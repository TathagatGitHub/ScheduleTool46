using System;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using OM_ScheduleTool.Models;
using System.Linq;
using System.Dynamic;
using OM_ScheduleTool.Helpers;
using System.Text;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using AppContext = OM_ScheduleTool.Models.AppContext;
using Dapper;
using OM_ScheduleTool.Dapper;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using Microsoft.VisualStudio.Web.CodeGeneration.Design;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;

namespace OM_ScheduleTool.Repositories
{
    public class PostLogRepository : IPostLogRepository
    {
        private AppContext _context;
        protected StoredProcsContext _spcontext;
        private ILogger<PostLogRepository> _logger;
        private IConfiguration _config;

        public PostLogRepository(AppContext context
            , StoredProcsContext spcontext
            , ILogger<PostLogRepository> logger
            , IConfiguration config)
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
            _config = config;
        }

        public IEnumerable<POSTLOG_T> GetPostLogWeeks(int BroadcastYr, int BroadcastQuarterNbr, int ClientId)
        {
            IList<POSTLOG_T> result = new List<POSTLOG_T>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_GetWeeks";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("BroadcastYr", BroadcastYr, System.Data.DbType.Int32);
                dbparams.Add("BroadcastQuarterNbr", BroadcastQuarterNbr, System.Data.DbType.Int32);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                result = FactoryServices.dbFactory.SelectCommand_SP(result, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError("Error in GetPostLogWeeks | BroadcastYr: " + BroadcastYr.ToString() + " BroadcastQuarterNbr " + BroadcastQuarterNbr + exc.Message);
            }
            finally
            {
            }
            return result;
        }

        public dynamic GetPostLogHeader(int PostLogId, int LoggedOnUserId)
        {
            try
            {
                dynamic expando = new ExpandoObject();
                var PostLog = _context
                    .POSTLOG_T
                    .Include(s => s.Schedule)
                    .Include(c => c.Schedule.Client)
                    .Include(x => x.UpdatedBy)
                    .Include(x => x.ActualizedBy)
                    .Include(l => l.PostLogLockedUser)
                    .Include(a => a.UpdatedBy)
                    .Where(x => x.PostLogId == PostLogId).Single();
                //if (PostLog.UpdUserID != null)
                //PostLog.UpdatedBy = _context.Users.Where(x => x.UserId == LoggedOnUserId).Select(x => x.DisplayName).Single();
                expando.PostLog = PostLog;
                var schedule = _context.Schedule.Where(x => x.ScheduleId == PostLog.SchedId).Single();
                //expando.ScheduleName = schedule.ScheduleName;
                expando.ClientName = _context.Clients.Where(x => x.ClientId == schedule.ClientId).Select(x => x.ClientName).Single();


                return expando;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetPostLogHeader | PostLogId: " + PostLogId.ToString() + exc.Message);
                return false;
            }
        }

        public IList<POSTLOG_LINE_T> GetPostLogLines(int PostLogId, int LoggedOnUserId)
        {
            return _context.POSTLOG_LINE_T
                .Where(pl => pl.PostLog.PostLogId == PostLogId)
                .Include(n => n.Network)
                .Include(p => p.Property)
                .Include(dp => dp.DayPart)
                .Include(r => r.Rate)
                .Include(bt => bt.BuyType)
                .Include(mt => mt.MediaType)
                .Include(dp => dp.DayPart)
                .OrderBy(pl => pl.Network.StdNetName).ThenBy(pl => pl.SpotDate)
                .ToList<POSTLOG_LINE_T>();
        }

        public ErrorMessage AddPostLogLine(int PropertyLineCount, int NetworkId, string PropertyName
            , bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday
            , string StartTime, string EndTime, int DayPartId, int SpotLen
            , int BuyTypeId, decimal RateAmt, decimal Impressions, string SpotDate, string spotTime
            , int MediaTypeId, string ISCI, string SigmaProgramName,
            string ProgramTitle, int LoggedOnUserId, int PostLogId, string SPBuy)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_AddPostLogLine";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("PropertyLineCount", PropertyLineCount, System.Data.DbType.Int32);
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                dbparams.Add("Monday", Monday, System.Data.DbType.Boolean);
                dbparams.Add("Tuesday", Tuesday, System.Data.DbType.Boolean);
                dbparams.Add("Wednesday", Wednesday, System.Data.DbType.Boolean);
                dbparams.Add("Thursday", Thursday, System.Data.DbType.Boolean);
                dbparams.Add("Friday", Friday, System.Data.DbType.Boolean);
                dbparams.Add("Saturday", Saturday, System.Data.DbType.Boolean);
                dbparams.Add("Sunday", Sunday, System.Data.DbType.Boolean);
                dbparams.Add("StartTime", StartTime, System.Data.DbType.String);
                dbparams.Add("EndTime", EndTime, System.Data.DbType.String);
                dbparams.Add("DayPartId", DayPartId, System.Data.DbType.Int32);
                dbparams.Add("SpotLen", SpotLen, System.Data.DbType.Int32);

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
                if (DateTime.TryParse(spotTime, out ParsedSpotTime) == true)
                {
                    dbparams.Add("SpotTime", spotTime, System.Data.DbType.DateTime);
                }

                if (MediaTypeId != 0)
                {
                    dbparams.Add("MediaTypeId", MediaTypeId, System.Data.DbType.Int32);
                }

                if (ISCI != null && ISCI.Length > 0)
                {
                    dbparams.Add("ISCI", ISCI, System.Data.DbType.String);
                }

