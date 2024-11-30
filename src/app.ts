import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Fabrica Fetish Api!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
