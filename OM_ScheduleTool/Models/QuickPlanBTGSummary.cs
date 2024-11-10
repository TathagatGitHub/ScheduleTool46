namespace OM_ScheduleTool.Models
{
    public class QuickPlanBTGSummary
    {
        public string PropertyName { get; set; }
        public int Length { get; set; }
        public decimal Rate { get; set; }
        public int Spots { get; set; }            
        public string DemoName { get; set; }
        public string BuyType { get; set; }
        public decimal CPM { get; set; }     
        public decimal Imps { get; set; }
        public decimal Percent15Sec { get; set; }
        public decimal Grps { get; set; }        
        public int NetworkId { get; set; }
        public int OrderColumn { get; set; }

    }
}
