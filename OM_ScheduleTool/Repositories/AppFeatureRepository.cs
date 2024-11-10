using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.Extensions.Logging;
using Dapper;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using OM_ScheduleTool.Dapper;

namespace OM_ScheduleTool.Models
{

    public class AppFeatureRepository : IAppFeatureRepository
    {
        private AppContext _context;
        private IConfiguration _config;
        private ILogger<AppFeatureRepository> _logger;

        public AppFeatureRepository(AppContext context
            , ILogger<AppFeatureRepository> logger
            , IConfiguration config)
        {
            _context = context;
            _logger = logger;
            _config = config;
        }

        public IEnumerable<AppFeatureGroup> GetAllFeatureGroups()
        {
            return _context.AppFeatureGroups
                .ToList();
        }

        public IEnumerable<AppFeature> GetUserDefaultPermissions(int LoggedOnUserId)
        {
            return _context.AppFeatures
                .Include(afg => afg.AppFeatureGroup)
                .Where(af => af.ParentAppFeatureId == null)
                .OrderBy(afg => afg.AppFeatureGroup.AppFeatureGroupId)
                .ToList();
        }

        public IEnumerable<AppFeature> GetAllDefaultPermissions()
        {
            return _context.AppFeatures
                .Include(afg => afg.AppFeatureGroup)
                .Where(af => af.ParentAppFeatureId == null)
                .OrderBy(afg => afg.AppFeatureGroup.AppFeatureGroupId)
                .ToList();
        }

        public IEnumerable<Action> GetAllActions()
        {
            return _context.Actions
                .ToList();
        }

        public IEnumerable<AppFeature> GetAllAppFeatures ()
        {
            return _context.AppFeatures
                .OrderBy(afg => afg.AppFeatureGroup.AppFeatureGroupId)
                .ToList();
        }

        public UserPermission GetUserAction (int UserId, string MenuDescription)
        {
            UserPermission permission = new UserPermission();
            // ST-946 Code Implementation with Dapper
            string spName = "sp_GetUserPermissions";
            DynamicParameters dbparams = new DynamicParameters();
            dbparams.Add("UserId", UserId, DbType.Int32);
            dbparams.Add("Feature", MenuDescription, DbType.String);
            permission = FactoryServices.dbFactory.SelectCommand_SP(permission, spName, dbparams);
            return permission;
        }

        public IEnumerable<DashboardUserPermission> GetDashboardPermissions(int UserId)
        {
            List<DashboardUserPermission> up = new List<DashboardUserPermission>();
            // ST-946 Code Implementation with Dapper
            string spName = "sp_GetDashboardFeatures";
            DynamicParameters dbparams = new DynamicParameters();
            dbparams.Add("UserId", UserId, DbType.Int32);
            up = FactoryServices.dbFactory.SelectCommand_SP(up, spName, dbparams);
            int SortOrder2 = 0;
            foreach (DashboardUserPermission permission in up.OrderBy(x => x.FeatureId))
            {
                permission.SortOrder = SortOrder2 + 1;
                if (permission.FeatureDescription == "Broadcast Year Management")
                {
                    permission.SortOrder = permission.FeatureId;
                }
            }
            return up.OrderBy(x => x.SortOrder);
        }

        public IEnumerable<AppFeatureGroup> GetDashboardGroups(int UserId)
        {
            List<AppFeatureGroup> up = new List<AppFeatureGroup>();
            
            // ST-946 Code Implementation with Dapper
            string spName = "sp_GetDashboardFeatures";
            DynamicParameters dbparams = new DynamicParameters();
            dbparams.Add("UserId", UserId, DbType.Int32);
            dbparams.Add("GroupsOnly", true, DbType.Boolean);
            up = FactoryServices.dbFactory.SelectCommand_SP(up, spName, dbparams);
            return up;
        }

        public IEnumerable<UserPermission> GetUserPermissions(int UserId)
        {
            List<UserPermission> up = new List<UserPermission>();
            // ST-946 Code Implementation with Dapper
            string spName = "sp_GetUserPermissions";
            DynamicParameters dbparams = new DynamicParameters();
            dbparams.Add("UserId", UserId, DbType.Int32);
            up = FactoryServices.dbFactory.SelectCommand_SP(up, spName, dbparams);
            return up;
        }

