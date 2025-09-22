import { Request, Response, NextFunction } from "express";

export function logger(req: Request, res: Response, next: NextFunction) {
  const start = Date.now();

  res.on("finish", () => {
    const ms = Date.now() - start;
    const status = res.statusCode;
    const color =
      status >= 500 ? "\x1b[31m" : // vermelho
      status >= 400 ? "\x1b[33m" : // amarelo
      "\x1b[32m";                  // verde

    console.log(
      `${new Date().toISOString()} - ${req.method} ${req.originalUrl} -> ${color}${status}\x1b[0m ${ms}ms`
    );
  });

  next();
}
