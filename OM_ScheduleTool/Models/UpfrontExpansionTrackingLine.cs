using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OM_ScheduleTool.Models
{
    public class UpfrontExpansionTrackingLine
    { 
        [Key]
        public int UpfrontExpansionTrackingLineId { get; set; }

        [Required]
        public int UpfrontExpansionTrackingId { get; set; }

        [Required]
        [DisplayFormat(DataFormatString = "{0:c0}")]
        [Column(TypeName = "Money")]
        public decimal TradedUEDollars { get; set; }

        public Client TradeFrom { get; set; }
        public Client TradeTo { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public User UpdatedBy { get; set; }
    }

    public class UpfrontExpansionTrackingLine_Audit
    {
        [Key]
        public int UpfrontExpansionTrackingLineId { get; set; }
        public int UpfrontExpansionTrackingId { get; set; }
        public decimal TradedUEDollars { get; set; }
        public int TradeFromClientId { get; set; }
        public int TradeToClientId { get; set; }        
        public DateTime UpdateDt { get; set; }
        public int UpdatedByUserId { get; set; }
        public string Operation { get; set; }
        public DateTime TrackingDt { get; set; }
    }
}
