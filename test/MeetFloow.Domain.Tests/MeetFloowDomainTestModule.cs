using Volo.Abp.Modularity;

namespace MeetFloow;

[DependsOn(
    typeof(MeetFloowDomainModule),
    typeof(MeetFloowTestBaseModule)
)]
public class MeetFloowDomainTestModule : AbpModule
{

}
