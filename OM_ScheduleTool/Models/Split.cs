using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Split
    {
        [Key]
        public int SplitId { get; set; }

        [Required]
        public int SplitNo { get; set; }

        [StringLength(255)]
        public string SplitDesc { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public int UpdatedByUserId { get; set; }

    }
}
