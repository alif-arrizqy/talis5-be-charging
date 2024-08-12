import express, { Application } from "express";
import bodyParser from "body-parser";
import cors, { CorsOptions } from "cors";
import { PrismaClient } from "@prisma/client";
import Routes from "./routes";

const prisma = new PrismaClient();

class Server {
  constructor(app: Application) {
    this.config(app);
    new Routes(app);
  }

  private config(app: Application): void {
    const corsOptions: CorsOptions = {
      origin: "*",
    };

    app.use(cors(corsOptions));
    app.use(express.json({ limit: "100mb" }));
    app.use(bodyParser.urlencoded({ limit: "100mb", extended: true }));
  }
}

export { Server, prisma };
