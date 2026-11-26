# API Hotel — AS de Back-end

API do Hotel Paradiso para cadastrar, consultar, atualizar e remover quartos. A AS organiza o código da AP2 por responsabilidade. O projeto usa ASP.NET Core Minimal API, Entity Framework Core e SQLite.

## Pré-requisitos

- SDK do .NET 10.
- Ferramenta `dotnet-ef` 10.0.12, mesma versão dos pacotes EF Core do projeto.
- Bruno 3.0 ou mais recente com suporte a Collections OpenCollection em YAML.

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
│   ├── 20261027234114_BancoInicial.cs
│   ├── 20261027234114_BancoInicial.Designer.cs
│   └── ApiDbContextModelSnapshot.cs
├── bruno/
│   └── Api Hotel AP2/
│       ├── opencollection.yml
│       ├── environments/
│       │   └── Local.yml
│       └── requisições 00 a 09 (.yml)
├── wwwroot/
│   ├── index.html
│   ├── app.js
│   └── style.css
├── .gitignore
├── GUIA_ENTREGA_AS.md
└── README.md
```

| Arquivo ou pasta | Responsabilidade |
| --- | --- |
| `Models/Quarto.cs` | Define a entidade que o EF Core persiste na tabela `Quartos`, com ID, título e disponibilidade. |
| `Dtos/` | Define os dados de entrada. `QuartoDTO` recebe o JSON do POST e `QuartoAtualizadoDTO` recebe o JSON do PUT. |
| `Data/ApiDbContext.cs` | Recebe a configuração do EF Core e expõe o conjunto `Quartos` como `DbSet<Quarto>`. |
| `Program.cs` | Configura a aplicação, registra o contexto com SQLite, serve os arquivos estáticos e mapeia as rotas da Minimal API. |
| `Migrations/` | Guarda a migração inicial e o snapshot do modelo usados pelo EF Core. |

`Program.cs` importa `ApiHotel.Models`, `ApiHotel.Dtos`, `ApiHotel.Data` e `Microsoft.EntityFrameworkCore`. O contexto usa `ApiHotel.Models` para acessar a entidade. Os metadados das migrações importam `ApiHotel.Data` para referenciar o contexto no namespace atual.

## Executar localmente

Abra um terminal na pasta que contém `ApiHotel.csproj`. Instale o `dotnet-ef` uma vez, caso ainda não o tenha.

```powershell
dotnet tool install --global dotnet-ef --version 10.0.12
```

Se já tiver outra versão, ajuste com `dotnet tool update --global dotnet-ef --version 10.0.12`.

```powershell
dotnet restore
dotnet build
dotnet ef database update
dotnet run --urls http://localhost:5050
```

O comando `dotnet ef database update` aplica as migrações ao banco. Por padrão, a configuração em `appsettings.json` usa o arquivo local `apihotel.db`. Com a API aberta, acesse [http://localhost:5050](http://localhost:5050) para usar a interface da AP2. Ela é servida pela própria aplicação a partir de `wwwroot/` e usa `fetch` para acessar o CRUD.

## Endpoints

| Método | Rota | Sucesso | Erros esperados |
| --- | --- | --- | --- |
| GET | `/api/status` | `200 OK`, mensagem de status em texto | — |
| GET | `/api/quartos` | `200 OK`, lista ordenada pelo ID | — |
| POST | `/api/quartos` | `201 Created`, quarto com ID gerado e cabeçalho `Location` | `400 Bad Request` com título vazio |
| GET | `/api/quartos/{id}` | `200 OK`, quarto com o ID consultado | `404 Not Found` se o ID não existir |
| PUT | `/api/quartos/{id}` | `200 OK`, quarto atualizado | `400 Bad Request` com título vazio, `404 Not Found` com ID inexistente e título válido |
| DELETE | `/api/quartos/{id}` | `204 No Content`, corpo vazio | `404 Not Found` se o ID não existir |

Envie os corpos do POST e do PUT como `application/json`. No POST, `disponivel` vale `true` quando omitido.

**POST `/api/quartos`**

```json
{
  "titulo": "Quarto 301 - Suíte Luxo",
  "disponivel": true
}
```

Exemplo de resposta do POST, com `Location: /api/quartos/42`. Use nas próximas requisições o ID que a API devolver na sua execução.

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

O PUT e o GET de conferência retornam o mesmo `id`, com os valores atualizados de `titulo` e `disponivel`. O corpo abaixo corresponde à resposta `400` para um título em branco no POST ou no PUT.

```json
{
  "erro": "O título do quarto é obrigatório."
}
```

## Collection do Bruno e persistência

Abra a pasta `bruno/Api Hotel AP2` pelo comando **Open Collection** no Bruno. Selecione o ambiente **Local**, que define `baseUrl` como `http://localhost:5050`. Envie as requisições **00 a 08** em ordem. O POST **02** captura o ID real em `quartoId` para a busca, a atualização, a conferência e a remoção. O GET **07** deve devolver `404` para esse mesmo ID.

O POST **08** cria outro quarto e salva seu ID em `quartoPersistenciaId`. Anote o ID e mantenha o Bruno aberto. Pare a API com `Ctrl+C` e suba de novo com `dotnet run --urls http://localhost:5050` na mesma pasta. Com o mesmo `apihotel.db`, o GET **09** deve devolver `200` e o mesmo quarto. Se a variável de execução tiver sido perdida, adicione temporariamente `quartoPersistenciaId` ao ambiente **Local** com o ID anotado.

O passo a passo e o roteiro de gravação estão no [GUIA_ENTREGA_AS.md](GUIA_ENTREGA_AS.md).

## Arquivos locais e segredos

O `.gitignore` exclui `bin/`, `obj/`, arquivos SQLite locais (`*.db` e arquivos auxiliares) e arquivos de configuração local como `.env`, `.env.*` e `appsettings.Local.json`. Guarde senhas, tokens e outras credenciais em variáveis de ambiente ou em um gerenciador local de segredos. A conexão SQLite incluída usa apenas o caminho do arquivo.

## Vídeo de demonstração — AS

[INSERIR LINK PÚBLICO DO NOVO VÍDEO]
