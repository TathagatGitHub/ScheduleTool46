using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DaysCode
    {
        public DaysCode()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        public int DaysCodeId { get; set; }

        [StringLength(7)]
        [Required]
        public string DayCode { get; set; }

        [StringLength(255)]
        [Required]
        public string DaysDesc { get; set; }

        [StringLength(15)]
        public string DaysDescShort { get; set; }

        [StringLength(8)]
        public string DaysDescCompact { get; set; }

        [Required]
        public bool Monday { get; set; }

        [Required]
        public bool Tuesday { get; set; }

        [Required]
        public bool Wednesday { get; set; }

        [Required]
        public bool Thursday { get; set; }

        [Required]
        public bool Friday { get; set; }

        [Required]
        public bool Saturday { get; set; }

        [Required]
        public bool Sunday { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        public int? UpdatedByUserId { get; set; }
    }
}
