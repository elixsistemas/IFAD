/**
 * @swagger
 * tags:
 *   name: Usuários
 *   description: Gestão de usuários do sistema
 */

import { Request, Response } from "express";
import { UsuarioRepositorio } from "../../Infra/repositorios/UsuarioRepositorio";
import { EsquemaUsuario, EsquemaAtualizarUsuario } from "../../dominio/esquemas/UsuarioDTO";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_SECONDS } from "../../config/jwt";

type TokenPayload = { id: string; email: string; papel: "admin" | "user" };

const repo = new UsuarioRepositorio();

export const UsuariosController = {
  /**
   * @swagger
   * /auth/login:
   *   post:
   *     summary: Login do usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               email:
   *                 type: string
   *                 example: admin@email.com
   *               senha:
   *                 type: string
   *                 example: 123456
   *     responses:
   *       200:
   *         description: Login realizado com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Credenciais inválidas
   */
  async login(req: Request, res: Response) {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: "Email e senha são obrigatórios" });

    try {
      const user = await repo.verificarSenha(email, senha);
      if (!user) return res.status(401).json({ erro: "Credenciais inválidas" });

      const payload: TokenPayload = {
        id: String(user._id),
        email: user.email,
        papel: user.papel,
      };

      const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_SECONDS });
      const { senhaHash, ...safe } = user as any;

      return res.json({ token, usuario: safe });
    } catch (err) {
      console.error("Erro ao fazer login:", err);
      return res.status(500).json({ erro: "Erro interno no login" });
    }
  },

  /**
   * @swagger
   * /usuarios:
   *   post:
   *     summary: Cria um novo usuário
   *     tags: [Usuários]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               nome:
   *                 type: string
   *                 example: João da Silva
   *               email:
   *                 type: string
   *                 example: joao@email.com
   *               senha:
   *                 type: string
   *                 example: 123456
   *               papel:
   *                 type: string
   *                 enum: [admin, user]
   *     responses:
   *       201:
   *         description: Usuário criado com sucesso
   *       400:
   *         description: Dados inválidos
   */
  async criar(req: Request, res: Response) {
    const parsed = EsquemaUsuario.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    try {
      const { senha, ...rest } = parsed.data;
      const user = await repo.criar({ ...rest, senha });
      const { senhaHash, ...safe } = user as any;
      return res.status(201).json(safe);
    } catch (err) {
      console.error("Erro ao criar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao criar usuário" });
    }
  },

  /**
   * @swagger
   * /usuarios:
   *   get:
   *     summary: Lista todos os usuários (somente admin)
   *     tags: [Usuários]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Lista de usuários
   *       401:
   *         description: Não autenticado
   *       403:
   *         description: Acesso negado
   */
  async listar(_req: Request, res: Response) {
    try {
      const lista = (await repo.listar()).map(u => {
        const { senhaHash, ...safe } = u as any;
        return safe;
      });
      res.json(lista);
    } catch (err) {
      console.error("Erro ao listar usuários:", err);
      res.status(500).json({ erro: "Erro interno ao listar usuários" });
    }
  },

  /**
   * @swagger
   * /usuarios/{id}:
   *   get:
   *     summary: Busca um usuário por ID
   *     tags: [Usuários]
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
   *         description: Usuário encontrado
   *       404:
   *         description: Usuário não encontrado
   */
  async buscar(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    try {
      const u = await repo.buscarPorId(id);
      if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });

      const { senhaHash, ...safe } = u as any;
      return res.json(safe);
    } catch (err) {
      console.error("Erro ao buscar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao buscar usuário" });
    }
  },

  /**
   * @swagger
   * /usuarios/{id}:
   *   patch:
   *     summary: Atualiza dados de um usuário
   *     tags: [Usuários]
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
   *         description: Usuário atualizado
   *       404:
   *         description: Usuário não encontrado
   */
  async atualizar(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    const parsed = EsquemaAtualizarUsuario.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    if ((parsed.data as any).senha) {
      return res.status(400).json({ erro: "Use a rota de troca de senha." });
    }

    try {
      const up = await repo.atualizar(id, parsed.data as any);
      if (!up) return res.status(404).json({ erro: "Usuário não encontrado" });

      const { senhaHash, ...safe } = up as any;
      return res.json(safe);
    } catch (err) {
      console.error("Erro ao atualizar usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao atualizar usuário" });
    }
  },

  /**
   * @swagger
   * /usuarios/{id}/senha:
   *   put:
   *     summary: Altera a senha de um usuário
   *     tags: [Usuários]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               senhaAtual:
   *                 type: string
   *                 example: 123456
   *               novaSenha:
   *                 type: string
   *                 example: 654321
   *     responses:
   *       204:
   *         description: Senha alterada com sucesso
   *       400:
   *         description: Dados inválidos
   *       401:
   *         description: Não autenticado ou senha incorreta
   *       403:
   *         description: Acesso negado
   */
  async alterarSenha(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    const { senhaAtual, novaSenha } = req.body as { senhaAtual?: string; novaSenha?: string };
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: "senhaAtual e novaSenha são obrigatórias" });
    }

    if (!req.user) return res.status(401).json({ erro: "Não autenticado" });
    if (String(req.user.id) !== String(id) && req.user.papel !== "admin") {
      return res.status(403).json({ erro: "Você não pode alterar a senha de outro usuário" });
    }

    try {
      const user = await repo.verificarSenha(req.user.email!, senhaAtual);
      if (!user || String(user._id) !== String(id)) {
        return res.status(401).json({ erro: "Senha atual incorreta" });
      }

      const atualizado = await repo.atualizarSenha(id, novaSenha);
      if (!atualizado) return res.status(404).json({ erro: "Usuário não encontrado" });

      return res.status(204).send();
    } catch (err) {
      console.error("Erro ao alterar senha:", err);
      return res.status(500).json({ erro: "Erro interno ao alterar senha" });
    }
  },

  /**
   * @swagger
   * /usuarios/{id}:
   *   delete:
   *     summary: Remove um usuário (somente admin)
   *     tags: [Usuários]
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
   *         description: Usuário removido
   *       404:
   *         description: Usuário não encontrado
   */
  async remover(req: Request, res: Response) {
    const id = req.params.id;
    if (!id) return res.status(400).json({ erro: "Parâmetro id é obrigatório" });

    try {
      const ok = await repo.remover(id);
      return res.status(ok ? 204 : 404).send();
    } catch (err) {
      console.error("Erro ao remover usuário:", err);
      return res.status(500).json({ erro: "Erro interno ao remover usuário" });
    }
  },
};
