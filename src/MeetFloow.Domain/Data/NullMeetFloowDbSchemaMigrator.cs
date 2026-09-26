using System.Threading.Tasks;
using Volo.Abp.DependencyInjection;

namespace MeetFloow.Data;

/* This is used if database provider does't define
 * IMeetFloowDbSchemaMigrator implementation.
 */
public class NullMeetFloowDbSchemaMigrator : IMeetFloowDbSchemaMigrator, ITransientDependency
{
    public Task MigrateAsync()
    {
        return Task.CompletedTask;
    }
}
