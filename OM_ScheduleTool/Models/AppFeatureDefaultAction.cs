using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class AppFeatureDefaultAction
    {
        public int AppFeatureDefaultActionId { get; set; }

        public virtual AppFeature AppFeature { get; set; }

        public virtual PermissionLevel PermissionLevel { get; set; }

        public virtual Action Action { get; set; }

        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }
    }
}
