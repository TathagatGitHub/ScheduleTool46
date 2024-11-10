using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class SCHED_WEEK_LOCK_T
    {
        [Key]
        public int SchedWeekLockId { get; set; }
        [Required]
        public int SchedId { get; set; }
        public bool Wk01_Lock { get; set; }
        public bool Wk02_Lock { get; set; }
        public bool Wk03_Lock { get; set; }
        public bool Wk04_Lock { get; set; }
        public bool Wk05_Lock { get; set; }
        public bool Wk06_Lock { get; set; }
        public bool Wk07_Lock { get; set; }
        public bool Wk08_Lock { get; set; }
        public bool Wk09_Lock { get; set; }
        public bool Wk10_Lock { get; set; }
        public bool Wk11_Lock { get; set; }
        public bool Wk12_Lock { get; set; }
        public bool Wk13_Lock { get; set; }
        public bool Wk14_Lock { get; set; }
        public string UpdUsr { get; set; }
        [ForeignKey("UpdatedBy")]
        public int? UpdUserID { get; set; }
        public virtual User UpdatedBy { get; set; }

    }
}
