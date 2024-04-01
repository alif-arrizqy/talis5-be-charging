import axios from "axios";
import e, { Request, Response } from "express";
import { ResponseHelper } from "../helpers/response/response";
import { dataCleaning } from "../helpers/preprocessing/data";
import * as ChargingService from "../services/charging.service";

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
      res.json(ResponseHelper.error("Failed to retrieve data battery", 400));
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
      res.json(ResponseHelper.error("Failed to preprocess data", 400));
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

      // store data
      const store = await ChargingService.createMasterFrame(cleanedData);
      if (store) {
        res.json(ResponseHelper.successMessage("Master frame stored", 201));
      } else {
        res.json(
          ResponseHelper.error("Data already exist in Master Frame", 409)
        );
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
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
      const cleanedData = (await this.preprocessing(req, res)) ?? [];

      // check charging status
      const results = await Promise.all(
        cleanedData.map(async (item) => {
          const isTrue = await ChargingService.checkChargingStatus(
            item.pcb_barcode
          );
          if (isTrue) {
            // store data
            await ChargingService.createLogData(item);
            return {
              pcb_barcode: item.pcb_barcode,
              status: true,
              sn_code_1: item.sn_code_1,
              sn_code_2: item.sn_code_2,
              voltage: item.voltage,
              current: item.current,
              soc: item.soc,
              temperature: item.average_cell_temperature,
              time_estiminate: item.remaining_charge_time,
            };
          }
          return null;
        })
      );

      // Check if all data has been stored
      if (results.every((result) => result)) {
        res.json(
          ResponseHelper.success(results.filter((result) => result !== null))
        );
      } else {
        console.log(results);
        res.json(ResponseHelper.error("Failed to store data, please check Charging Status", 400));
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
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

  // Update frame history
  updateFrameHistory = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData = await this.preprocessing(req, res);
      // store data
      const storeData = await ChargingService.updateFrameHistory(cleanedData);
      if (storeData) {
        res.json(ResponseHelper.successMessage("Frame history updated", 200));
      } else {
        res.json(ResponseHelper.error("Data frame history not found", 404));
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
    }
  };
}

export default ChargingController;
