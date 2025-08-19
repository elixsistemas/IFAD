import fs from "fs";
import path from "path";
import type { Pessoa } from "../../dominio/entidades/pessoa";

const DB_PATH = path.resolve(__dirname, "../banco/fakeBD.json");

type PessoaFile = Omit<Pessoa, "criadoEm" | "atualizadoEm"> & {
  criadoEm: string;
  atualizadoEm?: string | null;
};

type DBShape = {
  lastPessoaId: number;
  pessoas: PessoaFile[];

  lastUsuarioId?: number;
  usuarios?: any[];
};

function ensureDB() {
  if (!fs.existsSync(DB_PATH)) {
    const vazio: DBShape = { lastPessoaId: 0, pessoas: [] };
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
const toFile = (p: Pessoa): PessoaFile => ({
  ...p,
  criadoEm: p.criadoEm.toISOString(),
  atualizadoEm: p.atualizadoEm ? p.atualizadoEm.toISOString() : null,
});
const fromFile = (r: PessoaFile): Pessoa => ({
  ...r,
  criadoEm: new Date(r.criadoEm),
  atualizadoEm: r.atualizadoEm ? new Date(r.atualizadoEm) : null,
});

export class PessoaRepositorio {
  private seq = 0;
  private data: Pessoa[] = [];

  constructor() {
    const db = loadDB();
    this.seq = db.lastPessoaId ?? 0;
    this.data = (db.pessoas ?? []).map(fromFile);
  }

  private persist() {
    const db = loadDB();
    const novo: DBShape = {
      ...db,
      lastPessoaId: this.seq,
      pessoas: this.data.map(toFile),
    };
    saveDB(novo);
  }

  criar(p: Omit<Pessoa, "id" | "criadoEm" | "atualizadoEm">): Pessoa {
    const entity: Pessoa = {
      ...p,
      id: ++this.seq,
      criadoEm: new Date(),
      atualizadoEm: null,
    };
    this.data.push(entity);
    this.persist();
    return entity;
  }

  listar(f?: { tipo?: "PF" | "PJ"; q?: string }) {
    let arr = [...this.data];
    if (f?.tipo) arr = arr.filter(p => p.tipo === f.tipo);
    if (f?.q) {
      const q = f.q.toLowerCase();
      arr = arr.filter(p =>
        p.nome.toLowerCase().includes(q) ||
        p.documento.includes(q) ||
        (p.email?.toLowerCase().includes(q) ?? false)
      );
    }
    return arr;
  }

  buscarPorId(id: number) {
    return this.data.find(p => p.id === id) ?? null;
  }

  atualizar(id: number, patch: Partial<Pessoa>) {
    const i = this.data.findIndex(p => p.id === id);
    if (i < 0) return null;

    const atual = this.data[i];
    if (!atual) return null;

    const atualizado: Pessoa = {
      ...atual,
      ...patch,
      endereco: patch.endereco ? { ...atual.endereco, ...patch.endereco } : atual.endereco,
      atualizadoEm: new Date(),
    };

    this.data[i] = atualizado;
    this.persist();
    return atualizado;
  }

  remover(id: number) {
    const antes = this.data.length;
    this.data = this.data.filter(p => p.id !== id);
    const mudou = this.data.length < antes;
    if (mudou) this.persist();
    return mudou;
  }
}
