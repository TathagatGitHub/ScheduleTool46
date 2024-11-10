using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class PropertyHistory
    {
        public PropertyHistory()
        {
            CreateDt = DateTime.Now;
        }

        [Key]
        public int PropertyHistoryId { get; set; }

        [Required]
        public int PropertyId { get; set; }
        public virtual Property Property { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        public int UpdatedByUserId { get; set; }
        public virtual User UpdatedBy { get; set; }
    }
}
