// src/config/dotenv.config.ts
import "dotenv/config";
import * as jwt from "jsonwebtoken";
import type { StringValue } from "ms";

// SECRET sempre string não vazia
const SECRET: string = (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) || "dev-secret";

// EXPIRES: aceita "1h", "7d" etc (StringValue) ou número em segundos
const raw = process.env.JWT_EXPIRES;
const EXPIRES: number | StringValue = raw && /^\d+$/.test(raw) ? Number(raw) : (raw ?? "1h") as StringValue;

export const env = {
  JWT_SECRET: SECRET as jwt.Secret,             // <- tipado para jwt.Secret
  JWT_EXPIRES: EXPIRES as jwt.SignOptions["expiresIn"],
} as const;
