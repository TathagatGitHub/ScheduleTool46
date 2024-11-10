namespace OM_ScheduleTool.Models
{
    public class WeeklyExchangeRateModel
    {
        public int WkNbr { get; set; }
        public DateTime WeekDate { get; set; }
        public float WeekRate { get; set; }
        public int CanadaClientExchangeRateId { get; set; }
        public bool?  Actualized { get; set; }
        public int ClientId { get; set; }
        public DateTime ?CreateDt { get; set; }
        public decimal? PlanningRate { get; set; }
        public int? QuarterId { get; set; }
        public DateTime? UpdateDt { get; set; }
        public int? UpdatedByUserId { get; set; }
    }
}
