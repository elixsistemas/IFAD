/**
 * @swagger
 * tags:
 *   name: Pessoas
 *   description: Gestão de pessoas (PF/PJ)
 */

import { Request, Response } from "express";
import type { ParsedQs } from "qs";
import { PessoaRepositorio } from "../../Infra/repositorios/PessoaRepositorio";
import {
  EsquemaPessoa,
  EsquemaAtualizarPessoa,
  CriarPessoaDTO,
  AtualizarPessoaDTO,
} from "../../dominio/esquemas/PessoaDTO";

const repo = new PessoaRepositorio();

const firstStr = (v: unknown): string | undefined =>
  typeof v === "string"
    ? v
    : Array.isArray(v) && typeof v[0] === "string"
    ? v[0]
    : undefined;

const isTipo = (t: unknown): t is "PF" | "PJ" => t === "PF" || t === "PJ";

type ParamsWithId = { id: string };

export const PessoasController = {
  /**
   * @swagger
   * /pessoas:
   *   post:
   *     summary: Cria uma nova pessoa
   *     tags: [Pessoas]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               tipo:
   *                 type: string
   *                 enum: [PF, PJ]
   *               nome:
   *                 type: string
   *                 example: Maria Oliveira
   *               documento:
   *                 type: string
   *                 example: 12345678901
   *               email:
   *                 type: string
   *                 example: maria@email.com
   *               telefone:
   *                 type: string
   *                 example: 11999990000
   *     responses:
   *       201:
   *         description: Pessoa criada com sucesso
   *       400:
   *         description: Dados inválidos
   */
  async criar(req: Request, res: Response) {
    const parsed = EsquemaPessoa.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    try {
      const dto: CriarPessoaDTO = parsed.data;
      const pessoa = await repo.criar(dto);
      return res.status(201).json(pessoa);
    } catch (err) {
      console.error("Erro ao criar pessoa:", err);
      return res.status(500).json({ erro: "Erro interno ao criar pessoa" });
    }
  },

  /**
   * @swagger
   * /pessoas:
   *   get:
   *     summary: Lista todas as pessoas
   *     tags: [Pessoas]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de pessoas
   */
  async listar(req: Request, res: Response) {
    const qx = req.query as ParsedQs;
    const filtro: { tipo?: "PF" | "PJ"; q?: string } = {};

    const tipoStr = firstStr(qx.tipo);
    const qStr = firstStr(qx.q);

    if (isTipo(tipoStr)) filtro.tipo = tipoStr;
    if (qStr) filtro.q = qStr;

    try {
      const lista = await repo.listar(filtro);
      return res.json(lista);
    } catch (err) {
      console.error("Erro ao listar pessoas:", err);
      return res.status(500).json({ erro: "Erro interno ao listar pessoas" });
    }
  },

  /**
   * @swagger
   * /pessoas/{id}:
   *   get:
   *     summary: Busca pessoa por ID
   *     tags: [Pessoas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Pessoa encontrada
   *       404:
   *         description: Pessoa não encontrada
   */
  async buscar(req: Request<ParamsWithId>, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    try {
      const p = await repo.buscarPorId(id);
      return p
        ? res.json(p)
        : res.status(404).json({ erro: "Pessoa não encontrada" });
    } catch (err) {
      console.error("Erro ao buscar pessoa:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar pessoa" });
    }
  },

  /**
   * @swagger
   * /pessoas/{id}:
   *   patch:
   *     summary: Atualiza pessoa por ID
   *     tags: [Pessoas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *     responses:
   *       200:
   *         description: Pessoa atualizada
   *       404:
   *         description: Pessoa não encontrada
   */
  async atualizar(req: Request<ParamsWithId>, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    const parsed = EsquemaAtualizarPessoa.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    try {
      const dto: AtualizarPessoaDTO = parsed.data;
      const up = await repo.atualizar(id, dto);
      return up
        ? res.json(up)
        : res.status(404).json({ erro: "Pessoa não encontrada" });
    } catch (err) {
      console.error("Erro ao atualizar pessoa:", err);
      return res.status(500).json({ erro: "Erro interno ao atualizar pessoa" });
    }
  },

  /**
   * @swagger
   * /pessoas/{id}:
   *   delete:
   *     summary: Remove pessoa (somente admin)
   *     tags: [Pessoas]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       204:
   *         description: Pessoa removida
   *       404:
   *         description: Pessoa não encontrada
   */
  async remover(req: Request<ParamsWithId>, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    try {
      const ok = await repo.remover(id);
      return res.status(ok ? 204 : 404).send();
    } catch (err) {
      console.error("Erro ao remover pessoa:", err);
      return res.status(500).json({ erro: "Erro interno ao remover pessoa" });
    }
  },
};
