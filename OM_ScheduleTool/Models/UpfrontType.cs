using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class UpfrontType
    {
        [Key]
        public int UpfrontTypeId { get; set; }

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [ForeignKey("UpdatedByUser")]
        public int? UpdatedByUserId { get; set; }
        public virtual User UpdatedByUser { get; set; }
    }
}
