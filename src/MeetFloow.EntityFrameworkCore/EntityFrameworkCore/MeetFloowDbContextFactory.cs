using System;
using System.IO;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;

namespace MeetFloow.EntityFrameworkCore;

/* This class is needed for EF Core console commands
 * (like Add-Migration and Update-Database commands) */
public class MeetFloowDbContextFactory : IDesignTimeDbContextFactory<MeetFloowDbContext>
{
    public MeetFloowDbContext CreateDbContext(string[] args)
    {
        var configuration = BuildConfiguration();
        
        MeetFloowEfCoreEntityExtensionMappings.Configure();

        var builder = new DbContextOptionsBuilder<MeetFloowDbContext>()
            .UseSqlite(configuration.GetConnectionString("Default"));
        
        return new MeetFloowDbContext(builder.Options);
    }

    private static IConfigurationRoot BuildConfiguration()
    {
        var basePath = Directory.GetCurrentDirectory();
        if (!File.Exists(Path.Combine(basePath, "appsettings.json")))
        {
            if (File.Exists(Path.Combine(basePath, "src/MeetFloow.DbMigrator/appsettings.json")))
            {
                basePath = Path.Combine(basePath, "src/MeetFloow.DbMigrator");
            }
            else if (File.Exists(Path.Combine(basePath, "../MeetFloow.DbMigrator/appsettings.json")))
            {
                basePath = Path.Combine(basePath, "../MeetFloow.DbMigrator");
            }
        }

        var builder = new ConfigurationBuilder()
            .SetBasePath(basePath)
            .AddJsonFile("appsettings.json", optional: false)
            .AddEnvironmentVariables();

        return builder.Build();
    }
}
