using System.ComponentModel.DataAnnotations.Schema;


namespace OM_ScheduleTool.Models
{
    [NotMapped]
    public class PreLogWeeklySummary
    {
        public string StdNetName { get; set; }
        public string ProgramTitle { get; set; }
        public decimal? FullRateTotal { get; set; }
        public int Clearance { get; set; }
    }
}
