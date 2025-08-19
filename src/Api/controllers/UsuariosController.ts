import { Request, Response } from "express";
import { UsuarioRepositorio } from "../../Infra/repositorios/UsuarioRepositorio";
import { EsquemaUsuario, EsquemaAtualizarUsuario } from "../../dominio/esquemas/UsuarioSchema";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_SECONDS } from "../../config/jwt";

type TokenPayload = { id: number; email: string; papel: "admin" | "user" };

const repo = new UsuarioRepositorio();

export const UsuariosController = {
  criar(req: Request, res: Response) {
    const parsed = EsquemaUsuario.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());

    const { senha, ...rest } = parsed.data;
    const user = repo.criar({ ...rest, senha });

    const { senhaHash, ...safe } = user as any;
    return res.status(201).json(safe);
  },

  login(req: Request, res: Response) {
    const { email, senha } = req.body;
    if (!email || !senha) return res.status(400).json({ erro: "Email e senha são obrigatórios" });

    const user = repo.verificarSenha(email, senha);
    if (!user) return res.status(401).json({ erro: "Credenciais inválidas" });

    const payload: TokenPayload = { id: user.id, email: user.email, papel: user.papel };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_SECONDS });

    const { senhaHash, ...safe } = user as any;
    return res.json({ token, usuario: safe });
  },

  listar(_req: Request, res: Response) {
    const lista = repo.listar().map(u => {
      const { senhaHash, ...safe } = u as any;
      return safe;
    });
    res.json(lista);
  },

  buscar(req: Request, res: Response) {
    const u = repo.buscarPorId(Number(req.params.id));
    if (!u) return res.status(404).json({ erro: "Usuário não encontrado" });
    const { senhaHash, ...safe } = u as any;
    return res.json(safe);
  },

  atualizar(req: Request, res: Response) {
    const parsed = EsquemaAtualizarUsuario.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error.format());
    if ((parsed.data as any).senha) {
      return res.status(400).json({ erro: "Use a rota de troca de senha." });
    }

    const up = repo.atualizar(Number(req.params.id), parsed.data as any);
    if (!up) return res.status(404).json({ erro: "Usuário não encontrado" });
    const { senhaHash, ...safe } = up as any;
    return res.json(safe);
  },

  alterarSenha(req: Request, res: Response) {
    const id = Number(req.params.id);
    const { senhaAtual, novaSenha } = req.body as { senhaAtual?: string; novaSenha?: string };
    if (!senhaAtual || !novaSenha) {
      return res.status(400).json({ erro: "senhaAtual e novaSenha são obrigatórias" });
    }

    if (!req.user) return res.status(401).json({ erro: "Não autenticado" });
    if (req.user.id !== id && req.user.papel !== "admin") {
      return res.status(403).json({ erro: "Você não pode alterar a senha de outro usuário" });
    }

    const user = repo.verificarSenha(req.user.email!, senhaAtual);
    if (!user || user.id !== id) {
      return res.status(401).json({ erro: "Senha atual incorreta" });
    }

    const atualizado = repo.atualizarSenha(id, novaSenha);
    if (!atualizado) return res.status(404).json({ erro: "Usuário não encontrado" });
    return res.status(204).send();
  },

  remover(req: Request, res: Response) {
    return res.status(repo.remover(Number(req.params.id)) ? 204 : 404).send();
  },
};
