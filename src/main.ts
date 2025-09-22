import "dotenv/config";
import { createApp } from "./app";
import { connectMongo } from "./Infra/banco/db";

const app = createApp();
const PORT = process.env.PORT || 3000;

connectMongo().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  });
});
