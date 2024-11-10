using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanNetwork
    {
        [Key]
        [Column(Order = 1)]
        public int MediaPlanNetworkId { get; set; }

        [Column(Order = 2)]
        public int MediaPlanId { get; set; }

        [StringLength(20)]
        [Column(Order = 3)]
        public string BuyTypeGroup { get; set; }

        [Column(Order = 4)]
        public int NetworkId { get; set; }
        public string NetworkName { get; set; }

    }
}
