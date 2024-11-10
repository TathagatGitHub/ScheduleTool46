using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    [NotMapped]
    public class UpfrontExpansionQuarters
    {        
        public int UpfrontExpansionTrackingId { get; set; }

        [DefaultValue(0)]
        public bool IsCurrent { get; set; }

        public int PlanYear { get; set; }

        public Upfront UpfrontInfo { get; set; }
        [NotMapped]
        public int UpfrontIdVal { get; set; }

        public int QuarterNbr { get; set; }

        public string QuarterName { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}")]
        public decimal TotalQuarterUpfrontDollars { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}")]
        public decimal BookedUpfrontDollars { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}")]
        public decimal UEDollarsAvailable { get; set; }

        [NotMapped]
        public List<UpfrontExpansionNetworkGroup> UpfrontExpansionNetworkGroup { get; set; }

    }

    public class UpfrontExpansionTracking
    {
        [Key]        
        public int UpfrontExpansionTrackingId { get; set; }

        [Required]
        public Upfront Upfront { get; set; }
        
        public List<UpfrontExpansionTrackingLine> UpfrontExpansionTrackingLines { get; set; }

        [NotMapped]
        public List<UpfrontExpansionTradeDetail> UpfrontExpansionTradeDetails { get; set; }        

        [DisplayFormat(DataFormatString = "{0:c0}", ApplyFormatInEditMode = true)]
        [Column(TypeName = "Money")]
        public decimal TotalUpfrontDollars { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}", ApplyFormatInEditMode = true)]
        [Column(TypeName = "Money")]
        public decimal UEDollarsAvailable { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}", ApplyFormatInEditMode = true)]
        [Column(TypeName = "Money")]
        public decimal YearlyTotalUpfrontDollars { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}", ApplyFormatInEditMode = true)]
        [Column(TypeName = "Money")]
        public decimal YearlyUEDollarsAvailable { get; set; }

        public bool? Yearly { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public User UpdatedBy { get; set; }


    }
}
