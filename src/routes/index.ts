import { Application } from "express";
import rectiRoutes from "./recti.routes";

export default class Routes {
  constructor(app: Application) {
    app.get("/", (req, res) => {
      res.send({ message: "Welcome to Talis7 API" })
    });
    app.use("/api/recti", rectiRoutes);
  }
}
