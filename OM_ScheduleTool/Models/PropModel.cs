using OfficeOpenXml.FormulaParsing.Excel.Functions.DateTime;

namespace OM_ScheduleTool.Models
{
    public class PropModel
    {
        public PropModel()
        {
            Id = 0;
            Time = "";
            DP = "";
            Days = "";
            SpotLen = 30;
            RateAmt = 0;
            Imp = 0;
            CPM = 0;
            Status = "";
            EffExp = "";
            Revision = "";
            StartTimeFormatted = "";
            EndTimeFormatted = "";
            BuyTypeDescription = "";
            RateId = 0;
            ClientName = "";
            BuyTypeCode = "";
        }
        public string Approved { get; set; }
        public string DemoName { get; set; }
        public string PropertyName { get; set; }
        public string Time { get; set; }
        public string DP { get; set; }
        public string Days { get; set; }
        public string SPBuy { get; set; }
        public int SpotLen { get; set; }
        public double RateAmt { get; set; }
        public double Imp { get; set; }
        public double CPM { get; set; }
        public string Status { get; set; }
        public string ClientName { get; set; }
        public string EffExp { get; set; }
        public string Revision { get; set; }
        public string BuyTypeCode { get; set; }
        public string EffectiveDate { get; set; }
        public string ExpirationDate { get; set; }
        public string StartTimeFormatted { get; set; }
        public string EndTimeFormatted { get; set; }

        public int PropertyId { get; set; }
        public int NetworId { get; set; }
        public string BuyTypeDescription { get; set; }
        public int RateId { get; set; }
        public int SplitId { get; set; }
        public int Id { get; set; }
        public  Int32 CanCreateQTRProperty { get; set; }
        public Int32 ErrorCode { get; set; }
        public string ReturnMessage { get; set; }
    }
}
