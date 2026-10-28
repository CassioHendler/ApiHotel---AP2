# API Hotel

## Tema

Hotel: cadastro, consulta, atualização e remoção de quartos.

## Requisitos

- .NET 10 SDK
- ASP.NET Core Minimal API + Entity Framework Core 10 (SQLite)
- Ferramenta `dotnet-ef` 10.0.12 (`dotnet tool install --global dotnet-ef --version 10.0.12`)
- Bruno (para abrir a Collection da pasta `bruno/`)

## Como executar

Na pasta do projeto (onde está o `ApiHotel.csproj`):

```bash
dotnet restore
dotnet build
dotnet ef database update
dotnet run --urls http://localhost:5050
```

`dotnet ef database update` aplica as migrations versionadas em `Migrations/` e cria o arquivo SQLite local `apihotel.db` (ele não é versionado). A connection string está em `appsettings.json`.

## Como abrir a interface

Com a API em execução, abra no navegador: **http://localhost:5050**

A interface (`wwwroot/`) é servida pela própria API, na mesma origem, e usa `fetch` nos endpoints reais para listar, cadastrar, editar e excluir quartos.

## Rotas da API

| Método | Rota | Descrição | Sucesso | Não encontrado |
|---|---|---|---|---|
| GET | `/api/status` | Verifica se a API está no ar | 200 | - |
| GET | `/api/quartos` | Lista todos os quartos | 200 | - |
| GET | `/api/quartos/{id}` | Busca um quarto pelo ID | 200 | 404 |
| POST | `/api/quartos` | Cadastra um quarto | 201 | - |
| PUT | `/api/quartos/{id}` | Atualiza um quarto | 200 | 404 |
| DELETE | `/api/quartos/{id}` | Remove um quarto | 204 | 404 |

POST e PUT retornam 400 se o título estiver vazio.

JSON do POST (`disponivel` é opcional e vale `true` por padrão):

```json
{ "titulo": "Quarto 301 - Suíte Luxo", "disponivel": true }
```

JSON do PUT:

```json
{ "titulo": "Quarto 301 - Suíte Luxo Reformada", "disponivel": false }
```

## Persistência

Os dados ficam no SQLite via Entity Framework Core (`Quarto`, `ApiDbContext`, `DbSet<Quarto>`) e continuam salvos após reiniciar a API.

## Testes

A Collection do Bruno está em `bruno/Api Hotel AP2` (abrir a pasta no Bruno), com status, listar, buscar por ID, cadastrar, atualizar, remover e confirmar o 404 após remover. As requisições usam `http://localhost:5050` e o ID 1: após cadastrar, ajuste o número na URL para o ID retornado pelo POST, se for diferente.

## Vídeo de demonstração — AP2

https://drive.google.com/drive/folders/1AdOpij7Wd1Vzkid1H6994Cmda-yPKlR8?usp=sharing