                if (SigmaProgramName != null && SigmaProgramName.Length > 0)
                {
                    dbparams.Add("SigmaProgramName", SigmaProgramName, System.Data.DbType.String);
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

            }
            finally
            {
            }
            return err;
        }


        public ErrorMessage EditPostLogLine(int[] PostLogLineIds, int networkId, string propertyName
            , int Monday, int Tuesday, int Wednesday, int Thursday, int Friday, int Saturday, int Sunday
            , string StartTime, string EndTime, int DayPartId, int SpotLen
            , int BuyTypeId, decimal RateAmt, decimal Impressions
            , string SpotDate, string SpotTime, int MediaTypeId, string ProgramTitle, string ISCI, string clearedPlaced, string SigmaProgram, int scheduleId
            , int LoggedOnUserId, string SPBuy)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            DbConnection conn = _spcontext.Database.GetDbConnection();
            try
            {
                // ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int postLogLineId in PostLogLineIds)
                {
                    table.Rows.Add(postLogLineId);
                }
                string spName = "sp_PostLog_EditPostLogLine";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PLineIds", table.AsTableValuedParameter("dbo.SingleColumnId"));

                if (networkId > 0)
                {
                    dbparams.Add("NetworkId", networkId, DbType.Int32);

                }

                if (propertyName != "")
                {
                    dbparams.Add("PropertyName", propertyName, DbType.String);
                }

                if (Monday >= 0)
                {
                    dbparams.Add("Monday", (Monday == 1 ? true : false), DbType.Boolean);

                }

                if (Tuesday >= 0)
                {
                    dbparams.Add("Tuesday", (Tuesday == 1 ? true : false), DbType.Boolean);
                }

                if (Wednesday >= 0)
                {
                    dbparams.Add("Wednesday", (Wednesday == 1 ? true : false), DbType.Boolean);
                }

                if (Thursday >= 0)
                {
                    dbparams.Add("Thursday", (Thursday == 1 ? true : false), DbType.Boolean);
                }

                if (Friday >= 0)
                {
                    dbparams.Add("Friday", (Friday == 1 ? true : false), DbType.Boolean);
                }

                if (Saturday >= 0)
                {
                    dbparams.Add("Saturday", (Saturday == 1 ? true : false), DbType.Boolean);
                }

                if (Sunday >= 0)
                {
                    dbparams.Add("Sunday", (Sunday == 1 ? true : false), DbType.Boolean);
                }
                dbparams.Add("StartTime", StartTime, DbType.String);
                dbparams.Add("EndTime", EndTime, DbType.String);


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
                    dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                }

                if (RateAmt >= 0)
                {
                    dbparams.Add("RateAmt", RateAmt, DbType.Decimal);
                }

                if (Impressions >= 0)
                {
                    dbparams.Add("Impressions", Impressions, DbType.Decimal);
                }

                if (MediaTypeId > 0)
                {
                    dbparams.Add("MediaTypeId", MediaTypeId, DbType.Int32);
                }

                if (ISCI != null)
                {
                    dbparams.Add("ISCI", ISCI, DbType.String);
                }

                dbparams.Add("SpotDate", SpotDate, DbType.String);

                dbparams.Add("SpotTime", SpotTime, DbType.String);

                if (ProgramTitle != null)
                {
                    dbparams.Add("ProgramTitle", ProgramTitle, DbType.String);
                }
                if (SigmaProgram != null)
                {
                    dbparams.Add("SigmaProgramName", SigmaProgram, DbType.String);
                }
                dbparams.Add("ClearedPlaced", clearedPlaced, DbType.String);
                dbparams.Add("ScheduleId", scheduleId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("SPBuy", SPBuy, DbType.String);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;

            }
            finally
            {
                // conn.Close();
            }
            return err;

        }

        public ErrorMessage Unlock(int PostLogId, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_Unlock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                //  err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                Int32 retval = 0;
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                err.Success = true;
                err.ResponseCode = 1;
                err.ResponseText = "";
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;

            }
            return err;
        }

        public IEnumerable<POSTLOG_T> GetLockedPostLogs(int LoggedOnUserId)
        {
            return _context
                .POSTLOG_T
                .Include(p => p.PostLogLockedUser)
                .Include(s => s.Schedule)
                .Where(u => u.PostLogLockedBy != null)
                .ToList();
        }

        public bool UpdatePostlogFromScheduleAndNetwork(int postlogId, int schedId, int weekNbr, int loggedOnUserId)
        {
            try
            {
                var postLogIdParam = new SqlParameter("@PostLogID", postlogId);
                var schedIDParam = new SqlParameter("@SchedID", schedId);
                var weekNbrParam = new SqlParameter("@WeekNbr", weekNbr);
                var loggedOnUserIdParam = new SqlParameter("@UserId", loggedOnUserId);
                _spcontext.Database.SetCommandTimeout(2000);
                _spcontext.Database.ExecuteSqlRaw("exec dbo.UpdatePostlogFromScheduleAndNetwork @PostLogID, @SchedID, @WeekNbr, @UserId",
                    postLogIdParam, schedIDParam, weekNbrParam, loggedOnUserIdParam);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(loggedOnUserId, "Error in UpdatePostlogFromScheduleAndNetwork | postlogId: " + postlogId + " schedId: " + schedId.ToString() + " weekNbr: " + weekNbr.ToString() + exc.Message);
                return false;
            }
        }


        public IList<POSTLOG_LINE_T> GetPostLogLinesFromSP(int PostLogId, int LoggedOnUserId, bool Lock, int? PLineID)
        //public IList<POSTLOG_LINE_T> GetPostLogLinesFromSP(int PostLogId, int LoggedOnUserId, bool Lock, Guid? PostLogLineId)
        {
            IList<POSTLOG_LINE_T> result = new List<POSTLOG_LINE_T>();
            DbConnection conn = _spcontext.Database.GetDbConnection();
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }

            try
            {
                using (DbCommand command = conn.CreateCommand())
                {
                    command.CommandTimeout = 2000;
                    command.CommandText = "sp_PostLog_GetPostLogLines";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@PostLogId", SqlDbType.Int);
                    param.Value = PostLogId;
                    command.Parameters.Add(param);

                    param = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                    param.Value = LoggedOnUserId;
                    command.Parameters.Add(param);

                    param = new SqlParameter("@Lock", SqlDbType.Bit);
                    param.Value = Lock;
                    command.Parameters.Add(param);

                    // Sometimes, we allow for postloglineid.  This way the stored proc will only return
                    // the editted row(s)
                    // If this is null, all rows in the postlog will be returned.

                    //if (PostLogLineId != null)
                    //{
                    //    param = new SqlParameter("@PostLogLineId", SqlDbType.Int);
                    //    param.Value = PostLogLineId;
                    //    command.Parameters.Add(param);
                    //}

                    if (PLineID != null)
                    {
                        param = new SqlParameter("@PLineId", SqlDbType.Int);
                        param.Value = PLineID;
                        command.Parameters.Add(param);
                    }
                    using (DbDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            try
                            {
                                POSTLOG_LINE_T plt = new POSTLOG_LINE_T();

                                // Network should never be NULL
                                plt.Network = new Network()
                                {
                                    NetworkId = (int)reader["NetworkId"],
                                    StdNetName = reader["StdNetName"].ToString()
                                };

                                plt.PLineID = (int)reader["PLineID"];
                                //plt.PostLogLineId = Guid.Parse(reader["PostLogLineId"].ToString());
                                plt.PostLog = new POSTLOG_T()
                                {
                                    PostLogId = (int)reader["PostLogId"]
                                };
                                plt.ScheduleLine = (reader["ScheduleLineId"] == DBNull.Value ? null :
                                    new ScheduleLine()
                                    {
                                        ScheduleLineId = (int)reader["ScheduleLineId"]
                                    }
                                );

                                if (reader["ScheduleId"] != DBNull.Value)
                                {
                                    plt.ScheduleId = (int)reader["ScheduleId"];
                                }
                                else if (reader["ScheduleId"] == DBNull.Value && reader["Placed"] != DBNull.Value) //condition for identifying Netwroklines
                                {
                                    plt.ScheduleId = 0;
                                }
                                else //condition for identifying New added and saved lines
                                {
                                    plt.ScheduleId = -1;
                                }


                                //else if (reader["Placed"] != DBNull.Value)
                                //{
                                //    plt.ScheduleId = 0;
                                //}
                                //else
                                //{
                                //    plt.ScheduleId = -1;
                                //}


                                plt.Approved = (bool)reader["Approved"];
                                // DoNotBuy = reader["DoNotBuy"].ToString(),

                                plt.Property = (reader["PropertyId"] == DBNull.Value ?
                                    new Property()
                                    {
                                        PropertyId = 0,
                                        PropertyName = (reader["PropertyName"] == DBNull.Value ? "" : reader["PropertyName"].ToString()),
                                        Monday = (reader["Monday"] == DBNull.Value ? false : (bool)reader["Monday"]),
                                        Tuesday = (reader["Tuesday"] == DBNull.Value ? false : (bool)reader["Tuesday"]),
                                        Wednesday = (reader["Wednesday"] == DBNull.Value ? false : (bool)reader["Wednesday"]),
                                        Thursday = (reader["Thursday"] == DBNull.Value ? false : (bool)reader["Thursday"]),
                                        Friday = (reader["Friday"] == DBNull.Value ? false : (bool)reader["Friday"]),
                                        Saturday = (reader["Saturday"] == DBNull.Value ? false : (bool)reader["Saturday"]),
                                        Sunday = (reader["Sunday"] == DBNull.Value ? false : (bool)reader["Sunday"])
                                    }
                                    :
                                    new Property()
                                    {
                                        PropertyId = (int)reader["PropertyId"],
                                        PropertyName = reader["PropertyName"].ToString(),
                                        Monday = (bool)reader["Monday"],
                                        Tuesday = (bool)reader["Tuesday"],
                                        Wednesday = (bool)reader["Wednesday"],
                                        Thursday = (bool)reader["Thursday"],
                                        Friday = (bool)reader["Friday"],
                                        Saturday = (bool)reader["Saturday"],
                                        Sunday = (bool)reader["Sunday"],
                                        // StartTime = reader.GetDateTime(reader.GetOrdinal("StartTime")).TimeOfDay,
                                        //EndTime = reader.GetDateTime(reader.GetOrdinal("EndTime")).TimeOfDay
                                    }
                                );
                              
                                plt.StartTime = (reader["StartTime"] == DBNull.Value ? (DateTime?)null : DateTime.Parse(reader["StartTime"].ToString()));
                                plt.EndTime = (reader["EndTime"] == DBNull.Value ? (DateTime?)null : DateTime.Parse(reader["EndTime"].ToString()));

                                plt.DayPartCd = reader.GetSafeString("DayPartCd");
                                plt.DayPartId = (reader["DayPartId"] == DBNull.Value ? 0 : (int?)reader["DayPartId"]);

                                plt.DayPart = (reader["DayPartId"] == DBNull.Value ?
                                    new DayPart()
                                    {
                                        DayPartId = 0,
                                        DayPartCd = "",
                                        DayPartDesc = ""
                                    }
                                    :
                                    new DayPart()
                                    {
                                        DayPartId = (int)reader["DayPartId"],
                                        DayPartCd = reader["DayPartCd"].ToString(),
                                        DayPartDesc = reader["DayPartDesc"].ToString()
                                    }
                                );

                                if (plt.DayPartCd != null)
                                {
                                    switch (plt.DayPartCd.Trim().ToUpper())
                                    {
                                        case "M":
                                            plt.DayPart.DayPartDesc = "Morning";
                                            break;
                                        case "D":
                                            plt.DayPart.DayPartDesc = "Day";
                                            break;
                                        case "F":
                                            plt.DayPart.DayPartDesc = "Fringe";
                                            break;
                                        case "P":
                                            plt.DayPart.DayPartDesc = "Prime";
                                            break;
                                        case "L":
                                            plt.DayPart.DayPartDesc = "Latenight";
                                            break;
                                        case "O":
                                            plt.DayPart.DayPartDesc = "Overnight";
                                            break;
                                        case "W":
                                            plt.DayPart.DayPartDesc = "Weekend";
                                            break;
                                        case "R":
                                            plt.DayPart.DayPartDesc = "Rotation";
                                            break;
                                    }
                                }

                                plt.BuyTypeId = (reader["BuyTypeId"] == DBNull.Value ? 0 : (int?)reader["BuyTypeId"]);
                                plt.BuyTypeCode = reader.GetSafeString("BuyTypeCode");

                                //plt.BuyType = (reader["BuyTypeId"] == DBNull.Value ?
                                //plt.BuyType = (reader["BuyTypeCode"] == DBNull.Value ?
                                //    new BuyType()
                                //    {
                                //        BuyTypeId = 0,
                                //        BuyTypeCode = "",
                                //        BuyTypeDescription = ""
                                //    } :
                                //    new BuyType()
                                //    {
                                //        BuyTypeId = reader["BuyTypeId"] == DBNull.Value ? (int)reader["BuyTypeId"] : 0,
                                //        BuyTypeCode = reader["BuyTypeCode"].ToString(),
                                //        BuyTypeDescription = reader["BuyTypeDescription"] == DBNull.Value ? reader["BuyTypeDescription"].ToString() : "" 
                                //    }
                                //);


                                //plt.Rate = (reader["RateId"] == DBNull.Value ?
                                //    new Rate()
                                //    {
                                //        RateId = 0,
                                //        RateAmt = 0,
                                //        SpotLen = 0,
                                //        Impressions = 0
                                //    }
                                //    :
                                //    new Rate()
                                //    {
                                //        RateId = (int)reader["RateId"],
                                //        RateAmt = (decimal)reader["RateAmt"],
                                //        SpotLen = (int)reader["SpotLen"],
                                //        Impressions = decimal.Parse(reader["Impressions"].ToString())
                                //    }
                                //);

                                plt.RateId = (reader["RateId"] == DBNull.Value ? null : (int?)reader["RateId"]);


                                plt.RateAmount = (reader["RateAmt"] == DBNull.Value ? (decimal?)null : decimal.Parse(reader["RateAmt"].ToString()));
                                plt.ClientRate = (reader["ClientRate"] == DBNull.Value ? (decimal?)null : decimal.Parse(reader["ClientRate"].ToString()));
                                //plt.RateAmount = (reader["RateAmt"] == DBNull.Value ? (decimal?)null : decimal.Parse(reader["FullRate"].ToString()));
                                plt.SpotLen = (reader["SpotLen"] == DBNull.Value ? null : (int?)reader["SpotLen"]);
                                //plt.Impressions = (reader["Impressions"] == DBNull.Value ? (decimal?)null : decimal.Parse(reader["Impressions"].ToString()));
                                plt.Imp = (reader["Impressions"] == DBNull.Value ? (decimal?)null : decimal.Parse(reader["Impressions"].ToString()));

                                plt.SpotDate = (reader["SpotDate"] == DBNull.Value ? (DateTime?)null : DateTime.Parse(reader["SpotDate"].ToString()));
                                // ST-699 Commented By Shariq due to SpotTime
                                //if (reader["SpotTime"].ToString() != "00:00:00")
                                //{
                                //    plt.SpotTime = (reader["SpotTime"] == DBNull.Value ? (DateTime?)null : DateTime.Parse(reader["SpotTime"].ToString()));
                                //}
                                //ST-699 Added the logic below for SpotTime
                                plt.SpotTime = (reader["SpotTime"] == DBNull.Value ? (DateTime?)null : DateTime.Parse(reader["SpotTime"].ToString()));

                                plt.MediaType = (reader["MediaTypeId"] == DBNull.Value ?
                                    //new MediaType()
                                    //{
                                    //    MediaTypeId = 0,
                                    //    MediaTypeCode = reader["MediaTypeCode"].ToString(),
                                    //    MediaTypeName = reader["MediaTypeName"].ToString()
                                    //} 
                                    new MediaType()
                                    {
                                        MediaTypeId = 0,
                                        MediaTypeCode = "",
                                        MediaTypeName = ""
                                    }
                                    :
                                    new MediaType()
                                    {
                                        MediaTypeId = (int)reader["MediaTypeId"],
                                        MediaTypeCode = reader["MediaTypeCode"].ToString(),
                                        MediaTypeName = reader["MediaTypeName"].ToString()
                                    }
                                );

                                if (reader["ISCI"] != DBNull.Value)
                                {
                                    plt.ISCI = reader["ISCI"].ToString();
                                }

                                if (reader["ProgramTitle"] != DBNull.Value)
                                {
                                    plt.ProgramTitle = reader["ProgramTitle"].ToString();
                                }
                                else
                                {
                                    plt.ProgramTitle = "";
                                }
                                try
                                {
                                    plt.Cleared = (bool)reader["cleared"];
                                }
                                catch { }
                                try
                                {
                                    plt.Scheduled = (bool)reader["scheduled"];
                                }
                                catch { }
                                try
                                {
                                    plt.Placed = (bool)reader["Placed"];
                                }
                                catch { }
                                try
                                {
                                    plt.UpdDte = DateTime.Parse(reader["UpdDte"].ToString());
                                }
                                catch { }
                                try
                                {
                                    plt.UpdUserID = (reader["UpdUserID"] == DBNull.Value ? (int?)null : (int)reader["UpdUserID"]);
                                }
                                catch { }
                                plt.PoorSeparation = int.Parse(reader["PoorSeparation"].ToString()) == 0 ? false : true;
                                plt.OutOfDayPart = (bool)reader["OutOfDayPart"];
                                try
                                {
                                    plt.SigmaProgramName = reader["SigmaProgramName"].ToString();
                                }
                                catch { }
                                try
                                {
                                    plt.OrigSpotDate = DateTime.Parse(reader["OrigSpotDate"].ToString());
                                }
                                catch { }
                                try
                                {
                                    plt.OrigSpotTime = DateTime.Parse(reader["OrigSpotTime"].ToString());
                                }
                                catch { }
                                try
                                {
                                    plt.OrigISCI = reader["OrigISCI"].ToString();
                                }
                                catch { }
                                try
                                {
                                    plt.OrigProgramTitle = reader["OrigProgramTitle"].ToString();
                                }
                                catch { }
                                try
                                {
                                    plt.Sp_Buy = reader["Sp_Buy"].ToString();
                                }
                                catch { }

                                if (reader["OMDP"] != DBNull.Value)
                                {
                                    plt.OMDP = reader["OMDP"].ToString();
                                }

                                if (reader["CommRate"] == DBNull.Value)
                                    plt.CommRate = null;
                                else
                                    plt.CommRate = reader["CommRate"].ToString() + "%";


                                plt.NetworkLogId = (reader["NetworkLogId"] == DBNull.Value ? null : (int?)reader["NetworkLogId"]);

                                plt.CAConvRate = (reader["CAConvRate"] == DBNull.Value ? (decimal?)null : decimal.Parse(reader["CAConvRate"].ToString()));

                                plt.USDGrossRate = plt.CAConvRate * plt.ClientRate;

                                plt.IsValidISCI = (bool)reader["IsValidISCI"];
                                plt.OmdpSpotDateTime = reader["OMDPSpotDateTime"].ToString();
                                plt.ChildPropertyId = (reader["ChildPropertyId"] == DBNull.Value ? (int?)null : (int)reader["ChildPropertyId"]);
                                //ST-1117 Added Follwoing Lines by Shariq
                                plt.IsChildPropertyId = Convert.ToBoolean(reader["IsChildPropertyId"]);
                                plt.IsDOWChanged = Convert.ToBoolean(reader["IsDOWChanged"]);
                                plt.IsTimeChanged = Convert.ToBoolean(reader["IsTimeChanged"]);

                                result.Add(plt);
                            }
                            catch (Exception exc)
                            {
                                _logger.LogError("Error in sp_PostLog_GetPostLogLines | PostLogId: " + PostLogId.ToString() + " User: " + LoggedOnUserId.ToString() + " | " + exc.Message);
                            }
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError("Error in sp_PostLog_GetPostLogLines | PostLogId: " + PostLogId.ToString() + " User: " + LoggedOnUserId.ToString() + " | " + exc.Message);
            }
            finally
            {
                conn.Close();
            }
            return result;
        }




        public bool ReplacePostLogLineTableFromNetworkLogs(int postLogID, int networkId, string logFileName, int LoggedOnUserId)
        {
            try
            {
                var postLogIdParam = new SqlParameter("@PostLogID", postLogID);
                var netIDParam = new SqlParameter("@NetID", networkId);
                var logFileParam = new SqlParameter("@LogFileName", logFileName);
                var loggedOnUserIdParam = new SqlParameter("@UserID", LoggedOnUserId);
                _spcontext.Database.ExecuteSqlRaw("exec ReplacePostLogLineTableFromNetworkLogs_SP @PostLogID, @NetID, @LogFileName, @UserID",
                    postLogIdParam, netIDParam, logFileParam, loggedOnUserIdParam);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in ReplacePostLogLineTableFromNetworkLogs | postLogID: " + postLogID.ToString() + " networkId: " + networkId.ToString() + exc.Message);
                return false;
            }
        }

        public bool AppendPostLogLineTableFromNetworkLogs(int postLogID, int networkId, string logFileName, int LoggedOnUserId)
        {
            try
            {
                var postLogIdParam = new SqlParameter("@PostLogID", postLogID);
                var netIDParam = new SqlParameter("@NetID", networkId);
                var logFileParam = new SqlParameter("@LogFileName", logFileName);
                var loggedOnUserIdParam = new SqlParameter("@UserID", LoggedOnUserId);
                _spcontext.Database.ExecuteSqlRaw("exec AppendPostLogLineTableFromNetworkLogs_SP @PostLogID, @NetID, @LogFileName, @UserID",
                    postLogIdParam, netIDParam, logFileParam, loggedOnUserIdParam);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AppendPostLogLineTableFromNetworkLogs | postLogID: " + postLogID.ToString() + " networkId: " + networkId.ToString() + exc.Message);
                return false;
            }
        }

        public bool UpdatePostLogChangeDateUser(int postLogID, int LoggedOnUserId)
        {
            try
            {
                var postlog = _context.POSTLOG_T.Find(postLogID);
                postlog.UpdateDt = DateTime.Now;
                postlog.UpdatedBy = _context.Users.Find(LoggedOnUserId);
                _context.SaveChanges();
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in UpdatePostLogChangeDateUser | postLogID: " + postLogID.ToString() + exc.Message);
                return false;
            }
        }

        public bool IsActualized(int schedId, int weekNbr, int LoggedOnUserId)
        {
            try
            {
                var sched_lock = _context.SCHED_WEEK_LOCK_T.Where(x => x.SchedId == schedId).FirstOrDefault();
                bool result = false;

                if (sched_lock != null)
                {
                    switch (weekNbr)
                    {
                        case 1:
                            result = sched_lock.Wk01_Lock;
                            break;
                        case 2:
                            result = sched_lock.Wk02_Lock;
                            break;
                        case 3:
                            result = sched_lock.Wk03_Lock;
                            break;
                        case 4:
                            result = sched_lock.Wk04_Lock;
                            break;
                        case 5:
                            result = sched_lock.Wk05_Lock;
                            break;
                        case 6:
                            result = sched_lock.Wk06_Lock;
                            break;
                        case 7:
                            result = sched_lock.Wk07_Lock;
                            break;
                        case 8:
                            result = sched_lock.Wk08_Lock;
                            break;
                        case 9:
                            result = sched_lock.Wk09_Lock;
                            break;
                        case 10:
                            result = sched_lock.Wk10_Lock;
                            break;
                        case 11:
                            result = sched_lock.Wk11_Lock;
                            break;
                        case 12:
                            result = sched_lock.Wk12_Lock;
                            break;
                        case 13:
                            result = sched_lock.Wk13_Lock;
                            break;
                        case 14:
                            result = sched_lock.Wk14_Lock;
                            break;
                        default:
                            result = false;
                            break;
                    }
                }
                return result;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in IsActualized | schedId: " + schedId.ToString() + " weekNbr: " + weekNbr + exc.Message);
                return false;
            }
        }

        public IList<NetworkDeltaSummary> GetNetworkLogByPostLogSummary(int postLogId, int LoggedOnUserId)
        {
            IList<NetworkDeltaSummary> items = new List<NetworkDeltaSummary>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "GetNetworkLogByPostLogSummary_SP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", postLogId, System.Data.DbType.Int32);
                items = FactoryServices.dbFactory.SelectCommand_SP(items, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetNetworkLogByPreLogSummary | PostLogID: " + postLogId.ToString() + exc.Message);
            }
            return items;
        }

        public bool CreatePostLog(int SchedID, int WeekNbr, DateTime WeekDate, int LoggedOnUserId)
        {
            try
            {
                var schedIdParam = new SqlParameter("@SchedID", SchedID);
                var weekNbrParam = new SqlParameter("@WeekNbr", WeekNbr);
                var weekDateParam = new SqlParameter("@WeekDate", WeekDate);
                var loggedOnUserIdParam = new SqlParameter("@UserID", LoggedOnUserId);
                _spcontext.Database.ExecuteSqlRaw("exec sp_PostLogCreate @SchedID, @WeekNbr, @WeekDate, @UserID",
                    schedIdParam, weekNbrParam, weekDateParam, loggedOnUserIdParam);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in CreatePostLog | SchedID: " + SchedID.ToString() + " WeekNbr: " + WeekNbr.ToString() + exc.Message);
                return false;
            }
        }

        public IList<PostLogLine> GetPostLogLinesNew(int postLogId, int LoggedOnUserId)
        {
            IList<PostLogLine> postLogLines = new List<PostLogLine>();
            //IList<PostLogLine> postLogLines2 = new List<PostLogLine>();
            try
            {
                //using (DbConnection conn = _spcontext.Database.GetDbConnection())
                //{
                //    if (conn.State == ConnectionState.Closed)
                //    {
                //        conn.Open();
                //    }

                //    DbCommand command = conn.CreateCommand();
                //    command.CommandText = "sp_PostLogLines_Get";
                //    command.CommandType = CommandType.StoredProcedure;

                //    SqlParameter param = new SqlParameter("@PostLogID", SqlDbType.Int);
                //    param.Value = postLogId;
                //    command.Parameters.Add(param);

                //    using (DbDataReader reader = command.ExecuteReader())
                //    {
                //        while (reader.Read())
                //        {
                //            var line = new PostLogLine();
                //            line.PLineID = Convert.ToInt32(reader["PLineID"]);
                //            //line.PostLogLineId = Guid.Parse(reader["PostLogLineID"].ToString());
                //            line.PostLogId = reader.GetSafeInt("PostLogID");
                //            line.Approved = reader.GetSafeBool("Approved");
                //            line.NetId = reader.GetSafeInt("NetworkId");
                //            line.StdNetName = reader.GetSafeString("StdNetName");
                //            line.PropId = reader.GetSafeInt("PropertyID");
                //            line.PropertyName = reader.GetSafeString("PropertyName");
                //            line.Mon = reader.GetSafeString("MON") == "1" ? true : false;
                //            line.Tue = reader.GetSafeString("TUE") == "1" ? true : false;
                //            line.Wed = reader.GetSafeString("WED") == "1" ? true : false;
                //            line.Thu = reader.GetSafeString("THU") == "1" ? true : false;
                //            line.Fri = reader.GetSafeString("FRI") == "1" ? true : false;
                //            line.Sat = reader.GetSafeString("SAT") == "1" ? true : false;
                //            line.Sun = reader.GetSafeString("SUN") == "1" ? true : false;
                //            line.StartTime = reader.GetSafeString("StartTime");
                //            line.EndTime = reader.GetSafeString("EndTime");
                //            line.DayPartCd = reader.GetSafeString("DayPartCd");
                //            line.OmdpSpotDateTime = reader.GetSafeString("OMDPSpotDateTime");
                //            line.OMDP = reader.GetSafeString("OM_DP");
                //            line.SpotLen = reader.GetSafeInt("SpotLen");
                //            line.BuyType = reader.GetSafeString("BuyType");
                //            line.SpBuy = reader.GetSafeString("SP_Buy");
                //            line.FullRate = reader.GetSafeDecimal("FullRate");
                //            line.Rate = reader.GetSafeDecimal("Rate");
                //            line.RateId = reader.GetSafeInt("RateID");
                //            line.Imp = reader.GetSafeDecimal("Imp");
                //            line.CPM = reader.GetSafeDecimal("CPM");
                //            line.SpotDate = reader.GetSafeDateTime("SpotDate");
                //            line.SpotTime = reader.GetSafeString("SpotTime");
                //            line.MediaTypeCode = reader.GetSafeString("MediaTypeCode");
                //            line.ISCI = reader.GetSafeString("ISCI");
                //            line.ProgramTitle = reader.GetSafeString("ProgramTitle");
                //            line.Cleared = reader.GetSafeString("Cleared");
                //            line.CommRate = reader.GetSafeDecimal("CommRate");
                //            line.SigmaProgramName = reader.GetSafeString("SigmaProgramName");
                //            line.Out_Of_Daypart = reader.GetSafeBool("Out_Of_Daypart");
                //            line.PoorSeparation = reader.GetSafeBool("PoorSeparation");
                //            postLogLines.Add(line);
                //        }
                //    }
                //}
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLogLines_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", postLogId, System.Data.DbType.Int32);
                postLogLines = FactoryServices.dbFactory.SelectCommand_SP(postLogLines, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetPostLogLinesNew | postLogId: " + postLogId.ToString() + exc.Message);
            }

            //set the poorSeparation value

            string curSpotDateValue = "", nextSpotDateValue = "", curSpotTimeValue = "", nextSpotTimeValue = "";

            for (int i = 0; i < postLogLines.Count - 1; i++)
            {
                if (postLogLines[i].StdNetName == postLogLines[i + 1].StdNetName)
                {
                    if (postLogLines[i].SpotDate != null && postLogLines[i].SpotDate.ToString() != "")
                    {
                        curSpotDateValue = postLogLines[i].SpotDate.ToString();
                    }

                    if (postLogLines[i + 1].SpotDate != null && postLogLines[i + 1].SpotDate.ToString() != "")
                    {
                        nextSpotDateValue = postLogLines[i + 1].SpotDate.ToString();
                    }

                    if (postLogLines[i].SpotDate != null && postLogLines[i].SpotDate.ToString() != "")
                    {
                        curSpotTimeValue = postLogLines[i].SpotTime.ToString();
                    }

                    if (postLogLines[i + 1].SpotDate != null && postLogLines[i + 1].SpotDate.ToString() != "")
                    {
                        nextSpotTimeValue = postLogLines[i + 1].SpotTime.ToString();
                    }

                    if (curSpotDateValue == nextSpotDateValue && curSpotTimeValue == nextSpotTimeValue)
                    {
                        postLogLines[i].PoorSeparation = true;
                        postLogLines[i + 1].PoorSeparation = true;
                    }
                }

            }


            return postLogLines;
        }


        private string GetDaysCode(string mon, string tue, string wed, string thu, string fri, string sat, string sun)
        {
            StringBuilder result = new StringBuilder();
            result.Append(mon != null ? mon : "0");
            result.Append(tue != null ? tue : "0");
            result.Append(wed != null ? wed : "0");
            result.Append(thu != null ? thu : "0");
            result.Append(fri != null ? fri : "0");
            result.Append(sat != null ? sat : "0");
            result.Append(sun != null ? sun : "0");
            return result.ToString();
        }

        public ErrorMessage PostLogSaveChanges(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_SaveChanges";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", postLogId, System.Data.DbType.Int32);
                dbparams.Add("UserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PostLogSaveChanges | postlogID: " + postLogId.ToString() + " WeekNbr: " + weekNum.ToString() + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }

            return err;
        }

        public ErrorMessage Actualize(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            DbConnection conn = _spcontext.Database.GetDbConnection();
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }

            try
            {
                List<POSTLOG_LINE_T> linesWithNullDemoId = _context.POSTLOG_LINE_T.Where(x => x.PostLogID == postLogId && x.ScheduleLineID != null && x.DemoId == null).Include(n => n.Network).Include(p => p.Property).ToList(); //ST-823 HM 
                List<POSTLOG_LINE_T> unscheduledLines = _context.POSTLOG_LINE_T.Where(x => x.PostLogID == postLogId && x.ScheduleLineID == null).Include(n => n.Network).Include(p => p.Property).ToList();
                List<POSTLOG_LINE_T> scheduledLines = _context.POSTLOG_LINE_T.Where(x => x.PostLogID == postLogId && x.ScheduleLineID != null).Include(n => n.Network).Include(p => p.Property).ToList();
                List<POSTLOG_LINE_T> unmatchedLines = new List<POSTLOG_LINE_T>();

                foreach (var line in linesWithNullDemoId) //ST-823 HM 
                {
                    var match = scheduledLines.FirstOrDefault(x => x.NetworkId == line.NetworkId &&
                                                          x.PropName == line.PropName &&
                                                          x.Mon == line.Mon &&
                                                          x.Tue == line.Tue &&
                                                          x.Wed == line.Wed &&
                                                          x.Thu == line.Thu &&
                                                          x.Fri == line.Fri &&
                                                          x.Sat == line.Sat &&
                                                          x.Sun == line.Sun &&
                                                          x.StartTime == line.StartTime &&
                                                          x.EndTime == line.EndTime &&
                                                          x.DayPartCd == line.DayPartCd &&
                                                          x.SpotLen == line.SpotLen &&
                                                          x.BuyType == line.BuyType &&
                                                          x.Rate == line.Rate &&
                                                          x.Imp == line.Imp
                                                          );


                    if (match != null)
                    {                       
                        line.DemoId = match.DemoId;                       
                    }
                }

                foreach (var line in unscheduledLines)
                {
                    var match = scheduledLines.FirstOrDefault(x => x.NetworkId == line.NetworkId &&
                                                          x.PropName == line.PropName &&
                                                          x.Mon == line.Mon &&
                                                          x.Tue == line.Tue &&
                                                          x.Wed == line.Wed &&
                                                          x.Thu == line.Thu &&
                                                          x.Fri == line.Fri &&
                                                          x.Sat == line.Sat &&
                                                          x.Sun == line.Sun &&
                                                          x.StartTime == line.StartTime &&
                                                          x.EndTime == line.EndTime &&
                                                          x.DayPartCd == line.DayPartCd &&
                                                          x.SpotLen == line.SpotLen &&
                                                          x.BuyType == line.BuyType &&
                                                          x.Rate == line.Rate &&
                                                          x.Imp == line.Imp
                                                          );


                    if (match != null)
                    {
                        line.ScheduleLineID = match.ScheduleLineID;
                        line.PropertyID = match.PropertyID;
                        line.RateId = match.RateId;
                        line.DemoId= match.DemoId; //ST-823 HM 
                        if (line.Sp_Buy != match.Sp_Buy && match.Sp_Buy == "")
                        {
                            line.Sp_Buy = match.Sp_Buy;
                        }
                    }
                    else
                    {
                        unmatchedLines.Add(line);
                    }

                }

                _context.SaveChanges();

                int unPlacedLinesCount = 0;
                foreach (var line in unmatchedLines)
                {
                    if (line?.ClearedPlaced == "UNPLACED")
                    {
                        unPlacedLinesCount++;
                    }
                }

                if (unPlacedLinesCount > 0)
                {
                    err.Success = false;
                    err.ResponseCode = -1;
                    err.ResponseText = "Cannot actualized. There are 'UNPLACED' lines";
                    return err;
                }
                //sp_PostLog_CheckUpfrontsAndRemnantsForNetworks

                using (DbCommand command = conn.CreateCommand())
                {
                    command.CommandText = "sp_PostLog_CheckUpfrontsAndRemnantsForNetworks";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@PostLogID", SqlDbType.Int);
                    param.Value = postLogId;
                    command.Parameters.Add(param);

                    using (DbDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            if (!reader.IsDBNull(0))
                            {
                                err.Success = false;
                                err.ResponseCode = -1;
                                err.ResponseText = "Cannot Actualize due to NO UPFRONTS or REMNANTS existing for network(s). " +
                                    "One will need to create before actualization. Networks missing UPFRONTS or REMNANTS: '" + reader[2].ToString() + "'";
                                while (reader.Read())
                                {
                                    err.ResponseText = " , '" + err.ResponseText + reader[2].ToString() + "'";
                                }
                                return err;
                            }
                        }
                    }
                }



                foreach (var line in unmatchedLines)
                {
                    // create new rate property scheduleline by calling sp: [AssignNonScheduledUnitToSchedule_SP]
                    var postlogIdParam = new SqlParameter("@PostLogID", postLogId);
                    var networkIdParam = new SqlParameter("@NetID", line.NetworkId);
                    var networkNameParam = new SqlParameter("@NetName", line.NetworkName);
                    var propertyNameParam = new SqlParameter("@PropName", line.PropName);
                    var daysCodeParam = new SqlParameter("@DaysCode", GetDaysCode(line.Mon, line.Tue, line.Wed, line.Thu, line.Fri, line.Sat, line.Sun));
                    var startTimeParam = new SqlParameter("@StartTime", line.StartTime);
                    var endTimeParam = new SqlParameter("@EndTime", line.EndTime);
                    var dayPartCdParam = new SqlParameter("@DayPartCd", line.DayPartCd);
                    var spotLenParam = new SqlParameter("@spotLen", line.SpotLen);
                    var buyTypeParam = new SqlParameter("@BuyType", line.BuyType);
                    var rateAmtParam = new SqlParameter("@RateAmt", line.Rate);
                    var impParam = new SqlParameter("@Imp", line.Imp);
                    var weekNbrParam = new SqlParameter("@WeekNbr", weekNum);
                    //var postlogLineIdParam = new SqlParameter("@PostLogLineID", line.PostLogLineId);
                    var postlogLineIdParam = new SqlParameter("@PLineId", line.PLineID);
                    var updUserIdParam = new SqlParameter("@UpdUserID", LoggedOnUserId);

                    using (DbCommand command = conn.CreateCommand())
                    {
                        command.CommandText = "AssignNonScheduledUnitToSchedule_SP";
                        command.CommandType = CommandType.StoredProcedure;

                        SqlParameter param = new SqlParameter("@PostLogID", SqlDbType.Int);
                        param.Value = postLogId;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@NetID", SqlDbType.Int);
                        param.Value = line.NetworkId;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@NetName", SqlDbType.VarChar, 255);
                        param.Value = line.NetworkName;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@PropName", SqlDbType.VarChar, 255);
                        param.Value = line.PropName;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@DaysCode", SqlDbType.Char, 7);
                        param.Value = GetDaysCode(line.Mon, line.Tue, line.Wed, line.Thu, line.Fri, line.Sat, line.Sun);
                        command.Parameters.Add(param);

                        param = new SqlParameter("@StartTime", SqlDbType.DateTime);
                        param.Value = line.StartTime;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@EndTime", SqlDbType.DateTime);
                        param.Value = line.EndTime;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@DayPartCd", SqlDbType.Char, 2);
                        param.Value = line.DayPartCd;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@SpotLen", SqlDbType.Int);
                        param.Value = line.SpotLen;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@BuyType", SqlDbType.VarChar, 4);
                        param.Value = line.BuyType;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@RateAmt", SqlDbType.Decimal);
                        param.Value = line.Rate;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@Imp", SqlDbType.Decimal);
                        param.Value = line.Imp;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@WeekNbr", SqlDbType.Int);
                        param.Value = weekNum;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@PLineId", SqlDbType.Int);
                        //param.Value = line.PostLogLineId;
                        param.Value = line.PLineID;
                        command.Parameters.Add(param);

                        param = new SqlParameter("@UpdUserID", SqlDbType.Int);
                        param.Value = LoggedOnUserId;
                        command.Parameters.Add(param);

                        SqlParameter paramMonday = new SqlParameter("@Monday", SqlDbType.Bit);
                        paramMonday.Value = (line.Mon == "1") ? 1 : 0;
                        command.Parameters.Add(paramMonday);

                        SqlParameter paramTuesday = new SqlParameter("@Tuesday", SqlDbType.Bit);
                        paramTuesday.Value = (line.Tue == "1") ? 1 : 0;
                        command.Parameters.Add(paramTuesday);

                        SqlParameter paramWednesday = new SqlParameter("@Wednesday", SqlDbType.Bit);
                        paramWednesday.Value = (line.Wed == "1") ? 1 : 0;
                        command.Parameters.Add(paramWednesday);

                        SqlParameter paramThursday = new SqlParameter("@Thursday", SqlDbType.Bit);
                        paramThursday.Value = (line.Thu == "1") ? 1 : 0;
                        command.Parameters.Add(paramThursday);

                        SqlParameter paramFriday = new SqlParameter("@Friday", SqlDbType.Bit);
                        paramFriday.Value = (line.Fri == "1") ? 1 : 0;
                        command.Parameters.Add(paramFriday);

                        SqlParameter paramSaturday = new SqlParameter("@Saturday", SqlDbType.Bit);
                        paramSaturday.Value = (line.Sat == "1") ? 1 : 0;
                        command.Parameters.Add(paramSaturday);

                        SqlParameter paramSunday = new SqlParameter("@Sunday", SqlDbType.Bit);
                        paramSunday.Value = (line.Sun == "1") ? 1 : 0;
                        command.Parameters.Add(paramSunday);


                        param = new SqlParameter("@SPBuy", SqlDbType.Bit);
                        param.Value = (line.Sp_Buy == "SP") ? 1 : 0;
                        command.Parameters.Add(param);

                        using (DbDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                if (reader.IsDBNull(0))
                                {
                                    err.Success = false;
                                    err.ResponseCode = -1;
                                    err.ResponseText = reader[1].ToString();
                                    return err;
                                }
                            }
                        }
                    }

                    //var result = _spcontext.Database.ExecuteSqlCommand("exec AssignNonScheduledUnitToSchedule_SP @PostLogID, @NetID, @NetName, @PropName, @DaysCode," +
                    //" @StartTime, @EndTime, @DayPartCd, @SpotLen, @BuyType, @RateAmt, @Imp, @WeekNbr, @PostLogLineID, @UpdUserID",
                    //postlogIdParam, networkIdParam, networkNameParam, propertyNameParam, daysCodeParam, startTimeParam, endTimeParam, dayPartCdParam,
                    //spotLenParam, buyTypeParam, rateAmtParam, impParam, weekNbrParam, postlogLineIdParam, updUserIdParam);

                }

                // update schedule spots by calling sp: [Actualize_SP]
                var actualizePostlogIdParam = new SqlParameter("@PostLogID", postLogId);
                var clientIdParam = new SqlParameter("@ClientID", clientId);
                var weekDateParam = new SqlParameter("@WeekDte", weekDate);
                var actualizeWeekNbrParam = new SqlParameter("@WeekNbr", weekNum);
                var actualizeUpdUserIdParam = new SqlParameter("@UpdUserID", LoggedOnUserId);

                _spcontext.Database.ExecuteSqlRaw("exec Actualize_SP @PostLogID, @ClientID, @WeekDte, @WeekNbr, @UpdUserID",
                    actualizePostlogIdParam, clientIdParam, weekDateParam, actualizeWeekNbrParam, actualizeUpdUserIdParam);
                conn.Close();
                if (err.Success == true)
                {
                    Unlock(postLogId, LoggedOnUserId);
                }
                //return true;
            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in Actualize | postlogID: " + postLogId.ToString() + " WeekNbr: " + weekNum.ToString() + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }
            finally
            {
                conn.Close();
            }
            return err;
        }


        public ErrorMessage SetPostLogLines(int NetworkId, string PropertyName, bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday,
           string StartTime, string EndTime, int DayPartId, int SpotLen, decimal GrossRateAmt, decimal Impressions, string SpotDate, int MediaTypeId, string ISCI, string SigmaProgramName,
           string ProgramTitle, int LoggedOnUserId, int PostLogId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");

            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_AddPostLogLine";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                dbparams.Add("Monday", Monday, System.Data.DbType.Boolean);
                dbparams.Add("Tuesday", Tuesday, System.Data.DbType.Boolean);
                dbparams.Add("Wednesday", Wednesday, System.Data.DbType.Boolean);
                dbparams.Add("Thursday", Thursday, System.Data.DbType.Boolean);
                dbparams.Add("Friday", Friday, System.Data.DbType.Boolean);
                dbparams.Add("Saturday", Saturday, System.Data.DbType.Boolean);
                dbparams.Add("Sunday", Sunday, System.Data.DbType.Boolean);
                dbparams.Add("StartTime", StartTime, System.Data.DbType.String);
                dbparams.Add("EndTime", EndTime, System.Data.DbType.String);
                dbparams.Add("DayPartId", DayPartId, System.Data.DbType.Int32);               
                
                if (SpotLen != 0)
                {
                    dbparams.Add("SpotLen", SpotLen, System.Data.DbType.Int32);
                }

                if (GrossRateAmt >= 0)
                {
                    dbparams.Add("GrossRateAmt", GrossRateAmt, System.Data.DbType.Decimal);
                }

                if (Impressions >= 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.Decimal);
                }
                DateTime ParsedSpotDate;
                if (DateTime.TryParse(SpotDate, out ParsedSpotDate) == true)
                {
                    dbparams.Add("SpotDate", SpotDate, System.Data.DbType.DateTime);
                }

                if (MediaTypeId != 0)
                {
                    dbparams.Add("MediaTypeId", MediaTypeId, System.Data.DbType.Int32);
                }

                if (ISCI != null && ISCI.Length > 0)
                {
                    dbparams.Add("ISCI", ISCI, System.Data.DbType.String);
                }

                if (SigmaProgramName != null && SigmaProgramName.Length > 0)
                {
                    dbparams.Add("SigmaProgramName", SigmaProgramName, System.Data.DbType.String);
                }

                if (ProgramTitle != null && ProgramTitle.Length > 0)
                {
                    dbparams.Add("ProgramTitle", ProgramTitle, System.Data.DbType.String);
                }
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;

            }
            return err;
        }

        public ErrorMessage PostlogAddDuplicateProperty(int postLogId, int selectedPostLogLineIdToDuplicate, int propertyDuplicateCount, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_InsertDuplicateRows";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", postLogId, System.Data.DbType.Int32);
                dbparams.Add("PLineId", selectedPostLogLineIdToDuplicate, System.Data.DbType.Int32);
                dbparams.Add("DuplicateRowCount", propertyDuplicateCount, System.Data.DbType.Int32);
                dbparams.Add("LoggedUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in sp_PostLog_InsertDuplicateRows | postlogID: " + postLogId.ToString() + " SelectedDuplicatePropertyId: " + selectedPostLogLineIdToDuplicate.ToString() + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }
            finally
            {
            }


            return err;
        }

        public ErrorMessage AddPostLogNote(int PostLogId, string Note, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_AddNote";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                dbparams.Add("Note", Note, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AddPostLogNote | PostLogId: " + PostLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return err;
        }
        public ErrorMessage AddPostLogSubNote(int PostLogNoteId, string Note, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");

            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_AddSubNote";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogNoteId", PostLogNoteId, System.Data.DbType.Int32);
                dbparams.Add("Note", Note, System.Data.DbType.String);
                dbparams.Add("LoggedUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AddPostLogSubNote | PostLogNoteId: " + PostLogNoteId.ToString() + exc.Message);
            }
            finally
            {
               // conn.Close();
            }
            return err;

        }
        public IEnumerable<PostLogNote> GetPostLogNotes(int PostLogId, int LoggedOnUserId)
        {
            List<PostLogNote> postLogNotes = new List<PostLogNote>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLogNotes_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                postLogNotes = FactoryServices.dbFactory.SelectCommand_SP(postLogNotes, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetPostLogNotes | PostLogId: " + PostLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return postLogNotes;
        }

        public IEnumerable<ClsISCI> PostLogGetValidISCIs(int PostLogId, int LoggedOnUserId)
        {
            List<ClsISCI> lst = new List<ClsISCI>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_GetValidISCIs";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                lst = FactoryServices.dbFactory.SelectCommand_SP(lst, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PostLogGetValidISCIs | PostLogId: " + PostLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return lst;

        }


        public ErrorMessage PostLogAddNetworkLine(int preLog, int postLog, int nwSelectNetwork, int nwClientId,
                string nwSelectCountry, string nwProduct, string nwSpotDate, string nwSpotTime, int nwSpotLen,
                string nwISCICode, decimal nwSpotRate, string nwProgram, string rcvdDate, string nwWeekOf,
                string logFileName, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            DbConnection conn = _spcontext.Database.GetDbConnection();
            try
            {
                
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_AddNetworkLine";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("preLog", preLog, System.Data.DbType.Int32);
                dbparams.Add("postLog", postLog, System.Data.DbType.Int32);
                dbparams.Add("nwSelectNetwork", nwSelectNetwork, System.Data.DbType.Int32);
                dbparams.Add("nwClientId", nwClientId, System.Data.DbType.Int32);
                dbparams.Add("nwSelectCountry", nwSelectCountry, System.Data.DbType.Int32);
                dbparams.Add("nwProduct", nwProduct, System.Data.DbType.String);
                dbparams.Add("nwSpotDate", nwSpotDate, System.Data.DbType.String);
                dbparams.Add("nwSpotTime", nwSpotTime, System.Data.DbType.String);
                dbparams.Add("nwSpotLen", nwSpotLen, System.Data.DbType.Int32);
                dbparams.Add("nwISCICode", nwISCICode, System.Data.DbType.String);
                dbparams.Add("nwSpotRate", nwSpotRate, System.Data.DbType.Decimal);
                dbparams.Add("nwProgram", nwProgram, System.Data.DbType.String);
                dbparams.Add("rcvdDate", rcvdDate, System.Data.DbType.String);
                dbparams.Add("nwWeekOf", nwWeekOf, System.Data.DbType.String);
                dbparams.Add("logFileName", logFileName, System.Data.DbType.String);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PostLogAddNetworkLine - " + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }

            return err;
        }

        public ErrorMessage DeletePostLog(int LoggedOnUserId, int PostLogId)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
          
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_PostLog_Delete";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in DeletePostLog | PostLogId: " + PostLogId.ToString() + exc.Message);
            }
            finally
            {
            }
            return err;
        }

        public ErrorMessage PostLogCopyPropertyDetails(int LoggedOnUserId, int PostLogId, int PostLogLineId, int[] PostLogLineIds)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            //DbConnection conn = _spcontext.Database.GetDbConnection();
            //if (conn.State == ConnectionState.Closed)
            //{
            //    conn.Open();
            //}
            try
            {
                //using (DbCommand command = conn.CreateCommand())
                //{
                //    command.CommandText = "sp_PostLog_CopyPropertyDetails";
                //    command.CommandType = CommandType.StoredProcedure;

                //    SqlParameter paramPostLogId = new SqlParameter("@PostLogId", SqlDbType.Int);
                //    paramPostLogId.Value = PostLogId;
                //    command.Parameters.Add(paramPostLogId);

                //    SqlParameter paramPostLogLineId = new SqlParameter("@PLineId", SqlDbType.Int);
                //    paramPostLogLineId.Value = PostLogLineId;
                //    command.Parameters.Add(paramPostLogLineId);

                //    DataTable table = new DataTable();
                //    table.Columns.Add("id", typeof(int));
                //    foreach (int postLogLineId in PostLogLineIds)
                //    {
                //        table.Rows.Add(postLogLineId);
                //    }
                //    SqlParameter paramPostLogLineIds = new SqlParameter("@PLineIds", SqlDbType.Structured);
                //    paramPostLogLineIds.TypeName = "dbo.SingleColumnId";
                //    paramPostLogLineIds.Value = table;
                //    command.Parameters.Add(paramPostLogLineIds);

                //    SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //    paramLoggedOnUserId.Value = LoggedOnUserId;
                //    command.Parameters.Add(paramLoggedOnUserId);


                //    using (DbDataReader reader = command.ExecuteReader())
                //    {
                //        if (reader.Read())
                //        {
                //            err.Success = (bool)reader["Success"];
                //            err.ResponseCode = int.Parse(reader["ResponseCode"].ToString());
                //            err.ResponseText = reader["ResponseText"].ToString();
                //        }
                //    }
                //}

                // ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int postLogLineId in PostLogLineIds)
                {
                    table.Rows.Add(postLogLineId);
                }
                ErrorMessage em = new ErrorMessage();
                string spName = "sp_PostLog_CopyPropertyDetails";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, DbType.Int32);
                dbparams.Add("PLineId", PostLogLineId, DbType.Int32);
                dbparams.Add("PLineIds", table.AsTableValuedParameter("dbo.SingleColumnId"));

                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PostLogCopyPropertyDetails | PostLogId: " + PostLogId.ToString() + " PostLogLineId: " + PostLogLineId + " PostLogLineIds: " + string.Join(", ", PostLogLineIds) + exc.Message);
            }
            finally
            {
            }
            return err;
        }

        public ErrorMessage PostLogClearSpotData(int LoggedOnUserId, int PostLogId, int[] PLineIds)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            //DbConnection conn = _spcontext.Database.GetDbConnection();
            //if (conn.State == ConnectionState.Closed)
            //{
            //    conn.Open();
            //}
            try
            {
                //using (DbCommand command = conn.CreateCommand())
                //{
                //    command.CommandText = "sp_PostLog_ClearSpotData";
                //    command.CommandType = CommandType.StoredProcedure;

                //    SqlParameter paramPostLogId = new SqlParameter("@PostLogId", SqlDbType.Int);
                //    paramPostLogId.Value = PostLogId;
                //    command.Parameters.Add(paramPostLogId);

                //    DataTable table = new DataTable();
                //    table.Columns.Add("id", typeof(int));
                //    foreach (int PLineId in PLineIds)
                //    {
                //        table.Rows.Add(PLineId);
                //    }
                //    SqlParameter paramPostLogLineIds = new SqlParameter("@PLineIDs", SqlDbType.Structured);
                //    paramPostLogLineIds.TypeName = "dbo.SingleColumnId";
                //    paramPostLogLineIds.Value = table;
                //    command.Parameters.Add(paramPostLogLineIds);

                //    SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //    paramLoggedOnUserId.Value = LoggedOnUserId;
                //    command.Parameters.Add(paramLoggedOnUserId);


                //    using (DbDataReader reader = command.ExecuteReader())
                //    {
                //        if (reader.Read())
                //        {
                //            err.Success = (bool)reader["Success"];
                //            err.ResponseCode = int.Parse(reader["ResponseCode"].ToString());
                //            err.ResponseText = reader["ResponseText"].ToString();
                //        }
                //    }
                //}
                // ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int PLineId in PLineIds)
                {
                    table.Rows.Add(PLineId);
                }
                ErrorMessage em = new ErrorMessage();
                string spName = "sp_PostLog_ClearSpotData";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PostLogId", PostLogId, DbType.Int32);
                dbparams.Add("PLineIDs", table.AsTableValuedParameter("dbo.SingleColumnId"));
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PostLogClearSpotData | PostLogId: " + PostLogId.ToString() + " PostLogLineIds: " + string.Join(", ", PLineIds) + exc.Message);
            }
            finally
            {
            }
            return err;
        }

        public LockInfo PostlogCheckLock(int postLogId, int userId)
        {
            LockInfo info = new LockInfo();
            //bool success = false;
            try
            {
                var postlogItem = _context.POSTLOG_T.Where(x => x.PostLogId == postLogId).SingleOrDefault();
                //bool locked = postlogItem?.PostLogLocked ?? false;
                int locked = postlogItem?.PostLogLockedBy ?? 0;

                if (locked != 0)
                {
                    var lockUser = _context.Users.Where(x => x.UserId == postlogItem.PostLogLockedBy.Value).FirstOrDefault();
                    info.LockedBy = string.Format("{0} {1}", lockUser?.FirstName, lockUser?.LastName);
                    info.LockTime = postlogItem?.PostLogLockedDt;
                    info.IsLocked = true;
                    info.LockedToOtherUser = lockUser.UserId != userId;
                }
                else
                {

                    info.IsLocked = false;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(userId, "Error in LockPostLog | PostLogId: " + postLogId.ToString() + exc.Message);
            }

            return info;
        }


        //public ErrorMessage ActualizeExecuteGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        public async Task<ErrorMessage> ActualizeExecuteGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");
            var actualizeReportsDBConnection = "";


            if (_config.GetSection("DebugMode:Debug").Value == "on")
            {
                actualizeReportsDBConnection = _config.GetSection("ActualizeReportsDBConnection:QADBConnection").Value;
            }
            else
            {
                actualizeReportsDBConnection = _config.GetSection("ActualizeReportsDBConnection:ProdDBConnection").Value;
            }

            SqlConnectionStringBuilder builder = new SqlConnectionStringBuilder(actualizeReportsDBConnection);
            //builder.AsynchronousProcessing = true;
            DbConnection conn;
            //conn = new SqlConnection(actualizeReportsDBConnection);
            conn = new SqlConnection(builder.ConnectionString);
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }

            try
            {
                using (DbCommand command = conn.CreateCommand())
                {
                    //command.CommandText = "ExecuteGlobalPostLogAccountingReports_SP"; // ST-419, Commented
                    command.CommandText = "ExecuteGlobalPostLogReportingServices_SP"; // ST-419, Added
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@ClientID", SqlDbType.Int);
                    param.Value = clientId;
                    command.Parameters.Add(param);
                    command.CommandTimeout = 0;
                    await command.ExecuteNonQueryAsync();
                    //RunCommandAsynchronously(command, builder.ConnectionString);
                }

            }

            catch (Exception exc)
            {
                // ST-419, Changed ExecuteGlobalPostLogReportingServices_SP to ExecuteGlobalPostLogReportingServices_SP
                _logger.LogError(LoggedOnUserId, "Error in ExecuteGlobalPostLogReportingServices_SP | PostlogID:- " + postLogId.ToString() + "ClientId:  "
                                    + clientId.ToString() + " | Week Number: " + weekNum.ToString() + " | Week Date: "
                                    + weekDate.ToString() + " | Error Message: " + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }
            finally
            {
                conn.Close();
            }


            return err;
            //return Task.FromResult(err);
        }

        public bool IsPostLogExists(int LoggedOnUserId, int SchedID, DateTime WeekDate)
        {
            var result = false;
            try
            {
                if (_context.POSTLOG_T.Where(p => p.SchedId == SchedID && p.WeekDate == WeekDate).ToList().Count() > 0)
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
                _logger.LogError(LoggedOnUserId, "Error in IsPostLogExists | SchedID: " + SchedID.ToString() + " WeekDate: " + WeekDate + exc.Message);
            }
            return result;

        }

        public ErrorMessage PostLogMoveSpotData(int LoggedOnUserId, int PostLogId, int[] PostLogLineIdsFrom, int[] PostLogLineIdsTo)
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
                    command.CommandText = "sp_PostLog_MoveSpotData";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter paramPostLogId = new SqlParameter("@PostLogId", SqlDbType.Int);
                    paramPostLogId.Value = PostLogId;
                    command.Parameters.Add(paramPostLogId);

                    DataTable tblPostLogLineIdsFrom = new DataTable();
                    tblPostLogLineIdsFrom.Columns.Add("id", typeof(int));
                    foreach (int PLineId in PostLogLineIdsFrom)
                    {
                        tblPostLogLineIdsFrom.Rows.Add(PLineId);
                    }
                    SqlParameter paramPLineIdsFrom = new SqlParameter("@PLineIdsFrom", SqlDbType.Structured);
                    paramPLineIdsFrom.TypeName = "dbo.SingleColumnId";
                    paramPLineIdsFrom.Value = tblPostLogLineIdsFrom;
                    command.Parameters.Add(paramPLineIdsFrom);

                    DataTable tblPostLogLineIdsTo = new DataTable();
                    tblPostLogLineIdsTo.Columns.Add("id", typeof(int));
                    foreach (int PLineId in PostLogLineIdsTo)
                    {
                        tblPostLogLineIdsTo.Rows.Add(PLineId);
                    }

                    SqlParameter paramPLineIdsTo = new SqlParameter("@PLineIdsTo", SqlDbType.Structured);
                    paramPLineIdsTo.TypeName = "dbo.SingleColumnId";
                    paramPLineIdsTo.Value = tblPostLogLineIdsTo;
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
                _logger.LogError(LoggedOnUserId, "Error in PostLogMoveSpotData | PostLogId: " + PostLogId.ToString() + " PostLogLineIdsFrom: " + string.Join(", ", PostLogLineIdsFrom) + " PostLogLineIdsTo: " + string.Join(", ", PostLogLineIdsTo) + exc.Message);
            }
            finally
            {
                conn.Close();
            }
            return err;
        }

        public async Task<ErrorMessage> PostLogRealTimeReport(int ClientId, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");

            DbConnection conn = new SqlConnection(_config.GetSection("ConnectionStrings:Dashboard_BIADBConnection").Value.ToString());
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }

            try
            {
                using (DbCommand command = conn.CreateCommand())
                {

                    command.CommandText = "PostLogRealTime";
                    command.CommandType = CommandType.StoredProcedure;

                    SqlParameter param = new SqlParameter("@ClientID", SqlDbType.Int);
                    param.Value = ClientId;
                    command.Parameters.Add(param);
                    command.CommandTimeout = 0;
                    await command.ExecuteNonQueryAsync();
                }

            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in PostLogRealTimeReport | ClientId:  " + ClientId.ToString() + " | Error Message: " + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }
            finally
            {
                conn.Close();
            }

            return err;
        }

        public async Task<ErrorMessage> AssignMirrorBuyType(int ClientId, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");

            DbConnection conn = new SqlConnection(_config.GetSection("ConnectionStrings:DefaultConnection").Value.ToString());
            if (conn.State == ConnectionState.Closed)
            {
                conn.Open();
            }
            var LastUpddateDate = "";
            try
            {
                
                var lstUpddte = (from pl in _context.POSTLOG_LINE_T join p in _context.POSTLOG_T on pl.PostLogID equals p.PostLogId join s in _context.Schedule on p.SchedId equals s.ScheduleId where pl.Cleared == true && pl.ParentBuytype == null && s.ClientId == ClientId && pl.BuyType == "M" select pl.UpdDte).ToList();
                if (lstUpddte.Count() > 0)
                {
                    LastUpddateDate = lstUpddte.Min().ToShortDateString();
                }
                if (!string.IsNullOrEmpty(LastUpddateDate) && ClientId > 0)
                {
                    using (DbCommand command = conn.CreateCommand())
                    {

                        command.CommandText = "LoadAssignMirrorBuyType";
                        command.CommandType = CommandType.StoredProcedure;

                        SqlParameter paramClientID = new SqlParameter("@pClientID", SqlDbType.Int);
                        paramClientID.Value = ClientId;
                        command.Parameters.Add(paramClientID);

                        SqlParameter paramLastUpdateDate = new SqlParameter("@pLastUpdateDate", SqlDbType.VarChar, 10);
                        paramLastUpdateDate.Value = LastUpddateDate;
                        command.Parameters.Add(paramLastUpdateDate);
                        command.CommandTimeout = 0;

                         await command.ExecuteNonQueryAsync();
                    }
                }

            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AssignMirrorBuyType | ClientId: " + ClientId.ToString() + "| LastUpdateDate: " + LastUpddateDate.ToString() +  "| Error Message: " + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }
            finally
            {
                conn.Close();
            }

            return err;
        }


    }
}
