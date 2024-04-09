# Ponto de Venda API

Uma API para gerenciamento de um sistema de Ponto de Venda (PDV), fornecendo recursos essenciais para operações de vendas e gerenciamento de clientes, produtos e pedidos.

## Principais Tecnologias Utilizadas
- [TypeScript](https://www.typescriptlang.org/): Superset JavaScript, para desenvolvimento escalável.
- [Node.js](https://nodejs.org/en): Ambiente de execução JavaScript do lado do servidor.
- [Express.js](https://expressjs.com/pt-br/): Framework web para Node.js para criar APIs RESTful.
- [PostgreSQL](https://www.postgresql.org/): Sistema de gerenciamento de banco de dados relacional poderoso e open-source.

## Principais Dependências
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken): Implementação de JSON Web Tokens para autenticação.
- [bcrypt](https://www.npmjs.com/package/bcrypt): Biblioteca para hashing de senhas.
- [knex](https://www.npmjs.com/package/knex): Construtor de consultas SQL para Node.js.
- [multer](https://www.npmjs.com/package/multer): Middleware Node.js para manipulação de multipart/form-data, usado para upload de imagens.
- [joi](https://www.npmjs.com/package/joi): Biblioteca de validação de dados para Node.js.
- [nodemailer](https://www.npmjs.com/package/nodemailer): Módulo Node.js para envio de e-mails.
- [googleapis](https://www.npmjs.com/package/googleapis): Cliente para várias APIs do Google.

## Recursos / Funcionalidades
- **Persistência de dados**: Armazena informações importantes do PDV em um banco de dados PostgreSQL.
- **Validação de campos**: Utiliza a biblioteca Joi para validar dados de entrada.
- **Senhas criptografadas**: As senhas dos usuários são armazenadas de forma segura usando a função hash do bcrypt.
- **Autenticação por token JWT**: Implementa autenticação de usuário usando JSON Web Tokens para garantir a segurança das rotas.
- **Cadastro para usuários, clientes, produtos e pedidos**: Fornece endpoints para criar, ler, atualizar e excluir registros relacionados a usuários, clientes, produtos e pedidos.
- **Armazenamento de fotos dos produtos na nuvem**: Permite fazer upload de imagens dos produtos, armazenando-as em um serviço de nuvem.
- **Envio de e-mail para o cliente**: Utiliza o Nodemailer para enviar e-mails de confirmação para os clientes após a conclusão de um pedido.

## 🔗 Links

- [API](https://patrick-sistema-pdv.vercel.app/): URL da API para acesso aos endpoints.
- [Documentação - Swagger](https://patrick-sistema-pdv.vercel.app/api-docs/#/): Documentação interativa dos endpoints da API.
