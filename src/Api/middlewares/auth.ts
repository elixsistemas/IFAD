import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/jwt";

type JWTPayload = { id: number; email: string; papel: "admin" | "user" };

declare module "express-serve-static-core" {
  interface Request { user?: JWTPayload }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;       
  if (!header) return res.status(401).json({ erro: "Token não informado" });

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ erro: "Token inválido" });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
  req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ erro: "Token expirado ou inválido" });
  }
}

export function exigirPapel(papel: "admin" | "user") {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ erro: "Não autenticado" });
    if (req.user.papel !== papel) return res.status(403).json({ erro: "Acesso negado" });
    return next();
  };
}
