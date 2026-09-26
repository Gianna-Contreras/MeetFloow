using Volo.Abp.Modularity;

namespace MeetFloow;

[DependsOn(
    typeof(MeetFloowApplicationModule),
    typeof(MeetFloowDomainTestModule)
)]
public class MeetFloowApplicationTestModule : AbpModule
{

}
