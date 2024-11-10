using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class DashboardViewModel
    {
        public User LoggedOnUser { get; set; }

        public IEnumerable<DashboardUserPermission> FeaturePermissions { get; set; }
        public IEnumerable<AppFeatureGroup> AppFeatureGroups { get; set; }

        /*
        public IEnumerable<AppFeature> AppFeatures { get; set; }


        public IEnumerable<AppFeatureDefaultAction> AppFeatureDefaultActions { get; set; }
        */
    }
}
