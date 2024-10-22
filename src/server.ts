import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";
import { Server } from "http";

let server: Server;
async function main() {
  const res = await mongoose.connect(config.db_url as string);
  console.log(res.connection.name);
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}
main();

process.on("unhandledRejection", (err) => {
  console.log(`😈 unahandledRejection is detected , shutting down ...`, err);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

process.on("uncaughtException", () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
