using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DemographicSettingsPerQtr
    {
        public DemographicSettingsPerQtr()
        {
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int DemographicSettingsPerQtrId { get; set; }

        [ForeignKey("DemographicSettingsId")]
        public int? DemographicSettingsId { get; set; }
        public virtual DemographicSettings Demo { get; set; }

        [Required]
        [StringLength(6)]
        public int QuarterId { get; set; }
        public virtual Quarter Quarter { get; set; }

        /* Don't know what this is for yet */
        public int? DemoNbr { get; set; }

        [Required]
        public int Universe { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        public int? UpdatedByUserId { get; set; }

    }
}
