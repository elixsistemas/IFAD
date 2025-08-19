export type Papel = "admin" | "user";
export type TipoPessoa = "PF" | "PJ";

export interface EnderecoRegistro {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string | null;
  bairro: string;
  cidade: string;
  uf: string;
}

export interface UsuarioRegistro {
  id: number;
  nome: string;
  email: string;
  senhaHash: string;
  papel: Papel;
  criadoEm: string;
}

export interface PessoaRegistro {
  id: number;
  tipo: TipoPessoa;
  nome: string;
  documento: string;
  email: string | null;
  telefone: string | null;
  endereco: EnderecoRegistro;
  criadoEm: string;
  atualizadoEm: string | null;
}

export interface BancoDeDados {
  lastUsuarioId: number;
  usuarios: UsuarioRegistro[];

  lastPessoaId: number;
  pessoas: PessoaRegistro[];
}
