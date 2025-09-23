# IFAD API (Node + TypeScript + MongoDB)

API REST construída em **Node.js + TypeScript**, utilizando:

* **Express** para rotas
* **MongoDB Atlas** com **Mongoose**
* **JWT** para autenticação/autorização
* **Zod** para validação
* **Swagger (OpenAPI)** para documentação interativa
* **Jest + Supertest** para testes automatizados

Domínios: **Usuários** (`admin` | `user`) e **Pessoas** (PF/PJ com Endereço).

---

## 🚀 Tecnologias

* [Node.js](https://nodejs.org/)
* [TypeScript](https://www.typescriptlang.org/)
* [Express](https://expressjs.com/)
* [MongoDB Atlas](https://www.mongodb.com/atlas) + [Mongoose](https://mongoosejs.com/)
* [Zod](https://zod.dev/) (validação de DTOs)
* [JWT](https://jwt.io/) (autenticação e autorização)
* [Swagger UI](https://swagger.io/tools/swagger-ui/) (`/docs`)
* [Jest](https://jestjs.io/) + [Supertest](https://github.com/ladjs/supertest) (testes)

---

## ⚙️ Configuração do ambiente

1. Crie o arquivo `.env` na raiz:

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

5. Acesse:

* API: [http://localhost:3000](http://localhost:3000)
* Swagger Docs: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 📂 Estrutura de Pastas

```
src/
 ┣ 📂 Api/
 ┃ ┣ 📂 controllers/   # PessoasController, UsuariosController
 ┃ ┣ 📂 middlewares/  # autenticação, logger, errorHandler
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

* **Login**: `POST /auth/login` → retorna JWT
* **Header obrigatório em rotas protegidas**:

```
Authorization: Bearer <token>
```

* **Papéis (roles)**:

  * `admin`: pode gerenciar tudo
  * `user`: pode apenas suas ações básicas

---

## 📑 Rotas principais

### 🔑 Auth

* `POST /auth/login` → login

```json
{ "email": "admin@email.com", "senha": "123456" }
```

Resposta:

```json
{
  "token": "<jwt>",
  "usuario": { "_id": "...", "nome": "Admin", "email": "admin@email.com", "papel": "admin" }
}
```

---

### 👤 Usuários

* `POST /usuarios` → cria usuário
* `GET /usuarios` → lista usuários (**apenas admin**)
* `GET /usuarios/:id` → busca usuário por ID
* `PATCH /usuarios/:id` → atualiza dados
* `PUT /usuarios/:id/senha` → troca senha
* `DELETE /usuarios/:id` → remove usuário (**admin**)

---

### 🧾 Pessoas

* `POST /pessoas` → cria pessoa
* `GET /pessoas` → lista pessoas (filtros `?tipo=PF|PJ&q=texto`)
* `GET /pessoas/:id` → busca pessoa
* `PATCH /pessoas/:id` → atualiza parcialmente
* `DELETE /pessoas/:id` → remove (**admin**)

---

## 📘 Swagger

A documentação interativa está disponível em:
👉 [http://localhost:3000/docs](http://localhost:3000/docs)

---

## 📊 Modelagem do Banco (MongoDB)

### Coleção `usuarios`

| Campo     | Tipo     | Obrigatório | Descrição                         |
| --------- | -------- | ----------- | --------------------------------- |
| \_id      | ObjectId | Sim         | Gerado automaticamente pelo Mongo |
| nome      | String   | Sim         | Nome completo do usuário          |
| email     | String   | Sim         | Único (login)                     |
| senhaHash | String   | Sim         | Hash da senha (bcrypt)            |
| papel     | String   | Sim         | `admin` ou `user`                 |
| criadoEm  | Date     | Sim         | Data de criação                   |

---

### Coleção `pessoas`

| Campo     | Tipo     | Obrigatório | Descrição                         |
| --------- | -------- | ----------- | --------------------------------- |
| \_id      | ObjectId | Sim         | Gerado automaticamente pelo Mongo |
| tipo      | String   | Sim         | `PF` ou `PJ`                      |
| nome      | String   | Sim         | Nome/Razão Social                 |
| documento | String   | Sim         | CPF ou CNPJ (somente dígitos)     |
| email     | String   | Opcional    | E-mail                            |
| telefone  | String   | Opcional    | Telefone                          |
| endereco  | Object   | Sim         | Subdocumento com os dados abaixo  |
| criadoEm  | Date     | Sim         | Data de criação                   |

#### Subdocumento `endereco`

| Campo      | Tipo   | Obrigatório | Descrição                   |
| ---------- | ------ | ----------- | --------------------------- |
| cep        | String | Sim         | CEP normalizado (8 dígitos) |
| logradouro | String | Sim         | Nome da rua/avenida         |
| numero     | String | Sim         | Número                      |
| bairro     | String | Sim         | Bairro                      |
| cidade     | String | Sim         | Cidade                      |
| uf         | String | Sim         | Estado (sigla de 2 letras)  |

---

## 🧪 Testes Automatizados

Rodar todos os testes:

```bash
npm test
```

Exemplo de teste unitário:

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

## ✅ Checklist da Rubrica

* [x] Schema do banco de dados da aplicação
* [x] Modelagem em documentos (MongoDB)
* [x] Conexão isolada + camada de repositórios
* [x] CRUD completo via Mongoose
* [x] Swagger documentando as rotas
* [x] Middlewares (auth, logger, errorHandler)
* [x] Autorização por papel (admin/user)
* [x] Testes automatizados (mínimos implementados)

---

## 📌 Observações

* Primeiro usuário `admin` deve ser criado via `POST /usuarios`.
* Após isso, o fluxo padrão é login → uso do token nas demais rotas.
* Senhas nu
