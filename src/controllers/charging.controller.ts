import axios from "axios";
import { Request, Response } from "express";
import { ResponseHelper } from "../helpers/response/response";
import { dataCleaning } from "../helpers/preprocessing/data";

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
      const raw = (await this.getDataBattery(req, res));
      console.log(raw);
      // data cleaning
      // const cleaning = dataCleaning(raw);

      // store data to database

      // return data
    } catch (error) {
      // handle error
    }
  };
}

export default ChargingController;
