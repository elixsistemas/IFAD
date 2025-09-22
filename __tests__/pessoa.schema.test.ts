import { EsquemaPessoa } from "../src/dominio/esquemas/PessoaDTO";

describe("Validação Pessoa com Zod", () => {
  it("falha com CPF inválido", () => {
    const invalida = { tipo: "PF", nome: "Fulano", documento: "123" };
    const parsed = EsquemaPessoa.safeParse(invalida);
    expect(parsed.success).toBe(false);
  });

  it("aceita CNPJ válido", () => {
    const valida = {
      tipo: "PJ",
      nome: "Empresa",
      documento: "12345678000199",
    };
    const parsed = EsquemaPessoa.safeParse(valida);
    expect(parsed.success).toBe(true);
  });
});
