using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class UpfrontReportViewModel
    {
        public User LoggedOnUser { get; set; }
        public string ReportName { get; set; }
        public string FeedType { get; set; }
        public string Media { get; set; }
        public string Quarter { get; set; }
        public string Guaranteed { get; set; }
        public IEnumerable<string> ClientMandatesAvailable { get; set; }
        public string BusinessName { get; set; }
        public string BusinessStreet1 { get; set; }
        public string BusinessCity { get; set; }
        public string BusinessState { get; set; }
        public string BusinessZip { get; set; }
        public string BusinessPhone { get; set; }

        public IEnumerable<UpfrontRemnantLineFlat> UpfrontLines { get; set; }
        public Upfront UpfrontInfo { get; set; }
        public Network NetworkInfo { get; set; }
        public Dealpoint DealPointInfo { get; set; }

        public bool IsDRBuyType { get; set; }

        public bool IsDRBT { get; set; }
        /*
        public string BillboardAddedValue { get; set; }
        public string UpfrontSponsorship { get; set; }
        public string UpfrontCancellation { get; set; }
        public string ScatterCancellation { get; set; }
        public string NetworkSeparationPolicy { get; set; }
        */
    }
}
