using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class SpotLen
    {
        [Key]
        public int SpotLenId { get; set; }

        [Required]
        [StringLength(4)]
        public string SpotLenDesc { get; set; }

        public int? SortOrder { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public int UpdatedByUserId { get; set; }
    }
}
