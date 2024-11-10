using Dapper;
using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Dapper;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IScheduleProposalRepository
    {
        ErrorMessage Delete(int LoggedOnUserId, int ScheduleProposalId);
        ErrorMessage GetChangedCount(int LoggedOnUserId, int ScheduleId);
        SPUpfrontExpansionInfo GetUpfrontExpansionInfo(int LoggedOnUserId, int ScheduleProposalId, string NetworkNames, string BuyTypeCodes, bool CalcExch);
        IEnumerable<ProposalNote> GetScheduleProposalNotes(int LoggedOnUserId, int ProposalId);
        //IEnumerable<ProposalNote> GetScheduleProposalNotes_OLD(int LoggedOnUserId, int ProposalId);
        int AddNote(int LoggedOnUserId, int ProposalId, string Note);
        bool AddSubNote(int LoggedOnUserId, int ProposalParentNoteId, string Note);
        string Lock(int LoggedOnUserId, int Id);
        bool Unlock(int LoggedOnUserId, int Id, bool IsCalledFromBtn);
        int GetLockCount();

        // Add Property Functions
        IEnumerable<Network> GetNetworks(int ClientId, int QuarterId, int CountryId, int ProposalId, int UserId);
        IEnumerable<DemoNames> GetDemoNames(int ClientId, int QuarterId, int NetworkId, int ProposalId, int LoggedOnUserId);
        IEnumerable<PropertyAddNew> GetAvailableProperties(int ProposalId, int NetworkId, int DemoId, int LoggedOnUserId);
        ErrorMessage AddScheduleLines(int ProposalId, string RateIds, int UserId);

        IEnumerable<ScheduleProposalLinesFlat> GetProposalLinesFlat(int LoggedOnUserId
            , int ProposalId
            , string ApprovedDesc
            , string Status
            , string RevNo
            , string RevisedDate
            , string DemoName
            , string NetworkNames
            , string PropertyName
            , string dp
            , string omdp
            , string BuyType
            , string SpotLens
            , string RateAmt
            , string Impressions
            , string CPM
            , string EffectiveDate
            , string ExpirationDate
            , string Discount
            , string TotalSpots
            , string StartToEnd
            , string usd
            , int PageNumber
            , int PageSize
            , float DiscountRate
            , bool ViewOnly
            , string SPBuy
            , string WK01Spots
            , string WK02Spots
            , string WK03Spots
            , string WK04Spots
            , string WK05Spots
            , string WK06Spots
            , string WK07Spots
            , string WK08Spots
            , string WK09Spots
            , string WK10Spots
            , string WK11Spots
            , string WK12Spots
            , string WK13Spots
            , string WK14Spots            
            //, string Monday, string Tuesday, string Wednesday
            //, string Thursday, string Friday, string Saturday, string Sunday
            , string DOW
            , bool CalledForDropDown, bool FilterForEdit //ST-724, Addedd CalledForDropDown,FilterForEdit parameters
            ,bool PremiereFilter //ST-807
            );

        IEnumerable<ScheduleProposalLinesFlat> ExcelGetProposalLinesFlat(int LoggedOnUserId
           , int ProposalId
           , string ApprovedDesc
           , string Status
           , string RevNo
           , string RevisedDate
           , string DemoName
           , string NetworkNames
           , string PropertyName
           , string dp
           , string omdp
           , string BuyType
           , string SpotLens
           , string RateAmt
           , string Impressions
           , string CPM
           , string EffectiveDate
           , string ExpirationDate
           , string Discount
           , string TotalSpots
           , string StartToEnd
           , string usd
           , int PageNumber
           , int PageSize
           , float DiscountRate
           , bool ViewOnly
           , string SPBuy);

        IEnumerable<ScheduleProposalLinesFlatTotals> GetProposalLinesFlatTotals(int LoggedOnUserId
            , int ProposalId
            , string ApprovedDesc
            , string Status
            , string RevNo
            , string RevisedDate
            , string DemoName
            , string NetworkNames
            , string PropertyName
            , string dp
            , string omdp
            , string BuyType
            , string SpotLens
            , string RateAmt
            , string Impressions
            , string CPM
            , string EffectiveDate
            , string ExpirationDate
            , string Discount
            , string TotalSpots
            , string StartToEnd
            , string usd
            , int PageNumber
            , int PageSize
            , float DiscountRate
            , bool ViewOnly
            , bool ExchangeRate,
             bool Schedule
            , bool GI
            , bool ProposalReportTotals
            , bool IsDRBT
             , bool PremiereFilter //ST-807
             );
        IEnumerable<ScheduleProposalLinesFlatTotals> ExcelGetProposalLinesFlatTotals(int LoggedOnUserId
           , int ProposalId
           , string ApprovedDesc
           , string Status
           , string RevNo
           , string RevisedDate
           , string DemoName
           , string NetworkNames
           , string PropertyName
           , string dp
           , string omdp
           , string BuyType
           , string SpotLens
           , string RateAmt
           , string Impressions
           , string CPM
           , string EffectiveDate
           , string ExpirationDate
           , string Discount
           , string TotalSpots
           , string StartToEnd
           , string usd
           , int PageNumber
           , int PageSize
           , float DiscountRate
           , bool ViewOnly
           , bool ExchangeRate,
            bool Schedule
           , bool GI
           , bool ProposalReportTotals
           , bool IsDRBT
            );
        IEnumerable<string> GetDemoNames(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames, string filterBuyTypes);
        IEnumerable<string> GetApproved(int LoggedOnUserId, int ScheduleProposalId);
        IEnumerable<BuyTypesAndDemosByNetworks> GetBuyTypesAndDemos(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames, string filterBuyTypes);
        IEnumerable<DoNotBuyType> GetDoNotBuyTypes(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<string> GetDPs(int LoggedOnUserId, int UpfrontIScheduleProposalId, string filterNetworkNames);
        IEnumerable<string> GetOMDPs(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<string> GetRevNo(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<DateTime> GetRateRevisedDates(int LoggedOnUserId, int ScheduleProposalId);
        IEnumerable<DateTime> GetEffectiveDates(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<DateTime> GetExpirationDates(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<string> GetNetworkNames(int LoggedOnUserId, int ScheduleProposalid);
        IEnumerable<string> GetPropertyNames(int LoggedOnUserId, int ScheduleProposalid, string filterNetworkNames);
        IEnumerable<SelectListItem> GetWeekDay(int LoggedOnUserId, int ScheduleProposalid, string filterNetworkNames, int WeekDayId);
        IEnumerable<string> GetLens(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<double> GetRateAmt(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<double> GetImpressions(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<double> GetCPM(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<string> GetStartToEnd(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<double> GetDiscounts(int LoggedOnUserId, int ScheduleProposalId, float DiscountRate, string filterNetworkNames);
        IEnumerable<int> GetTotalSpots(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<double> GetUSDRate(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        ErrorMessage GetWeeklySpot(int LoggedOnUserId, int ScheduleLineId, int WeekNo);
        ErrorMessage SaveWeeklySpots(int LoggedOnUserId, int ScheduleLineId, int WeekNo, int Spots);
        ErrorMessage SaveChanges(int LoggedOnUserId, int ScheduleId);

        ErrorMessage DeleteLine(int LoggedOnUserId, int LineId);
        IEnumerable<SelectListItem> GetSPBuy(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames);
        IEnumerable<int> GetWKSpots(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames, int WKNo);
    }

    public interface IScheduleRepository : IScheduleProposalRepository
    {
        ScheduleSummary GetScheduleById(int LoggedOnUserId, int Id);
        IEnumerable<SchedulePermissions> GetScheduleByClient(int LoggedOnUserId, int ClientId, int BroadcastYr);
        IEnumerable<ScheduleLine> GetScheduleLines(int LoggedOnUser, int ScheduleId);
        IEnumerable<Schedule> GetSchedules(int LoggedOnUserId);
        string LockSchedule(int LoggedOnUserId, int ScheduleId);
        bool UnlockSchedule(int LoggedOnUserId, int ScheduleId);
        int GetScheduleLockCount();
        SCHED_WEEK_LOCK_T GetSchedWeekLockStatus(int ScheduleId);
    }

    public interface IProposalRepository : IScheduleProposalRepository
    {
        SchedulePermissions GetProposalById(int LoggedOnUserId, int Id);
        IEnumerable<SchedulePermissions> GetProposalByClient(int LoggedOnUserId, int ClientId, int BroadcastYr);
        IEnumerable<ScheduleLine> GetProposalLines(int LoggedOnUser, int ProposalId);
        IEnumerable<Schedule> GetProposals(int LoggedOnUserId);
        Schedule GetProposal(int ProposalId, int LoggedOnUserId);

        CommRate GetClientQuarterWeeklyCommissionRates(int LoggedOnUserId, int ClientId, int QuarterId);
        IEnumerable<float> GetClientQuarterCommissionRates(int LoggedOnUserId, int ClientId, int QuarterId);
        CAtoUS_ExchangeRates GetClientQuarterWeeklyExchangeRates(int LoggedOnUserId, int ClientId, int QuarterId);
        float GetClientExchangeRate(int LoggedOnUserId, int ClientId, int QuarterId);

        string LockProposal(int LoggedOnUserId, int ProposalId);
        bool UnlockProposal(int LoggedOnUserId, int ProposalId, bool IsCalledFromBtn);
        int GetProposalLockCount();

        ErrorMessage CopyToSchedule(int ProposalId, string NetworkIds, int UserId);
        ErrorMessage CopySpots(int ProposalId, int CopyWeek, int EndCopyWeek, string NetworkName, int LoggedOnUserId, string ScheduleLineIds);
        ErrorMessage IsInUse(int LineId);
        ErrorMessage SaveFilterState(int proposalId, string profileKey, string currentFilters, int userId);

        IEnumerable<Network> GetNetworksAvailable(int ProposalId, int UserId);
        IEnumerable<Network> GetNetworksNeedAttention(int ProposalId, int UserId);
        IEnumerable<Network> GetNetworksNotAvailable(int ProposalId, int UserId);

        ErrorMessage CreateProposal(int ClientId, int DemographicSettingsId, string QuarterName, string ScheduleName, string RateIds, int LoggedOnUserId);
        List<Rate> GetPropertiesForCreate(string NetworkIds, string QuarterName, int ClientId, int DemographicSettingsId, int LoggedOnUserId);

        int GetProposalVersion(int ProposalId, int LoggedOnUserId);
        IEnumerable<ProposalNetworks> GetProposalAllNetworks(int proposalId, int userId);
        bool CreateProposalVisible(int ClientId, int LoggedOnUserId);
        ErrorMessage SaveQuarterlyClientNote(int ClientId, string Note, int LoggedOnUserId);
        string GetQuarterlyClientNote(int ProposalId, int LoggedOnUserId);
        IEnumerable<Network> GetScheduleNetworksNotInProposal(int ProposalId, int LoggedOnUserId);
        //#region Proposal Automation Functions
        //List<UnAllocatedProposals> GetUnAllocatedProposals(int ClientId, string QuarterName, bool GetCount, string LoggedOnUserId);
        //#endregion

        #region Proposal Automation Functions
        List<UnAllocatedProposals> GetUnAllocatedProposals(int ClientId, string QuarterName, bool GetCount, string LoggedOnUserId, bool Archived, string Mode);

        int ArchiveProposals(int ClientId, string QuarterName, string NetworkIds, string SourceFileName, bool Archived, int LoggedOnUserId);
        List<ImportingProposals> GetImportingProposals(int ClientId, string QuarterName, int NetworkId, string SourceFileName, string FileAction, int CountryId, bool ShowTotals, string Mode, int LoggedOnUserId);

        //SaveUnallocatedProposalResponse SaveUnAllocateProposals(int ClientId, string QuarterName, int NetworkId, string SourceFileName, int CountryId, int ProposalId, int RateId,string Mode,
        //    int wk1, int wk2, int wk3, int wk4, int wk5, int wk6, int wk7, int wk8,
        //    int wk9, int wk10, int wk11, int wk12, int wk13, int wk14, int LoggedOnUserId);
        SaveUnallocatedProposalResponse SaveUnAllocateProposalsVersionHistory(int ClientId, string QuarterName, string Mode, string SourceFileName, string FileAction, int LoggedOnUserId);
        SaveUnallocatedProposalResponse SaveUnAllocateProposalsVersionHistoryIgnored(int ClientId, string QuarterName, string Mode, string SourceFileName, string FileAction, int LoggedOnUserId);
        SaveUnallocatedProposalResponse SaveUnAllocateProposals(int ProposalId, int RateId, int PropertyId, int ClientId, string QuarterName, Int64 PAJourneyId
             , int wk1, int wk2, int wk3, int wk4, int wk5, int wk6, int wk7, int wk8,
             int wk9, int wk10, int wk11, int wk12, int wk13, int wk14, int LoggedOnUserId);
        int MarkProposalAsAlocated(int ClientId, string QuarterName, string NetworkIds, string SourceFile, int ProposalId, int LoggedOnUserId);
        List<ProposalsRawFileExportModel> ExportRawProposalsFile(int ClientId, string QuarterName, int NetworkId, string SourceFileName, int CountryId, int LoggedOnUserId);

        List<ImportingSTSpots> GetSTSpotsForPrposal(string RateId, int ScheduleId, bool FromST, int ActWeekNum, int LoggedOnUserId);

        #region ST-710, Proposal Automation User Journey Functions
        int AddUserJourneyMaster(int ClientId, int NetworkId, string QuarterName, string ScreenName, int ScheduleId, int Deal, string SourceFile, string ActionTaken, string Description, int LoggedOnUserId);
        #endregion

        #region ST-691
        List<UnAllocatedProposals> GetProcessedProposals(int ClientId, string QuarterName, int LoggedOnUserId);
        #endregion
        #endregion

        #region ST-724 Functions Start here
        List<ProposalNetworkModel> GetNetworkListForSchedule(int ClientId, int ScheduleId, int LoggedOnUserId);
        List<Schedule> GetPatiallyLockedProposals();
         string LockProposalWithNetwork(int LoggedOnUserId, int ScheduleId, string NetworkList, bool IsFullyLocked, bool PremiereFilter);
        #endregion

        #region Child Properties Functions
        ErrorMessage AddChildProperties(PropertyAddNew PropertyModel, int ProposalId, int UserId);
        ErrorMessage CheckChildPropertiesUniqueness(PropertyAddNew PropertyModel, int UserId);
        #endregion
    }

}