import express from "express";
import { router } from "./Api/routers";
import { logger } from "./Api/middlewares/logger";
import { errorHandler } from "./Api/middlewares/errorHandler";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./docs/swagger";

export function createApp() {
  const app = express();

  app.use(express.json());
  app.use(logger);

  app.get("/", (_req, res) => res.send("API OK"));

  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  app.use(router);

  app.use(errorHandler);

  return app;
}
