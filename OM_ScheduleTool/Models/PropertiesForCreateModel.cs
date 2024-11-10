namespace OM_ScheduleTool.Models
{
    public class PropertiesForCreateModel
    {
        public Int32 RateID { get; set; }

        public Int32 PropertyId { get; set; }

        public Int32 NetworkId { get; set; }
        public string StdNetName { get; set; }
        public string PropertyName { get; set; }
        public bool Monday { get; set; }
        public bool Tuesday { get; set; }
        public bool Wednesday { get; set; }
        public bool Thursday { get; set; }
        public bool Friday { get; set; }
        public bool Saturday { get; set; }
        public bool Sunday { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public Int32 DayPartId { get; set; }
        public string DayPartCd { get; set; }

        public decimal RateAmt { get; set; }

        public Int32 SpotLen { get; set; }
        public Int32 SplitId { get; set; }
        public Int32 SplitNo { get; set; }
        public Int32 BuyTypeId { get; set; }
        public string BuyTypeCode { get; set; }
        public Int32 DoNotBuyTypeId { get; set; }
        public string Status { get; set; }
        public string StartTimeFormatted { get; set; }
        public string EndTimeFormatted { get; set; }
    }
}
