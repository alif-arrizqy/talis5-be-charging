import { Router } from "express";
import dischargingController from "../controllers/discharging.controller";

class DischargingRoutes {
  router = Router();
  controller = new dischargingController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/data", this.controller.storeDischargingData);
    this.router.get(
      "/pack_barcode/:packBarcode",
      this.controller.getByPackBarcode
    );
    this.router.get(
      "/pcb_barcode/:pcbBarcode",
      this.controller.getByPcbBarcode
    );
  }
}

export default new DischargingRoutes().router;
