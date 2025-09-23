# IFAD API (Node + TypeScript + MongoDB)

API REST com validação **Zod**, autenticação **JWT** e persistência em **MongoDB Atlas**.  
Domínios principais: **Usuários** (`admin|user`) e **Pessoas** (PF/PJ com endereço aninhado).

---

## 📦 Requisitos
- Node 18+ (ou 16 LTS)
- npm
- Conta e cluster no [MongoDB Atlas](https://www.mongodb.com/atlas)

---

## ⚙️ Configuração

1. Crie o arquivo `.env` na raiz:
   ```env
   MONGO_URI=mongodb+srv://<usuario>:<senha>@cluster0.xxxxx.mongodb.net/
   PORT=3000
   JWT_SECRET=uma_chave_bem_secreta
   JWT_EXPIRES=1h   # ou segundos: 3600
   ```

2. Instale dependências:
   ```bash
   npm i
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

A API sobe em [http://localhost:3000](http://localhost:3000) por padrão.

---

## 📂 Estrutura de Pastas

```
src/
  Api/
    controllers/
      PessoasController.ts
      UsuariosController.ts
    middlewares/
      auth.ts
      errorHandler.ts
      logger.ts
    routers.ts
  config/
    jwt.ts
  dominio/
    esquemas/
      PessoaDTO.ts
      PessoaModel.ts
      UsuarioDTO.ts
      UsuarioModel.ts
  Infra/
    banco/
      db.ts
    repositorios/
      PessoaRepositorio.ts
      UsuarioRepositorio.ts
  docs/
    swagger.ts
  main.ts
types/
  express.d.ts
```

---

## 🔑 Autenticação & Autorização

- **Login**: `POST /auth/login` → retorna `token` (JWT) + dados do usuário.
- Rotas protegidas exigem **header**:
  ```
  Authorization: Bearer <token>
  ```
- Algumas rotas exigem **papel** `admin` (`exigirPapel("admin")`).
- O payload do token inclui `{ id, email, papel }`.

---

## 🧾 Modelagem no MongoDB

### Coleção `usuarios`

| Campo      | Tipo      | Obrigatório | Descrição                        |
|------------|----------|-------------|----------------------------------|
| _id        | ObjectId | Sim         | Gerado automaticamente pelo Mongo|
| nome       | String   | Sim         | Nome completo                    |
| email      | String   | Sim (único) | Login e identificação            |
| senhaHash  | String   | Sim         | Senha criptografada (bcrypt)     |
| papel      | String   | Sim         | `admin` ou `user`                |
| criadoEm   | Date     | Sim         | Data de criação                  |
| atualizadoEm | Date   | Não         | Última atualização               |

---

### Coleção `pessoas`

| Campo       | Tipo      | Obrigatório | Descrição                        |
|-------------|----------|-------------|----------------------------------|
| _id         | ObjectId | Sim         | Gerado automaticamente pelo Mongo|
| tipo        | String   | Sim         | `PF` ou `PJ`                     |
| nome        | String   | Sim         | Nome/Razão Social                |
| documento   | String   | Sim         | CPF ou CNPJ (somente dígitos)    |
| email       | String   | Opcional    | E-mail                           |
| telefone    | String   | Opcional    | Telefone                         |
| endereco    | Object   | Sim         | Subdocumento com os dados abaixo |
| criadoEm    | Date     | Sim         | Data de criação                   |

**Subdocumento `endereco`**

| Campo       | Tipo   | Obrigatório | Descrição                        |
|-------------|--------|-------------|----------------------------------|
| cep         | String | Sim         | CEP normalizado (8 dígitos)      |
| logradouro  | String | Sim         | Nome da rua/avenida              |
| numero      | String | Sim         | Número                           |
| bairro      | String | Sim         | Bairro                           |
| cidade      | String | Sim         | Cidade                           |
| uf          | String | Sim         | Estado (sigla de 2 letras)       |

**Exemplo de criação (Mongo Shell):**
```js
db.pessoas.insertOne({
  tipo: "PF",
  nome: "Maria Oliveira",
  documento: "12345678901",
  email: "maria@email.com",
  telefone: "11999990000",
  endereco: {
    cep: "01001000",
    logradouro: "Praça da Sé",
    numero: "100",
    bairro: "Sé",
    cidade: "São Paulo",
    uf: "SP"
  },
  criadoEm: new Date()
});
```

---

## 🚀 Rotas Principais

### Auth
- **POST** `/auth/login` → Login e retorno de JWT.

### Usuários
- **POST** `/usuarios` → Criar usuário (sem senhaHash no retorno).
- **GET** `/usuarios` → Listar usuários (**apenas admin**).
- **GET** `/usuarios/:id` → Buscar usuário por ID.
- **PATCH** `/usuarios/:id` → Atualizar dados.
- **PUT** `/usuarios/:id/senha` → Alterar senha.
- **DELETE** `/usuarios/:id` → Remover (**apenas admin**).

### Pessoas
- **POST** `/pessoas` → Criar pessoa.
- **GET** `/pessoas` → Listar pessoas (com filtros `tipo` e `q`).
- **GET** `/pessoas/:id` → Buscar pessoa por ID.
- **PATCH** `/pessoas/:id` → Atualizar dados.
- **DELETE** `/pessoas/:id` → Remover (**apenas admin**).

---

## ❌ Códigos de Erro Padrão

- **400**: Validação (Zod) / body inválido
- **401**: Token ausente ou inválido
- **403**: Acesso negado (sem permissão)
- **404**: Recurso não encontrado
- **204**: Operação concluída sem body (delete, troca de senha)

---

## 🧪 Testes Automatizados

O projeto usa **Jest + ts-jest** para testes unitários e de integração.

### Rodar testes
```bash
npm test
```

Exemplo de teste de validação (`__tests__/pessoa.schema.test.ts`):

```ts
import { EsquemaPessoa } from "../src/dominio/esquemas/PessoaDTO";

describe("EsquemaPessoa", () => {
  it("valida PF com CEP correto", () => {
    const result = EsquemaPessoa.safeParse({
      tipo: "PF",
      nome: "Maria Silva",
      documento: "12345678901",
      endereco: {
        cep: "01001000",
        logradouro: "Praça da Sé",
        numero: "1",
        bairro: "Sé",
        cidade: "São Paulo",
        uf: "SP"
      }
    });
    expect(result.success).toBe(true);
  });
});
```

---

## 📋 Checklist de requisitos (rubrica)

- [x] Node + TypeScript (API REST)
- [x] Estrutura em camadas: **Api / dominio / Infra**
- [x] Validação com **Zod** (DTOs)
- [x] Normalização de dados (CEP/documento/telefone)
- [x] Autenticação **JWT** (login, autorização por papel)
- [x] Troca de senha com verificação da senha atual
- [x] Persistência em **MongoDB Atlas**
- [x] Rotas documentadas com **Swagger**
- [x] Tratamento de erros padronizado
- [x] Testes automatizados com **Jest**
- [x] Scripts de build (`tsconfig.build.json`)
