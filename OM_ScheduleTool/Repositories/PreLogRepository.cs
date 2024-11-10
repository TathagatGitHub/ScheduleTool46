using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Dynamic;
using System.Linq;
using AppContext = OM_ScheduleTool.Models.AppContext;
using Dapper;
using OM_ScheduleTool.Dapper;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace OM_ScheduleTool.Repositories
{
    public class PreLogRepository : IPreLogRepository
    {
        private AppContext _context;
        protected StoredProcsContext _spcontext;
        private ILogger<PreLogRepository> _logger;

        public PreLogRepository(AppContext context
            , StoredProcsContext spcontext
            , ILogger<PreLogRepository> logger)
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
        }

        public dynamic GetPreAndPostLogWeeks(int BroadcastYr, int BroadcastQuarterNbr, int ClientId, int LoggedOnUserId)
        {
            IList<PRELOG_T> prelogs = new List<PRELOG_T>();
            IList<POSTLOG_T> postlogs = new List<POSTLOG_T>();
            int SchedID = 0;
            DbConnection conn = _spcontext.Database.GetDbConnection();
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }

            try
            {
                using (DbCommand command = conn.CreateCommand())
                {
                    command.CommandText = "sp_PreAndPostLog_GetWeeks";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@BroadcastYr", SqlDbType.Int);
                    param.Value = BroadcastYr;
                    command.Parameters.Add(param);
                    param = new SqlParameter("@BroadcastQuarterNbr", SqlDbType.Int);
                    param.Value = BroadcastQuarterNbr;
                    command.Parameters.Add(param);
                    param = new SqlParameter("@ClientId", SqlDbType.Int);
                    param.Value = ClientId;
                    command.Parameters.Add(param);
                    param = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                    param.Value = LoggedOnUserId;
                    command.Parameters.Add(param);

                    using (DbDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                            SchedID = int.Parse(reader[0].ToString());

                        if (reader.NextResult())
                        {
                            while (reader.Read())
                            {
                                var prelog = new PRELOG_T()
                                {
                                    PreLogId = reader["PreLogId"] == DBNull.Value ? 0 : int.Parse(reader["PreLogId"].ToString()),
                                    WeekDate = Convert.ToDateTime(reader["WeekDate"]),
                                    ScheduleName = reader["ScheduleName"].ToString(),
                                    CanEditPreLog = Convert.ToBoolean(reader["CanEditPreLog"]),
                                    PreLogLocked = reader["PreLogLocked"] == DBNull.Value ? false : Convert.ToBoolean(reader["PreLogLocked"]),
                                    PreLogLockedBy = reader["PreLogLockedBy"] == DBNull.Value ? 0 : int.Parse(reader["PreLogLockedBy"].ToString()),
                                    SchedId = reader["schedId"] == DBNull.Value ? 0 : int.Parse(reader["SchedId"].ToString()),
                                    WeekNbr = reader["WeekNbr"] == DBNull.Value ? 0 : int.Parse(reader["WeekNbr"].ToString())
                                };
                                if(prelog.PreLogLocked == true)
                                {
                                    prelog.PreLogLockedUser = _context.Users.Where(u => u.UserId == prelog.PreLogLockedBy).Single();
                                }
                                prelogs.Add(prelog);
                            }
                        }

                        if (reader.NextResult())
                        {
                            while (reader.Read())
                            {
                                POSTLOG_T plt = new POSTLOG_T();
                                plt.PostLogId = reader["PostLogId"] == DBNull.Value ? 0 : int.Parse(reader["PostLogId"].ToString());
                                plt.WeekDate = Convert.ToDateTime(reader["WeekDate"]);
                                plt.ScheduleName = reader["ScheduleName"].ToString();
                                plt.CanEditPostLog = Convert.ToBoolean(reader["CanEditPreLog"]);
                                plt.SchedId = reader["SchedID"] == DBNull.Value ? 0 : int.Parse(reader["SchedID"].ToString());
                                plt.WeekNbr = reader["WeekNbr"] == DBNull.Value ? 0 : int.Parse(reader["WeekNbr"].ToString());
                                if (reader["PostLogLockedBy"] != DBNull.Value)
                                {
                                    plt.PostLogLockedDt = DateTime.Parse(reader["PostLogLockedDt"].ToString());
                                    plt.PostLogLockedUser = _context.Users.Where(u => u.UserId == int.Parse(reader["PostLogLockedBy"].ToString())).Single();
                                }

                                postlogs.Add(plt);
                            }
                        }
                    }

                    dynamic expando = new ExpandoObject();
                    expando.SchedID = SchedID;
                    expando.prelogWeeks = prelogs;
                    expando.postlogWeeks = postlogs;
                    return expando;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError("Error in GetPreAndPostLogWeeks | BroadcastYr: " + BroadcastYr.ToString() + " BroadcastQuarterNbr " + BroadcastQuarterNbr + " ClientId: " + ClientId + exc.Message);
            }
            finally
            {
                conn.Close();
            }
            return null;
        }

        public bool CreatePreLog(int SchedID, int WeekNbr, DateTime WeekDate, int LoggedOnUserId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                Int32 retval = 0;
                string spName = "sp_PreLogCreate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("SchedID", SchedID, System.Data.DbType.Int32);
                dbparams.Add("WeekNbr", WeekNbr, System.Data.DbType.String);
                dbparams.Add("WeekDate", WeekDate, System.Data.DbType.Date);
                dbparams.Add("UserId", LoggedOnUserId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in CreatePreLog | SchedID: " + SchedID.ToString() + " WeekDate: " + WeekDate.ToString() + exc.Message);
                return false;
            }
        }

        public bool CanEditPreLog(int PreLogId, int ClientId, int LoggedOnUserId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                Int32 CanEditPreLog = 0;
                string spName = "sp_PreLogPermissions";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                CanEditPreLog = FactoryServices.dbFactory.SelectCommand_SP(CanEditPreLog, spName, dbparams);
                if (CanEditPreLog != null && CanEditPreLog >0)
                    return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in CanEditPreLog | PreLogId: " + PreLogId.ToString() + " ClientId: " + ClientId.ToString() + exc.Message);
            }
            return false;
        }
        public dynamic GetPreLogHeader(int PreLogId, int LoggedOnUserId)
        {
            try
            {
                dynamic expando = new ExpandoObject();
                var PreLog = _context.PRELOG_T.Where(x => x.PreLogId == PreLogId).Single();
                if (PreLog.UpdUserID != null)
                    PreLog.UpdUsr = _context.Users.Where(x => x.UserId == PreLog.UpdUserID).Select(x => x.DisplayName).Single();
                expando.PreLog = PreLog;
                var schedule = _context.Schedule.Where(x => x.ScheduleId == PreLog.SchedId).Single();
                expando.ScheduleName = schedule.ScheduleName;
                expando.ClientName = _context.Clients.Where(x => x.ClientId == schedule.ClientId).Select(x => x.ClientName).Single();


                return expando;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetPreLogHeader | PreLogId: " + PreLogId.ToString() + exc.Message);
                return false;
            }
        }

        public LockInfo LockPreLog(int preLogId, int userId)
        {
            LockInfo info = new LockInfo();
            bool success = false;
            try
            {
                var prelogItem = _context.PRELOG_T.Where(x => x.PreLogId == preLogId).SingleOrDefault();

                bool locked = prelogItem?.PreLogLocked ?? false;

                if(locked)
                {
                    var lockUser = _context.Users.Where(x => x.UserId == prelogItem.PreLogLockedBy.Value).FirstOrDefault();
                    info.LockedBy = string.Format("{0} {1}", lockUser?.FirstName, lockUser?.LastName);
                    info.LockTime = prelogItem?.PreLogLockedDte;
                    info.IsLocked = true;
                    info.LockedToOtherUser = lockUser.UserId != userId;
                }
                else
                {

                    UpdatePrelogFromScheduleAndNetwork(preLogId, prelogItem.SchedId, prelogItem.WeekNbr, userId);
                    //ST-946 Code Implementation with Dapper
                    ErrorMessage err = new ErrorMessage();
                    string spName = "sp_PreLog_Lock";
                    DynamicParameters dbparams = new DynamicParameters();
                    dbparams.Add("PreLogId", preLogId, System.Data.DbType.Int32);
                    dbparams.Add("LoggedOnUserId", userId, System.Data.DbType.Int32);
                    err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                    if (err.Success)
                    {
                        var lockUser = _context.Users.Where(x => x.UserId == userId).FirstOrDefault();
                        info.LockedBy = string.Format("{0} {1}", lockUser?.FirstName, lockUser?.LastName);
                        _context.Entry<PRELOG_T>(prelogItem).Reload();
                        info.LockTime = prelogItem.PreLogLockedDte;
                        info.LockedToOtherUser = false;
                        info.IsLocked = true;
                    }
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(userId, "Error in LockPreLog | PreLogId: " + preLogId.ToString() + exc.Message);
            }

            return info;
        }

        public bool UnLockPreLog(int preLogId, int LoggedOnUserId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                Int32 retval = 0;
                string spName = "sp_PreLog_Unlock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", preLogId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in UnLockPreLog | PreLogId: " + preLogId.ToString() + exc.Message);
                return false;
            }
            return true;
        }

        private bool UpdatePrelogFromScheduleAndNetwork(int preLogID, int SchedID, int WeekNbr, int LoggedOnUserId)
        {
            try
            {
                var preLogIdParam = new SqlParameter("@PreLogID", preLogID);
                var schedIDParam = new SqlParameter("@SchedID", SchedID);
                var weekNbrParam = new SqlParameter("@WeekNbr", WeekNbr);
                var loggedOnUserIdParam = new SqlParameter("@UserId", LoggedOnUserId);
                _spcontext.Database.SetCommandTimeout(2000);
                _spcontext.Database.ExecuteSqlRaw("exec UpdatePrelogFromScheduleAndNetwork @PreLogID, @SchedID, @WeekNbr, @UserId",
                    preLogIdParam, schedIDParam, weekNbrParam, loggedOnUserIdParam);
                return true;

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in UpdatePrelogFromScheduleAndNetwork | SchedID: " + SchedID.ToString() + " WeekNbr: " + WeekNbr.ToString() + exc.Message);
                return false;
            }
        }

        public bool ReplacePreLogLineTableFromNetworkLogs(int preLogID, int networkId, string logFileName, int LoggedOnUserId)
        {
            try
            {
                var preLogIdParam = new SqlParameter("@PreLogID", preLogID);
                var netIDParam = new SqlParameter("@NetID", networkId);
                var logFileParam = new SqlParameter("@LogFileName", logFileName);
                var loggedOnUserIdParam = new SqlParameter("@UserID", LoggedOnUserId);
                _spcontext.Database.ExecuteSqlRaw("exec ReplacePreLogLineTableFromNetworkLogs_SP @PreLogID, @NetID, @LogFileName, @UserID",
                    preLogIdParam, netIDParam, logFileParam, loggedOnUserIdParam);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in ReplacePreLogLineTableFromNetworkLogs | preLogID: " + preLogID.ToString() + " networkId: " + networkId.ToString() + exc.Message);
                return false;
            }
        }

        public bool AppendPreLogLineTableFromNetworkLogs(int preLogID, int networkId, string logFileName, int LoggedOnUserId)
        {
            try
            {
                var preLogIdParam = new SqlParameter("@PreLogID", preLogID);
                var netIDParam = new SqlParameter("@NetID", networkId);
                var logFileParam = new SqlParameter("@LogFileName", logFileName);
                var loggedOnUserIdParam = new SqlParameter("@UserID", LoggedOnUserId);
                _spcontext.Database.ExecuteSqlRaw("exec AppendPreLogLineTableFromNetworkLogs_SP @PreLogID, @NetID, @LogFileName, @UserID",
                    preLogIdParam, netIDParam, logFileParam, loggedOnUserIdParam);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AppendPreLogLineTableFromNetworkLogs | preLogID: " + preLogID.ToString() + " networkId: " + networkId.ToString() + exc.Message);
                return false;
            }
        }    

        public bool UpdatePreLogChangeDateUser(int preLogID, int LoggedOnUserId)
        {
            try
            {
                var prelog = _context.PRELOG_T.Find(preLogID);
                var user = _context.Users.Find(LoggedOnUserId);
                if (prelog != null && user != null) { 
                prelog.UpdDte = DateTime.Now;
                prelog.UpdUsr = user.DisplayName;
                prelog.UpdUserID = user.UserId;
                _context.SaveChanges();
                }
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in UpdatePreLogChangeDateUser | preLogID: " + preLogID.ToString() + exc.Message);
                return false;
            }
        }


        public IList<PreLogLine> GetPreLogLines(int PreLogId, int LoggedOnUserId, bool EditPreLog = false)
        {
            IList<PreLogLine> preLogLines = new List<PreLogLine>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLogLines_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("EditPreLog", EditPreLog, System.Data.DbType.Boolean);

                preLogLines = FactoryServices.dbFactory.SelectCommand_SP(preLogLines, spName, dbparams);
                if (preLogLines != null)
                {
                    foreach (var line in preLogLines)
                    {
                        if (line.Rate != null && line.CAConvRate != null)
                            line.USDGrossRate = Convert.ToDecimal(line.Rate) * Convert.ToDecimal(line.CAConvRate);
                        else
                            line.USDGrossRate = 0;
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in ViewPreLog | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            return preLogLines;
        }
        public IEnumerable<PreLogNote> GetNotes(int PreLogId, int LoggedOnUserId)
        {
            List<PreLogNote> preLogNotes = new List<PreLogNote>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLogNotes_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);

                preLogNotes = FactoryServices.dbFactory.SelectCommand_SP(preLogNotes, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetNotes | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return preLogNotes;
        }
        public IList<PreLogWeeklySummary> GetPreLogWeeklySummary(int PreLogId, int LoggedOnUserId)
        {
            IList<PreLogWeeklySummary> items = new List<PreLogWeeklySummary>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_WeeklySummary";
                List<PreLogWeeklySummary> lstProps = new List<PreLogWeeklySummary>();
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                items = FactoryServices.dbFactory.SelectCommand_SP(items, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetPreLogWeeklySummary | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            return items;
        }

        public IList<NetworkDeltaSummary> GetNetworkLogByPreLogSummary(int preLogId, int LoggedOnUserId)
        {
            IList<NetworkDeltaSummary> items = new List<NetworkDeltaSummary>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "GetNetworkLogByPreLogSummary_SP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", preLogId, System.Data.DbType.Int32);
                items = FactoryServices.dbFactory.SelectCommand_SP(items, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetNetworkLogByPreLogSummary | PreLogId: " + preLogId.ToString() + exc.Message);
            }
            return items;
        }

        public ErrorMessage EditPreLogLine(int[] PreLogLineIds, int PreLogId, int NetworkId, string PropertyName
          , bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday
          , string StartTime, string EndTime, int DayPartId, int SpotLen
          , int BuyTypeId, decimal RateAmt, decimal Impressions, string SpotDate, string SpotTime, string ProgramTitle, string ISCI, string Cleared, int LoggedOnUserId, string SPBuy)

        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {
                // ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int preLogLineId in PreLogLineIds)
                {
                    table.Rows.Add(preLogLineId);
                }
                List<UpfrontPermissions> upfronts = new List<UpfrontPermissions>();
                ErrorMessage em = new ErrorMessage();
                string spName = "sp_PreLog_EditPreLogLine";
                DynamicParameters dbparams = new DynamicParameters();

                dbparams.Add("PreLogLineIds", table.AsTableValuedParameter("dbo.SingleColumnId"));

                dbparams.Add("PreLogID", PreLogId, DbType.Int32);

                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);

                if (PropertyName != "")
                {
                    dbparams.Add("PropertyName", PropertyName, DbType.String);
                }
                dbparams.Add("Monday", Monday, DbType.Boolean);
                dbparams.Add("Tuesday", Tuesday, DbType.Boolean);
                dbparams.Add("Wednesday", Wednesday, DbType.Boolean);
                dbparams.Add("Thursday", Thursday, DbType.Boolean);
                dbparams.Add("Friday", Friday, DbType.Boolean);
                dbparams.Add("Saturday", Saturday, DbType.Boolean);
                dbparams.Add("Sunday", Sunday, DbType.Boolean);

                DateTime ParsedStartTime;
                if (DateTime.TryParse(StartTime, out ParsedStartTime) == true)
                {
                    dbparams.Add("StartTime", ParsedStartTime.ToLongTimeString(), DbType.DateTime);
                }

                DateTime ParsedEndTime;
                if (DateTime.TryParse(EndTime, out ParsedEndTime) == true)
                {
                    dbparams.Add("EndTime", ParsedEndTime.ToLongTimeString(), DbType.DateTime);
                }
                if (DayPartId > 0)
                {
                    dbparams.Add("DayPartId", DayPartId, DbType.Int32);
                }

                if (SpotLen > 0)
                {
                    dbparams.Add("SpotLen", SpotLen, DbType.Int32);
                }

                if (BuyTypeId > 0)
                {
                    dbparams.Add("BuyTypeId", SpotLen, DbType.Int32);
                }

                if (RateAmt >= 0)
                {
                    dbparams.Add("RateAmt", RateAmt, DbType.Int32);
                }

                if (Impressions >= 0)
                {
                    dbparams.Add("Impressions", Impressions, DbType.Int32);
                }
                dbparams.Add("ISCI", ISCI, DbType.String);
                dbparams.Add("SpotDate", SpotDate, DbType.String);
                dbparams.Add("SpotTime", SpotTime, DbType.String);
                dbparams.Add("ProgramTitle", ProgramTitle, DbType.String);
                dbparams.Add("Cleared", Cleared, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("SPBuy", SPBuy, DbType.String);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
                _logger.LogError(LoggedOnUserId, "Error in EditPreLogLine | PreLogId: " + PreLogId.ToString() + " PreLogLineIds: " + string.Join(", ", PreLogLineIds) + exc.Message);
            }
            finally
            {
            }
            return err;

        }

        public ErrorMessage PreLogSaveChanges(int PreLogId, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");

            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_SaveChanges";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("UserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
                _logger.LogError(LoggedOnUserId, "Error in PreLogSaveChanges | PreLogId: " + PreLogId.ToString() + exc.Message);
            }

            return err;
        }

        public ErrorMessage AddPreLogLine(int PropertyLineCount, int NetworkId, string PropertyName
          , bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday
          , string StartTime, string EndTime, int DayPartId, int SpotLen
          , int BuyTypeId, decimal RateAmt, decimal Impressions, string SpotDate, string SpotTime
          , string ISCI,string ProgramTitle, int LoggedOnUserId, int PreLogId, string SPBuy)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {                
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_AddPreLogLine";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PropertyLineCount", PropertyLineCount, System.Data.DbType.Int32);
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                dbparams.Add("Monday", Monday, System.Data.DbType.Boolean);
                dbparams.Add("Tuesday", Tuesday, System.Data.DbType.Boolean);
                dbparams.Add("Wednesday", Wednesday, System.Data.DbType.Boolean);
                dbparams.Add("Thursday", Thursday, System.Data.DbType.Boolean);
                dbparams.Add("Friday", Friday, System.Data.DbType.Boolean);
                dbparams.Add("Saturday", Saturday, System.Data.DbType.Boolean);
                dbparams.Add("Sunday", Sunday, System.Data.DbType.Boolean);                

                DateTime ParsedStartTime;
                if (DateTime.TryParse(StartTime, out ParsedStartTime) == true)
                {
                    dbparams.Add("StartTime", ParsedStartTime.ToLongTimeString(), System.Data.DbType.DateTime);
                }

                DateTime ParsedEndTime;
                if (DateTime.TryParse(EndTime, out ParsedEndTime) == true)
                {
                    dbparams.Add("EndTime", ParsedEndTime.ToLongTimeString()  , System.Data.DbType.DateTime);
                }
                if (DayPartId > 0)
                {
                    dbparams.Add("DayPartId", DayPartId, System.Data.DbType.Int32);
                }

                if (SpotLen > 0)
                {
                    dbparams.Add("SpotLen", SpotLen, System.Data.DbType.Int32);
                }

                if (BuyTypeId > 0)
                {
                    dbparams.Add("BuyTypeId", BuyTypeId, System.Data.DbType.Int32);
                }

                if (RateAmt >= 0)
                {
                    dbparams.Add("RateAmt", RateAmt, System.Data.DbType.Decimal);
                }
                
                if (Impressions >= 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.Decimal);
                }

                DateTime ParsedSpotDate;
                if (DateTime.TryParse(SpotDate, out ParsedSpotDate) == true)
                {
                    dbparams.Add("SpotDate", SpotDate, System.Data.DbType.Date);
                }

                DateTime ParsedSpotTime;
                if (DateTime.TryParse(SpotTime, out ParsedSpotTime) == true)
                {
                    dbparams.Add("SpotTime", SpotTime, System.Data.DbType.DateTime);
                }
                if (ISCI != null && ISCI.Length > 0)
                {
                    dbparams.Add("ISCI", ISCI, System.Data.DbType.String);
                }
                if (ProgramTitle != null && ProgramTitle.Length > 0)
                {
                    dbparams.Add("ProgramTitle", ProgramTitle, System.Data.DbType.String);
                }
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("SPBuy", SPBuy, System.Data.DbType.String);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
                _logger.LogError(LoggedOnUserId, "Error in AddPreLogLine | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return err;

        }

        public ErrorMessage PreLogAddDuplicateProperty(int PreLogId, int PreLogLineId, int PropertyDuplicateCount, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
           
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_InsertDuplicateRows";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("PreLogLineId", PreLogLineId, System.Data.DbType.Int32);
                dbparams.Add("DuplicateRowCount", PropertyDuplicateCount, System.Data.DbType.Int32);
                dbparams.Add("LoggedUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
                _logger.LogError(LoggedOnUserId, "Error in PreLogAddDuplicateProperty | PreLogId: " + PreLogId.ToString() + " PreLogLineId: " + PreLogLineId.ToString() + exc.Message);
            }
            finally
            {
            }

            return err;
        }


        public ErrorMessage AddPreLogNote(int LoggedOnUserId, int PreLogId, string Note)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
           
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_AddNote";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("Note", Note, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AddPreLogNote | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return err;
        }
        public ErrorMessage AddPreLogSubNote(int LoggedOnUserId, int PreLogNoteId, string Note)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_AddSubNote";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogNoteId", PreLogNoteId, System.Data.DbType.Int32);
                dbparams.Add("Note", Note, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AddPreLogSubNote | PreLogNoteId: " + PreLogNoteId.ToString() + exc.Message);
            }
            finally
            {
            }
            return err;

        }

        public IEnumerable<ClsISCI> GetValidISCIs(int LoggedOnUserId, int PreLogId)
        {
          
            List<ClsISCI> lst = new List<ClsISCI>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_GetValidISCIs";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                lst = FactoryServices.dbFactory.SelectCommand_SP(lst, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetValidISCIs | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return lst;

        }

        public ErrorMessage DeletePreLog(int LoggedOnUserId, int PreLogId)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_Delete";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in DeletePreLog | PreLogId: " + PreLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return err;
        }

        public ErrorMessage PreLogCopyPropertyDetails(int LoggedOnUserId,int PreLogId, int PreLogLineId,int[] PreLogLineIds)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                ////ST-946 Code Implementation with Dapper
                string spName = "sp_PreLog_CopyPropertyDetails";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, System.Data.DbType.Int32);
                dbparams.Add("PreLogLineId", PreLogLineId, System.Data.DbType.Int32);

                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int preLogLineId in PreLogLineIds)
                {
                    table.Rows.Add(preLogLineId);
                }
                dbparams.Add("@PreLogLineIds", table.AsTableValuedParameter("dbo.SingleColumnId"));
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PreLogCopyPropertyDetails | PreLogId: " + PreLogId.ToString() + " PreLogLineId: " + PreLogLineId + " PreLogLineIds: " + string.Join(", ", PreLogLineIds) + exc.Message);
            }
            finally
            {
            }
            return err;
        }


        public ErrorMessage PreLogClearSpotData(int LoggedOnUserId, int PreLogId, int[] PreLogLineIds)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                // ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int preLogLineId in PreLogLineIds)
                {
                    table.Rows.Add(preLogLineId);
                }
                List<UpfrontPermissions> upfronts = new List<UpfrontPermissions>();
                ErrorMessage em = new ErrorMessage();
                string spName = "sp_PreLog_ClearSpotData";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PreLogId", PreLogId, DbType.Int32);
                dbparams.Add("PreLogLineIds", table.AsTableValuedParameter("dbo.SingleColumnId"));

                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PreLogClearSpotData | PreLogId: " + PreLogId.ToString() + " PreLogLineIds: " + string.Join(", ", PreLogLineIds) + exc.Message);
            }
            finally
            {
               // conn.Close();
            }
            return err;
        }

        public IEnumerable<PRELOG_T> GetLockedPreLogs(int LoggedOnUserId)
        {
            var result = _context
                .PRELOG_T
                .Include(p => p.PreLogLockedUser)
                .Where(p => p.PreLogLockedBy != null)
                .ToList();
            return result.Join(_context.Schedule, a => a.SchedId, b => b.ScheduleId, (a, b) => new PRELOG_T
            {
                PreLogId = a.PreLogId,
                ScheduleName = b.ScheduleName,
                WeekDate = a.WeekDate,
                PreLogLockedUser = a.PreLogLockedUser,
                PreLogLockedDte = a.PreLogLockedDte
            }).ToList();
        }

        public bool IsPreLogExists(int LoggedOnUserId, int SchedID, DateTime WeekDate)
        {
            var result = false;
            try
            {
                if (_context.PRELOG_T.Where(p => p.SchedId == SchedID && p.WeekDate == WeekDate).ToList().Count() > 0)
                {
                    result = true;
                }
                else
                {
                    result = false;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in IsPreLogExists | SchedID: " + SchedID.ToString() + " WeekDate: " + WeekDate + exc.Message);
            }
            return result;


        }

        public ErrorMessage PreLogMoveSpotData(int LoggedOnUserId, int PreLogId, int[] PreLogLineIdsFrom, int[] PreLogLineIdsTo)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            DbConnection conn = _spcontext.Database.GetDbConnection();
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            try
            {
                using (DbCommand command = conn.CreateCommand())
                {
                    command.CommandText = "sp_PreLog_MoveSpotData";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter paramPreLogId = new SqlParameter("@PreLogId", SqlDbType.Int);
                    paramPreLogId.Value = PreLogId;
                    command.Parameters.Add(paramPreLogId);

                    DataTable tblPreLogLineIdsFrom = new DataTable();
                    tblPreLogLineIdsFrom.Columns.Add("id", typeof(int));
                    foreach (int PLineId in PreLogLineIdsFrom)
                    {
                        tblPreLogLineIdsFrom.Rows.Add(PLineId);
                    }
                    SqlParameter paramPLineIdsFrom = new SqlParameter("@PLineIdsFrom", SqlDbType.Structured);
                    paramPLineIdsFrom.TypeName = "dbo.SingleColumnId";
                    paramPLineIdsFrom.Value = tblPreLogLineIdsFrom;
                    command.Parameters.Add(paramPLineIdsFrom);

                    DataTable tblPreLogLineIdsTo = new DataTable();
                    tblPreLogLineIdsTo.Columns.Add("id", typeof(int));
                    foreach (int PLineId in PreLogLineIdsTo)
                    {
                        tblPreLogLineIdsTo.Rows.Add(PLineId);
                    }

                    SqlParameter paramPLineIdsTo = new SqlParameter("@PLineIdsTo", SqlDbType.Structured);
                    paramPLineIdsTo.TypeName = "dbo.SingleColumnId";
                    paramPLineIdsTo.Value = tblPreLogLineIdsTo;
                    command.Parameters.Add(paramPLineIdsTo);

                    SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                    paramLoggedOnUserId.Value = LoggedOnUserId;
                    command.Parameters.Add(paramLoggedOnUserId);

                    using (DbDataReader reader = command.ExecuteReader())
                    {
                        do
                        {
                            if (reader.Read())
                            {
                                err.Success = (bool)reader["Success"];
                                err.ResponseCode = int.Parse(reader["ResponseCode"].ToString());
                                err.ResponseText = reader["ResponseText"].ToString();
                            }
                        } while (err.Success && reader.NextResult());

                    }
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PreLogMoveSpotData | PreLogId: " + PreLogId.ToString() + " PreLogLineIdsFrom: " + string.Join(", ", PreLogLineIdsFrom) + " PreLogLineIdsTo: " + string.Join(", ", PreLogLineIdsTo) + exc.Message);
            }
            finally
            {
                conn.Close();
            }
            return err;
        }
    }
}

