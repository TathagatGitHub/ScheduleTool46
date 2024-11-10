namespace OM_ScheduleTool.Models
{
    public class MediaPlanSummary
    {
        public string GroupName { get; set; }
        public string ValueType { get; set; }
        public string Title { get; set; }
        public string NetworkId { get; set; }
        public string GrandTotal { get; set; }
        public Int32 DisplayOrder { get; set; }
        public string Wk01_Data { get; set; }
        public string Wk02_Data { get; set; }
        public string Wk03_Data { get; set; }
        public string Wk04_Data { get; set; }
        public string Wk05_Data { get; set; }
        public string Wk06_Data { get; set; }
        public string Wk07_Data { get; set; }
        public string Wk08_Data { get; set; }
        public string Wk09_Data { get; set; }
        public string Wk10_Data { get; set; }
        public string Wk11_Data { get; set; }
        public string Wk12_Data { get; set; }
        public string Wk13_Data { get; set; }
        public string Wk14_Data { get; set; }
        public Int32 TotalNetworks { get; set; }
        public MediaPlanSummary()
        {
            GroupName = "";
            ValueType = "";
            Title = "";
            NetworkId = "0";
            DisplayOrder = 0;
            Wk01_Data = "";
            Wk02_Data = "";
            Wk03_Data = "";
            Wk04_Data = "";
            Wk05_Data = "";
            Wk06_Data = "";
            Wk07_Data = "";
            Wk08_Data = "";
            Wk09_Data = "";
            Wk10_Data = "";
            Wk11_Data = "";
            Wk12_Data = "";
            Wk13_Data = "";
            Wk14_Data = "";
        }
    }
}
