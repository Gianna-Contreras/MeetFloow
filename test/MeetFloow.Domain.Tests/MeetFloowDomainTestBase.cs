using Volo.Abp.Modularity;

namespace MeetFloow;

/* Inherit from this class for your domain layer tests. */
public abstract class MeetFloowDomainTestBase<TStartupModule> : MeetFloowTestBase<TStartupModule>
    where TStartupModule : IAbpModule
{

}
