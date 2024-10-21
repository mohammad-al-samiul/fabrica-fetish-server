import app from "./app";
import mongoose from "mongoose";
import config from "./app/config";

async function main() {
  const res = await mongoose.connect(config.db_url as string);
  console.log(res.connection.name);
  app.listen(config.port, () => {
    console.log(`Example app listening on port ${config.port}`);
  });
}
main().catch((err) => console.log(err));
