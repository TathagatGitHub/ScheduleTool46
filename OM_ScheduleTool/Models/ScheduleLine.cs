using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class ScheduleLine
    {
        public ScheduleLine()
        {
            Wk01_Spots = 0;
            Wk02_Spots = 0;
            Wk03_Spots = 0;
            Wk04_Spots = 0;
            Wk05_Spots = 0;
            Wk06_Spots = 0;
            Wk07_Spots = 0;
            Wk08_Spots = 0;
            Wk09_Spots = 0;
            Wk10_Spots = 0;
            Wk11_Spots = 0;
            Wk12_Spots = 0;
            Wk13_Spots = 0;
            Wk14_Spots = 0;

            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;

        }

        public int ScheduleLineId { get; set; }

        [Required]
        public int ScheduleId { get; set; }
        public virtual Schedule Schedule { get; set; }

        [Required]
        public int BB { get; set; }

        [Required]
        public int RateId { get; set; }
        public virtual Rate Rate { get; set; }

        [Required]
        [DefaultValue(0)]
        public bool DNB_Override { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk01_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk02_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk03_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk04_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk05_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk06_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk07_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk08_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk09_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk10_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk11_Spots { get; set; }


        [Required]
        [DefaultValue(0)]
        public int Wk12_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk13_Spots { get; set; }

        [Required]
        [DefaultValue(0)]
        public int Wk14_Spots { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public int UpdatedByUserId { get; set; }
        public User UpdatedBy { get; set; }
    }

    public class ScheduleProposalLinesFlatTotals
    {
        public ScheduleProposalLinesFlatTotals()
        {
            
        }

        public string Description { get; set; }
        public string Total { get; set; }
        public string Wk01 { get; set; }
        public string Wk02 { get; set; }
        public string Wk03 { get; set; }
        public string Wk04 { get; set; }
        public string Wk05 { get; set; }
        public string Wk06 { get; set; }
        public string Wk07 { get; set; }
        public string Wk08 { get; set; }
        public string Wk09 { get; set; }
        public string Wk10 { get; set; }
        public string Wk11 { get; set; }
        public string Wk12 { get; set; }
        public string Wk13 { get; set; }
        public string Wk14 { get; set; }
        public string Category { get; set; }
    }

    public class ScheduleProposalLinesFlat
    {
        public ScheduleProposalLinesFlat()
        {
            Approved = false;
            ApprovedDesc = "Not Approved";
        }

        [Required, Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ScheduleLineId { get; set; }
        public bool Approved { get; set; }
        public string ApprovedDesc { get; set; }
        public int DoNotBuyTypeId { get; set; }
        public string DoNotBuyTypeDescription { get; set; }
        public int RateId { get; set; }
        public string RateRevision { get; set; }
        [Required]
        [DefaultValue(0)]
        public DateTime RateUpdateDt { get; set; }

        public int DemoUniverse { get; set; }
        public string DemoName { get; set; }
        public string NetworkName { get; set; }
        public string PropertyName { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirationDate { get; set; }

        public bool Monday { get; set; }
        public bool Tuesday { get; set; }
        public bool Wednesday { get; set; }
        public bool Thursday { get; set; }
        public bool Friday { get; set; }
        public bool Saturday { get; set; }
        public bool Sunday { get; set; }
        public string DOW { get; set; }

        public string DayPartCd { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int CountryId { get; set; }
        public string StartToEndTime { get; set; }
        public string OMDP { get; set; }
        public int SpotLen { get; set; }
        public string BuyTypeCode { get; set; }

        public double RateAmt { get; set; }
        public double Impressions { get; set; }

        public int TotalSpots { get; set; }
        public int? Wk01_Spots { get; set; }
        public int? Wk02_Spots { get; set; }
        public int? Wk03_Spots { get; set; }
        public int? Wk04_Spots { get; set; }
        public int? Wk05_Spots { get; set; }
        public int? Wk06_Spots { get; set; }
        public int? Wk07_Spots { get; set; }
        public int? Wk08_Spots { get; set; }
        public int? Wk09_Spots { get; set; }
        public int? Wk10_Spots { get; set; }
        public int? Wk11_Spots { get; set; }
        public int? Wk12_Spots { get; set; }
        public int? Wk13_Spots { get; set; }
        public int? Wk14_Spots { get; set; }
        public DateTime? Wk01_UpdateDt { get; set; }
        public DateTime? Wk02_UpdateDt { get; set; }
        public DateTime? Wk03_UpdateDt { get; set; }
        public DateTime? Wk04_UpdateDt { get; set; }
        public DateTime? Wk05_UpdateDt { get; set; }
        public DateTime? Wk06_UpdateDt { get; set; }
        public DateTime? Wk07_UpdateDt { get; set; }
        public DateTime? Wk08_UpdateDt { get; set; }
        public DateTime? Wk09_UpdateDt { get; set; }
        public DateTime? Wk10_UpdateDt { get; set; }
        public DateTime? Wk11_UpdateDt { get; set; }
        public DateTime? Wk12_UpdateDt { get; set; }
        public DateTime? Wk13_UpdateDt { get; set; }
        public DateTime? Wk14_UpdateDt { get; set; }

        public int FullCount { get; set; }
        public double Discount { get; set; }
        public float CPM { get; set; }
        public double UsdRate { get; set; }
        public int ScheduleId { get; set; }
        public int? LockedByUserId { get; set; }
        [Required]
        [DefaultValue(false)]
        public bool CanDelete { get; set; }
        [DefaultValue(0)]
        public int RecordsFiltered { get; set; }
        [DefaultValue(0)]
        public bool Wk01_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk02_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk03_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk04_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk05_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk06_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk07_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk08_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk09_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk10_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk11_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk12_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk13_Locked { get; set; }
        [DefaultValue(0)]
        public bool Wk14_Locked { get; set; }
        public string SPBuy { get; set; }
        public int? ChildPropertyId { get; set; }//ST-1185
        public bool IsChildProperty { get; set; }//ST-1185
        public bool IsDowChanged { get; set; }//ST-1185
        public bool IsTimeChanged { get; set; }//ST-1185
    }
}
