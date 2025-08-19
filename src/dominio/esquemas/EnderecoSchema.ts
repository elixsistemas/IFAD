import { z } from "zod";

import { UFS } from "../objetos/Endereco";

const apenasNumeros = (s: string) => s.replace(/\D/g, "");

export const EsquemaEndereco = z.object({
  cep: z.string()
    .transform(apenasNumeros)
    .pipe(z.string().length(8, "CEP deve ter 8 dígitos")),
  logradouro: z.string().min(3),
  numero: z.string().min(1),
  complemento: z.string().optional(),
  bairro: z.string().min(2),
  cidade: z.string().min(2),
  uf: z.enum(UFS),
});
export type EnderecoDTO = z.infer<typeof EsquemaEndereco>;
