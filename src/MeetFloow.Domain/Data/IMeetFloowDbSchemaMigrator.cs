using System.Threading.Tasks;

namespace MeetFloow.Data;

public interface IMeetFloowDbSchemaMigrator
{
    Task MigrateAsync();
}
