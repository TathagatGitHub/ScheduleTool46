using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class PropertyAddNew : Property
    {
        public PropertyAddNew()
        {
            Time = "";
            DP = "";
            Days = "";
            SpotLen = 30;
            RateAmt = 0;
            Imp = 0;
            CPM = 0;
            Status = "";
            EffExp = "";
            Revision = "";
            StartTimeFormatted = "";
            EndTimeFormatted = "";
            BuyTypeDescription = "";
            BuyTypeCode = "";//ST-1102
            SPBuy = "";//ST-1102
            RateId = 0;
            ReviseDt = null;
        }

        public string Time { get; set; }
        public string DP { get; set; }
        public int DayPartId { get; set; }
        public string Days { get; set; }
        public int SpotLen { get; set; }
        public double RateAmt { get; set; }
        public double Imp { get; set; }
        public double CPM { get; set; }
        public string Status { get; set; }
        public string EffExp { get; set; }
        public string Revision { get; set; }
        public string StartTimeFormatted { get; set; }
        public string EndTimeFormatted { get; set; }
        public string BuyTypeDescription { get; set; }
        public string BuyTypeCode { get; set; } //ST-1102
        public string SPBuy { get; set; }//ST-1102
        public int RateId { get; set; }
        public int QuarterId { get; set; }
        public int SplitId { get; set; }
        public DateTime? ReviseDt { get; set; }
    }
}

