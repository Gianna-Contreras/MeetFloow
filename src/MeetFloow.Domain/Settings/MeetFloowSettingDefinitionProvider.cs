using Volo.Abp.Settings;

namespace MeetFloow.Settings;

public class MeetFloowSettingDefinitionProvider : SettingDefinitionProvider
{
    public override void Define(ISettingDefinitionContext context)
    {
        //Define your own settings here. Example:
        //context.Add(new SettingDefinition(MeetFloowSettings.MySetting1));
    }
}
