using OM_ScheduleTool.Models;
using System.Collections.Generic;

namespace OM_ScheduleTool.ViewModels
{
    public class PostLogViewModel : LogsViewModel
    {
        public int PostlogId { get; set; }
        public User LoggedOnUser { get; set; }
        public bool ViewOnly { get; set; }
        public string ClientName { get; set; }
        public string ScheduleName { get; set; }        
        public bool CanEditPreLog { get; set; }
        public POSTLOG_T PostLog { get; set; }
        public IEnumerable<PreLogLine> PostLogLines { get; set; }
        public IList<NetworkDeltaSummary> PostLogNetworkSummaryList { get; set; }
        public IEnumerable<KeyValuePair<int, string>> NetworksAvailable { get; set; }
        public string[] PropertiesAvailable { get; set; }
        public string[] StartTimesAvailable { get; set; }
        public string[] EndTimesAvailable { get; set; }
        public string[] DPsAvailable { get; set; }
        public string[] OMDPsAvailable { get; set; }
        public int?[] SpotLensAvailable { get; set; }
        public string[] BuyTypesAvailable { get; set; }
        public string[] SpBuysAvailable { get; set; }
        public decimal?[] FullRatesAvailable { get; set; }
        public decimal?[] RatesAvailable { get; set; }
        public decimal?[] ImpressionsAvailable { get; set; }
        public decimal?[] CPMAvailable { get; set; }
        public System.DateTime?[] SpotDatesAvailable { get; set; }
        public string[] SpotTimesAvailable { get; set; }
        public string[] MediaTypeAvailable { get; set; }
        public string[] ISCIAvailable { get; set; }
        public string[] ProgramAvailable { get; set; }
        public string[] ClearedAvailable { get; set; }
        public string[] SpotOMDPsAvailable { get; set; }
        public decimal[] CommRateAvailable { get; set; }

    }
    
}
