using System;

namespace OM_ScheduleTool.Models
{
    public class ChildPropertiesModel
    {
        public int ChildPropertyId { get; set; }
        public int NetworkId { get; set; }
        public int QuarterId { get; set; }
        public int DayPartId { get; set; }
        public string PropertyName { get; set; }
        public int ParentPropertyId { get; set; }
        public int ParentRateId { get; set; }
        public TimeSpan StartTime { get; set; }
        public TimeSpan EndTime { get; set; }
        public bool Monday { get; set; }
        public bool Tuesday { get; set; }
        public bool Wednesday { get; set; }
        public bool Thursday { get; set; }
        public bool Friday { get; set; }
        public bool Saturday { get; set; }
        public bool Sunday { get; set; }
        public bool SPBuy { get; set; }
        public DateTime CreateDate { get; set; }
        public int CreatedByUserId { get; set; }
    }
}
