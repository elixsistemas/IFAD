import { z } from "zod";

export const EsquemaUsuario = z.object({
  nome: z.string().min(3),
  email: z.string().email(),
  senha: z.string().min(6),
  papel: z.enum(["admin","user"]).default("user"),
});
export type CriarUsuarioDTO = z.infer<typeof EsquemaUsuario>;

export const EsquemaAtualizarUsuario = EsquemaUsuario.partial();
export type AtualizarUsuarioDTO = z.infer<typeof EsquemaAtualizarUsuario>;

