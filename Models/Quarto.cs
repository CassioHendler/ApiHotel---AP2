namespace ApiHotel.Models;

// Model persistido pelo EF Core (tabela Quartos)
internal class Quarto
{
    public int Id { get; set; }
    public string Titulo { get; set; } = string.Empty;
    public bool Disponivel { get; set; }
}
