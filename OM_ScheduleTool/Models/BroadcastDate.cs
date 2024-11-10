using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class BroadcastDate
    {
        public BroadcastDate()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int BroadcastDateId { get; set; }

        [Required]
        public int Year { get; set; }

        [Required]
        public int Month { get; set; }

        [Required]
        public DateTime DateFrom { get; set; }

        [Required]
        public DateTime DateTo { get; set; }

        [Required]
        public DateTime? CreateDt { get; set; }

        [Required]
        public DateTime? UpdateDt { get; set; }

    }
}
