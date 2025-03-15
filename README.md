# 📌 FastFeet

API para controle de encomendas de uma transportadora fictícia, a FastFeet.

## Índice

1. [Sobre o projeto](#sobre-o-projeto)
2. [Tecnologias utilizadas](#tecnologias-utilizadas)
3. [Conceitos aplicados](#conceitos-aplicados)
4. [Casos de uso](#casos-de-uso)
5. [Regras de negócio](#regras-de-negocio)
6. [Instalação e configuração](#instalacao-e-configuracao)
7. [Documentação da API (Swagger)](#documentacao-da-api-swagger)
8. [Testes](#testes)
9. [Contato](#contato)
10. [Autor](#autor)

## Sobre o projeto

O **FastFeet** é uma API desenvolvida para gerenciar o fluxo de encomendas de uma transportadora fictícia. A aplicação permite que administradores cadastrem entregadores, clientes e encomendas, garantindo um controle eficiente das operações logísticas.

### 🚀 Objetivo

Facilitar a gestão de entregas, oferecendo uma API robusta que permite:

- Cadastro e gerenciamento de entregadores e destinatários.
- Controle do fluxo de entrega, incluindo retirada e confirmação da entrega.
- Registro de problemas nas encomendas.
- Autenticação e controle de permissões para diferentes perfis de usuários.

### 🎯 Público-alvo

A API foi projetada para ser utilizada por:

- Administradores da transportadora, que gerenciam entregadores e encomendas.
- Entregadores, que podem visualizar suas encomendas e registrar entregas ou problemas.

## Tecnologias utilizadas

O projeto foi desenvolvido com as seguintes tecnologias:

### 🏗 Backend
- **Node.js** - Plataforma utilizada para execução do código JavaScript no servidor.
- **NestJS** - Framework para construção de APIs escaláveis e modulares.

### 🗄️ Banco de dados
- **PostgreSQL** - Banco de dados relacional utilizado para armazenamento das informações.
- **Prisma** - ORM para interação eficiente com o banco de dados.

### 📦 Infraestrutura e ferramentas
- **Docker** - Para conteinerização e gerenciamento dos serviços.
- **Cloudflare R2** - Para armazenamento de arquivos.

### 🔐 Segurança e autenticação
- **JWT (JSON Web Token)** - Para autenticação segura dos usuários.
- **passport-jwt** - Middleware para integração do JWT com NestJS.
- **bcryptjs** - Para hash e validação segura de senhas.

### 📏 Validação e controle de acesso
- **Zod** - Para validação de schemas de dados.
- **CASL** - Para gerenciamento de permissões e controle de acesso baseado em regras.

### 🧪 Testes
- **Vitest** - Para implementação de testes automatizados.

### 📖 Documentação
- **Swagger** - Para geração da documentação da API.

## Conceitos aplicados

- DDD, Domain Events, Clean Architecture
- Autenticação e Autorização (RBAC e ABAC)
- Testes unitários e e2e
- Integração com serviços externos

## Casos de uso

- A aplicação deve ter dois tipos de usuário, entregador e/ou admin
- Deve ser possível realizar login com CPF e Senha
- Deve ser possível realizar o CRUD dos entregadores
- Deve ser possível realizar o CRUD das encomendas
- Deve ser possível realizar o CRUD dos destinatários
- Deve ser possível marcar uma encomenda como aguardando (Disponível para retirada)
- Deve ser possível retirar uma encomenda
- Deve ser possível marcar uma encomenda como entregue
- Deve ser possível marcar uma encomenda como devolvida
- Deve ser possível listar as encomendas com endereços de entrega próximo ao local do entregador
- Deve ser possível alterar a senha de um usuário
- Deve ser possível listar as entregas de um usuário
- Deve ser possível notificar o destinatário a cada alteração no status da encomenda

## Regras de negócio

- Somente usuário do tipo admin pode realizar operações de CRUD nas encomendas
- Somente usuário do tipo admin pode realizar operações de CRUD dos entregadores
- Somente usuário do tipo admin pode realizar operações de CRUD dos destinatários
- Para marcar uma encomenda como entregue é obrigatório o envio de uma foto
- Somente o entregador que retirou a encomenda pode marcar ela como entregue
- Somente o admin pode alterar a senha de um usuário
- Não deve ser possível um entregador listar as encomendas de outro entregador

## Instalação e configuração

Passos para configurar o ambiente local:

1. Clone o repositório:
   ```sh
   git clone https://github.com/josevictorn/fastfeet-api.git
   ```
2. Acesse o diretório:
   ```sh
   cd fastfeet-api
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure as variáveis de ambiente:
   ```sh
   cp .env.example .env
   ```
5. Configure as variáveis de ambiente de test:
   ```sh
   cp .env.test.example .env.test
   ```
6. Crie e inicie o banco de dados com Docker:
   ```sh
   docker-compose up -d
   ```
7. Execute as migrations do Prisma:
   ```sh
   npx prisma migrate dev
   ```
8. Crie e configure um bucket no Cloudflare R2 para armazenamento de arquivos e defina as credenciais nas variáveis de ambiente.
9. Inicie o servidor:
   ```sh
   npm run start:dev
   ```

## Documentação da API (Swagger)

A documentação completa dos endpoints da API está disponível via Swagger. Para acessá-la:

1. Inicie a aplicação.
2. Acesse a URL da documentação no navegador:
   ```
   http://localhost:3000/api-docs
   ```
3. Explore os endpoints, visualize os modelos de requisição e resposta, e teste as chamadas diretamente na interface.

## Testes

- Para executar os testes unitários, utilize o seguinte comando:
  ```sh
  npm run test
  ```
- Para executar os testes end-to-end (E2E), utilize o seguinte comando:
  ```sh
  npm run test:e2e
  ```

## Contato
Para dúvidas ou sugestões, entre em contato através de:

- [Email](mailto:josevictornascimento2016@gmail.com)
- [Linkedin](https://www.linkedin.com/in/jos%C3%A9-victor-nascimento-7983b2230/)

## Autor

Feito com amor por [@josevictorn](https://github.com/josevictorn)

