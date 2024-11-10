namespace OM_ScheduleTool.Models
{
    public class CAActualExchRateAPIResult
    {
        public Dictionary<DateTime, ExchRate> rates { get; set; }
    }
    public class ExchRate
    {
        public decimal USD { get; set; }
    }
}
