import type { Endereco } from "../objetos/Endereco";
export type TipoPessoa = "PF" | "PJ";

export interface Pessoa {
  id: number;
  tipo: TipoPessoa;
  nome: string;
  documento: string;
  email?: string;
  telefone?: string;
  endereco: Endereco;
  criadoEm: Date;
  atualizadoEm: Date | null;
}