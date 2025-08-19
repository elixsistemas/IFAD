import * as jwt from "jsonwebtoken";

// Converte "1h", "30m", "15s", "7d" OU "3600" -> segundos (number)
// Se vier vazio/indefinido, usa 3600 (1h)
export function parseExpiresToSeconds(raw?: string): number {
  if (!raw || raw.trim() === "") return 3600;
  const m = raw.trim().match(/^(\d+)\s*([smhdw])?$/i);
  if (!m) {
    // se não bater o padrão, tenta Number direto (pode ser "3600")
    const n = Number(raw);
    return Number.isFinite(n) && n > 0 ? n : 3600;
  }
  const value = Number(m[1]);
  const unit = (m[2] || "s").toLowerCase(); // default: segundos

  const mult: Record<string, number> = {
    s: 1,
    m: 60,
    h: 3600,
    d: 86400,
    w: 604800,
  };
  return value * (mult[unit] ?? 1);
}

export const JWT_SECRET: jwt.Secret =
  (process.env.JWT_SECRET && process.env.JWT_SECRET.trim()) || "dev-secret";

export const JWT_EXPIRES_SECONDS = parseExpiresToSeconds(process.env.JWT_EXPIRES);
