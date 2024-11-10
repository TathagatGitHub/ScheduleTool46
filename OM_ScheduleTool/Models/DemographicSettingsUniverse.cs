using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DemographicSettingsUniverse
    {
        public int DemographicSettingsId { get; set; }
        public string DemographicName { get; set; }
        public int SortOrder { get; set; }
        public int Universe { get; set; }
        public int PlanYr { get; set; }
        public bool IsZeroRate { get; set; }
        public bool IsZeroImp { get; set; }
        public bool DRType { get; set; }
        public string CountryShort { get; set; }
    }
}
