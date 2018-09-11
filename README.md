# Projeto de Banco de Dados II utilizando TypeORM - Unisinos

## Requisitos do projeto:

1. Modelar um banco de dados à escolha do grupo (Modelo Conceitual ou Lógico), no qual existam
em torno de 4 entidades relacionadas e ao menos um relacionamento do tipo N:N;
2. Realizar o Mapeamento Objeto-Relacional de acordo com o diagrama ER criado anteriormente.
Popular alguns objetos (registros) em cada uma das entidades modeladas através do framework.
Consultar os objetos inseridos no banco de dados, verificando se foram populados adequadamente;
3. Gerar o Mapeamento XML e XSD das entidades mapeadas.
4. Gerar o Mapeamento JSON das entidades mapeadas com informações populadas.

## Sobre o projeto "Laboratório de Análises Clínicas":

Um banco de dados que gerencia os Bioquímicos, Exames e Pacientes de um Laboratório.

**Algumas consultas que podem ser feitas:**

- Quais Bioquímicos trabalham para tal Laboratório;
- Quais são os Exames que os Bioquímicos estão analisando;
- Quais e quantos Exames um determinado Paciente possui;

## Passo a passo para rodar o TypeORM:

- Rodar o comando `npm i`
- Configurar o banco de dados no arquivo `ormconfig.json`
- Rodar `npm start` para criar, atualizar e consultar o banco de dados
