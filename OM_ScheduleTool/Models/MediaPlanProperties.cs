using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanProperties
    {
        public int BuyTypeGroupId { get; set; }
        public int MediaPlanId { get; set; }
        public int NetworkId { get; set; }            
        public int PropertyId { get; set; }        
        public int RateId { get; set; }        
        public string PropertyName { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int DayPartId { get; set; }
        public string DP { get; set; }
        public string DayPartDesc { get; set; }
        public string Days { get; set; }       
        public int SpotLen { get; set; }        
        public string Status { get; set; }
        public decimal RateAmt { get; set; }
        public decimal Impressions { get; set; }
        public decimal CPM { get; set; }
        public int Universe { get; set; }
        public int ClientId { get; set; }
        public int BuyTypeId { get; set; }
        public int DemoId { get; set; }
        public int PlanYear { get; set; }
        public int QuarterId { get; set; }
        public string DOW { get; set; }
        public string BuyTypeCode { get; set; }

        public int TotalSpots { get; set; }
        public int Wk01Spots { get; set; }
        public int Wk02Spots { get; set; }
        public int Wk03Spots { get; set; }
        public int Wk04Spots { get; set; }
        public int Wk05Spots { get; set; }
        public int Wk06Spots { get; set; }
        public int Wk07Spots { get; set; }
        public int Wk08Spots { get; set; }
        public int Wk09Spots { get; set; }
        public int Wk10Spots { get; set; }
        public int Wk11Spots { get; set; }
        public int Wk12Spots { get; set; }
        public int Wk13Spots { get; set; }
        public int Wk14Spots { get; set; }
        public decimal AdjustedRatesPerc { get; set; }
        public decimal AdjustedImpsPerc { get; set; }
        public bool IsPlaceHolder { get; set; }

    }
}
