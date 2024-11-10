using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class ManageMediaViewModel
    {
        public User LoggedOnUser { get; set; }

        // Collections to fill out controls
        public IEnumerable<Country> Countries { get; set; }
        public IEnumerable<Network> Networks { get; set; }
        public int LastSelectedClientId { get; set; }
        public int LastSelectedNetworkId { get; set; }
        public int LastSelectedPlanYear { get; set; }
        public int LastSelectedCountryId { get; set; }
        public int LastQuarter { get; set; }
        public int CurrentMediaSelection { get; set; }
        public int UpfrontLockedCount { get; set; }
        public int RemnantLockedCount { get; set; }
        public int ScheduleLockedCount { get; set; }
        public int ProposalLockedCount { get; set; }
        public int LastWindowHeight { get; set; }
        public int LastWindowWidth { get; set; }
        public bool CanSeeMediaPlan { get; set; }

    }
}
