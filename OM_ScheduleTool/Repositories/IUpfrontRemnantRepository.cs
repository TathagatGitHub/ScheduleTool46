using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IUpfrontRemnantRepository
    {
        IEnumerable<UpfrontPermissions> GetUpfrontByNetwork(int LoggedOnUserId
            , int NetworkId
            , int Year
        );
        IEnumerable<Upfront> GetUpfronts(int LoggedOnUserId);
        Upfront GetUpfrontById(int LoggedOnUserId, int UpfrontId);
        ErrorMessage LockUpfront(int LoggedOnUserId, int UpfrontId);
        bool UnlockUpfront(int LoggedOnUserId, int UpfrontId);
        bool UnlockUpfront(int LoggedOnUserId);
        string ApproveUpfront(int LoggedOnUserId, int UpfrontLineId);
        string UnapproveUpfront(int LoggedOnUserId, int UpfrontLineId);
        int GetUpfrontLockedCount();
        Upfront GetUpfront(int LoggedOnUserId, int NetworkId, int QuarterId, int UpfrontTypeId);
        IEnumerable<DemographicSettings> GetUpfrontDemoNamesByBuyTypeId(int LoggedOnUserId, int UpfrontId, string BuyTypeIds);
        IEnumerable<UpfrontRemnantLineFlat> GetUpfrontRemnantLinesFlat(int LoggedOnUserId, int id, string BuyTypesInclude, string DemoNames);
        IEnumerable<UpfrontRemnantLineFlat> GetUpfrontRemnantLinesFlat(int LoggedOnUserId, int id, string BuyTypes, string DemoNames
            , string ApprovedDesc, string PropertyName, string StartTime, string EndTime, string dp, string omdp
            , string SpotLen, string Rate, string Impressions, string CPM, string Status, string ClientName, string RevNo
            , string RevisedDate, string EffectiveDate, string ExpirationDate, int Sort, string SearchBox, string BuyTypesInclude, string BuyTypesExclude, bool ViewOnly);
        IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(string StoredProcedureName, int LoggedOnUserId, int id, string BuyTypes, string DemoNames, string BuyTypesInclude);
        IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(int LoggedOnUserId, int UpfrontId);
        IEnumerable<UpfrontNote> GetUpfrontRemnantNotes(int LoggedOnUserId, int UpfrontId);
        IEnumerable<_DeleteProperty> GetUpfrontRemnantLinesDeleteGroup(int LoggedOnUserId, int UpfrontLineId);
        IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLinesReviseLines(int LoggedOnUserId, int UpfrontId, bool DRRateRevision);
        ErrorMessage ReviseEstimate(int LoggedOnUserId, string UpfrontLineIds);
        ErrorMessage ReviseDRRates(int LoggedOnUserId, string UpfrontLineIds);

        bool AddNote(int LoggedOnUserId, int UpfrontId, string Note);
    }

}
