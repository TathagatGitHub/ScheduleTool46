using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Quarter
    {
        public Quarter()
        {
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int QuarterId { get; set; }

        [Required]
        [StringLength(6)]
        public string QuarterName { get; set; }

        [Required]
        public int BroadcastYr { get; set; }

        [Required]
        public int CalendarYr { get; set; }

        [Required]
        public int BroadcastQuarterNbr { get; set; }

        [Required]
        public int CalendarQuarterNbr { get; set; }

        [Required]
        public DateTime QtrStartDate { get; set; }

        public DateTime QtrEndDate { get; set; }

        public int QtrStartWkNbr { get; set; }

        public DateTime? Wk01_Date { get; set; }
        public DateTime? Wk02_Date { get; set; }
        public DateTime? Wk03_Date { get; set; }
        public DateTime? Wk04_Date { get; set; }
        public DateTime? Wk05_Date { get; set; }
        public DateTime? Wk06_Date { get; set; }
        public DateTime? Wk07_Date { get; set; }
        public DateTime? Wk08_Date { get; set; }
        public DateTime? Wk09_Date { get; set; }
        public DateTime? Wk10_Date { get; set; }
        public DateTime? Wk11_Date { get; set; }
        public DateTime? Wk12_Date { get; set; }
        public DateTime? Wk13_Date { get; set; }
        public DateTime? Wk14_Date { get; set; }

        public DateTime CreateDt { get; set; }
        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }
    }
}
