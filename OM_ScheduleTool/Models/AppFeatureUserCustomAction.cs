using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class AppFeatureUserCustomAction
    {
        [Key]
        public int AppFeatureUserCustomActionId { get; set; }

        public virtual User User { get; set; }

        public virtual AppFeature AppFeature { get; set; }

        public virtual Action Action { get; set; }

        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }
    }
}
