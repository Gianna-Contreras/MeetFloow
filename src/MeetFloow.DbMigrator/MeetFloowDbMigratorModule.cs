using MeetFloow.EntityFrameworkCore;
using Volo.Abp.Autofac;
using Volo.Abp.Modularity;

namespace MeetFloow.DbMigrator;

[DependsOn(
    typeof(AbpAutofacModule),
    typeof(MeetFloowEntityFrameworkCoreModule),
    typeof(MeetFloowApplicationContractsModule)
)]
public class MeetFloowDbMigratorModule : AbpModule
{
}
