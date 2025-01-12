import { Application } from "express";
import rectiRoutes from "./recti.routes";
import chargingRoutes from "./charging.routes";
import dischargingRoutes from "./discharging.routes";

export default class Routes {
  constructor(app: Application) {
    app.get("/", (req, res) => {
      res.send({ message: "Welcome to Talis7 API" })
    });
    app.use("/api/recti", rectiRoutes);
    app.use("/api/charging", chargingRoutes);
    app.use("/api/discharging", dischargingRoutes);
  }
}
