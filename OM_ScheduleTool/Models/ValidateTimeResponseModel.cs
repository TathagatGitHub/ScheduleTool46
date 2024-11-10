namespace OM_ScheduleTool.Models
{
    public class ValidateTimeResponseModel
    {
        public bool Success { get; set; }
        public string originalTime { get; set; }
        public DateTime FormattedTime { get; set; }
    }
}