        public UserFeaturePermission GetUserFeaturePermissions(int UserId, int? NetworkId)
        {
            // ST-946 Code Implementation with Dapper
            UserFeaturePermission permission = new UserFeaturePermission();
            string spName = "sp_GetUserFeaturePermissions";
            DynamicParameters dbparams = new DynamicParameters();
            dbparams.Add("UserId", UserId, DbType.Int32);
            dbparams.Add("NetworkId", NetworkId, DbType.Int32);
            permission = FactoryServices.dbFactory.SelectCommand_SP(permission, spName, dbparams);
            return permission;
        }

        public IEnumerable<AppFeatureDefaultAction> GetAppFeatureDefaultActions (int PermissionLevelId)
        {
            return _context.AppFeatureDefaultActions
                .Include(af => af.AppFeature)
                .Include(action => action.Action)
                .Include(pl => pl.PermissionLevel)
                .Include(u => u.PermissionLevel)
                .Where(afda => afda.PermissionLevel.PermissionLevelId == PermissionLevelId)
                .ToList();
        }

        public bool SaveAppFeatureDefaultAction(int AppFeatureDefaultActionId, int ActionId)
        {
            AppFeatureDefaultAction afda = new AppFeatureDefaultAction();
            afda = _context
                .AppFeatureDefaultActions
                .Include (a => a.Action)
                .Where(a => a.AppFeatureDefaultActionId == AppFeatureDefaultActionId).FirstOrDefault<AppFeatureDefaultAction>();
            if (afda != null)
            {
                if (afda.Action.ActionId != ActionId)
                {
                    afda.Action = _context.Actions.Where(a => a.ActionId == ActionId).FirstOrDefault<Action>();
                    afda.UpdateDt = DateTime.Now;
                    _context.Entry(afda).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    _context.SaveChanges();
                }
                else
                {
                    return false;
                }
            }
            else
            {
                return false;
            }

            return true;
        }

        public bool SaveAppFeatureUserCustomAction(int AppFeatureId, int  UserId, int ActionId)
        {
            // 1) Get the permission level of the user we are about to update.
            User user = _context.Users
                .Where(u => u.UserId == UserId)
                .FirstOrDefault<User>();

            // 2) Get the default action for the feature/permission level
            AppFeatureDefaultAction afda = new AppFeatureDefaultAction();
            afda = _context.AppFeatureDefaultActions
                .Include (act => act.Action)
                .Include (pl => pl.PermissionLevel)
                .Where(a => a.AppFeature.AppFeatureId == AppFeatureId && a.PermissionLevel.PermissionLevelId == user.PermissionLevelId)
                .FirstOrDefault<AppFeatureDefaultAction>();

            // 3) Check the Current Default Action.  If it's the same, we should clean this out from the database custom actions (AppFeatureUserCustomAction).  I usually don't like
            // deleting from the database but it will be beneficial to have a clean table for this one.
            int CurrentDefaultAction = 1;
            if (afda != null)
            {
                CurrentDefaultAction = afda.Action.ActionId;
            }
            else
            {
                // Should never happen
                return false;
            }

            AppFeatureUserCustomAction afuca = new AppFeatureUserCustomAction();
            afuca = _context.AppFeatureUserCustomActions
                .Include (a => a.Action)
                .Where(a => (a.AppFeature.AppFeatureId == AppFeatureId && a.User.UserId == UserId))
                .FirstOrDefault<AppFeatureUserCustomAction>();
            if (CurrentDefaultAction != ActionId)
            {
                // Just Update
                if (afuca != null)
                {
                    // Only update if it changed
                    if (afuca.Action.ActionId != ActionId)
                    {
                        afuca.Action = _context.Actions.Where(a => a.ActionId == ActionId).FirstOrDefault<Action>();
                        afuca.UpdateDt = DateTime.Now;
                        _context.Entry(afuca).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                        _context.SaveChanges();
                    }
                    else
                    {
                        return false;
                    }
                }
                else
                {
                    afuca = new AppFeatureUserCustomAction();
                    afuca.AppFeature = _context.AppFeatures.Where(a => a.AppFeatureId == AppFeatureId).FirstOrDefault<AppFeature>();
                    afuca.User = _context.Users.Where(u => u.UserId == UserId).FirstOrDefault<User>();
                    afuca.Action = _context.Actions.Where(a => a.ActionId == ActionId).FirstOrDefault<Action>();
                    afuca.CreateDt = DateTime.Now;
                    afuca.UpdateDt = DateTime.Now;

                    _context.AppFeatureUserCustomActions.Add(afuca);
                    _context.SaveChanges();
                }

            }
            else
            {
                if (afuca != null)
                {
                    _context.AppFeatureUserCustomActions.Remove(afuca);
                    _context.SaveChanges();
                }
                else
                {
                    return false;
                }
            }

            return true;
        }

