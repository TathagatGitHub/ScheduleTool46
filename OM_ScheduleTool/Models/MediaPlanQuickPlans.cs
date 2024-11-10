namespace OM_ScheduleTool.Models
{
    public class MediaPlanQuickPlan
    {
        public int QuickPlanId { get; set; }
        public int MediaPlanId { get; set; }
        public int NetworkId { get; set; }
        public int BuyTypeGroupId { get; set; }
        public int Year { get; set; }
        public int QuarterId { get; set; }
        public int DemographicId { get; set; }
        public int BuyTypeId { get; set; }
        public decimal AdjustedRates { get; set; }
        public decimal AdjustedImps { get; set; }
        public decimal AvgRates30Sec { get; set; }
        public decimal AvgRates15Sec { get; set; }
        public decimal AvgImpressions { get; set; }        
        public int TotalSpots30Sec { get; set; }
        public int TotalSpots15Sec { get; set; }
        public decimal Total30SecSpend { get; set; }
        public decimal Total15SecSpend { get; set; }
        public decimal TotalSpend { get; set; }
        public decimal Imps { get; set; }
        public decimal TotalImps { get; set; }
        public decimal CPM { get; set; }
        public DateTime CreateDt { get; set; }
        public int CreatedBy { get; set; }
        public DateTime ModifiedDate { get; set; }
        public int ModifiedBy { get; set; }
        public bool Percent15Selected { get; set; }         
        public bool AlreadyExists { get; set; }       
        public int Universe { get; set; }
        public decimal Percent15Sec { get; set; }
        public int PropertyCount { get; set; }
    }
}
