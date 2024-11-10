using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class AppFeatureGroup
    {
        public int AppFeatureGroupId { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }

        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }
    }
}
