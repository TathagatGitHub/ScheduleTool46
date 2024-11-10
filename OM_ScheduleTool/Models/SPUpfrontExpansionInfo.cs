using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Permissions;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class SPUpfrontExpansionInfo
    {
        public string AvailableUE { get; set; }
        public string BookedUE { get; set; }
        public string StaticAvailableUE { get; set; }
        public string StaticBookedUE { get; set; }
        public int UECount { get; set; }
        public string BillingType { get; set; }
        public int NetworkCount { get; set; }
        public string ErrorDescription { get; set; }

        public ErrorMessage ErrorMessage { get; set; }
        
        //ST-946
        public bool Success { get; set; }
        public int ResponseCode { get; set; }
        public string ResponseText { get; set; }
    }
}
