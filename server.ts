import express, { Application } from "express";
import { Server, prisma } from "./src/index";
import dotenv from "dotenv";

const env = dotenv.config();

if (env.parsed?.NODE_ENV === "development") {
  console.log("Running in development mode.");
  dotenv.config({ path: ".env.development" });
} else if (env.parsed?.NODE_ENV === "production") {
  console.log("Running in production mode.");
  dotenv.config({ path: ".env.production" });
}

const app: Application = express();
const server: Server = new Server(app);
const PORT: number = process.env.PORT ? parseInt(process.env.PORT) : 3777;
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
