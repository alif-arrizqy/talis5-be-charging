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
      // res.json(ResponseHelper.error("Failed to preprocess data"));
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.log("pre-processing cleaned data error:", messageError);

      // Ensure headers haven't been sent already before sending a response
      if (!res.headersSent) {
        return res
          .status(400)
          .json(ResponseHelper.error(messageError, 400));
      }
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
      const cleanedData:any = await this.preprocessing(req, res);
      const firstData = cleanedData ? [cleanedData[0]] : [];

      // is the string starts with "TBI"?
      if (!firstData[0].pcb_barcode.startsWith("TBI")) {
        return res.json(ResponseHelper.error("Format pcb_barcode is incorrect", 400));
      }

      // store data
      const store = await ChargingService.createMasterFrame(firstData);
      if (Array.isArray(store)) {
        const successResponse = store.find((el) => el.status);
        if (successResponse) {
          res.json(ResponseHelper.successMessage("Master frame stored", 200));
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

  // Store charging data
  storeChargingData = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData:any = (await this.preprocessing(req, res)) ?? [];
      const firstData = [cleanedData[0]];

      // check charging status
      const results = await Promise.all(
        firstData.map(async (item) => {
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

            const isTrue =
              await ChargingService.checkChargingStatusWithPcbBarcode(
                pcb_barcode
              );

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
              const faultStatusFlag = await checkFlag.faultStatusFlagCheck(
                item
              );
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
                voltage: null,
                current: null,
                soc: null,
                max_cell_voltage: null,
                min_cell_voltage: null,
                temperature: null,
                time_estimate: null,
                error_log: {
                  warningFlag: [],
                  protectionFlag: [],
                  faultStatusFlag: [],
                },
              };
            }
          } catch (error) {
            const messageError =
              error instanceof Error && error.message
                ? error.message
                : "An unknown error occurred";
            console.error(
              `Error processing item ${item.pcb_barcode}: ${messageError}`
            );
            return null;
          }
        })
      );

      // Check if all data has been stored
      if (results.every((result) => result !== null)) {
        return res.json(
          ResponseHelper.success(results.filter((result) => result !== null))
        );
      } else {
        throw new Error("Failed to store data, please check Charging Status");
      }
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.log("storeChargingData error:", messageError);

      // Ensure headers haven't been sent already before sending a response
      if (!res.headersSent) {
        return res.status(400).json(ResponseHelper.error(messageError, 400));
      }
    }
  };

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

  // Rectifier power module
  powerModule = async (req: Request, res: Response) => {
    let doubleCheck = 3;

    while (doubleCheck > 0) {
      try {
        // read current
        const cleanedData:any = await this.preprocessing(req, res);
        const firstData = cleanedData ? [cleanedData[0]] : [];
        const current = firstData[0].current;

        if (current > 0) {
          try {
            const rectiResponse = await axios({
              method: "POST",
              url: `${process.env.RECTI_URL}/set-module-32`,
              data: { group: 0, value: 0 },
              timeout: 5000,
            });
            if (rectiResponse.data.status === 1) {
              console.log("power module is off");
            } else {
              console.log("power module is not off");
              break;
            }
          } catch (error) {
            const messageError =
              error instanceof Error && error.message
                ? error.message
                : "An unknown error occurred";
            console.log("set power module error:", messageError);

            // Ensure headers haven't been sent already before sending a response
            if (!res.headersSent) {
              console.log(`failed to connect to recti`, messageError);
              return false;
            }
          }
        } else {
          console.log(`current is 0`);
        }
      } catch (error) {
        const messageError =
          error instanceof Error && error.message
            ? error.message
            : "An unknown error occurred";
        console.log("power module error:", messageError);

        // Ensure headers haven't been sent already before sending a response
        if (!res.headersSent) {
          console.log(`failed to connect to recti`, messageError);
          return false;
        }
      }

      doubleCheck--;
    }

    if (doubleCheck === 0) {
      console.log("Double check completed. Current is 0 and recti is off.");
      return true;
    } else {
      console.log("Double check failed. Current is not 0 or recti is not off.");
      return false;
    }
  };

  // Update frame history
  updateFrameHistory = async (req: Request, res: Response) => {
    try {
      // turn off recti
      const rectiStatus = await this.powerModule(req, res);
      
      if (rectiStatus) {
        // data cleaning
        const cleanedData:any = await this.preprocessing(req, res);
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
      } else {
        // failed to turn off recti and update frame history
        res.json(ResponseHelper.error("Failed to connect recti ip, data frame not updated", 400));
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
