using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DoNotBuyType
    {
        public DoNotBuyType () {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int DoNotBuyTypeId { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [Required]
        public bool ClientRequired { get; set; }

        [Required]
        public bool CanBeSelectedFromGrid { get; set; }

        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }

        [ForeignKey("UpdatedByUser")]
        public int? UpdatedByUserId { get; set; }
        public virtual User UpdatedByUser { get; set; }
    }
}
