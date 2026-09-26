using MeetFloow.Localization;
using Volo.Abp.AspNetCore.Mvc;

namespace MeetFloow.Controllers;

/* Inherit your controllers from this class.
 */
public abstract class MeetFloowController : AbpControllerBase
{
    protected MeetFloowController()
    {
        LocalizationResource = typeof(MeetFloowResource);
    }
}
