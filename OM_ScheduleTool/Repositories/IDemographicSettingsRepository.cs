using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IDemographicSettingsRepository
    {
        IEnumerable<int> GetPlanYears(int CountryId, int LoggedOnUserId);
        List<DemographicSettingsUniverse> GetDemoUniverse(int CountryId, int PlanYr, int LoggedOnUserId, int Sort, int BuyTypeId);
        ErrorMessage SaveDemoUniverse(int DemoSettingsId, int SortOrder, string DemographicName, int Universe, int LoggedOnUserId, int CountryId, int PlanYr);
        DemoRateCalculator CalculateRates(int LoggedOnUserId, int CountryId, bool DRType, double RateAmt, double Impressions);
        List<DemographicSettings> GetClientQuarter(int CountryId, string QuarterName, int ClientId, int LoggedOnUserId);
        List<DemographicSettings> GetDemosByProposalId(int ProposalId, int LoggedOnUserId);
        List<DemographicSettingsExport> GetDemographicSettings(string countryShortCode, int planYr, int loggedOnUserId);
        List<DemographicSettingsExport> MapListDemographicSettingsUniverseToListDemographicSettingsExport(List<DemographicSettingsUniverse> objListDemographicSettingsUniverse);
    }
}
