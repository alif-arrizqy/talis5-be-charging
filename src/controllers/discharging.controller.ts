import { Request, Response } from "express";
import { ResponseHelper } from "../helpers/response/response";
import * as DischargingService from "../services/discharging.service";

class DischargingController {
  storeDischargingData = async (req: Request, res: Response) => {
    try {
      const data = req.body.data;
      const results = await Promise.all(
        data.map(async (item: any) => {
          try {
            await DischargingService.createLogDischarging(item);
            return true;
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
        console.log("Data stored successfully for all items", results.length);
        return res
          .status(201)
          .json(ResponseHelper.successMessage("Data stored successfully", 201));
      } else {
        throw new Error("Failed to store data, please check input body");
      }
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.log("storeDischargingData error:", messageError);

      // Ensure headers haven't been sent already before sending a response
      if (!res.headersSent) {
        return res.status(400).json(ResponseHelper.error(messageError, 400));
      }
    }
  };

  getByPackBarcode = async (req: Request, res: Response) => {
    try {
      const packBarcode = req.params.packBarcode;
      const result = await DischargingService.getByPackBarcode(packBarcode);
      return res.status(200).json(ResponseHelper.success(result));
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.log("getByPackBarcode error:", messageError);

      // Ensure headers haven't been sent already before sending a response
      if (!res.headersSent) {
        return res.status(400).json(ResponseHelper.error(messageError, 400));
      }
    }
  };

  getByPcbBarcode = async (req: Request, res: Response) => {
    try {
      const pcbBarcode = req.params.pcbBarcode;
      const result = await DischargingService.getByPcbBarcode(pcbBarcode);
      return res.status(200).json(ResponseHelper.success(result));
    } catch (error) {
      const messageError =
        error instanceof Error && error.message
          ? error.message
          : "An unknown error occurred";
      console.log("getByPcbBarcode error:", messageError);

      // Ensure headers haven't been sent already before sending a response
      if (!res.headersSent) {
        return res.status(400).json(ResponseHelper.error(messageError, 400));
      }
    }
  };
}

export default DischargingController;
