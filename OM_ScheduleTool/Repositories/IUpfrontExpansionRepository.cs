using System.Collections.Generic;
using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.Repositories
{
    public interface IUpfrontExpansionRepository
    {
        UpfrontExpansionTracking GetUpfrontExpansionTrackingByUpfrontId(int LoggedOnUserId, int UpfrontId);
        List<UpfrontExpansionQuarters> GetUpfrontExpansionQtrsByUpfrontId(int LoggedOnUserId, int UpfrontId, int CurrentQuarterNbr);
        List<DemoNames> GetUpfrontExpansion_DemoNames(int UpfrontId);
        int CreateUpfrontExpansion(int UpfrontId, int CurrentUpfrontExpansionTrackingId, int LoggedOnUserId);
        int Trade(int UpfrontExpansionTrackingId, int FromClientId, int ToClientId, decimal TradedUEDollars, User LoggedOnUser);
        bool DeleteTrade(int UpfrontExpansionTrackingLineId, User LoggedOnUser);
        int Save_UpfrontExpansionTracking(int UpfrontId, int UpfrontExpansionTrackingId, decimal UEDollarsAvailable, decimal TotalQuarterUpfrontDollars, User LoggedOnUser);
        bool Save_UpfrontExpansionTracking(int UpfrontExpansionTrackingId, decimal UEDollarsAvailable, decimal TotalUpfrontDollars, decimal YearUEDollarsAvailable, decimal YearTotalUpfrontDollars, User LoggedOnUser);
        void GetYearlyFlag(int UpfrontId, int LoggedOnUserId, out bool? Yearly, out int id, out bool CanChangeYearly);
        UpfrontExpansionNetworkGroup GetNetworkGroup(int UpfrontId);
        bool SaveYearlyOrQuarterlyUpfrontExpansion(int UpfrontId, bool YearlyQuarterly, int LoggedOnUserId);
        void GetYearUsageTracker(int LoggedOnUserId, int UpfrontId, out int FundsUsed, out int FundsRemaining);        
        IEnumerable<KeyValuePair<int, string>> GetNetworkGroups(int Year, int CountryId, int LoggedOnUserId);
        IEnumerable<Network> GetNetworksForGroup(int UpfrontExpansionNetworkGroupId, int LoggedOnUserId);
        bool AddNetworkToGroup(int UpfrontExpansionNetworkGroupId, int[] Networks, int Year, string Country, int LoggedOnUserId, out string errorMsg);
        bool DeleteNetworkInGroup(int NetworkId, int UpfrontExpansionNetworkGroupId, int LoggedOnUserId, out string errorMsg);
        bool AddNewNetworkGroup(int Year, string Country, int[] Networks, out string errorMsg, int LoggedOnUserId);
        IEnumerable<string> GetNetworkGroup(int? NetworkId, int? QuarterId, int LoggedOnUserId);        
    }
}
