using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace OM_ScheduleTool.Models
{
    public class UpfrontExpansionTradeDetail
    { 
        public int RowNo { get; set; }
        
        public int UpfrontId { get; set; }
        public int UpfrontExpansionTrackingLineId { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}")]
        public decimal ? UpfrontSpend { get; set; }

        [DisplayFormat(DataFormatString = "{0:n2}%")]
        public decimal ? PercentOfUpfront { get; set; }

        [DisplayFormat(DataFormatString = "{0:c2}")]
        public decimal ? UEAvailable { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}")]
        public decimal ? TradedUEDollars { get; set; }

        [DisplayFormat(DataFormatString = "{0:c2}")]
        public decimal ? RevisedUERemaining { get; set; }

        [DisplayFormat(DataFormatString = "{0:c0}")]
        public decimal ? UEBooked { get; set; }

        [DisplayFormat(DataFormatString = "{0:c2}")]
        public decimal ? UERemaining { get; set; }

        public int ? TradeClient { get; set; }
        public string TradeClientName { get; set; }

        public DateTime ? UpdateDt { get; set; }

    }
}
