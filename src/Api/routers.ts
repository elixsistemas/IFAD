import { Router } from "express";
import { PessoasController } from "./controllers/PessoasController";
import { UsuariosController } from "./controllers/UsuariosController";
import { autenticar, exigirPapel } from "./middlewares/auth";

export const router = Router();

// auth
router.post("/auth/login", UsuariosController.login);

// usuários
router.post("/usuarios", UsuariosController.criar); 
router.get("/usuarios", autenticar, exigirPapel("admin"), UsuariosController.listar);
router.get("/usuarios/:id", autenticar, UsuariosController.buscar);
router.put("/usuarios/:id", autenticar, UsuariosController.atualizar);
router.put("/usuarios/:id/senha", autenticar, UsuariosController.alterarSenha);
router.delete("/usuarios/:id", autenticar, exigirPapel("admin"), UsuariosController.remover);

// pessoas (todas protegidas; delete só admin)
router.post("/pessoas", autenticar, PessoasController.criar);
router.get("/pessoas", autenticar, PessoasController.listar);
router.get("/pessoas/:id", autenticar, PessoasController.buscar);
router.put("/pessoas/:id", autenticar, PessoasController.atualizar);
router.delete("/pessoas/:id", autenticar, exigirPapel("admin"), PessoasController.remover);
