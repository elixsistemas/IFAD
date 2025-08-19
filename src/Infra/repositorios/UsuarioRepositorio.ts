import * as bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import type { Usuario } from "../../dominio/entidades/usuario";

const DB_PATH = path.resolve(__dirname, "../banco/fakeBD.json");

type UsuarioFile = Omit<Usuario, "criadoEm"> & { criadoEm: string };
type DBShape = {
  lastUsuarioId: number;
  usuarios: UsuarioFile[];
};

function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    const vazio: DBShape = { lastUsuarioId: 0, usuarios: [] };
    fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(vazio, null, 2));
  }
}

function loadDB(): DBShape {
  ensureDB();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw) as DBShape;
}

function saveDB(db: DBShape) {
  fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
}

// conversão arquivo ⇄ memória
const toFile = (u: Usuario): UsuarioFile => ({
  ...u,
  criadoEm: u.criadoEm.toISOString(),
});
const fromFile = (r: UsuarioFile): Usuario => ({
  ...r,
  criadoEm: new Date(r.criadoEm),
});
// ==============================================

export class UsuarioRepositorio {
  private seq = 0;
  private data: Usuario[] = [];

  constructor() {
    const db = loadDB();
    this.seq = db.lastUsuarioId;
    this.data = db.usuarios.map(fromFile);
  }

  private persist() {
    const db: DBShape = {
      lastUsuarioId: this.seq,
      usuarios: this.data.map(toFile),
    };
    saveDB(db);
  }

  criar(u: Omit<Usuario, "id" | "criadoEm" | "senhaHash"> & { senha: string }): Usuario {
    const senhaHash = bcrypt.hashSync(u.senha, 10);
    const entity: Usuario = {
      ...u,
      senhaHash,
      id: ++this.seq,
      criadoEm: new Date(),
    } as Usuario;

    delete (entity as any).senha;

    this.data.push(entity);
    this.persist();
    return entity;
  }

  listar(): Usuario[] { return [...this.data]; }

  buscarPorId(id: number): Usuario | null {
    return this.data.find(u => u.id === id) ?? null;
  }

  buscarPorEmail(email: string): Usuario | null {
    return this.data.find(u => u.email === email) ?? null;
  }

  verificarSenha(email: string, senha: string): Usuario | null {
    const user = this.buscarPorEmail(email);
    if (!user) return null;
    const ok = bcrypt.compareSync(senha, user.senhaHash);
    return ok ? user : null;
  }

  atualizarSenha(id: number, novaSenha: string): Usuario | null {
    const i = this.data.findIndex(u => u.id === id);
    if (i < 0) return null;
    const senhaHash = bcrypt.hashSync(novaSenha, 10);
    this.data[i] = { ...this.data[i], senhaHash } as Usuario;
    this.persist();
    return this.data[i];
  }

  atualizar(id: number, patch: Partial<Omit<Usuario, "senhaHash">>): Usuario | null {
    const i = this.data.findIndex(u => u.id === id);
    if (i < 0) return null;
    const atualizado = { ...this.data[i], ...patch } as Usuario;
    this.data[i] = atualizado;
    this.persist();
    return atualizado;
  }

  remover(id: number): boolean {
    const antes = this.data.length;
    this.data = this.data.filter(u => u.id !== id);
    const mudou = this.data.length < antes;
    if (mudou) this.persist();
    return mudou;
  }
}
