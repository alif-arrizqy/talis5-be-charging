import axios from "axios";
import { Request, Response } from "express";
import { ResponseHelper } from "../helpers/response/response";
import { dataCleaning } from "../helpers/preprocessing/data";
import * as ChargingService from "../services/charging.service";
import { CheckErrorLog } from "../helpers/errorFlagCheck";
import {
  MAX_VALUE_VOLTAGE,
  MAX_VALUE_CELL_VOLTAGE,
} from "../helpers/constants";

class ChargingController {
  // Helper function to fetch battery data
  fetchDataBattery = async (req: Request, res: Response) => {
    try {
      const response = await axios({
        method: "GET",
        url: `${process.env.CHARGING_URL}/get-data`,
        timeout: 5000,
      });
      return response.data;
    } catch (error) {
      res.json(ResponseHelper.error("Failed fetch data /get-data"));
    }
  };

  // Helper function to preprocess data
  preprocessing = async (req: Request, res: Response) => {
    try {
      // raw data
      const raw = await this.fetchDataBattery(req, res);
      // data cleaning
      return dataCleaning(raw);
    } catch (error) {
      res.json(ResponseHelper.error("Failed to preprocess data"));
    }
  };

  // Retrieve all master frame
  getAllMasterFrame = async (req: Request, res: Response) => {
    try {
      const masterFrame = await ChargingService.getAllMasterFrame();
      res.json(ResponseHelper.success(masterFrame));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve master frame", 400));
    }
  };

  // Retrieve master frame by pcb barcode
  getMasterFrame = async (req: Request, res: Response) => {
    const pcbBarcode: string = req.params.pcb_barcode;
    try {
      const masterFrame = await ChargingService.getMasterFrame(pcbBarcode);
      res.json(ResponseHelper.success(masterFrame));
    } catch (error) {
      res.json(ResponseHelper.error(`Frame ${pcbBarcode} data not found`, 404));
    }
  };

  // Store master frame
  storeMasterFrame = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData = await this.preprocessing(req, res);
      const firstData = cleanedData ? [cleanedData[0]] : [];

