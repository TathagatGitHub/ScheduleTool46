using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class NetworkAlias
    {
        public string Country { get; set; }

        public string NetworkName { get; set; }

        public string Alias { get; set; }
    }

    public class Network
    {
        [Key]
        public int NetworkId { get; set; }

        public int PlanYr { get; set; }

        [StringLength(255)]
        [Required]
        public string StdNetName { get; set; }

        [Required]
        public int CountryId { get; set; }
        public virtual Country Country { get; set; }

        [Required]
        public FeedType FeedType { get; set; }
        [NotMapped]
        public string FeedTypeName { get; set; }

        [Required]
        public MediaType MediaType { get; set; }

        public int WGT { get; set; }

        public int? GuarImp { get; set; }

        public DateTime CreateDt { get; set; }

        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }
    }

    public class ProposalNetworks
    {
        public int NetworkId { get; set; }
        public string StdNetName { get; set; }
        public Boolean ApprvUnits { get; set; }
        public Boolean ApprvNoUnits { get; set; }
        public Boolean UnApprvUnits { get; set; }
        public Boolean UnApprvNoUnits { get; set; }
        public Boolean ScheduledUnits { get; set; }
    }

}
