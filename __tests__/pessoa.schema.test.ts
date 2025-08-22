import { EsquemaPessoa } from "../src/dominio/esquemas/PessoaSchema";

describe("EsquemaPessoa", () => {
  it("valida PF com CEP de 8 dígitos após normalização", () => {
    const ok = EsquemaPessoa.safeParse({
      tipo: "PF",
      nome: "João da Silva",
      documento: "123.456.789-01",
      email: "joao@email.com",
      telefone: "(11) 99999-0000",
      endereco: {
        cep: "01001-000", // vira 01001000
        logradouro: "Praça da Sé",
        numero: "100",
        bairro: "Sé",
        cidade: "São Paulo",
        uf: "SP"
      }
    });
    expect(ok.success).toBe(true);
  });

  it("recusa CEP inválido", () => {
    const fail = EsquemaPessoa.safeParse({
      tipo: "PF",
      nome: "Teste",
      documento: "111.111.111-11",
      endereco: {
        cep: "123", // inválido
        logradouro: "Rua X",
        numero: "1",
        bairro: "B",
        cidade: "C",
        uf: "SP"
      }
    });
    expect(fail.success).toBe(false);
  });
});
