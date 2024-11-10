using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class EdiNetworkLookup
    {
        public int EdiNetworkLookupId { get; set; }

        public string EdiNetName { get; set; }

        [Required]
        public virtual Network Network { get; set; }

        public DateTime CreateDt { get; set; }

        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }
    }
}
