using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Dealpoint
    {
        public Dealpoint ()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;

            BillboardAddedValue = "";
            UpfrontSponsorship = "";
        }
        public int DealPointId { get; set; }

        [Required]
        public int NetworkId { get; set; }
        public virtual Network Network { get; set; }

        [Required]
        public int PlanYr { get; set; }

        public string DR { get; set; }

        [StringLength(250)]
        public string BillboardAddedValue { get; set; }

        [StringLength(250)]
        public string UpfrontSponsorship { get; set; }

        [StringLength(250)]
        public string UpfrontCancellation { get; set; }

        [StringLength(250)]
        public string ScatterCancellation { get; set; }

        [StringLength(250)]
        public string NetworkSeparationPolicy { get; set; }

        public DateTime CreateDt { get; set; }
        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }

    }
}
