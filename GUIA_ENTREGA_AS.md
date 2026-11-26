# Guia de entrega da AS — API Hotel

Entrega até **25/11/2026, às 23h59 (Brasília)**.

## Checklist do enunciado

- [ ] **Organização do código (2,0 pontos)** — mostrar o mesmo repositório da AP2, a árvore de pastas, a entidade, os dois DTOs, o contexto e seus namespaces. Mostrar os imports, o registro do contexto e as rotas em `Program.cs`.
- [ ] **Funcionamento (1,5 ponto)** — compilar, aplicar a migração SQLite, iniciar a API e executar todas as requisições listadas abaixo, incluindo o `404` após remover e o `200` após reiniciar.
- [ ] **Vídeo demonstrativo (2,0 pontos)** — gravar a demonstração da AS, disponibilizar a visualização sem login, conferir em aba anônima e inserir o link novo no README.
- [ ] **Repositório e entrega** — revisar os arquivos, conferir que os artefatos locais e segredos estão fora do Git e enviar a URL pública do repositório no Canvas.

## Arquivos da AS

| Arquivo ou pasta | O que mostrar |
| --- | --- |
| `Models/Quarto.cs` | A entidade `Quarto` em `ApiHotel.Models` e suas propriedades `Id`, `Titulo` e `Disponivel`. |
| `Dtos/QuartoDTO.cs` | O JSON de entrada do POST no namespace `ApiHotel.Dtos` e o padrão `true` de `disponivel`. |
| `Dtos/QuartoAtualizadoDTO.cs` | O JSON de entrada do PUT no mesmo namespace. |
| `Data/ApiDbContext.cs` | O contexto em `ApiHotel.Data`, o import de `ApiHotel.Models` e o `DbSet<Quarto>`. |
| `Program.cs` | Os imports, `AddDbContext` com `UseSqlite`, os arquivos estáticos e as rotas. |
| `Migrations/*.Designer.cs` e `Migrations/ApiDbContextModelSnapshot.cs` | As referências aos namespaces do contexto e da entidade. A migração inicial representa a tabela usada pela API. |
| `bruno/Api Hotel AP2/` | A Collection **API Hotel — AS**, o ambiente **Local**, os JSONs e os scripts que capturam os IDs dos POSTs. |
| `.gitignore` | As regras para arquivos de compilação, SQLite local e arquivos locais com segredos. |
| `README.md` e `GUIA_ENTREGA_AS.md` | Os passos para rodar e demonstrar a API. O link do novo vídeo vai no README. |

## Preparar e executar no Windows

No PowerShell, entre na pasta do repositório que contém `ApiHotel.csproj`. Confira a branch e a versão do SDK.

```powershell
git status --short --branch
dotnet --version
dotnet tool list --global
```

Se `dotnet-ef` não aparecer na lista, instale com `dotnet tool install --global dotnet-ef --version 10.0.12`. Se aparecer com outra versão, use `dotnet tool update --global dotnet-ef --version 10.0.12`. Abra outro PowerShell se o Windows ainda não encontrar a ferramenta após a instalação.

```powershell
dotnet restore
dotnet build
dotnet ef database update
dotnet run --urls http://localhost:5050
```

Deixe o PowerShell aberto com a aplicação em execução. O endereço base deve ser `http://localhost:5050`. A preparação do banco usa as migrações versionadas e o arquivo local `apihotel.db`.

## Roteiro exato no Bruno

1. Clique em **Open Collection** e selecione a pasta `bruno/Api Hotel AP2`, onde está `opencollection.yml`.
2. Selecione o ambiente **Local** no seletor de ambientes. Ele define `baseUrl` como `http://localhost:5050`.
3. Abra cada requisição na ordem abaixo e clique em **Send**. Mostre o método e a URL, a aba **Body** nos POSTs e no PUT, o código HTTP e o retorno. Nas requisições sem JSON de entrada, mostre o status e o corpo retornado. A aba **Tests** ajuda a conferir as verificações.

