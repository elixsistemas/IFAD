// src/Infra/repositorios/UsuarioRepositorio.ts
import * as bcrypt from "bcryptjs";
import { UsuarioModel } from "../../dominio/esquemas/UsuarioModel";
import { CriarUsuarioDTO, AtualizarUsuarioDTO } from "../../dominio/esquemas/UsuarioDTO";
import { Types } from "mongoose";

export class UsuarioRepositorio {
  async criar(dados: CriarUsuarioDTO & { senha: string }) {
    const senhaHash = await bcrypt.hash(dados.senha, 10);
    const doc = await UsuarioModel.create({
      ...dados,
      senhaHash,
      criadoEm: new Date(),
    });
    return doc.toObject();
  }

  async listar() {
    return UsuarioModel.find().lean();
  }

  async buscarPorId(id: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    return UsuarioModel.findById(id).lean();
  }

  async buscarPorEmail(email: string) {
    return UsuarioModel.findOne({ email }).lean();
  }

  async verificarSenha(email: string, senha: string) {
    const user = await UsuarioModel.findOne({ email });
    if (!user) return null;

    const ok = await bcrypt.compare(senha, user.senhaHash);
    return ok ? user.toObject() : null;
  }

  async atualizarSenha(id: string, novaSenha: string) {
    if (!Types.ObjectId.isValid(id)) return null;
    const senhaHash = await bcrypt.hash(novaSenha, 10);
    return UsuarioModel.findByIdAndUpdate(id, { senhaHash }, { new: true }).lean();
  }

  async atualizar(id: string, patch: AtualizarUsuarioDTO) {
    if (!Types.ObjectId.isValid(id)) return null;
    return UsuarioModel.findByIdAndUpdate(id, patch, { new: true }).lean();
  }

  async remover(id: string) {
    if (!Types.ObjectId.isValid(id)) return false;
    const res = await UsuarioModel.findByIdAndDelete(id);
    return !!res;
  }
}
