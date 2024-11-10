namespace OM_ScheduleTool.Models
{
    public class UpfrontHeaderViewModel
    {
        public UpfrontHeaderViewModel()
        {
            lstApproved = new List<string>();
            lstDemoNames = new List<DemoNames>();
            lstProps = new List<Property>();
            lstStartTimes = new List<DateTime>();
            lstEndTimes = new List<DateTime>();
            lstDayParts = new List<DayPart>();
            lstOMDPs = new List<string>();
            lstBuyTypes = new List<BuyType>();
            lstLens = new List<string>();
            lstRates = new List<double>();
            lstImpressions = new List<double>();
            lstCPM = new List<double>();
            lstDoNotBuyTypes = new List<DoNotBuyType>();
            lstClients = new List<Client>();
            lstEffectiveDates = new List<DateTime>();
            lstRevisedDates = new List<DateTime>();
            lstExpirationDates = new List<DateTime>();
            lstRevNos = new List<string>();
            SPBuys = new List<string>();
            lstWeekDay1 = new List<bool>();
            lstWeekDay2 = new List<bool>();
            lstWeekDay3 = new List<bool>();
            lstWeekDay4 = new List<bool>();
            lstWeekDay5 = new List<bool>();
            lstWeekDay6 = new List<bool>();
            lstWeekDay7 = new List<bool>();
        }
        public List<string> lstApproved { get; set; }
        public List<DemoNames> lstDemoNames { get; set; }
        public List<Models.Property> lstProps { get; set; }
        public List<DateTime> lstStartTimes { get; set; }
        public List<DateTime> lstEndTimes { get; set; }
        public List<DayPart> lstDayParts { get; set; }
        public List<string> lstOMDPs { get; set; }
        public List<BuyType> lstBuyTypes { get; set; }
        public List<string> lstLens { get; set; }
        public List<double> lstRates { get; set; }
        public List<double> lstImpressions { get; set; }
        public List<double> lstCPM { get; set; }
        public List<DoNotBuyType> lstDoNotBuyTypes { get; set; }
        public List<Client> lstClients { get; set; }
        public List<DateTime> lstEffectiveDates { get; set; }

        public List<DateTime> lstRevisedDates { get; set; }
        public List<DateTime> lstExpirationDates { get; set; }
        public List<string> lstRevNos { get; set; }
        public List<string> SPBuys { get; set; }
        public List<bool> lstWeekDay1 { get; set; }
        public List<bool> lstWeekDay2 { get; set; }
        public List<bool> lstWeekDay3 { get; set; }
        public List<bool> lstWeekDay4 { get; set; }
        public List<bool> lstWeekDay5 { get; set; }
        public List<bool> lstWeekDay6 { get; set; }
        public List<bool> lstWeekDay7 { get; set; }
    }
}
