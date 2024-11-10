using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class UpfrontRemnantLine
    {
        public UpfrontRemnantLine()
        {
            Id = 0;
            UpfrontLineId = 0;
            DoNotBuyTypeId = 1;
            DoNotBuyTypeDescription = "";
            ApprovedDesc = "";
            Approved = false;
            Monday = false;
            Tuesday = false;
            Wednesday = false;
            Thursday = false;
            Friday = false;
            Saturday = false;
            Sunday = false;
            StartTime = DateTime.Parse("12/6/1971");
            EndTime = DateTime.Parse("12/6/1971");
            DayPartCd = "";
            Combo = false;
            BuyTypeId = 1;
            BuyTypeDescription = "";
            BuyTypeCode = "";
            SplitNo = 0;
            SpotLen = 30;
            RateAmt = 0;
            Impressions = 0;
            CPM = 0;
            MandateClientName = "";
            ApproveLock = false;
            QuarterName = "";

        }

        public int Id { get; set; }
        public int UpfrontLineId { get; set; }
        public int DoNotBuyTypeId { get; set; }
        public string DoNotBuyTypeDescription { get; set; }
        public bool DoNotBuyTypeClientRequired { get; set; }
        public string ApprovedDesc;
        public bool Approved { get; set; }
        public Property Property { get; set; }
        public string PropertyName { get; set; }
        public bool Monday { get; set; }
        public bool Tuesday { get; set; }
        public bool Wednesday { get; set; }
        public bool Thursday { get; set; }
        public bool Friday { get; set; }
        public bool Saturday { get; set; }
        public bool Sunday { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public string DayPartCd { get; set; }
        public string OMDP { get; set; }
        public bool Combo { get; set; }
        public int BuyTypeId { get; set; }
        public string BuyTypeDescription { get; set; }
        public string BuyTypeCode { get; set; }
        public int SpotLen { get; set; }
        public int SplitNo { get; set; }
        public decimal RateAmt { get; set; }
        public decimal Impressions { get; set; }
        public decimal CPM { get; set; }
        public int MandateClientId { get; set; }
        public string MandateClientName { get; set; }
        public string Revision { get; set; }
        public DateTime RateRevisedDate { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DemoNames Demo { get; set; }
        public string DemoName { get; set; }
        public bool ApproveLock { get; set; }
        public bool AllUnapproved { get; set; }
        public string QuarterName { get; set; }
        public string Universe { get; set; }
        public int FullCount { get; set; }
        public int? DemographicSettingsId { get; set; }
        public int? PropertyId { get; set; }

        public List<DemoNames> AllDemoNames { get; set; }
    }

    // This will be used for temporarily loading upfront lines for editing.  
    public class UpfrontRemnantLineFlat
    {
        public UpfrontRemnantLineFlat()
        {
            Id = 0;
            UpfrontLineId = 0;
            DoNotBuyTypeId = 1;
            DoNotBuyTypeDescription = "";
            ApprovedDesc = "Approved";
            Approved = false;
            Monday = false;
            Tuesday = false;
            Wednesday = false;
            Thursday = false;
            Friday = false;
            Saturday = false;
            Sunday = false;
            StartTime = DateTime.Parse("12/6/1971");
            EndTime = DateTime.Parse("12/6/1971");
            DayPartCd = "";
            Combo = false;
            BuyTypeId = 1;
            BuyTypeDescription = "";
            BuyTypeCode = "";
            SplitNo = 0;
            SpotLen = 30;
            RateAmt = 0;
            Impressions = 0;
            CPM = 0;
            MandateClientName = "";
            ApproveLock = false;
            QuarterName = "";
            RateId = 0;
            FullCount = 0;
            UpfrontLineUpdateDt = DateTime.Parse("12/6/1971");
            RateUpdateDt = DateTime.Parse("12/6/1971");
        }

        [Required, Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int UpfrontLineId { get; set; }
        public int Id { get; set; }
        public int UserId { get; set; }
        public int DoNotBuyTypeId { get; set; }
        public string DoNotBuyTypeDescription { get; set; }
        public bool DoNotBuyTypeClientRequired { get; set; }
        public DateTime? DoNotBuyTypeUpdateDt { get; set; }
        public string ApprovedDesc;
        public bool Approved { get; set; }
        public int PropertyId { get; set; }
        public string PropertyName { get; set; }
        public DateTime? PropertyNameUpdateDt { get; set;  }
        public bool Monday { get; set; }
        public bool Tuesday { get; set; }
        public bool Wednesday { get; set; }
        public bool Thursday { get; set; }
        public bool Friday { get; set; }
        public bool Saturday { get; set; }
        public bool Sunday { get; set; }
        public DateTime? DaysUpdateDt { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? StartTimeUpdateDt { get; set; }
        public DateTime EndTime { get; set; }
        public DateTime? EndTimeUpdateDt { get; set; }
        public string DayPartCd { get; set; }
        public DateTime? DayPartUpdateDt { get; set; }
        public string OMDP { get; set; }
        public DateTime? OMDPUpdateDt { get; set; }
        public bool Combo { get; set; }
        public int BuyTypeId { get; set; }
        public DateTime? BuyTypeIdUpdateDt { get; set; }
        public string BuyTypeDescription { get; set; }
        public string BuyTypeCode { get; set; }
        public bool BuyTypeIsZeroRate { get; set; }
        public bool BuyTypeIsZeroImp { get; set; }
        public int SpotLen { get; set; }
        public int SplitNo { get; set; }
        public decimal RateAmt { get; set; }
        public decimal Impressions { get; set; }
        public DateTime? ImpressionsUpdateDt { get; set; }
        public decimal CPM { get; set; }
        public int? MandateClientId { get; set; }
        public string MandateClientName { get; set; }
        public DateTime? MandateClientUpdateDt { get; set; }
        public string Revision { get; set; }
        public DateTime RateRevisedDate { get; set; }
        public DateTime EffectiveDate { get; set; }
        public DateTime? EffectiveDateUpdateDt { get; set; }
        public DateTime ExpirationDate { get; set; }
        public DateTime? ExpirationDateUpdateDt { get; set; }
        public int DemographicSettingsId {get; set;}
        public string DemoName { get; set; }
        public bool ApproveLock { get; set; }
        public bool AllUnapproved { get; set; }
        public string QuarterName { get; set; }
        public string Universe { get; set; }
        public int FullCount { get; set; }
        public int SortOrder { get; set; }
        public int SplitId { get; set; }
        public int RateId { get; set; }
        public DateTime UpfrontLineUpdateDt { get; set; }
        public DateTime? RateUpdateDt { get; set; }
        public int UpfrontId { get; set; }
        public int LockedByUserId { get; set; }
        public string SPBuy { get; set; }
        public DateTime? SPBuyUpdateDt { get; set; }
    }
}
