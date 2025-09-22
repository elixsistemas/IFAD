// src/docs/swagger.ts
import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.3",
  info: {
    title: "IFAD API - Back-end TypeScript + MongoDB",
    version: "1.0.0",
    description: "API documentada com JSDoc + Swagger (OpenAPI).",
  },
  servers: [{ url: "http://localhost:3000", description: "Local" }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Pessoa: {
        type: "object",
        required: ["tipo", "nome", "documento"],
        properties: {
          id: { type: "string", example: "66c9cba759ccf797fbbb5bf7" },
          tipo: { type: "string", enum: ["PF", "PJ"] },
          nome: { type: "string", example: "João da Silva" },
          documento: { type: "string", example: "12345678901" },
          email: { type: "string", example: "joao@email.com" },
          telefone: { type: "string", example: "11999999999" },
          endereco: {
            type: "object",
            properties: {
              cep: { type: "string", example: "01001-000" },
              logradouro: { type: "string", example: "Praça da Sé" },
              numero: { type: "string", example: "100" },
              bairro: { type: "string", example: "Sé" },
              cidade: { type: "string", example: "São Paulo" },
              uf: { type: "string", example: "SP" },
              complemento: { type: "string", example: "Apto 10" },
            },
          },
          criadoEm: { type: "string", format: "date-time" },
          atualizadoEm: { type: "string", format: "date-time" },
        },
      },
      Usuario: {
        type: "object",
        required: ["nome", "email", "senha"],
        properties: {
          id: { type: "string", example: "66c9ccba759ccf797fbbb5bf7" },
          nome: { type: "string", example: "Maria Admin" },
          email: { type: "string", example: "maria@email.com" },
          senha: { type: "string", example: "123456" },
          papel: { type: "string", enum: ["admin", "user"], example: "admin" },
          criadoEm: { type: "string", format: "date-time" },
        },
      },
      LoginRequest: {
        type: "object",
        required: ["email", "senha"],
        properties: {
          email: { type: "string", example: "maria@email.com" },
          senha: { type: "string", example: "123456" },
        },
      },
      LoginResponse: {
        type: "object",
        properties: {
          token: { type: "string" },
          usuario: { $ref: "#/components/schemas/Usuario" },
        },
      },
    },
  },
  security: [{ bearerAuth: [] }],
};

export const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ["src/Api/controllers/*.ts"], // pega apenas os controllers
};

export const swaggerSpec = swaggerJSDoc(swaggerOptions);
