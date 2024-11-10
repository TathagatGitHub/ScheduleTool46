using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Country
    {
        [Key]
        public int CountryId { get; set; }

        [StringLength(2)]
        [Display(Name = "Country")]
        public string CountryShort { get; set; }

        [StringLength(255)]
        public string CountryLong { get; set; }

        public int SortKey { get; set; }

        public bool IncludeInNetwork { get; set; }

        public DateTime CreateDt { get; set; }

        public DateTime UpdateDt { get; set; }

        public virtual User UpdatedBy { get; set; }

    }
}
