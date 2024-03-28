import { Router } from "express";
import ChargingController from "../controllers/charging.controller";

class ChargingRoutes {
  router = Router();
  controller = new ChargingController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/master-frame", this.controller.getAllMasterFrame);
    this.router.get("/master-frame/:pcb_barcode", this.controller.getMasterFrame);
    this.router.post("/master-frame", this.controller.storeMasterFrame);

    this.router.get("/frame-history", this.controller.getAllFrameHistory)
    this.router.get("/frame-history/:pcb_barcode", this.controller.getFrameHistory);
    this.router.put("/frame-history", this.controller.updateFrameHistory);
    
    this.router.post("/store-data", this.controller.storeData);
  }
}

export default new ChargingRoutes().router;