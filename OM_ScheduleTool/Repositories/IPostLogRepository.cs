using System;
using System.Collections.Generic;
using OM_ScheduleTool.Models;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IPostLogRepository
    {
        IEnumerable<POSTLOG_T> GetPostLogWeeks(int BroadcastYr, int BroadcastQuarterNbr, int ClientId);
        dynamic GetPostLogHeader(int PreLogId, int LoggedOnUserId);
        IList<POSTLOG_LINE_T> GetPostLogLines(int PostLogId, int LoggedOnUserId);
        IList<POSTLOG_LINE_T> GetPostLogLinesFromSP(int PostLogId, int LoggedOnUserId, bool Lock, int? PostLogLineId);
        //IList<POSTLOG_LINE_T> GetPostLogLinesFromSP(int PostLogId, int LoggedOnUserId, bool Lock, Guid? PostLogLineId);
        ErrorMessage AddPostLogLine(int PropertyLineCount, int NetworkId, string propertyName
            , bool monday, bool tuesday, bool wednesday, bool thursday, bool friday, bool saturday, bool sunday
            , string startTime, string endTime
            , int dayPartId, int spotLength, int BuyTypeId
            , decimal grossRateAmt, decimal impressions, string spotDate, string spotTime
            , int mediaTypeId, string isci, string sigmaProgram,
            string program, int LoggedOnUserId, int PostLogId, string SPBuy);

        ErrorMessage EditPostLogLine(int[] PostLogLineIds, int NetworkId, string propertyName
            , int Monday, int Tuesday, int Wednesday, int Thursday, int Friday, int Saturday, int Sunday
            , string startTime, string endTime
            , int dayPartId, int spotLen, int BuyTypeId, decimal fullRate, decimal impressions
            , string SpotDate, string SpotTime, int mediaTypeId
            , string ProgramTitle, string ISCI, string clearedPlaced, string sigmaProgram, int scheduleId, int LoggedOnUserId, string SPBuy);
        ErrorMessage Unlock(int PostLogId, int LoggedOnUserId);
        IEnumerable<POSTLOG_T> GetLockedPostLogs(int LoggedOnUserId);

        bool UpdatePostlogFromScheduleAndNetwork(int postlogId, int schedId, int weekNbr, int loggedOnUserId);
        IList<NetworkDeltaSummary> GetNetworkLogByPostLogSummary(int postLogId, int LoggedOnUserId);
        bool ReplacePostLogLineTableFromNetworkLogs(int postLogID, int networkId, string logFileName, int LoggedOnUserId);
        bool AppendPostLogLineTableFromNetworkLogs(int postLogID, int networkId, string logFileName, int LoggedOnUserId);
        bool UpdatePostLogChangeDateUser(int postLogID, int LoggedOnUserId);
        bool IsActualized(int schedId, int weekNbr, int LoggedOnUserId);
        bool CreatePostLog(int SchedID, int WeekNbr, DateTime WeekDate, int LoggedOnUserId);
        IList<PostLogLine> GetPostLogLinesNew(int postLogId, int LoggedOnUserId);
        ErrorMessage Actualize(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId);

        ErrorMessage SetPostLogLines(int NetworkId, string propertyName, bool monday, bool tuesday, bool wednesday, bool thursday, bool friday, bool saturday, bool sunday,
          string startTime, string endTime, int dayPartId, int spotLength, decimal grossRateAmt, decimal impressions, string spotDate, int mediaTypeId, string isci, string sigmaProgram,
          string program, int LoggedOnUserId, int PostLogId);

        ErrorMessage PostLogSaveChanges(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId);
        ErrorMessage PostlogAddDuplicateProperty(int postlogId, int selectedDuplicatePropertyId, int propertyDuplicateCount, int LoggedOnUserId);
        ErrorMessage AddPostLogNote(int PostLogId, string Note, int LoggedOnUserId);
        ErrorMessage AddPostLogSubNote(int PostLogNoteId, string Note, int LoggedOnUserId);
        IEnumerable<PostLogNote> GetPostLogNotes(int PostLogId, int LoggedOnUserId);
        IEnumerable<ClsISCI> PostLogGetValidISCIs(int PostLogId, int LoggedOnUserId);
        ErrorMessage PostLogAddNetworkLine(int preLog, int postLog, int nwSelectNetwork, int nwClientId,
                string selectCountry, string nwProduct, string nwSpotDate, string nwSpotTime, int nwSpotLen,
                string nwISCICode, decimal nwSpotRate, string nwProgram, string rcvdDate, string nwWeekOf,
                string logFileName, int LoggedOnUserId);
        ErrorMessage DeletePostLog(int LoggedOnUserId, int PostLogId);
        ErrorMessage PostLogCopyPropertyDetails(int LoggedOnUserId, int PostLogId, int PostLogLineId, int[] PostLogLineIds);
        ErrorMessage PostLogClearSpotData(int LoggedOnUserId, int PreLogId, int[] PreLogLineIds);
        LockInfo PostlogCheckLock(int postLogId, int userId);
        //ErrorMessage ActualizeExecuteGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId);
        Task<ErrorMessage> ActualizeExecuteGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId);
        bool IsPostLogExists(int LoggedOnUserId, int SchedID, DateTime WeekDate);
        ErrorMessage PostLogMoveSpotData(int LoggedOnUserId, int PostLogId, int[] PostLogLineIdsFrom, int[] PostLogLineIdsTo);
        Task<ErrorMessage> PostLogRealTimeReport(int ClientId, int LoggedOnUserId);
        Task<ErrorMessage> AssignMirrorBuyType(int ClientId, int LoggedOnUserId);
    }
}
