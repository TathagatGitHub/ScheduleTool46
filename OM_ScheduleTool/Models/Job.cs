using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Job
    {
        public Job()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        [Required]
        public int JobId { get; set; }

        [Required]
        [StringLength(255)]
        public string JobDesc { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }
    }
}