        public bool SaveUserPermissionLevel(User SelectedUser, User LoggedOnUser, int PermissionLevelId)
        {
            try
            {
                _context.Database.BeginTransaction();
                // 1) Get the permission level of the user we are about to update.
                User user = _context.Users
                    .Include(pl => pl.PermissionLevel)
                    .Where(u => u.UserId == SelectedUser.UserId)
                    .FirstOrDefault<User>();

                // 2) If the permission level changed, then update
                if (user.PermissionLevel.PermissionLevelId == PermissionLevelId)
                {
                    return false;
                }
                else
                {                    
                    user.PermissionLevel = _context.PermissionLevels.Where(pl => pl.PermissionLevelId == PermissionLevelId).FirstOrDefault<PermissionLevel>();
                    user.UpdateDt = DateTime.Now;                    
                }


                // 3) Delete all custom actions
                IEnumerable<AppFeatureUserCustomAction> AppFeatureUserCustomActionList = _context.AppFeatureUserCustomActions
                    .Include(a => a.User)
                    .Where(a => a.User.UserId == SelectedUser.UserId)
                    .ToList();

                _context.AppFeatureUserCustomActions.RemoveRange(AppFeatureUserCustomActionList);

                _context.SaveChanges();
                _context.Database.CommitTransaction();
            }
            catch (Exception exc)
            {
                _context.Database.RollbackTransaction();
                _logger.LogError(LoggedOnUser.UserId, exc, exc.Message);
                return false;
            }

            return true;
        }

        public bool SaveJobTitleType (User SelectedUser, User LoggedOnUser, int JobTitleTypeId)
        {
            try
            {
                // 1) Get the job title type of the user we are about to update.
                User user = _context.Users
                    .Include(jtt => jtt.JobTitleType)
                    .Where(u => u.UserId == SelectedUser.UserId)                    
                    .FirstOrDefault<User>();

                // 2) If the job title type changed, then update
                if (user.JobTitleType.JobTitleTypeId == JobTitleTypeId)
                {
                    return false;
                }
                else
                {                    
                    user.JobTitleType = _context.JobTitleTypes.Where(jtt => jtt.JobTitleTypeId == JobTitleTypeId).FirstOrDefault<JobTitleType>();
                    user.UpdateDt = DateTime.Now;                    
                }

                _context.SaveChanges();
                _logger.LogInformation(LoggedOnUser.UserId, SelectedUser.DisplayName + "'s Job Title updated to " + user.JobTitleType.Description);
                
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUser.UserId, exc, exc.Message);
                return false;
            }

            return true;
        }

        //public bool SaveJobTitleType (User SelectedUser, User LoggedOnUser, int JobTitleTypeId)
        //{
        //    try
        //    {
        //        // 1) Get the JobTitleType of the user we are about to update.
        //        User user = _context.Users
        //            .Include(jtt => jtt.JobTitleType)
        //            .Where(u => u.JobTitleType.JobTitleTypeId == SelectedUser.JobTitleType.JobTitleTypeId)
        //            .FirstOrDefault<User>();

        //        // 2) If the JobTitleType changed, then update
        //        if (user.JobTitleType.JobTitleTypeId == JobTitleTypeId)
        //        {
        //            return false;
        //        }
        //        else
        //        {
        //            user.JobTitleType = _context.JobTitleTypes.Where(jtt => jtt.JobTitleTypeId == JobTitleTypeId).FirstOrDefault<JobTitleType>();
        //            user.UpdateDt = DateTime.Now;
        //            _context.Entry(user).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
        //        }

        //        _context.SaveChanges();
        //    }
        //    catch (Exception exc)
        //    {
        //        _logger.LogError(LoggedOnUser.UserId, exc, exc.Message);
        //        return false;
        //    }

        //    return true;
        //}
    }
}
