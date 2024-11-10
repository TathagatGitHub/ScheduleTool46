using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class ProposalReportViewModel
    {
        public User LoggedOnUser { get; set; }
        public string ReportName { get; set; }
        public string Client { get; set; }
        public string FeedType { get; set; }
        public string Media { get; set; }
        public Quarter Quarter { get; set; }
        public string Guaranteed { get; set; }
        public string Network { get; set; }

        public string BusinessName { get; set; }
        public string BusinessStreet1 { get; set; }
        public string BusinessCity { get; set; }
        public string BusinessState { get; set; }
        public string BusinessZip { get; set; }
        public string BusinessPhone { get; set; }
        public SchedulePermissions ProposalInfo { get; set; }
        public Network NetworkInfo { get; set; }
        public IEnumerable<ScheduleProposalLinesFlat> ProposalLines { get; set; }
        public Dealpoint DealPointInfo { get; set; }
        public IEnumerable<ScheduleProposalLinesFlatTotals> ProposalLinesFlatTotals { get; set; }

        public bool IsDRBuyType { get; set; }
        public string QuaterlyClientNote { get; set; }
        public bool IsDRBT { get; set; }
    }
}
