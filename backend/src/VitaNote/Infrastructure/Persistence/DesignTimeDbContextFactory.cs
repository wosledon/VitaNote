using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Configuration.Json;

namespace VitaNote.Infrastructure.Persistence;

public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<VitaNoteDbContext>
{
    public VitaNoteDbContext CreateDbContext(string[] args)
    {
        var configuration = new ConfigurationBuilder()
            .SetBasePath(Directory.GetCurrentDirectory())
            .AddJsonFile("appsettings.json", optional: true)
            .AddJsonFile("appsettings.Development.json", optional: true)
            .Build();

        var optionsBuilder = new DbContextOptionsBuilder<VitaNoteDbContext>();
        var connectionString = configuration.GetConnectionString("DefaultConnection") 
            ?? "Data Source=vitanote.db";
        
        optionsBuilder.UseSqlite(connectionString);

        return new VitaNoteDbContext(optionsBuilder.Options);
    }
}
