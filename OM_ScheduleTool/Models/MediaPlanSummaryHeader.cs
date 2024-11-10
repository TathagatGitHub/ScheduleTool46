namespace OM_ScheduleTool.Models
{
    public class MediaPlanSummaryHeader
    {
        public Int32 MediaPlanId { get; set; }
        public string MediaPlanName { get; set; }

        public string PlanStatus { get; set; }
        public string BudgetPeriod { get; set; }
        public string BudgetType { get; set; }
        public string ModifiedDate { get; set; }
        public string ModifiedBy { get; set; }
        public Int32 PlanYear { get; set; }
        public Int32 QuarterId { get; set; }
        
        public Int32 ClientId { get; set; }
        public string QuarterName { get; set; }
        public string ClientName { get; set; }
        public Int32 CountryId { get; set; }
        public string CountryShort { get; set; }
        public Int32 NotesCount { get; set; }
        public Int32 AttachmentCount { get; set; }
        public bool RefreshData { get; set; }
        public bool DisableBudgetToggle { get; set; }
        public decimal Per15Sec { get; set; }
    }
}
