using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface IAppFeatureRepository
    {
        IEnumerable<AppFeatureDefaultAction> GetAppFeatureDefaultActions (int PermissionLevelId);

        IEnumerable<AppFeature> GetAllDefaultPermissions();

        IEnumerable<AppFeatureGroup> GetDashboardGroups(int UserId);
        IEnumerable<DashboardUserPermission> GetDashboardPermissions(int UserId);

        IEnumerable<UserPermission> GetUserPermissions(int UserId);
        UserPermission GetUserAction(int UserId, string MenuDescription);
        UserFeaturePermission GetUserFeaturePermissions(int UserId, int? NetworkId);

        IEnumerable<AppFeatureGroup> GetAllFeatureGroups();

        IEnumerable<Action> GetAllActions();

        IEnumerable<AppFeature> GetAllAppFeatures();

        bool SaveAppFeatureDefaultAction(int AppFeatureDefaultActionId, int ActionId);

        bool SaveAppFeatureUserCustomAction(int AppFeatureId, int UserId, int ActionId);

        bool SaveJobTitleType(User SelectedUser, User LoggedOnUser, int JobTitleTypeId);
        bool SaveUserPermissionLevel(User SelectedUser, User LoggedOnUser, int PermissionLevelId);

    }
}
