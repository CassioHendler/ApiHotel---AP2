using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApiDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Serve a interface de wwwroot/ (index.html) pela mesma origem da API
app.UseDefaultFiles();
app.UseStaticFiles();

app.MapGet("/api/status", () => "Api do Hotel esta no ar!");

app.MapGet("/api/quartos", async (ApiDbContext db) =>
    Results.Ok(await db.Quartos.OrderBy(q => q.Id).ToListAsync()));

app.MapGet("/api/quartos/{id:int}", async (int id, ApiDbContext db) =>
{
    var quarto = await db.Quartos.FindAsync(id);
    return quarto is null ? Results.NotFound() : Results.Ok(quarto);
});

app.MapPost("/api/quartos", async (QuartoDTO dados, ApiDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dados.titulo))
        return Results.BadRequest(new { erro = "O título do quarto é obrigatório." });

    var novoQuarto = new Quarto { Titulo = dados.titulo.Trim(), Disponivel = dados.disponivel };
    db.Quartos.Add(novoQuarto);
    await db.SaveChangesAsync();
    return Results.Created($"/api/quartos/{novoQuarto.Id}", novoQuarto);
});

app.MapPut("/api/quartos/{id:int}", async (int id, QuartoAtualizadoDTO dados, ApiDbContext db) =>
{
    if (string.IsNullOrWhiteSpace(dados.titulo))
        return Results.BadRequest(new { erro = "O título do quarto é obrigatório." });

    var quarto = await db.Quartos.FindAsync(id);
    if (quarto is null) return Results.NotFound();

    quarto.Titulo = dados.titulo.Trim();
    quarto.Disponivel = dados.disponivel;
    await db.SaveChangesAsync();
    return Results.Ok(quarto);
});

app.MapDelete("/api/quartos/{id:int}", async (int id, ApiDbContext db) =>
{
    var quarto = await db.Quartos.FindAsync(id);
    if (quarto is null) return Results.NotFound();

    db.Quartos.Remove(quarto);
    await db.SaveChangesAsync();
    return Results.NoContent();
});

app.Run();

// Model persistido pelo EF Core (tabela Quartos)
class Quarto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool Disponivel { get; set; }
}

class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<Quarto> Quartos => Set<Quarto>();
}

// DTOs de entrada (mesmo contrato da AP1; "disponivel" é opcional no POST)
record QuartoDTO(string titulo, bool disponivel = true);

record QuartoAtualizadoDTO(string titulo, bool disponivel);
