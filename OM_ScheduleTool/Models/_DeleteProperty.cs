using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    /* Not saved to database */
    public class _DeleteProperty
    {
        public int _DeletePropertyId { get; set; }

        public bool Approved { get; set; }

        public bool InUse { get; set; }

        public string DemoName { get; set; }

        public string PropertyName { get; set; }

        public DateTime StartTime { get; set; }

        public DateTime EndTime { get; set; }

        public string DayPartCd { get; set; }

        public string BuyTypeCode { get; set; }

        public int SplitNo { get; set; }

        public int SpotLen { get; set; }

        public double RateAmt { get; set; }

        public double Impressions { get; set; }

        public string DoNotBuyTypeDescription { get; set; }

        public int RateId { get; set; }

        public int PropertyId { get; set; }

        public int UpfrontLineId { get; set; }

        public int UpfrontId { get; set; }

        public string DeleteFlag { get; set; }
    }
}
