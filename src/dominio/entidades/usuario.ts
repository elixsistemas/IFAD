export type Papel = "admin" | "user";

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  papel: Papel;
  criadoEm: Date;
}
