using MeetFloow.Samples;
using Xunit;

namespace MeetFloow.EntityFrameworkCore.Applications;

[Collection(MeetFloowTestConsts.CollectionDefinitionName)]
public class EfCoreSampleAppServiceTests : SampleAppServiceTests<MeetFloowEntityFrameworkCoreTestModule>
{

}
