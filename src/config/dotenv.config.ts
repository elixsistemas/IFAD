import "dotenv/config";
import * as jwt from "jsonwebtoken";
import type { StringValue } from "ms";

const SECRET: string = (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) || "dev-secret";

const raw = process.env.JWT_EXPIRES;
const EXPIRES: number | StringValue = raw && /^\d+$/.test(raw) ? Number(raw) : (raw ?? "1h") as StringValue;

export const env = {
  JWT_SECRET: SECRET as jwt.Secret,             
  JWT_EXPIRES: EXPIRES as jwt.SignOptions["expiresIn"],
} as const;
