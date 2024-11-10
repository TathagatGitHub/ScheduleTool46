using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class ApprovalLevel
    {
        public ApprovalLevel()
        {
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int ApprovalLevelId { get; set; }

        [Required]
        [StringLength(255)]
        public string ApprovalName { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public User UpdatedBy { get; set; }
    }
}
