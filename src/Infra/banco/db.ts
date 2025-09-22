import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectMongo(uri?: string): Promise<void> {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) throw new Error("MONGO_URI não definida no .env");

  try {
    await mongoose.connect(mongoUri);
    console.log("✅ Conectado ao MongoDB");
  } catch (err) {
    console.error("❌ Erro ao conectar no MongoDB:", err);
    process.exit(1);
  }
}

export async function disconnectMongo(): Promise<void> {
  await mongoose.disconnect();
}
