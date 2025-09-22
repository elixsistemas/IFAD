// src/dominio/esquemas/UsuarioModel.ts
import { Schema, model, Document } from "mongoose";

export interface UsuarioDoc extends Document {
  nome: string;
  email: string;
  senhaHash: string;
  papel: "admin" | "user";
  criadoEm: Date;
}

const UsuarioSchema = new Schema<UsuarioDoc>(
  {
    nome: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    senhaHash: { type: String, required: true },
    papel: { type: String, enum: ["admin", "user"], default: "user" },
    criadoEm: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

export const UsuarioModel = model<UsuarioDoc>("Usuario", UsuarioSchema);
