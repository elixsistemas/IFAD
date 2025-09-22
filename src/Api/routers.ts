import { Router } from "express";
import { PessoasController } from "./controllers/PessoasController";
import { UsuariosController } from "./controllers/UsuariosController";
import { autenticar, exigirPapel } from "./middlewares/auth";
import { logger } from "./middlewares/logger";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger";

export const router = Router();

router.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

router.post("/auth/login", logger, UsuariosController.login);

router.post("/usuarios", UsuariosController.criar); 
router.get("/usuarios", autenticar, exigirPapel("admin"), UsuariosController.listar);
router.get("/usuarios/:id", autenticar, UsuariosController.buscar);
router.patch("/usuarios/:id", autenticar, UsuariosController.atualizar);
router.patch("/usuarios/:id/senha", autenticar, UsuariosController.alterarSenha);
router.delete("/usuarios/:id", autenticar, exigirPapel("admin"), UsuariosController.remover);

router.post("/pessoas", autenticar, PessoasController.criar);
router.get("/pessoas", autenticar, PessoasController.listar);
router.get("/pessoas/:id", autenticar, PessoasController.buscar);
router.patch("/pessoas/:id", autenticar, PessoasController.atualizar);
router.delete("/pessoas/:id", autenticar, exigirPapel("admin"), PessoasController.remover);
