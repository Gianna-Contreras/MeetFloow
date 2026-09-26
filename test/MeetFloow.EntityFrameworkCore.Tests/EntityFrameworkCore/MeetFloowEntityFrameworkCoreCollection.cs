using Xunit;

namespace MeetFloow.EntityFrameworkCore;

[CollectionDefinition(MeetFloowTestConsts.CollectionDefinitionName)]
public class MeetFloowEntityFrameworkCoreCollection : ICollectionFixture<MeetFloowEntityFrameworkCoreFixture>
{

}
