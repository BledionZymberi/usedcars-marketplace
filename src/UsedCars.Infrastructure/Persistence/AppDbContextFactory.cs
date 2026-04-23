using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace UsedCars.Infrastructure.Persistence
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

           optionsBuilder.UseNpgsql(
    "Host=localhost;Port=port;Database=UsedCarsDb;Username=user;Password=pass");
            return new AppDbContext(optionsBuilder.Options);
        }
    }
}