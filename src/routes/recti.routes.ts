import { Router } from "express";
import RectiController from "../controllers/recti.controller";

class RectiRoutes {
  router = Router();
  controller = new RectiController();

  constructor() {
    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.get("/power/:init", this.controller.powerModule);
    this.router.get("/get-setting", this.controller.getSetting);
    this.router.post("/set-recti", this.controller.setRecti);
    this.router.post("/set-default", this.controller.setDefaultValue);
    this.router.post("/set-voltage", this.controller.setVoltage);
    this.router.post("/set-current", this.controller.setCurrent);
  }
}

export default new RectiRoutes().router;
