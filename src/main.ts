import express from 'express'
import type { Request, Response } from 'express'

const app = express()
const port = 3000

app.get('/', (req: Request, res: Response) => {
  res.send('Sistema IFAD rodando com Express + TypeScript!')
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
})

import { pessoas } from './pessoa';

function retornaPessoas(){
    return pessoas;
}

function retornaPessoasPorID(id: number){
    return pessoas.find(user => user.id === id);
}

const pessoaID = retornaPessoasPorID(3);
console.log(pessoaID);

const pessoaDB = retornaPessoas();
console.log(pessoaDB);

console.log("Sistema IFAD Iniciado!");


