// src/Infra/repositorios/PessoaRepositorio.ts
import { Types } from "mongoose";
import { PessoaModel } from "../../dominio/esquemas/PessoaModel";
import { CriarPessoaDTO, AtualizarPessoaDTO } from "../../dominio/esquemas/PessoaDTO";

export class PessoaRepositorio {
  async criar(dados: CriarPessoaDTO) {
    const doc = await PessoaModel.create({
      ...dados,
      criadoEm: new Date(),
    });
    return doc.toObject();
  }

  async listar(f?: { tipo?: "PF" | "PJ"; q?: string }) {
    const filtro: any = {};
    if (f?.tipo) filtro.tipo = f.tipo;
    if (f?.q) {
      filtro.$or = [
        { nome: { $regex: f.q, $options: "i" } },
        { documento: { $regex: f.q, $options: "i" } },
        { email: { $regex: f.q, $options: "i" } },
      ];
    }
    return PessoaModel.find(filtro).limit(100).lean();
  }

  async buscarPorId(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return PessoaModel.findById(id).lean();
  }

  async atualizar(id: string, patch: AtualizarPessoaDTO) {
    if (!Types.ObjectId.isValid(id)) return null;
    return PessoaModel.findByIdAndUpdate(
      id,
      { ...patch, atualizadoEm: new Date() },
      { new: true }
    ).lean();
  }

  async remover(id: string) {
    if (!Types.ObjectId.isValid(id)) return false;
    const res = await PessoaModel.findByIdAndDelete(id);
    return !!res;
  }
}
