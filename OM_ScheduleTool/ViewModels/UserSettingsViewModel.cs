using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class UserSettingsViewModel
    {
        public User UserSelected;
        public IEnumerable<User> Users;

        public JobTitleType JobTitleTypeSelected;
        public IEnumerable<JobTitleType> JobTitleTypes;

        public PermissionLevel PermissionLevelSelected;
        public IEnumerable<PermissionLevel> PermissionLevels;
    }
}
