using ApiHotel.Models;
using Microsoft.EntityFrameworkCore;

namespace ApiHotel.Data;

internal class ApiDbContext : DbContext
{
    public ApiDbContext(DbContextOptions<ApiDbContext> options) : base(options)
    {
    }

    public DbSet<Quarto> Quartos => Set<Quarto>();
}
