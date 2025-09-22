# 📌 IFAD API - Back-end TypeScript + MongoDB

API RESTful desenvolvida em **Node.js + TypeScript** com **Express** e **MongoDB**, aplicando boas práticas de arquitetura, validações com **Zod**, autenticação com **JWT**, testes com **Jest + Supertest** e documentação com **Swagger**.

---

## 🚀 Tecnologias utilizadas
- Node.js + TypeScript
- Express
- MongoDB + Mongoose
- JWT (Autenticação)
- Zod (Validação de dados)
- Swagger (Documentação)
- Jest + Supertest (Testes)
- MongoDB Memory Server (banco em memória para testes)

---

## 📂 Estrutura de Pastas

```
src/
 ├── Api/
 │   ├── controllers/     # Controladores (Pessoas, Usuários)
 │   ├── middlewares/     # Autenticação, Logger, Error Handler
 │   └── routers.ts       # Rotas da aplicação
 ├── dominio/
 │   └── esquemas/        # Schemas DTO (Zod) e Models (Mongoose)
 ├── Infra/
 │   └── banco/           # Conexão MongoDB
 ├── docs/                # Configuração Swagger
 ├── app.ts               # Criação do Express (para testes e produção)
 └── main.ts              # Ponto de entrada da aplicação
```

---

## ⚙️ Configuração do ambiente

1. Clonar o repositório:
   ```bash
   git clone https://github.com/seu-repositorio/ifad-api.git
   cd ifad-api
   ```

2. Instalar dependências:
   ```bash
   npm install
   ```

3. Criar arquivo `.env`:
   ```env
   MONGO_URI=mongodb+srv://usuario:senha@cluster0.mongodb.net/IFAD_BD
   PORT=3000
   JWT_SECRET=supersecreto
   JWT_EXPIRES=1h
   ```

---

## ▶️ Execução

### Desenvolvimento
```bash
npm run dev
```

### Produção
```bash
npm run build
npm start
```

Servidor rodará em:  
👉 `http://localhost:3000`

---

## 📖 Documentação da API (Swagger)

Disponível em:  
👉 `http://localhost:3000/docs`

---

## 🔐 Autenticação

A API utiliza **JWT Bearer Token**.  
Após login (`POST /auth/login`), use o token retornado para acessar rotas protegidas:

```http
Authorization: Bearer <seu_token>
```

---

## ✅ Testes

### Executar testes automatizados:
```bash
npm test
```

Inclui:
- Testes de **validação com Zod**
- Testes de **autenticação (login + acesso rota protegida)**
- Uso de **MongoDB em memória** para ambiente isolado

---

## 📊 Funcionalidades

### Usuários
- Criar usuário (`POST /usuarios`)
- Login (`POST /auth/login`)
- Listar todos os usuários (apenas admin)
- Buscar por ID
- Atualizar dados
- Alterar senha
- Remover usuário (apenas admin)

### Pessoas
- Criar pessoa (PF/PJ)
- Listar todas as pessoas
- Buscar por ID
- Atualizar dados
- Remover pessoa (apenas admin)

---

## 👨‍💻 Autor
**Ednaldo O. Bezerra**  
Trabalho acadêmico - Pós-graduação Full Stack
