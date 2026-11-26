# API Hotel — AS de Back-end

API do Hotel Paradiso para cadastrar, consultar, atualizar e remover quartos. A aplicação usa ASP.NET Core Minimal API, Entity Framework Core e SQLite.

## Pré-requisitos

- SDK do .NET 10.
- Ferramenta `dotnet-ef` 10.0.12.
- Bruno 3.0 ou mais recente, com suporte a Collections OpenCollection em YAML.

## Estrutura do projeto

```text
ApiHotel---AP2/
├── ApiHotel.csproj
├── Program.cs
├── appsettings.json
├── Models/
│   └── Quarto.cs
├── Dtos/
│   ├── QuartoDTO.cs
│   └── QuartoAtualizadoDTO.cs
├── Data/
│   └── ApiDbContext.cs
├── Migrations/
├── bruno/
│   └── Api Hotel AP2/
│       ├── opencollection.yml
│       ├── environments/
│       │   └── Local.yml
│       └── requisições 00 a 09 (.yml)
├── wwwroot/
├── .gitignore
└── README.md
```

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `Models/Quarto.cs` | Define a entidade `Quarto`, com ID, título e disponibilidade. |
| `Dtos/` | Define o JSON de entrada do POST (`QuartoDTO`) e do PUT (`QuartoAtualizadoDTO`). |
| `Data/ApiDbContext.cs` | Configura o acesso aos dados pelo EF Core e expõe `Quartos` como `DbSet<Quarto>`. |
| `Program.cs` | Inicializa a aplicação, registra o contexto com SQLite, serve os arquivos estáticos e define as rotas. |
| `Migrations/` | Contém a migração inicial e o snapshot do modelo do EF Core. |

O `Program.cs` importa `ApiHotel.Models`, `ApiHotel.Dtos`, `ApiHotel.Data` e `Microsoft.EntityFrameworkCore`. O contexto usa `ApiHotel.Models` para acessar a entidade `Quarto`.

## Executar localmente

Abra um terminal na pasta que contém `ApiHotel.csproj`. Se ainda precisar instalar o `dotnet-ef`, rode:

```powershell
dotnet tool install --global dotnet-ef --version 10.0.12
```

Se já tiver outra versão instalada, use `dotnet tool update --global dotnet-ef --version 10.0.12`.

```powershell
dotnet restore
dotnet build
dotnet ef database update
dotnet run --urls http://localhost:5050
```

O comando `dotnet ef database update` aplica as migrações ao arquivo local `apihotel.db`, configurado em `appsettings.json`. Com a API em execução, a interface pode ser acessada em [http://localhost:5050](http://localhost:5050).

## Endpoints

| Método | Rota | Sucesso | Erros esperados |
| --- | --- | --- | --- |
| GET | `/api/status` | `200 OK` com mensagem de status | — |
| GET | `/api/quartos` | `200 OK` com a lista ordenada pelo ID | — |
| POST | `/api/quartos` | `201 Created` com o quarto, o ID gerado e o cabeçalho `Location` | `400` se o título estiver vazio |
| GET | `/api/quartos/{id}` | `200 OK` com o quarto | `404` se o ID não existir |
| PUT | `/api/quartos/{id}` | `200 OK` com o quarto atualizado | `400` se o título estiver vazio ou `404` se o ID não existir |
| DELETE | `/api/quartos/{id}` | `204 No Content` com corpo vazio | `404` se o ID não existir |

**POST `/api/quartos`**

```json
{
  "titulo": "Quarto 301 - Suíte Luxo",
  "disponivel": true
}
```

O campo `disponivel` assume `true` se for omitido. O POST retorna o quarto com seu ID. Por exemplo, com `Location: /api/quartos/42`:

```json
{
  "id": 42,
  "titulo": "Quarto 301 - Suíte Luxo",
  "disponivel": true
}
```

**PUT `/api/quartos/42`**

```json
{
  "titulo": "Quarto 301 - Suíte Luxo Reformada",
  "disponivel": false
}
```

Use o ID retornado pela API na sua execução. Envie o corpo do POST e do PUT como `application/json`.

## Testar com Bruno

Abra a pasta `bruno/Api Hotel AP2` com **Open Collection** e selecione o ambiente **Local**. Envie as requisições **00 a 08** na ordem. O POST **02** captura o ID usado nas operações seguintes. O GET **07** deve retornar `404` após a exclusão.

Para verificar a persistência, anote o ID devolvido pelo POST **08**. Mantenha o Bruno aberto, pare a API com `Ctrl+C` e execute `dotnet run --urls http://localhost:5050` novamente na mesma pasta. Envie o GET **09**. A resposta deve ser `200 OK` com o mesmo ID, título e disponibilidade registrados antes do reinício. Se precisar recuperar o ID, adicione temporariamente ao ambiente **Local** a variável `quartoPersistenciaId` com o valor anotado.

## Arquivos locais

O `.gitignore` exclui `bin/`, `obj/`, bancos SQLite locais (`*.db` e arquivos auxiliares) e configurações locais como `.env` e `appsettings.Local.json`. Credenciais devem ser mantidas fora do Git.

## Vídeo de demonstração — AS

[Assistir à demonstração da AS no Google Drive](https://drive.google.com/drive/folders/1QPcN1FflsKKh7brbzUyr46yZOaJ-BQ5v?usp=sharing)
