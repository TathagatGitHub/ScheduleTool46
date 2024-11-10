using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class AppFeature
    {
        public int AppFeatureId { get; set; }

        [Required]
        [StringLength(100)]
        public string Description { get; set; }

        public int? ParentAppFeatureId { get; set; }
    
        public virtual AppFeatureGroup AppFeatureGroup { get; set; }

        [StringLength(255)]
        public string Link { get; set; }

        public string Icon { get; set; }

        [Required]
        [DefaultValue(1)]
        public bool AllowSetPermission { get; set; }

        [Required]
        [DefaultValue(0)]
        public bool OnlyShowIfFinanceRole { get; set; }

        [Required]
        [DefaultValue(0)]
        public bool OnlyShowIfExchangeRateAdminRole { get; set; }

        public DateTime? CreateDt { get; set; }

        public DateTime? UpdateDt { get; set; }

    }
}
