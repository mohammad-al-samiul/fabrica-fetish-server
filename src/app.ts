import express, { Application, Request, Response } from "express";
import cors from "cors";
import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";
import router from "./app/routes";
import cookieParser from "cookie-parser";
import { paymentRouter } from "./app/modules/payment/payment.route";
const app: Application = express();

app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://fabrica-fetish-client.vercel.app",
    ],
    credentials: true,
  })
);

app.use(cookieParser());

app.use("/api/v1", router);
app.use("/api/v1", paymentRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to Fabrica Fetish Api!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
