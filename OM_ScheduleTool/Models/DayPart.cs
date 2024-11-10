using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DayPart
    {
        public DayPart()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }
        public int DayPartId { get; set; }

        [StringLength(2)]
        [Required]
        public string DayPartCd { get; set; }

        [StringLength(255)]
        [Required]
        public string DayPartDesc { get; set; }

        public int SortOrder { get; set; }

        [StringLength(255)]
        public string LongDesc { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }

    }
}
