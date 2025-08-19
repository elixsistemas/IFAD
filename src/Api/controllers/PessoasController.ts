import { Request, Response } from "express";
import type { ParsedQs } from "qs";
import { PessoaRepositorio } from "../../Infra/repositorios/PessoaRepositorio";
import { EsquemaPessoa, EsquemaAtualizarPessoa } from "../../dominio/esquemas/PessoaSchema";

const repo = new PessoaRepositorio();

const firstStr = (v: unknown): string | undefined => {
  if (typeof v === "string") return v;
  if (Array.isArray(v) && typeof v[0] === "string") return v[0];
  return undefined;
};

const isTipo = (t: unknown): t is "PF" | "PJ" => t === "PF" || t === "PJ";

export const PessoasController = {
  criar(req: Request, res: Response) {
    const parsed = EsquemaPessoa.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const pessoa = repo.criar(parsed.data as any);
    return res.status(201).json(pessoa);
  },

  listar(req: Request, res: Response) {
    const qx = req.query as ParsedQs;

    const tipoStr = firstStr(qx.tipo);
    const qStr    = firstStr(qx.q);

    const filtro: { tipo?: "PF" | "PJ"; q?: string } = {};
    if (isTipo(tipoStr)) filtro.tipo = tipoStr;
    if (typeof qStr === "string") filtro.q = qStr;

    const lista = repo.listar(filtro);
    return res.json(lista);
  },

  buscar(req: Request, res: Response) {
    const p = repo.buscarPorId(Number(req.params.id));
    return p ? res.json(p) : res.status(404).json({ erro: "Pessoa não encontrada" });
  },

  atualizar(req: Request, res: Response) {
    const parsed = EsquemaAtualizarPessoa.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    const up = repo.atualizar(Number(req.params.id), parsed.data as any);
    return up ? res.json(up) : res.status(404).json({ erro: "Pessoa não encontrada" });
  },

  remover(req: Request, res: Response) {
    return res.status(repo.remover(Number(req.params.id)) ? 204 : 404).send();
  },
};
