using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class UserViewModel
    {
        public UserViewModel()
        {
        }

        public UserViewModel(UserViewModel CopyUVW)
        {
            this.LoggedOnUserId = CopyUVW.LoggedOnUserId;
            this.SelectedUserId = CopyUVW.SelectedUserId;
            this.PermissionLevelId = CopyUVW.PermissionLevelId;
            this.JobTitleTypeId = CopyUVW.JobTitleTypeId;
            this.CanEditUserSettings = CopyUVW.CanEditUserSettings;
            this.Finance = CopyUVW.Finance;            
        }

        public int LoggedOnUserId { get; set; }
        public User LoggedOnUser;

        public int SelectedUserId { get; set; }
        public User SelectedUser;

        public int PermissionLevelId { get; set; }
        public PermissionLevel PermissionLevel;
        public IEnumerable<PermissionLevel> PermissionLevels;

        public int JobTitleTypeId { get; set; }
        public JobTitleType JobTitleType;
        public IEnumerable<JobTitleType> JobTitleTypes;

        public bool Finance { get; set; }

        public IEnumerable<AppFeatureDefaultAction> AppFeatureDefaultActions { get; set; }

        public IEnumerable<UserPermission> UserPermissions { get; set; }
        public bool CanEditUserSettings { get; set; }

        public IEnumerable<OM_ScheduleTool.Models.Action> Actions;

        public IEnumerable<Client> Clients;

        public IEnumerable<ClientUserJob> ClientUserJobs;
        public IEnumerable<ClientUserJob> ClientUserJobs_Buyer;
        public IEnumerable<ClientUserJob> ClientUserJobs_Assistant;
        public IEnumerable<ClientUserJob> ClientUserJobs_Backup;
        public IEnumerable<ClientUserJob> ClientUserJobs_None;

        public IEnumerable<Client> ClientUserJobs_NoBuyer;
        public IEnumerable<Client> ClientUserJobs_NoAssistant;
        public IEnumerable<Client> ClientUserJobs_NoBackup;

        public IEnumerable<NetworkUserJob> Networks;
        public bool CAClientExchRate { get; set; }
        public bool CAActualExchRate { get; set; }
        public bool USBuyer { get; set; }
        public bool CABuyer { get; set; }
        public bool Digital { get; set; }
        public bool Local { get; set; }
        public bool Podcast { get; set; }
    }
}
