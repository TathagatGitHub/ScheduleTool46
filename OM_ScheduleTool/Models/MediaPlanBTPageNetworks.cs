namespace OM_ScheduleTool.Models
{
    public class MediaPlanBTPageNetworks
    {
        public int NetworkId { get; set; }
        public string NetworkName { get; set; }
        public decimal TotalSpend { get; set; }
        public int TotalSpots { get; set; }
        public decimal Perc15 { get; set; }
        public decimal TotalIMPS { get; set;}
        public string PlanType { get; set; }// ST-898
    }
}
