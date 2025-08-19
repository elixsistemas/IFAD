import 'dotenv/config';

import express from "express";
import { router } from "./Api/routers";
import { logger } from "./Api/middlewares/logger";

const app = express();

app.use(express.json());
app.use(logger);

app.use(router);

app.get("/", (_req,res)=>res.send("API OK"));
app.listen(3000, () => console.log("🚀 http://localhost:3000"));