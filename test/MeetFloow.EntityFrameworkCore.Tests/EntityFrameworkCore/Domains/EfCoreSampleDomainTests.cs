using MeetFloow.Samples;
using Xunit;

namespace MeetFloow.EntityFrameworkCore.Domains;

[Collection(MeetFloowTestConsts.CollectionDefinitionName)]
public class EfCoreSampleDomainTests : SampleDomainTests<MeetFloowEntityFrameworkCoreTestModule>
{

}
