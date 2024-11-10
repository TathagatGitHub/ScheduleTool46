using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OM_ScheduleTool.Models
{    
    public class PRELOG_T
    {
        [Key]
        public int PreLogId { get; set; }

        [Required]
        public int SchedId { get; set; }

        [NotMapped]
        public string ScheduleName { get; set; }

        [Required]
        public int WeekNbr { get; set; }

        [Required]
        public DateTime WeekDate { get; set; }

        [NotMapped]
        public bool CanEditPreLog { get; set; }
        public bool? PreLogLocked { get; set; }
        [ForeignKey("PreLogLockedUser")]
        public int? PreLogLockedBy { get; set; }        
        public DateTime? PreLogLockedDte { get; set; }        
        public DateTime? UpdDte { get; set; }
        public int? UpdUserID { get; set; }

        public virtual User PreLogLockedUser { get; set; }

        [NotMapped]
        public string UpdUsr { get; set; }

        public string txtNote { get; set; }

        public string AdmintextNotes { get; set; }
        
        
    }
}
