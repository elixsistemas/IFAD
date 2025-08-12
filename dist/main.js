"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const port = 3000;
app.get('/', (req, res) => {
    res.send('Sistema IFAD rodando com Express + TypeScript!');
});
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
const pessoa_1 = require("./pessoa");
function retornaPessoas() {
    return pessoa_1.pessoas;
}
function retornaPessoasPorID(id) {
    return pessoa_1.pessoas.find(user => user.id === id);
}
const pessoaID = retornaPessoasPorID(3);
console.log(pessoaID);
const pessoaDB = retornaPessoas();
console.log(pessoaDB);
console.log("Sistema IFAD Iniciado!");
//# sourceMappingURL=main.js.map