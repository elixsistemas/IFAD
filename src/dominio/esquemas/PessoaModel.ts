// src/dominio/esquemas/PessoaModel.ts
import { Schema, model, Document } from "mongoose";

export interface Endereco {
  cep?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
  complemento?: string;
}

export interface PessoaDoc extends Document {
  tipo: "PF" | "PJ";
  nome: string;
  documento: string;
  email?: string;
  telefone?: string;
  endereco?: Endereco;
  criadoEm?: Date;
  atualizadoEm?: Date;
}

const EnderecoSchema = new Schema<Endereco>(
  {
    cep: String,
    logradouro: String,
    numero: String,
    bairro: String,
    cidade: String,
    uf: String,
    complemento: String,
  },
  { _id: false } // não cria _id para subdocumento
);

const PessoaSchema = new Schema<PessoaDoc>(
  {
    tipo: { type: String, enum: ["PF", "PJ"], required: true },
    nome: { type: String, required: true },
    documento: { type: String, required: true },
    email: { type: String },
    telefone: { type: String },
    endereco: EnderecoSchema,
    criadoEm: { type: Date, default: Date.now },
    atualizadoEm: { type: Date },
  },
  { collection: "pessoas", versionKey: false }
);

export const PessoaModel = model<PessoaDoc>("Pessoa", PessoaSchema);
