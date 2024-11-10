using System.Collections.Generic;
using OM_ScheduleTool.Models;
using System;

namespace OM_ScheduleTool.Repositories
{
    public interface IPreLogRepository
    {
        dynamic GetPreAndPostLogWeeks(int BroadcastYr, int BroadcastQuarterNbr, int ClientId, int LoggedOnUserId);
        bool CreatePreLog(int SchedID, int WeekNbr, DateTime WeekDate, int LoggedOnUserId);
        bool CanEditPreLog(int PreLogId, int ClientId, int LoggedOnUserId);
        IList<PreLogLine> GetPreLogLines(int PreLogId, int LoggedOnUserId, bool EditPreLog = false);
        dynamic GetPreLogHeader(int PreLogId, int LoggedOnUserId);
        IEnumerable<PreLogNote> GetNotes(int PreLogId, int LoggedOnUserId);
        IList<PreLogWeeklySummary> GetPreLogWeeklySummary(int PreLogId, int LoggedOnUserId);
        LockInfo LockPreLog(int preLogId, int userId);
        bool UnLockPreLog(int preLogId, int LoggedOnUserId);
        IList<NetworkDeltaSummary> GetNetworkLogByPreLogSummary(int preLogId, int LoggedOnUserId);
        bool ReplacePreLogLineTableFromNetworkLogs(int preLogID, int networkId, string logFileName, int LoggedOnUserId);
        bool AppendPreLogLineTableFromNetworkLogs(int preLogID, int networkId, string logFileName, int LoggedOnUserId);
        bool UpdatePreLogChangeDateUser(int preLogID, int LoggedOnUserId);
        ErrorMessage EditPreLogLine(int[] PreLogLineIds, int PreLogId, int NetworkId, string PropertyName
         , bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday
         , string StartTime, string EndTime, int DayPartId, int SpotLen
         , int BuyTypeId, decimal RateAmt, decimal Impressions, string SpotDate, string SpotTime, string ProgramTitle, string ISCI, string Cleared, int LoggedOnUserId, string SPBuy);
        ErrorMessage PreLogSaveChanges(int PreLogId, int LoggedOnUserId);
        ErrorMessage AddPreLogLine(int PropertyLineCount, int NetworkId, string PropertyName, bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday
        , string StartTime, string EndTime, int DayPartId, int SpotLen, int BuyTypeId, decimal RateAmt, decimal Impressions, string SpotDate, string spotTime,
        string ISCI, string ProgramTitle, int LoggedOnUserId, int PreLogId, string SPBuy);
        ErrorMessage PreLogAddDuplicateProperty(int PreLogId, int PreLogLineId, int PropertyDuplicateCount, int LoggedOnUserId);
        ErrorMessage AddPreLogNote(int LoggedOnUserId, int PreLogId, string Note);
        ErrorMessage AddPreLogSubNote(int LoggedOnUserId, int PreLogNoteId, string Note);
        IEnumerable<ClsISCI> GetValidISCIs(int LoggedOnUserId, int PreLogId);
        ErrorMessage DeletePreLog(int LoggedOnUserId, int PreLogId);
        ErrorMessage PreLogCopyPropertyDetails(int LoggedOnUserId, int PreLogId, int PreLogLineId, int[] PreLogLineIds);

        ErrorMessage PreLogClearSpotData(int LoggedOnUserId, int PreLogId, int[] PreLogLineIds);
        IEnumerable<PRELOG_T> GetLockedPreLogs(int LoggedOnUserId);
        bool IsPreLogExists(int LoggedOnUserId, int SchedID, DateTime WeekDate);
        ErrorMessage PreLogMoveSpotData(int LoggedOnUserId, int PreLogId, int[] PreLogLineIdsFrom, int[] PreLogLineIdsTo);
    }
}
