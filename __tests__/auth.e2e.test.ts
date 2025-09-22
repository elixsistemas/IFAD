import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import { createApp } from "../src/app";
import { connectMongo, disconnectMongo } from "../src/Infra/banco/db";

let mongod: MongoMemoryServer;

describe("Fluxo de autenticação", () => {
  const app = createApp();

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();
    await connectMongo(mongod.getUri());
  });

  afterAll(async () => {
    await disconnectMongo();
    await mongod.stop();
  });

  it("cria usuário, faz login e acessa rota protegida", async () => {
    const novoUsuario = {
      nome: "Admin",
      email: "admin@empresa.com",
      senha: "123456",
      papel: "admin",
    };

    const resCreate = await request(app).post("/usuarios").send(novoUsuario);
    expect(resCreate.status).toBe(201);

    const resLogin = await request(app)
      .post("/auth/login")
      .send({ email: "admin@empresa.com", senha: "123456" });

    expect(resLogin.status).toBe(200);
    const token = resLogin.body.token;

    const resList = await request(app)
      .get("/pessoas")
      .set("Authorization", `Bearer ${token}`);

    expect(resList.status).toBe(200);
  });
});
