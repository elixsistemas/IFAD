# IFAD API (Node + TypeScript)

API REST com validação **Zod**, autenticação **JWT** e persistência simples em arquivo **`fakeBD.json`**.  
Domínios: **Usuários** (`admin|user`) e **Pessoas** (PF/PJ com Endereço).

---

## Requisitos
- Node 18+ (ou 16 LTS)
- npm

## Configuração

1) Crie o arquivo `.env` na raiz:
```
PORT=3000
JWT_SECRET=uma_chave_bem_secreta
JWT_EXPIRES=1h   # ou segundos: 3600
```

2) Instale dependências:
```bash
npm i
```

3) Rodar em desenvolvimento:
```bash
npm run dev
```

4) Build/produção:
```bash
npm run build
npm start
```

A API sobe em `http://localhost:${PORT}` (padrão 3000).

---

## Estrutura (resumo)

```
src/
  Api/
    controllers/
      PessoasController.ts
      UsuariosController.ts
    middlewares/
      auth.ts
    routers.ts
  config/
    env.ts
    jwt.ts
  dominio/
    entidades/
      pessoa.ts
      usuario.ts
    esquemas/
      EnderecoSchema.ts
      PessoaSchema.ts
      UsuarioSchema.ts
    objetos/
      Endereco.ts
  Infra/
    banco/
      db.ts
      DBSchema.ts
      fakeBD.json
    repositorios/
      PessoaRepositorio.ts
      UsuarioRepositorio.ts
  main.ts
types/
  express.d.ts
```

> **Persistência**: os repositórios leem e gravam no `Infra/banco/fakeBD.json` a cada operação.

---

## Autenticação & Autorização

- **Login**: `POST /auth/login` → retorna `token` (JWT) + dados do usuário.
- Rotas protegidas exigem **header**:
  ```
  Authorization: Bearer <token>
  ```
- Algumas rotas exigem **papel** `admin` (middleware `exigirPapel('admin')`).
- O payload do token inclui `{ id, email, papel }`.

---

## Validação (Zod)

- **Pessoa**: `tipo: 'PF'|'PJ'`, documento/cep normalizados (apenas dígitos), endereço (`UF` válido).
- **Usuário**: senha exigida apenas no create; **nunca** retorna `senhaHash` nas respostas.

---

## Rotas

### Auth

**POST `/auth/login`**
```json
{ "email": "admin@empresa.com", "senha": "123456" }
```
**200**
```json
{
  "token": "<jwt>",
  "usuario": { "id": 1, "nome": "Admin", "email": "admin@empresa.com", "papel": "admin" }
}
```

---

### Usuários

**POST `/usuarios`** – criar (público para semear o 1º admin)
```json
{ "nome":"Admin", "email":"admin@empresa.com", "senha":"123456", "papel":"admin" }
```
**201** → usuário sem `senhaHash`.

**GET `/usuarios`** – listar (**admin**)

**GET `/usuarios/:id`** – buscar (autenticado)

**PUT `/usuarios/:id`** – atualizar dados (autenticado, **sem senha**)

**PUT `/usuarios/:id/senha`** – trocar senha (autenticado; próprio usuário ou admin)
```json
{ "senhaAtual": "123456", "novaSenha": "nova123" }
```
**204** sem corpo.

**DELETE `/usuarios/:id`** – remover (**admin**)

---

### Pessoas (todas autenticadas)

**POST `/pessoas`**
```json
{
  "tipo":"PF",
  "nome":"João Silva",
  "documento":"123.456.789-01",
  "email":"joao@email.com",
  "telefone":"(11) 99999-0000",
  "endereco":{
    "cep":"01001-000",
    "logradouro":"Praça da Sé",
    "numero":"100",
    "bairro":"Sé",
    "cidade":"São Paulo",
    "uf":"SP"
  }
}
```
**201** pessoa criada.

**GET `/pessoas`** – filtros: `?tipo=PF|PJ` e `?q=<texto>`

**GET `/pessoas/:id`**

**PUT `/pessoas/:id`** – patch parcial
```json
{ "nome":"João A. Silva", "endereco": { "numero":"120" } }
```

**DELETE `/pessoas/:id`** – (geralmente **admin**, se configurado)

---

## Códigos de erro (padrão)

- **400**: validação (Zod) / body inválido
- **401**: sem token / token inválido / senha atual incorreta
- **403**: acesso negado (sem permissão)
- **404**: recurso não encontrado
- **204**: operação concluída sem body (delete, troca de senha)

---

## Testes rápidos (cURL)

```bash
# criar admin
curl -X POST http://localhost:3000/usuarios   -H "Content-Type: application/json"   -d '{"nome":"Admin","email":"admin@empresa.com","senha":"123456","papel":"admin"}'

# login
TOKEN=$(curl -s -X POST http http://localhost:3000/auth/login   -H "Content-Type: application/json"   -d '{"email":"admin@empresa.com","senha":"123456"}' | jq -r .token)

# criar pessoa
curl -X POST http://localhost:3000/pessoas   -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json"   -d '{"tipo":"PF","nome":"João","documento":"123.456.789-01","endereco":{"cep":"01001-000","logradouro":"Praça da Sé","numero":"100","bairro":"Sé","cidade":"São Paulo","uf":"SP"}}'
```

---

## Checklist de requisitos

- [x] Node + TypeScript (API REST)
- [x] Camadas: **Api / dominio / Infra**
- [x] Validação com **Zod** (DTOs) + normalização de CEP/documento/telefone
- [x] **JWT** (login, autenticação e autorização por papel)
- [x] **Troca de senha** com verificação de senha atual
- [x] Persistência **`fakeBD.json`** (criar/listar/atualizar/remover)
- [x] Rotas e exemplos documentados (README + Postman)
- [x] Tratamento de erros padronizado
