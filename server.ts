import express, { Application } from "express";
import { Server, prisma } from "./src/index";
import dotenv from "dotenv";

const env = dotenv.config();
let PORT:number = 3777;

if (env.parsed?.NODE_ENV === "development") {
  console.log("Running in development mode.");
  dotenv.config({ path: ".env.development" });
  PORT = process.env.DEVELOPMENT_PORT ? parseInt(process.env.DEVELOPMENT_PORT) : 3777;
} else if (env.parsed?.NODE_ENV === "production") {
  console.log("Running in production mode.");
  dotenv.config({ path: ".env.production" });
  PORT = process.env.PRODUCTION_PORT ? parseInt(process.env.PRODUCTION_PORT) : 3777;
}

const app: Application = express();
const server: Server = new Server(app);
// check connection prisma
prisma.$connect()
  .then(() => {
    console.log("Database connection established.");
  })
  .catch((err) => {
    console.log("Error: unable to connect to the database.");
    console.log(err);
  });

app
  .listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
  })
  .on("error", (err: any) => {
    if (err.code === "EADDRINUSE") {
      console.log("Error: address already in use");
    } else {
      console.log(err);
    }
  });
