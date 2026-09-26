using MeetFloow.Localization;
using Volo.Abp.Application.Services;

namespace MeetFloow;

/* Inherit your application services from this class.
 */
public abstract class MeetFloowAppService : ApplicationService
{
    protected MeetFloowAppService()
    {
        LocalizationResource = typeof(MeetFloowResource);
    }
}
