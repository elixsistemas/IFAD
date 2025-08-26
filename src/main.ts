import 'dotenv/config';

import express from "express";
import { router } from "./Api/routers";
import { logger } from "./Api/middlewares/logger";
import { errorHandler } from "./Api/middlewares/errorHandler";

const app = express();

app.use(express.json());
app.use(logger);
app.use(errorHandler);

app.use(router);

const PORT = process.env.PORT || 3000;

app.get("/", (_req,res)=>res.send("API OK"));
app.listen(PORT, () => console.log(`🚀 http://localhost:${PORT}`));