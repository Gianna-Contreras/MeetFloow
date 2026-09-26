using Microsoft.Extensions.Localization;
using MeetFloow.Localization;
using Volo.Abp.DependencyInjection;
using Volo.Abp.Ui.Branding;

namespace MeetFloow;

[Dependency(ReplaceServices = true)]
public class MeetFloowBrandingProvider : DefaultBrandingProvider
{
    private IStringLocalizer<MeetFloowResource> _localizer;

    public MeetFloowBrandingProvider(IStringLocalizer<MeetFloowResource> localizer)
    {
        _localizer = localizer;
    }

    public override string AppName => _localizer["AppName"];
}
