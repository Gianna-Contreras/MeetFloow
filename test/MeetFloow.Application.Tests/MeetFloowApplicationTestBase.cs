using Volo.Abp.Modularity;

namespace MeetFloow;

public abstract class MeetFloowApplicationTestBase<TStartupModule> : MeetFloowTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
