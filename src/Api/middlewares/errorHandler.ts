import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  console.error("🔥 Erro capturado pelo middleware:", err);

  if (err instanceof ZodError) {
    return res.status(400).json({ erros: err.flatten() });
  }

  if (err instanceof Error) {
    return res.status(500).json({ erro: err.message });
  }

  return res.status(500).json({ erro: "Erro interno no servidor" });
}
