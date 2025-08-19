export const UFS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB",
  "PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
] as const;

export type UF = typeof UFS[number];

export interface Endereco {
  cep: string; logradouro: string; numero: string; complemento?: string;
  bairro: string; cidade: string; uf: UF;
}