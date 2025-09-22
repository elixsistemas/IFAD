import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/jwt";

// id agora é string (ObjectId)
export type JWTPayload = { 
  id: string; 
  email: string; 
  papel: "admin" | "user"; 
};

declare module "express-serve-static-core" {
  interface Request { 
    user?: JWTPayload; 
  }
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
  } catch (err) {
    return res.status(401).json({ erro: "Token expirado ou inválido" });
  }
}

// versão mais flexível (pode exigir um ou vários papéis)
export function exigirPapel(...papeis: ("admin" | "user")[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ erro: "Não autenticado" });
    if (!papeis.includes(req.user.papel)) {
      return res.status(403).json({ erro: "Acesso negado" });
    }
    return next();
  };
}
