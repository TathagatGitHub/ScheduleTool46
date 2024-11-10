using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DemographicSettingsExport
    {
        public string Country { get; set; }

        public int PlanYear { get; set; }

        public string DemoName { get; set; }

        public int Universe { get; set; }
    }

    public class DemographicSettings
    {
        public DemographicSettings()
        {
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int DemographicSettingsId { get; set; }

        [StringLength(255)]
        [Required]
        public string DemoName { get; set; }

        [Required]
        public int CountryId { get; set; }
        public virtual Country Country { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [StringLength(255)]
        /* Don't know when this is used */
        public string Gender { get; set; }

        /* Don't know when this is used */
        public int? AgeMin { get; set; }
        
        /* Don't know when this is used */
        public int? AgeMax { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [ForeignKey("User")]
        public int? UpdatedByUserId { get; set; }
        public virtual User UpdatedBy { get; set; }
    }
}
