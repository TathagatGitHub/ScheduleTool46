namespace OM_ScheduleTool.Models
{
    public class ImportingProposals
    {
        public string MatchStyle { get; set; }
        public string MatchType { get; set; }
        public int PropertyId { get; set; }
        public int RateId { get; set; }
        public string PropertyName { get; set; }
        public bool M { get; set; }
        public bool T { get; set; }
        public bool W { get; set; }
        public bool Th { get; set; }
        public bool F { get; set; }
        public bool Sa { get; set; }
        public bool su { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string StartAndEndTime { get; set; }
        public int BuyTypeId { get; set; }
        public string BuyTypeCode { get; set; }
        public int DayPartId { get; set; }
        public string DayPart { get; set; }
        public int SpotLen { get; set; }
        public int DemoId { get; set; }
        public string DemoName { get; set; }
        public string RateAmt { get; set; }
        public string Impressions { get; set; }
        public string CPM { get; set; }
        public string totalEDISpots { get; set; }
        public string TotalSpots { get; set; }

        public string Week01 { get; set; }
        public string Week02 { get; set; }
        public string Week03 { get; set; }
        public string Week04 { get; set; }
        public string Week05 { get; set; }
        public string Week06 { get; set; }
        public string Week07 { get; set; }
        public string Week08 { get; set; }
        public string Week09 { get; set; }
        public string Week10 { get; set; }
        public string Week11 { get; set; }
        public string Week12 { get; set; }
        public string Week13 { get; set; }
        public string Week14 { get; set; }
        public int EDIProposalsID { get; set; }
        //   public bool CanConsider { get; set; }
        public string TotalDollar { get; set; }
        public string CalcDollar { get; set; }
        public string CalcImps { get; set; }
        public string SourceFile { get; set; }
        public bool FromST { get; set; }
        public string FileAction { get; set; }
        public string Mode { get; set; }
        public bool HasPotentialMatch { get; set; }
        public string PotentialMatchBGClass { get; set; }
        public bool IsFullyActualized { get; set; } //ST-720 Added
        public string FullyActuaizedBGClass { get; set; }//ST-720 Added
        public string FullyActuaizedTextClass { get; set; }//ST-720 Added
        public int ActualizedWeekNum { get; set; }//ST-720 Added
    }
}
