using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using MeetFloow.Data;
using Volo.Abp.DependencyInjection;

namespace MeetFloow.EntityFrameworkCore;

public class EntityFrameworkCoreMeetFloowDbSchemaMigrator
    : IMeetFloowDbSchemaMigrator, ITransientDependency
{
    private readonly IServiceProvider _serviceProvider;

    public EntityFrameworkCoreMeetFloowDbSchemaMigrator(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public async Task MigrateAsync()
    {
        /* We intentionally resolving the MeetFloowDbContext
         * from IServiceProvider (instead of directly injecting it)
         * to properly get the connection string of the current tenant in the
         * current scope.
         */

        await _serviceProvider
            .GetRequiredService<MeetFloowDbContext>()
            .Database
            .MigrateAsync();
    }
}
