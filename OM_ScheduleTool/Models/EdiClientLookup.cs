using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class EdiClientLookup
    {
        public int EdiClientLookupId { get; set; }

        [StringLength(255)]
        public string EdiClientName { get; set; }

        public Client Client { get; set; }

        public bool? IsNew { get; set; }

        public DateTime CreateDt { get; set; }

        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }
    }
}
