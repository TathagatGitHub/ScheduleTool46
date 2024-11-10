using System.IO;

namespace OM_ScheduleTool.Models
{
    public class PartialLockedModel
    {
        public Int32 ScheduleId { get; set; }
        public string ScheduleName { get; set; }
        public string ImageUrl { get; set; }
        public DateTime? LastActiveDt { get; set; }
        public string DisplayName { get; set; }
        public DateTime? LockedDt { get; set; }
    }
}