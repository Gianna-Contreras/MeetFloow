using MeetFloow.Localization;
using Volo.Abp.Authorization.Permissions;
using Volo.Abp.Localization;
using Volo.Abp.MultiTenancy;

namespace MeetFloow.Permissions;

public class MeetFloowPermissionDefinitionProvider : PermissionDefinitionProvider
{
    public override void Define(IPermissionDefinitionContext context)
    {
        var myGroup = context.AddGroup(MeetFloowPermissions.GroupName);

        //Define your own permissions here. Example:
        //myGroup.AddPermission(MeetFloowPermissions.MyPermission1, L("Permission:MyPermission1"));
    }

    private static LocalizableString L(string name)
    {
        return LocalizableString.Create<MeetFloowResource>(name);
    }
}
