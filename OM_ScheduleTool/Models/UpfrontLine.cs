using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class UpfrontLine
    {
        public UpfrontLine()
        {
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int UpfrontLineId { get; set; }

        [Required]
        public int UpfrontId { get; set; }
        public virtual Upfront Upfront { get; set; }

        [Required]
        public int RateId { get; set; }
        public virtual Rate Rate { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public int UpdatedByUserId { get; set; }
 

    }
}
