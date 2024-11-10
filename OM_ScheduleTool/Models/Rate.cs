using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Rate
    {
        [Required]
        public int RateId { get; set; }

        [Required]
        [ForeignKey("Property")]
        public int PropertyId { get; set; }
        public virtual Property Property { get; set; }

        [ForeignKey("DemographicSettings")]
        public int? DemographicSettingsPerQtrId { get; set; }
        public virtual DemographicSettingsPerQtr DemographicSettingsPerQtr { get; set; }

        /*
        [Required]
        [ForeignKey("Quarter")]
        public int QuarterId { get; set; }
        public Quarter Quarter { get; set; }
        */

        [Required]
        public int SpotLen { get; set; }

        [ForeignKey("Split")]
        public int? SplitId { get; set; }
        public Split Split { get; set; }

        [Required]
        [ForeignKey("BuyType")]
        public int BuyTypeId { get; set; }
        public BuyType BuyType { get; set; }

        [Required]
        [Column(TypeName = "Money")]
        public decimal RateAmt { get; set; }

        [Required]
        public decimal Impressions { get; set; }

        [Required]
        public bool Approved { get; set; }

        [Required]
        [ForeignKey("DoNotBuy")]
        public int DoNotBuyTypeId { get; set; }
        public DoNotBuyType DoNotBuyType { get; set; }

        [ForeignKey("MandateClient")]
        public int? MandateClientId { get; set; }
        public virtual Client MandateClient { get; set; }

        [Required]
        public DateTime EffectiveDate { get; set; }

        [Required]
        public DateTime ExpirationDate { get; set; }

        [Required]
        public string Revision { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [ForeignKey("UpdatedByUser")]
        public int? UpdatedByUserId { get; set; }
        public virtual User UpdatedByUser { get; set; }
        [NotMapped]
        public string StartTimeFormatted { get; set; }
        [NotMapped]
        public string EndTimeFormatted { get; set; }
    }
}
