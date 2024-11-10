using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OM_ScheduleTool.Models
{
    public class POSTLOG_T
    {
        public POSTLOG_T()
        {
            UpdateDt = DateTime.Now;
            CreateDt = DateTime.Now;
        }

        [Key]
        public int PostLogId { get; set; }

        [Required]
        [ForeignKey("Schedule")]
        public int SchedId { get; set; }
        public virtual Schedule Schedule { get; set; }

        [NotMapped]
        public string ScheduleName { get; set; }

        [Required]
        public int WeekNbr { get; set; }

        [Required]
        public DateTime WeekDate { get; set; }

        [NotMapped]
        public bool CanEditPostLog { get; set; }

        public bool? PostLogLocked { get; set; }

        public DateTime? PostLogLockedDt { get; set; }

        [ForeignKey("PostLogLockedUser")]
        public int? PostLogLockedBy { get; set; }
        public virtual User PostLogLockedUser { get; set; }

        public string txtNote { get; set; }

        public string AdmintextNotes { get; set; }
        public DateTime? Actualize_Date { get; set; }

        [ForeignKey("ActualizedBy")]
        public int? Actualize_User { get; set; }
        public virtual User ActualizedBy { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public User UpdatedBy { get; set; }
    }
}