      // store data
      const store = await ChargingService.createMasterFrame(firstData);
      if (Array.isArray(store)) {
        const successResponse = store.find((el) => el.status);
        if (successResponse) {
          res.json(ResponseHelper.successMessage("Master frame stored", 200));

          // Call storeChargingData after successfully storing master frame
          this.storeChargingData(req, res);
        } else {
          const failedResponses = store.filter((el) => !el.status);
          if (failedResponses.length > 0) {
            const errors = failedResponses.map((el) => ({
              message: "Frame is already exist",
              pcb_barcode: el.pcb_barcode,
            }));
            res.json(ResponseHelper.error(errors, 400));
          } else {
            res.json(ResponseHelper.error("Failed to store master frame", 400));
          }
        }
      } else {
        res.json(ResponseHelper.error("Failed to store master frame", 400));
      }
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      res.json(ResponseHelper.error(messageError, 400));
    }
  };

  // Update master frame
  updateMasterFrame = async (req: Request, res: Response) => {
    const pcbBarcode: string = req.body.pcb_barcode;
    const chargingStatus: boolean = req.body.charging;
    try {
      const update = await ChargingService.updateMasterFrame(
        pcbBarcode,
        chargingStatus
      );
      if (update && chargingStatus === true) {
        res.json(
          ResponseHelper.successMessage(
            "Master frame updated and ready for charging",
            200
          )
        );
      } else if (update && chargingStatus === false) {
        res.json(
          ResponseHelper.successMessage(
            "Master frame set to stop charging",
            200
          )
        );
      } else {
        res.json(
          ResponseHelper.error(`Frame ${pcbBarcode} data not found`, 404)
        );
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
    }
  };
  
  // process data from storeChargingData
  processChargingData = async (data: any) => {
    try {
      // check charging status
      const results = await Promise.all(
        data.map(async (item: any) => {
          try {
            const {
              pcb_barcode,
              sn_code_1,
              sn_code_2,
              voltage,
              current,
              soc,
              max_cell_voltage,
              min_cell_voltage,
              average_cell_temperature,
              remaining_charge_time,
            } = item;

            const isTrue = await ChargingService.checkChargingStatusWithPcbBarcode(pcb_barcode);

            // check high temperature
            const temperature_status =
              average_cell_temperature / 10 > 55
                ? "high_temperature"
                : "normal";

            // check battery full
            const battery_status =
              voltage > MAX_VALUE_VOLTAGE ||
              max_cell_voltage > MAX_VALUE_CELL_VOLTAGE
                ? "fully_charged"
                : "low_battery";

            if (isTrue) {
              // store data
              await ChargingService.createLogData(item);

              // check error log
              const checkFlag = new CheckErrorLog();
              const warningFlag = await checkFlag.warningFlagCheck(item);
              const protectionFlag = await checkFlag.protectionFlagCheck(item);
              const faultStatusFlag = await checkFlag.faultStatusFlagCheck(item);

              const error_status =
                warningFlag.length > 0 ||
                protectionFlag.length > 0 ||
                faultStatusFlag.length > 0;

              if (error_status) {
                // store error log
                await ChargingService.createErrorLog({
                  pcb_barcode,
                  warningFlag,
                  protectionFlag,
                  faultStatusFlag,
                });
              }

              return {
                pcb_barcode,
                charging: true,
                battery_status,
                temperature_status,
                sn_code_1,
                sn_code_2,
                voltage: voltage / 100,
                current: current / 10,
                soc: soc / 100,
                max_cell_voltage: max_cell_voltage,
                min_cell_voltage: min_cell_voltage,
                temperature: average_cell_temperature / 10,
                time_estimate: remaining_charge_time,
                error_status: error_status,
                error_log: { warningFlag, protectionFlag, faultStatusFlag },
              };
            } else {
              return {
                pcb_barcode,
                charging: false,
                battery_status,
                temperature_status,
                sn_code_1,
                sn_code_2,
                voltage: voltage ? voltage / 100 : null,
                current: current ? current / 10 : null,
                soc: soc ? soc / 100 : null,
                max_cell_voltage: max_cell_voltage ? max_cell_voltage : null,
                min_cell_voltage: min_cell_voltage ? min_cell_voltage : null,
                temperature: average_cell_temperature ? average_cell_temperature / 10 : null,
                time_estimate: remaining_charge_time ? remaining_charge_time : null,
                error_log: {
                  warningFlag: [],
                  protectionFlag: [],
                  faultStatusFlag: [],
                },
              };
            }
          } catch (error) {
            const messageError = error instanceof Error && error.message ? error.message : "An unknown error occurred";
            console.error(`Error processing item ${item.pcb_barcode}: ${messageError}`);
            return null;
          }
        })
      );

      // Check if all data has been stored
      if (results.every((result) => result !== null)) {
        return results;
      } else {
        throw new Error("Failed to store data, please check Charging Status");
      }
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.error(`Error processing data: ${messageError}`);
      return null;
    }
  };

  // Store charging data
  storeChargingData = async (req: Request, res: Response) => {
    try {
      let loop = true;
      while (loop) {
        // data cleaning
        const cleanedData = (await this.preprocessing(req, res)) ?? [];
        const firstData = [cleanedData[0]];

        // process data
        const resultProcess = this.processChargingData(firstData);
        resultProcess.then((result) => {
          if (result) {
            console.log(result);
            // get charging status
            const chargingStatus = result.map((el) => el.charging);
            const batteryStatus = result.map((el) => el.battery_status);
            const temperatureStatus = result.map((el) => el.temperature_status);

            if (
              chargingStatus.includes(false) || 
              batteryStatus.includes("fully_charged") || 
              temperatureStatus.includes("high_temperature")
            ) {
              loop = false;
            }
          } else {
            console.log('processChargingData error');
          }
        })
      }

    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.log("storeChargingData error:", messageError);
    }
  };

  // realtime monitoring charging data
  realtimeMonitoring = async () => {
    
  }

  // Retrieve all frame history
  getAllFrameHistory = async (req: Request, res: Response) => {
    try {
      const frameHistory = await ChargingService.getAllFrameHistory();
      res.json(ResponseHelper.success(frameHistory));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve frame history", 400));
    }
  };

  // Retrieve frame history by pcb barcode
  getFrameHistory = async (req: Request, res: Response) => {
    const pcbBarcode = req.params.pcb_barcode;
    try {
      const frameHistory = await ChargingService.getFrameHistory(pcbBarcode);
      res.json(ResponseHelper.success(frameHistory));
    } catch (error) {
      res.json(ResponseHelper.error(`Frame ${pcbBarcode} data not found`, 404));
    }
  };

  // Update frame history
  updateFrameHistory = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData = await this.preprocessing(req, res);
      const firstData = cleanedData ? [cleanedData[0]] : [];

      // store data
      const update = await ChargingService.updateFrameHistory(firstData);
      if (Array.isArray(update)) {
        const successResponses = update.filter((el) => el.status);
        if (successResponses.length > 0) {
          const messages = successResponses.map((el) => ({
            message: "Frame history updated",
            pcb_barcode: el.pcb_barcode,
          }));
          // turn off rectifier
          try {
            await axios({
              method: "POST",
              url: `${process.env.RECTI_URL}/set-module-32`,
              data: { group: 0, value: 0 },
              timeout: 5000,
            });
          } catch (error) {
            res.json(
              ResponseHelper.error("Failed to turn off power module", 500)
            );
          }

          res.json(ResponseHelper.success(messages));
        } else {
          const failedResponses = update.filter((el) => !el.status);
          if (failedResponses.length > 0) {
            const errors = failedResponses.map((el) => ({
              message: "Frame charging is false",
              pcb_barcode: el.pcb_barcode,
            }));
            res.json(ResponseHelper.error(errors, 400));
          } else {
            res.json(
              ResponseHelper.error("Failed to update frame history", 400)
            );
          }
        }
      } else {
        res.json(ResponseHelper.error("Failed to update frame history", 400));
      }
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      res.json(ResponseHelper.error(messageError, 400));
    }
  };

  checkChargingStatus = async (req: Request, res: Response) => {
    try {
      const status = await ChargingService.checkChargingStatus();
      res.json(ResponseHelper.success(status));
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      res.json(ResponseHelper.error(messageError, 400));
    }
  };
}

export default ChargingController;
