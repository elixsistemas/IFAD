import fs from "fs";
import path from "path";
import {
  BancoDeDados,
  UsuarioRegistro,
  PessoaRegistro,
} from "./DBSchema";

const DB_PATH = path.resolve(__dirname, "fakeBD.json");

function ensureFile() {
  if (!fs.existsSync(DB_PATH)) {
    const vazio: BancoDeDados = {
      lastUsuarioId: 0,
      usuarios: [],
      lastPessoaId: 0,
      pessoas: [],
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(vazio, null, 2));
  }
}

export function carregarDB(): BancoDeDados {
  ensureFile();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as BancoDeDados;
}

export function salvarDB(db: BancoDeDados) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}
