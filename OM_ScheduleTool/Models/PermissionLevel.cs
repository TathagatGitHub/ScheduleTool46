using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class PermissionLevel
    {
        public PermissionLevel()
        {
                
        }

        public PermissionLevel(PermissionLevel pl)
        {
            this.PermissionLevelId = pl.PermissionLevelId;
            this.Description = pl.Description;
            this.ThemeBackground = pl.ThemeBackground;
            this.CreateDt = pl.CreateDt;
            this.UpdateDt = pl.UpdateDt;
        }

        public int PermissionLevelId { get; set; }

        public string Description { get; set; }

        public string ThemeBackground { get; set; }


        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }



    }
}
