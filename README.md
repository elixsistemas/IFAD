# IFAD API (Node + TypeScript + MongoDB)

API REST com **TypeScript**, validação **Zod**, autenticação **JWT**, documentação **Swagger** e persistência em **MongoDB Atlas** via **Mongoose**.  
Domínios: **Usuários** (`admin|user`) e **Pessoas** (PF/PJ com Endereço).

---

## 🚀 Tecnologias
- **Node.js** + **TypeScript**
- **Express**
- **MongoDB Atlas** + **Mongoose**
- **JWT** (auth/roles)
- **Zod** (validação)
- **Swagger** (`/docs`)
- **Jest + Supertest** (testes automatizados)

---

## 📦 Requisitos
- Node 18+
- Conta no [MongoDB Atlas](https://cloud.mongodb.com/)

---

## ⚙️ Configuração

1. Crie o arquivo `.env`:
```env
MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.mongodb.net/
PORT=3000
JWT_SECRET=uma_chave_bem_secreta
JWT_EXPIRES=1h
```

2. Instale dependências:
```bash
npm install
```

3. Rodar em desenvolvimento:
```bash
npm run dev
```

4. Build/produção:
```bash
npm run build
npm start
```

A API sobe em `http://localhost:${PORT}` (padrão 3000).  
A documentação está em `http://localhost:${PORT}/docs`.

---

## 📂 Estrutura de Pastas

```
src/
 ┣ 📂 Api/
 ┃ ┣ 📂 controllers/   # PessoasController, UsuariosController
 ┃ ┣ 📂 middlewares/  # auth, logger, errorHandler
 ┃ ┗ 📜 routers.ts    # Rotas principais
 ┣ 📂 dominio/
 ┃ ┣ 📂 entidades/    # Interfaces de domínio (Pessoa, Usuario)
 ┃ ┗ 📂 esquemas/     # DTOs (Zod) + Models (Mongoose)
 ┣ 📂 Infra/
 ┃ ┣ 📂 banco/        # Conexão com MongoDB
 ┃ ┗ 📂 repositorios/ # PessoaRepositorio, UsuarioRepositorio
 ┣ 📂 docs/           # Configuração Swagger
 ┣ 📜 main.ts         # Ponto de entrada
 ┗ 📜 app.ts          # Express app (útil para testes)
```

---

## 🔐 Autenticação & Autorização

- **Login**: `POST /auth/login` → retorna JWT
- Rotas protegidas → Header:
```
Authorization: Bearer <token>
```
- Papéis:
  - `admin`: pode tudo
  - `user`: restrito às próprias ações

---

## 📑 Rotas principais

### Auth
- `POST /auth/login` → login

### Usuários
- `POST /usuarios` → cria usuário
- `GET /usuarios` → lista usuários (**admin**)
- `GET /usuarios/:id` → busca usuário
- `PATCH /usuarios/:id` → atualiza dados
- `PUT /usuarios/:id/senha` → troca senha
- `DELETE /usuarios/:id` → remove usuário (**admin**)

### Pessoas
- `POST /pessoas` → cria pessoa
- `GET /pessoas` → lista pessoas (filtros `?tipo=PF|PJ&q=texto`)
- `GET /pessoas/:id` → busca pessoa
- `PATCH /pessoas/:id` → atualiza
- `DELETE /pessoas/:id` → remove (**admin**)

---

## 📘 Swagger

Acesse `http://localhost:3000/docs` para ver a documentação interativa das rotas.

---

## 🧪 Testes Automatizados

O projeto usa **Jest + ts-jest + Supertest**.  

Rodar testes:
```bash
npm test
```

Exemplo de teste (`__tests__/pessoa.schema.test.ts`):

```ts
import { EsquemaPessoa } from "../src/dominio/esquemas/PessoaSchema";

describe("EsquemaPessoa", () => {
  it("valida CPF correto", () => {
    const result = EsquemaPessoa.safeParse({
      tipo: "PF",
      nome: "Maria Silva",
      documento: "12345678901",
      email: "maria@email.com",
      endereco: { cep: "01001000", logradouro: "Praça da Sé", numero: "1", bairro: "Sé", cidade: "SP", uf: "SP" }
    });
    expect(result.success).toBe(true);
  });
});
```

---

## ✅ Checklist Rubrica

- [x] Schema de banco definido
- [x] Modelagem em documentos
- [x] Conexão isolada e repositórios
- [x] CRUD completo via Mongoose
- [x] Swagger documentando as rotas
- [x] Middlewares (auth, logger, errorHandler)
- [ ] Testes automatizados (básicos implementados, podem ser expandidos)
