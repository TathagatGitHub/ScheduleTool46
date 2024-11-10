using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class FeedType
    {
        [Key]
        [Column(Order = 1)]
        public int FeedTypeId { get; set; }

        [StringLength(255)]
        [Column(Order = 2)]
        public string Description { get; set; }

        [Column(Order = 3)]
        public DateTime CreateDt { get; set; }

        [Column(Order = 4)]
        public DateTime UpdateDt { get; set; }

        [Column(Order = 5)]
        public virtual User UpdateBy { get; set; }

    }
}