| Ordem e nome no Bruno | Método e caminho | O que conferir |
| --- | --- | --- |
| 00 - API no ar | GET `/api/status` | `200` e `Api do Hotel esta no ar!`. |
| 01 - Listar | GET `/api/quartos` | `200` e um array JSON. Em um banco novo, o retorno inicial é `[]`. |
| 02 - Cadastrar | POST `/api/quartos` | `201`, título `Quarto 301 - Suíte Luxo`, `disponivel: true` e um ID real no corpo. O cabeçalho `Location` mostra a URL do quarto criado. |
| 03 - Buscar por ID | GET `/api/quartos/{{quartoId}}` | `200` e o mesmo quarto criado no passo 02. |
| 04 - Atualizar | PUT `/api/quartos/{{quartoId}}` | `200`, mesmo ID, título `Quarto 301 - Suíte Luxo Reformada` e `disponivel: false`. |
| 05 - Conferir atualização | GET `/api/quartos/{{quartoId}}` | `200` com os valores gravados pelo PUT. |
| 06 - Remover | DELETE `/api/quartos/{{quartoId}}` | `204` com corpo vazio. |
| 07 - Confirmar remoção (404) | GET `/api/quartos/{{quartoId}}` | `404` ao buscar o mesmo ID removido. |
| 08 - Cadastrar para persistência | POST `/api/quartos` | `201`, título `Quarto 302 - Teste de persistência`, `disponivel: true` e novo ID. |
| 09 - Buscar após reiniciar | GET `/api/quartos/{{quartoPersistenciaId}}` | Após reiniciar a API, `200` com o ID, o título e a disponibilidade do passo 08. |

`quartoId` é preenchido pelo passo 02 e usado nos passos 03 a 07. `quartoPersistenciaId` é preenchido no passo 08 e usado no passo 09. Os dois vêm do JSON devolvido pela API. Confira os IDs no retorno para poder identificá-los na gravação.

### Demonstrar a persistência

1. Execute o passo **08** e anote o valor de `id` da resposta `201`. Mantenha o Bruno aberto.
2. No PowerShell que está rodando a API, pressione **Ctrl+C** e aguarde o processo encerrar. Preserve o arquivo `apihotel.db` e use a mesma pasta do projeto.
3. Inicie a API novamente com `dotnet run --urls http://localhost:5050`.
4. De volta ao Bruno, envie o passo **09**. Mostre o `200` e compare o ID e os campos do JSON com o que apareceu na criação.
5. Se a variável de execução tiver sumido, edite o ambiente **Local**, adicione temporariamente a variável `quartoPersistenciaId` com o ID anotado e repita o passo **09**. Remova a variável temporária do ambiente após o teste.

## Tópicos da gravação

1. **Tema e repositório** — apresentar a API do Hotel Paradiso, o CRUD de quartos e o repositório usado na AP2.
2. **Organização** — mostrar a árvore e abrir a entidade `Quarto`, os dois DTOs e `ApiDbContext`. Apontar o namespace em cada arquivo e onde é usado.
3. **Inicialização e banco** — abrir `Program.cs` e mostrar imports, registro do EF Core com SQLite, middlewares de arquivos estáticos e rotas. Mostrar a conexão em `appsettings.json`, a pasta `Migrations/`, o build, a aplicação da migração e a API em execução.
4. **CRUD no Bruno** — selecionar o ambiente **Local** e mostrar os passos 00 a 07. Deixar método, URL, JSON quando enviado, status e retorno legíveis.
5. **Reinício e persistência** — mostrar o POST **08**, o ID retornado, a parada e a nova execução no PowerShell e o GET **09** consultando aquele mesmo registro.
6. **README** — indicar onde ficam os comandos para reprodução e a seção do vídeo da AS.

## Disponibilizar o vídeo e entregar

- Envie o vídeo a um serviço que permita abrir por link sem autenticação. Por exemplo, no YouTube use **Não listado** e copie o link de visualização. No Google Drive, use **Acesso geral → Qualquer pessoa com o link → Leitor** e copie o link. [Ajuda do YouTube](https://support.google.com/youtube/answer/157177?hl=pt-BR) · [Ajuda do Google Drive](https://support.google.com/drive/answer/7166529?hl=pt-BR)
- Abra o link em uma aba anônima, sem entrar na sua conta, e confirme que o vídeo reproduz. Substitua `[INSERIR LINK PÚBLICO DO NOVO VÍDEO]` no `README.md` por esse link.
- Revise a versão da AS no Git e confirme em aba anônima que a professora consegue acessar o código e o README com o novo vídeo no mesmo repositório.
- No Canvas, cole somente a URL pública do repositório [https://github.com/CassioHendler/ApiHotel---AP2](https://github.com/CassioHendler/ApiHotel---AP2). O link do vídeo fica no README.

## Pendências de entrega

- [ ] Repetir o roteiro no Bruno Desktop e gravar a demonstração.
- [ ] Disponibilizar e testar o vídeo em aba anônima e inserir o link no README.
- [ ] Publicar as alterações revisadas da AS no mesmo repositório e verificar o acesso público.
- [ ] Colar a URL pública do repositório no Canvas até o prazo.
