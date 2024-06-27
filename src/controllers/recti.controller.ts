import axios from "axios";
import { Request, Response } from "express";
import { ResponseHelper } from "../helpers/response/response";
import * as RectiService from "../services/recti.service";

class RectiController {
  powerModule = async (req: Request, res: Response) => {
    const init = req.params.init;
    if (init === "true") {
      try {
        await axios({
          method: "POST",
          url: `${process.env.RECTI_URL}/set-module-32`,
          data: { group: 0, value: 12 },
          timeout: 5000,
        })
          .then((response) => {
            res.json(ResponseHelper.successMessage("Power module is on"));
          })
          .catch((error) => {
            res.json(ResponseHelper.error(error.message, 500));
          });
      } catch (error) {
        res.json(ResponseHelper.error("Failed to turn on power module", 500));
      }
    } else {
      try {
        await axios({
          method: "POST",
          url: `${process.env.RECTI_URL}/set-module-32`,
          data: { group: 0, value: 0 },
          timeout: 5000,
        })
          .then((response) => {
            res.json(ResponseHelper.successMessage("Power module is off"));
          })
          .catch((error) => {
            res.json(ResponseHelper.error(error.message, 500));
          });
      } catch (error) {
        res.json(ResponseHelper.error("Failed to turn off power module", 500));
      }
    }
  };

  getSetting = async (req: Request, res: Response) => {
    try {
      const data = await RectiService.getAll();
      res.json(ResponseHelper.success(data));
    } catch (error) {
      res.json(ResponseHelper.error("Failed to retrieve data", 400));
    }
  };

  setRecti = async (req: Request, res: Response) => {
    const payload = req.body;
    const maxVoltCell: number = req.body.maxVoltageCell;
    const minVoltCell: number = req.body.minVoltageCell;
    const totalCell: number = req.body.totalCell;
    const voltage: number = maxVoltCell * totalCell;
    const current: number = req.body.current;
    try {
      const data = await RectiService.createRecti(payload);
      // initailize variable response
      let responseSetVoltage;
      if (data) {
        // post to recti api
        // set voltage
        await axios({
          method: "POST",
          url: `${process.env.RECTI_URL}/set-voltage`,
          data: { group: 0, subaddress: 0, voltage: voltage },
          timeout: 5000,
        })
          .then((response) => {
            responseSetVoltage = response.data.status;
          })
          .catch((error) => {
            res.json(ResponseHelper.error(error.message, 500));
          });
        
        if (responseSetVoltage === 1) {
          // delay
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // set current
          await axios({
            method: "POST",
            url: `${process.env.RECTI_URL}/set-current`,
            data: { group: 0, subaddress: 0, voltage: current * 1000 },
            timeout: 5000,
          });
        }

        res.json(ResponseHelper.successMessage("Success update rectifier data"));
      } else {
        res.json(ResponseHelper.successMessage("Success create rectifier data"));
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
    }
  };

  setDefaultValue = async (req: Request, res: Response) => {
    const data = await RectiService.createDefaultValue();
    if (data) {
      res.json(ResponseHelper.successMessage("Set default value success"));
    } else {
      res.json(ResponseHelper.successMessage("Success create default value"));
    }
  };

  setVoltage = async (req: Request, res: Response) => {
    const payload = req.body;
    try {
      const data = await RectiService.createVoltage(payload);
      // post to recti api
      if (data !== null) {
        await axios({
          method: "POST",
          url: `${process.env.RECTI_URL}/set-voltage`,
          data: { group: 0, subaddress: 0, voltage: data },
          timeout: 5000,
        })
          .then((response) => {
            res.json(
              ResponseHelper.successMessage(`Success set Rectifier Voltage`)
            );
          })
          .catch((error) => {
            res.json(ResponseHelper.error(error.message, 500));
          });
      } else {
        res.json(ResponseHelper.error(`Missing Rectifier Data`, 404));
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
    }
  };

  setCurrent = async (req: Request, res: Response) => {
    const payload = req.body;
    try {
      const data = await RectiService.createCurrent(payload);
      // post to recti api
      if (data !== null) {
        await axios({
          method: "POST",
          url: `${process.env.RECTI_URL}/set-current`,
          data: { group: 0, subaddress: 0, voltage: Number(data) * 1000 },
          timeout: 5000,
        })
          .then((response) => {
            res.json(
              ResponseHelper.successMessage(`Success set Rectifier Current`)
            );
          })
          .catch((error) => {
            res.json(ResponseHelper.error(error.message, 500));
          });
      } else {
        res.json(ResponseHelper.error(`Missing Rectifier Data`, 404));
      }
    } catch (error) {
      res.json(ResponseHelper.error(error, 400));
    }
  };
}

export default RectiController;
