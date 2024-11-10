namespace OM_ScheduleTool.Models
{
    public class NetworkResponseModel
    {
        public int NetworkId { get; set; }
        public string StdNetName { get; set; }
        public int CountryId { get; set; }
        public string CountryShort { get; set; }
        public int FeedTypeId { get; set; }
        public string FeedTypeName { get; set; }
        public int MediaTypeId { get; set; }
        public string MediaTypeCode { get; set; }
    }
}
