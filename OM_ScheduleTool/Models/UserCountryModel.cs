namespace OM_ScheduleTool.Models
{
    public class UserCountryModel
    {
        public bool USBuyerSuccess { get; set; }
        public bool CABuyerSuccess { get; set; }
        public int USClientCnt { get; set; }
        public int USNetworkCnt { get; set; }
        public int CAClientCnt { get; set; }
        public int CANetworkCnt { get; set; }
    }
}