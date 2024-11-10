using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    [NotMapped]
    public class PostLogLine
    {
        [Key]
        public int PLineID { get; set; }
        //public Guid PostLogLineId { get; set; }
        public int? PostLogId { get; set; }
        public int? SchedLineId { get; set; }
        public bool? Scheduled { get; set; }
        public bool? Approved { get; set; }
        public string DoNotBuy { get; set; }
        public bool? PoorSeparation { get; set; }
        public bool? Out_Of_Daypart { get; set; }
        public string OMDP { get; set; }
        public string OmdpSpotDateTime { get; set; }
        public int? NetId { get; set; }
        public string StdNetName { get; set; }
        public int? PropId { get; set; }
        public string PropertyName { get; set; }
        public bool? Mon { get; set; }
        public bool? Tue { get; set; }
        public bool? Wed { get; set; }
        public bool? Thu { get; set; }
        public bool? Fri { get; set; }
        public bool? Sat { get; set; }
        public bool? Sun { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string DayPartCd { get; set; }
        public int? SpotLen { get; set; }
        public int? Split { get; set; }
        public string BuyType { get; set; }
        public string SpBuy { get; set; }
        public int? RateId { get; set; }
        public decimal? FullRate { get; set; }
        public decimal? Rate { get; set; }
        public decimal? USDRate { get; set; }
        public decimal? Imp { get; set; }
        public decimal? CPM { get; set; }
        public DateTime? SpotDate { get; set; }
        public string SpotTime { get; set; }
        public string MediaTypeCode { get; set; }
        public string ISCI { get; set; }
        public string ProgramTitle { get; set; }
        public string Cleared { get; set; }
        public decimal? CommRate { get; set; }
        public string SigmaProgramName { get; set; }
    }
}
