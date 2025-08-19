import { z } from "zod";
import { EsquemaEndereco } from "./EnderecoSchema";

const apenasNum = (s: string) => s.replace(/\D/g, "");

export const EsquemaPessoa = z.object({
  tipo: z.enum(["PF","PJ"]),
  nome: z.string().min(3),
  documento: z.string().transform(apenasNum),
  email: z.string().email().optional(),
  telefone: z.string().transform(apenasNum).optional(),
  endereco: EsquemaEndereco,
}).superRefine((d, ctx) => {
  const len = d.documento.length;
  if (d.tipo === "PF" && len !== 11)
    ctx.addIssue({ path: ["documento"], code: "custom", message: "CPF deve ter 11 dígitos" });
  if (d.tipo === "PJ" && len !== 14)
    ctx.addIssue({ path: ["documento"], code: "custom", message: "CNPJ deve ter 14 dígitos" });
});

export type CriarPessoaDTO = z.infer<typeof EsquemaPessoa>;
export const EsquemaAtualizarPessoa = EsquemaPessoa.partial();
export type AtualizarPessoaDTO = z.infer<typeof EsquemaAtualizarPessoa>;
