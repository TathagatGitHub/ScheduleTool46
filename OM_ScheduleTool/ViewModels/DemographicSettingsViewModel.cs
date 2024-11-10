using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class DemographicSettingsViewModel
    {
        public User LoggedOnUser { get; set; }

        public IEnumerable<int> PlanYears { get; set; }

        public int DemographicSettingsAction { get; set; }

        public List<DemographicSettingsExport> lstDemographicSettingsExport { get; set; }
    }
}
