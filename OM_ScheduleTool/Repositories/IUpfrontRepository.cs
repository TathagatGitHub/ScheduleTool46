using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IUpfrontRepository
    {
        IEnumerable<UpfrontPermissions> GetUpfrontByNetwork(int LoggedOnUserId
            , int NetworkId
            , int Year
        );
        IEnumerable<Upfront> GetUpfronts(int LoggedOnUserId);
        Upfront GetUpfrontRemnantById(int LoggedOnUserId, int UpfrontId);
        Upfront GetUpfrontById(int LoggedOnUserId, int UpfrontId);
        User IsLocked(int LoggedOnUserId, int NetworkId, int QuarterId, int UpfrontTypeId);
        ErrorMessage LockUpfront(int LoggedOnUserId, int UpfrontId);
        bool UnlockUpfront(int LoggedOnUserId, int UpfrontId);
        bool UnlockUpfront(int LoggedOnUserId);
        string ApproveUpfront(int LoggedOnUserId, int UpfrontLineId);
        string UnapproveUpfront(int LoggedOnUserId, int UpfrontLineId);
        int GetUpfrontLockCount();
        IEnumerable<DemographicSettings> GetUpfrontDemoNamesByBuyTypeId(int LoggedOnUserId, int UpfrontId, string BuyTypeIds);
        IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(int LoggedOnUserId, int id, string BuyTypesInclude, string DemoNames);
        IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(int LoggedOnUserId, int id, string BuyTypes, string DemoNames
            , string ApprovedDesc, string PropertyName, string StartTime, string EndTime, string dp, string omdp
            , string SpotLen, string Rate, string Impressions, string CPM, string Status, string ClientName, string RevNo
            , string RevisedDate, string EffectiveDate, string ExpirationDate, int Sort, string SearchBox, string BuyTypesInclude, string RevNoExclude, string BuyTypesExclude
            , bool ViewOnly);
        IEnumerable<UpfrontRemnantLineFlat> GetUpfrontRemnantLinesFlat(int LoggedOnUserId, int id, string BuyTypesInclude, string DemoNames);
        IEnumerable<UpfrontRemnantLineFlat> GetUpfrontRemnantLinesFlat(int LoggedOnUserId, int id, string BuyTypes, string DemoNames
            , string ApprovedDesc, string PropertyName
            , string Monday, string Tuesday, string Wednesday
            , string Thursday, string Friday, string Saturday, string Sunday
            , string StartTime, string EndTime, string dp, string omdp
            , string SpotLen, string Rate, string Impressions, string CPM, string Status, string ClientName, string RevNo
            , string RevisedDate, string EffectiveDate, string ExpirationDate, int Sort, string SearchBox, string BuyTypesInclude, string RevNoExclude, string BuyTypesExclude
            , bool ViewOnly, string SpBuy);

        IEnumerable<DemoNames> GetDemoNames(int LoggedOnUserId, int UpfrontId);
        IEnumerable<string> GetApproved(int LoggedOnUserId, int UpfrontId);
        List<Models.Property> GetPropertyNames(int LoggedOnUserId, int UpfrontId);
        IEnumerable<DateTime> GetStartTimes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<DateTime> GetEndTimes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<BuyType> GetBuyTypes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<DayPart> GetDPs(int LoggedOnUserId, int UpfrontId, string PropertyNames);
        IEnumerable<string> GetOMDPs(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<string> GetLens(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<double> GetRateAmt(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<double> GetImpressions(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<double> GetCPM(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<DoNotBuyType> GetDoNotBuyTypes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<Client> GetClients(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<string> GetRevNo(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<DateTime> GetRateRevisedDates(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
        IEnumerable<DateTime> GetExpirationDates(int LoggedOnUserId, int UpfrontId, string PropertyNames);
        IEnumerable<bool> GetWeekDay(int LoggedOnUserId, int UpfrontId, string PropertyNames, int WeekDayId);
        IEnumerable<DateTime> GetEffectiveDates(int LoggedOnUserId, int UpfrontId, string PropertyNames);
        IEnumerable<UpfrontNote> GetUpfrontRemnantNotes(int LoggedOnUserId, int UpfrontId);
        IEnumerable<_DeleteProperty> GetUpfrontRemnantLinesDeleteGroup(int LoggedOnUserId, params int[] UpfrontLineIds);
        IEnumerable<_ReviseEstimate> GetUpfrontRemnantLinesReviseLines(int LoggedOnUserId, int UpfrontId, bool DRRateRevision);
        UpfrontLine GetUpfrontLineById(int LoggedOnUserId, int UpfrontLineId);
        int AddNote(int LoggedOnUserId, int UpfrontId, string Note);
        bool AddSubNote(int LoggedOnUserId, int UpfrontParentNoteId, string Note);
        IEnumerable<string> GetSPBuy(int LoggedOnUserId, int UpfrontId, string PropertyNames);

        ErrorMessage CreateUpfront(int networkId, string qName, int userId);
        IEnumerable<string> GetQuartersForAddProperty(int planYear, int broadcastQtrNumber, int EditedURYear, int LoggedOnUserId);
        IEnumerable<PropModel> GetAvailablePropertiesForQuater(string quarterName, int countryId, int NetworkId, int loggedOnUserId);
        IEnumerable<PropModel> CheckQuarterlyPropertyCanCreate(string existingRateIds, string proposedDemosIds,
            string proposedQuarterName, int copyRateImp, int proposedBuyTypeId, int upfrontTypeId, int upfrontId, bool isCreatePropertyRates, int userId);
        IEnumerable<DREtimateVerions> GetDRAvailableEstimateVerions(int networkId, string quarterName, int userId);
        IEnumerable<PropModel> GetDRAvailableProperties(int networkId, string quarterName, int estimateVersion, int userId);
        IEnumerable<PropModel> DRCheckProperties(int networkId, string quarterName, int estimateVersion, int IsCreateDRPropertyRates, List<DRQuartersProperty> lstDRSelectedProperties, int userId);
        // IEnumerable<QuartersProperty> GetAllDemos();
        UpfrontHeaderViewModel GetUpfrontHeader(int LoggedOnUserId, int UpfrontId, string PropertyNames = null);
    }

    public interface IRemnantRepository
    {
        IEnumerable<UpfrontPermissions> GetRemnantByNetwork(int LoggedOnUserId
            , int NetworkId
            , int Year
        );
        IEnumerable<Upfront> GetRemnants(int LoggedOnUserId);
        User IsLocked(int LoggedOnUserId, int NetworkId, int QuarterId, int UpfrontTypeId);
        Upfront GetUpfrontRemnantById(int LoggedOnUserId, int UpfrontId);
        Upfront GetRemnantById(int LoggedOnUserId, int UpfrontId);
        ErrorMessage LockUpfront(int LoggedOnUserId, int UpfrontId);
        bool UnlockUpfront(int LoggedOnUserId, int UpfrontId);
        bool UnlockUpfront(int LoggedOnUserId);
        int GetRemnantLockCount();
        IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(int LoggedOnUserId, int id, string BuyTypesInclude, string DemoNames);
        IEnumerable<_DeleteProperty> GetUpfrontRemnantLinesDeleteGroup(int LoggedOnUserId, params int[] UpfrontLineIds);
        IEnumerable<_ReviseEstimate> GetUpfrontRemnantLinesReviseLines(int LoggedOnUserId, int UpfrontId, bool DRRateRevision);
        ErrorMessage ReviseEstimate(int LoggedOnUserId, string UpfrontLineIds, string BuytypeCodes);
        ErrorMessage ReviseDRRates(int LoggedOnUserId, string UpfrontLineIds);
        int AddNote(int LoggedOnUserId, int UpfrontId, string Note);
        ErrorMessage CreateRemnant(int networkId, string qName, int userId);
    }
}
