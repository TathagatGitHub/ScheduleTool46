using OM_ScheduleTool.Models;
using System.Collections.Generic;

namespace OM_ScheduleTool.ViewModels
{
    public class UpfrontExpansionGroupingViewModel
    {
        public User LoggedOnUser { get; set; }
        public int selectedYear { get; set; }

        public int[] Year { get; set; }
        public int CountryId { get; set; }
        public int selectedNetworkGroup { get; set; }
        public IEnumerable<Network> NetworksInSelectedNetworkGroup { get; set; }

        public IEnumerable<Network> Networks { get; set; }
        public IEnumerable<Country> Countries { get; set; }
        public IEnumerable<KeyValuePair<int, string>> NetworkGroups { get; set; }

    }
}
