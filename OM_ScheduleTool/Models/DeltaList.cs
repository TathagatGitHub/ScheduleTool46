using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DeltaList
    {
        public int DeltaListId { get; set; }

        [StringLength(5000)]
        public string Change { get; set; }

        public string Version { get; set; }

        public DateTime CreateDt {get; set;}

    }
}
