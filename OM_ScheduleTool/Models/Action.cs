using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace OM_ScheduleTool.Models
{
    public class Action
    {
        public int ActionId { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }

        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }
    }
}
