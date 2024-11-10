using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class ScheduleViewModel : ProposalViewModel
    {
    }

    public class ProposalViewModel : ScheduleProposalViewModel
    {
        public CommRate ClientWeeklyCommissionRates;
        public IEnumerable<float> ClientCommissionRates;
        public Quarter ProposalQuarter { get; set; }
        public IEnumerable<ScheduleProposalLinesFlat> ProposalLines { get; set; }
        public List<ProposalNote> ProposalNotes { get; set; }
        public IEnumerable<Network> Networks;
        public IEnumerable<DemographicSettings> DemographicSettings { get; set; }

        public IEnumerable<Network> NetworksAvailable { get; set; }
        public IEnumerable<Network> NetworksNeedAttention { get; set; }
        public IEnumerable<Network> NetworksNotAvailable { get; set; }

        public SchedulePermissions ProposalInfo { get; set; }
        public float ClientExchangeRate { get; set; }
        public CAtoUS_ExchangeRates ClientWeeklyExchangeRate { get; set; }
        public bool UniqueDemo { get; set; }
        public int NetworkId { get; set; }
        public int DemographicSettingsId { get; set; }
        public SPUpfrontExpansionInfo UpfrontExpansion { get; set; }
        public IEnumerable<ProposalNetworks> ProposalAllNetworks { get; set; }
        public SCHED_WEEK_LOCK_T SchedWeekLock { get; set; }

        public IEnumerable<Network> ScheduleNetworkNotInProposal { get; set; }
        public IEnumerable<Network> LockedNetworksByUserInProposal { get; set; }//ST-724
    }

    public class ScheduleProposalViewModel
    {
        public User LoggedOnUser { get; set; }
        public Client ClientInfo { get; set; }

        public UserFeaturePermission UserFeaturePermissionInfo { get; set; }
    }
}
