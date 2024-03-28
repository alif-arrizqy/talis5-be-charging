import axios from "axios";
import { Request, Response, response } from "express";
import { ResponseHelper } from "../helpers/response/response";
import { dataCleaning } from "../helpers/preprocessing/data";
import * as ChargingService from "../services/charging.service";

class ChargingController {
  getDataBattery = async (req: Request, res: Response) => {
    try {
      return await axios({
        method: "GET",
        url: `${process.env.CHARGING_URL}/get-data`,
        timeout: 5000,
      })
        .then((response) => {
          return response.data;
        })
        .catch((error) => {
          return error;
        });
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve data battery", 400));
    }
  };

  preprocessing = async (req: Request, res: Response) => {
    try {
      // raw data
      const raw = await this.getDataBattery(req, res);
      // data cleaning
      const cleanedData = dataCleaning(raw);
      return cleanedData;
    } catch (error) {
      // handle error
      res.json(ResponseHelper.error("Failed to preprocess data", 400));
    }
  };

  getAllMasterFrame = async (req: Request, res: Response) => {
    try {
      const masterFrame = await ChargingService.getAllMasterFrame();
      res.json(ResponseHelper.success(masterFrame));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve master frame", 400));
    }
  };

  getMasterFrame = async (req: Request, res: Response) => {
    try {
      const pcbBarcode = req.params.pcb_barcode;
      const masterFrame = await ChargingService.getMasterFrame(pcbBarcode);
      res.json(ResponseHelper.success(masterFrame));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve master frame", 400));
    }
  };

  storeMasterFrame = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData = await this.preprocessing(req, res);

      // store data
      const store = await ChargingService.createMasterFrame(cleanedData);
      if (store) {
        res.json(ResponseHelper.successMessage("Master frame stored", 201));
      }
    } catch (error) {
      res.json(ResponseHelper.error("Failed to store master frame", 400));
    }
  };

  storeData = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData = await this.preprocessing(req, res);
      // check charging status
      cleanedData?.map(async (item) => {
        const isTrue = ChargingService.checkChargingStatus(item.pcb_barcode);
        // handle promise
        await isTrue.then((response) => {
          if (response) {
            // store data
            return ChargingService.createLogData;
          }
          return null
        });
      });
    } catch (error) {
      res.json(ResponseHelper.error("Failed to store data", 400));
    }
  };

  getAllFrameHistory = async (req: Request, res: Response) => {
    try {
      const frameHistory = await ChargingService.getAllFrameHistory();
      res.json(ResponseHelper.success(frameHistory));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve frame history", 400));
    }
  };

  getFrameHistory = async (req: Request, res: Response) => {
    try {
      const pcbBarcode = req.params.pcb_barcode;
      const frameHistory = await ChargingService.getFrameHistory(pcbBarcode);
      res.json(ResponseHelper.success(frameHistory));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve frame history", 400));
    }
  };

  updateFrameHistory = async (req: Request, res: Response) => {
    try {
      // data cleaning
      const cleanedData = await this.preprocessing(req, res);
      // store data
      const storeData = await ChargingService.updateFrameHistory(cleanedData);
      if (storeData) {
        res.json(ResponseHelper.successMessage("Frame history updated", 200));
      }
    } catch (error) {
      res.json(ResponseHelper.error("Failed to store frame history", 400));
    }
  };
}

export default ChargingController;
