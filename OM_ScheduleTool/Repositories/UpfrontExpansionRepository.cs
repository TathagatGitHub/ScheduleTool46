using Microsoft.Extensions.Logging;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using OM_ScheduleTool.Models;
using AppContext = OM_ScheduleTool.Models.AppContext;
using Dapper;
using OM_ScheduleTool.Dapper;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace OM_ScheduleTool.Repositories
{
    public class UpfrontExpansionRepository : IUpfrontExpansionRepository
    {
        private AppContext _context;
        protected StoredProcsContext _spcontext;
        private ILogger<UpfrontExpansionRepository> _logger;

        public UpfrontExpansionRepository(AppContext context
            , StoredProcsContext spcontext
            , ILogger<UpfrontExpansionRepository> logger)
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
        }

        public UpfrontExpansionTracking GetUpfrontExpansionTrackingByUpfrontId(int LoggedOnUserId, int UpfrontId)
        {
            UpfrontExpansionTracking upfrontexpansion = null;
            try
            {
                upfrontexpansion = _context
                .UpfrontExpansionTracking
                .Where(u => u.Upfront.UpfrontId == UpfrontId)
                .Include(u => u.Upfront)
                .FirstOrDefault();

                if (upfrontexpansion == null)
                    upfrontexpansion = new UpfrontExpansionTracking() { Upfront = new Upfront() { UpfrontId = UpfrontId } };

                upfrontexpansion.UpfrontExpansionTradeDetails = new List<UpfrontExpansionTradeDetail>();

                try
                {
                    // ST-946 Code Implementation with Dapper
                    string spName = "sp_UpfrontExpansion_GetClientTrades";
                    DynamicParameters dbparams = new DynamicParameters();
                    dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                    upfrontexpansion.UpfrontExpansionTradeDetails = FactoryServices.dbFactory.SelectCommand_SP(upfrontexpansion.UpfrontExpansionTradeDetails, spName, dbparams);
                }
                catch (Exception exc)
                {
                    _logger.LogError(LoggedOnUserId, "Unable to retrieve UpfrontExpansionTracking | UpfrontId: " + UpfrontId.ToString() + exc.Message);
                }
                finally { 
                //    conn.Close();
                }
            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to retrieve UpfrontExpansionTracking | UpfrontId: " + UpfrontId.ToString() + exc.Message);
            }

            return upfrontexpansion;
        }

        public List<UpfrontExpansionQuarters> GetUpfrontExpansionQtrsByUpfrontId(int LoggedOnUserId, int UpfrontId, int CurrentQuarterNbr)
        {
            List<UpfrontExpansionQuarters> result = new List<UpfrontExpansionQuarters>();
            try
            {
                //// ST-946 Code Implementation with Dapper
                string spName = "sp_UpfrontExpansion_GetNetworkQuarters";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                result = FactoryServices.dbFactory.SelectCommand_SP(result, spName, dbparams);
                foreach (var item in result)
                {
                    item.IsCurrent = item.QuarterNbr == CurrentQuarterNbr ? true : false;
                    if (item.UpfrontExpansionTrackingId == 0)
                    {
                        var groupId = _context.Upfronts.Where(a => a.UpfrontId == item.UpfrontIdVal && a.UpfrontTypeId == 2)
                            .Join(_context.UpfrontExpansionNetworkGroup,
                                  a => new { NetworkId = a.NetworkId, QuarterId = a.QuarterId },
                                  b => new { NetworkId = (int?)b.NetworkId, QuarterId = (int?)b.QuarterId }, (a, b) => b.GroupId).Single();

                        var ue = _context.UpfrontExpansionNetworkGroup.Where(a => a.GroupId == groupId)
                                  .Join(_context.Upfronts, a => new { NetworkId = (int?)a.NetworkId, QuarterId = (int?)a.QuarterId }, 
                                  b => new { NetworkId = b.NetworkId, QuarterId = b.QuarterId }, (a, b) => b)
                                  .Join(_context.UpfrontExpansionTracking, b => b.UpfrontId, c => c.Upfront.UpfrontId, (b, c) => c)
                                  .Select(c => new { c.UpfrontExpansionTrackingId, c.Upfront.UpfrontId, c.UEDollarsAvailable, c.TotalUpfrontDollars }).SingleOrDefault();

                        if (ue != null)
                        {
                            item.TotalQuarterUpfrontDollars = ue.TotalUpfrontDollars;
                            item.UEDollarsAvailable = ue.UEDollarsAvailable;
                            item.UpfrontInfo = _context.Upfronts.Where(u => u.UpfrontId == ue.UpfrontId).Single();
                            item.UpfrontExpansionTrackingId = ue.UpfrontExpansionTrackingId;
                        }
                    }
                    else
                    {
                        item.UpfrontInfo = _context.Upfronts.Where(u => u.UpfrontId == item.UpfrontIdVal).FirstOrDefault();
                    }
                }
                foreach (var quarter in result)
                {
                    if (quarter.IsCurrent)
                    {
                        var GroupId = _context.UpfrontExpansionNetworkGroup.Where(l => l.Network.NetworkId == quarter.UpfrontInfo.NetworkId && l.QuarterId == quarter.UpfrontInfo.QuarterId).Select(l => l.GroupId).FirstOrDefault();
                        quarter.UpfrontExpansionNetworkGroup = _context.UpfrontExpansionNetworkGroup.Where(x => x.GroupId == GroupId).Join(_context.Networks, a => a.Network.NetworkId, b => b.NetworkId, (a, b) =>
                            new UpfrontExpansionNetworkGroup { UpfrontExpansionNetworkGroupId = a.UpfrontExpansionNetworkGroupId, GroupId = a.GroupId, QuarterId = a.QuarterId, Network = new Network { NetworkId = b.NetworkId, StdNetName = b.StdNetName } })
                        .OrderBy(x => x.Network.StdNetName).ToList();
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load quarters | UpfrontId: " + UpfrontId.ToString() + " | CurrentQuarterNbr: " + CurrentQuarterNbr.ToString() + " | " + exc.Message);
            }
            finally
            {
              //  conn.Close();
            }

            return result;
        }
        
        public UpfrontExpansionNetworkGroup GetNetworkGroup(int UpfrontId)
        {
            var upfront = _context.Upfronts.Where(x => x.UpfrontId == UpfrontId).Single();
            return _context.UpfrontExpansionNetworkGroup.Where(l => l.Network.NetworkId == upfront.NetworkId && l.QuarterId == upfront.QuarterId).SingleOrDefault();
        }

        public void GetYearlyFlag(int UpfrontId, int LoggedOnUserId, out bool? Yearly, out int id, out bool CanChangeYearly)
        {
            int Year;
            int[] upfrontIds_ForYear;
            int[] upfrontIds_ForGroup = null;
            CanChangeYearly = true;
            Yearly = null;
            id = 0;

            List<UpfrontExpansionTracking> UpfrontExpansionTrackings = new List<UpfrontExpansionTracking>();
            var upfront = _context.Upfronts.Where(x => x.UpfrontId == UpfrontId).Single();

            try
            {
                if (upfront.PlanYrType == "B")
                {
                    Year = _context.Quarter.Where(x => x.QuarterId == upfront.QuarterId).Select(x => x.BroadcastYr).Single();
                    upfrontIds_ForYear = _context.Upfronts.Where(x => x.NetworkId == upfront.NetworkId && x.UpfrontTypeId == 2)
                    .Join(_context.Quarter.Where(x => x.BroadcastYr == Year), a => a.QuarterId, b => b.QuarterId, (a, b) => a.UpfrontId).ToArray();
                }
                else
                {
                    Year = _context.Quarter.Where(x => x.QuarterId == upfront.QuarterId).Select(x => x.CalendarYr).Single();
                    upfrontIds_ForYear = _context.Upfronts.Where(x => x.NetworkId == upfront.NetworkId && x.UpfrontTypeId == 2)
                        .Join(_context.Quarter.Where(x => x.CalendarYr == Year), a => a.QuarterId, b => b.QuarterId, (a, b) => a.UpfrontId).ToArray();
                }

                if (_context.UpfrontExpansionTracking.Where(x => x.Upfront == upfront).Count() > 0)
                    UpfrontExpansionTrackings.Add(_context.UpfrontExpansionTracking.Where(x => x.Upfront == upfront).Single());
                UpfrontExpansionTrackings = UpfrontExpansionTrackings.Union(_context.UpfrontExpansionTracking.Where(x => upfrontIds_ForYear.Contains(x.Upfront.UpfrontId)).Include(x => x.Upfront)).ToList();

                var networkGroup = GetNetworkGroup(UpfrontId);
                if (networkGroup != null)
                {
                    upfrontIds_ForGroup = _context.UpfrontExpansionNetworkGroup.Where(x => x.GroupId == networkGroup.GroupId)
                        .Join(_context.Upfronts.Where(x => x.UpfrontTypeId == 2), a => new { a.Network.NetworkId, a.QuarterId },
                        b => new { b.Network.NetworkId, b.Quarter.QuarterId }, (a, b) => b.UpfrontId).ToArray();
                    UpfrontExpansionTrackings = UpfrontExpansionTrackings.Union(_context.UpfrontExpansionTracking.Where(x => upfrontIds_ForGroup.Contains(x.Upfront.UpfrontId)).Include(x => x.Upfront)).ToList();
                }

                Yearly = UpfrontExpansionTrackings.Where(x => x.Yearly != null).Select(x => x.Yearly).Distinct().SingleOrDefault();
                if (UpfrontExpansionTrackings.Where(x => x.Upfront.UpfrontId == UpfrontId).Count() > 0)
                    id = UpfrontId;
                else if (UpfrontExpansionTrackings.Where(x => upfrontIds_ForGroup.Contains(x.Upfront.UpfrontId)).Count() > 0)
                    id = UpfrontExpansionTrackings.Where(x => upfrontIds_ForGroup.Contains(x.Upfront.UpfrontId)).Select(x => x.Upfront.UpfrontId).Single();

                // Trades already exist for this Upfront Expansion in this year or Group.
                //if (_context.UpfrontExpansionTrackingLines.Join(UpfrontExpansionTrackings, a => a.UpfrontExpansionTrackingId, b => b.UpfrontExpansionTrackingId, (a, b) => a.UpfrontExpansionTrackingId).ToList().Count > 0) 
                // Added AsEnummerable to make it work in EF Core 6.0
                if (_context.UpfrontExpansionTrackingLines.AsEnumerable().Join(UpfrontExpansionTrackings.AsEnumerable(), a => a.UpfrontExpansionTrackingId, b => b.UpfrontExpansionTrackingId, (a, b) => a.UpfrontExpansionTrackingId).ToList().Count > 0) {
                    CanChangeYearly = false;
                    return;
                }
                // Dollar amounts have been entered for this Upfront Expansion in this year or Group.
                if (UpfrontExpansionTrackings.Where(x => x.TotalUpfrontDollars > 0 || x.UEDollarsAvailable > 0 || x.YearlyTotalUpfrontDollars > 0 || x.YearlyUEDollarsAvailable > 0).Count() > 0)
                    CanChangeYearly = false;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in function GetYearlyFlag | UpfrontId: " + UpfrontId.ToString() + exc.Message);
            }
        }

        public List<DemoNames> GetUpfrontExpansion_DemoNames(int UpfrontId)
        {
            List<DemoNames> result = new List<DemoNames>();
            List<DemosModel> lds2 = new List<DemosModel>();
            try
            {

                //// ST-946 Code Implementation with Dapper
                string spName = "sp_UpfrontExpansion_GetDemoNames";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                lds2 = FactoryServices.dbFactory.SelectCommand_SP(lds2, spName, dbparams);
                if (lds2.Any())
                {
                    foreach (DemosModel dm in lds2)
                    {
                        result.Add(new DemoNames(dm.DemographicSettingsId, dm.DemoName));
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError("Unable to load Demo names | UpfrontId: " + UpfrontId.ToString() + exc.Message);
            }
            finally
            {
            }
            return result;
        }

        public int CreateUpfrontExpansion(int UpfrontId, int DemographicSettingsId, int LoggedOnUserId)
        {
            int RemnantId = 0;
            try
            {
                //// ST-946 Code Implementation with Dapper
                string spName = "sp_UpfrontExpansion_Create";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                dbparams.Add("DemographicSettingsId", DemographicSettingsId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                RemnantId = FactoryServices.dbFactory.SelectCommand_SP(RemnantId, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to create Upfront Expansion | UpfrontId: " + UpfrontId.ToString() + exc.Message);
                throw;
            }

            return RemnantId;
        }

        public int Trade(int UpfrontExpansionTrackingId, int FromClientId, int ToClientId, decimal TradedUEDollars, Models.User LoggedOnUser)
        {
            int _UpfrontExpansionTrackingLineId = 0;
            Client fromClient = _context.Clients.Where(x => x.ClientId == FromClientId).Single();
            Client toClient = _context.Clients.Where(x => x.ClientId == ToClientId).Single();
            try
            {
                DateTime currentTime = DateTime.Now;
                UpfrontExpansionTrackingLine trackingLine = new UpfrontExpansionTrackingLine()
                {
                    UpdateDt = currentTime,
                    TradedUEDollars = TradedUEDollars,
                    TradeFrom = fromClient,
                    TradeTo = toClient,
                    UpdatedBy = LoggedOnUser,
                    UpfrontExpansionTrackingId = UpfrontExpansionTrackingId
                };
                _context.UpfrontExpansionTrackingLines.Add(trackingLine);
                _context.SaveChanges();

                _UpfrontExpansionTrackingLineId = trackingLine.UpfrontExpansionTrackingLineId;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUser.UserId, "Error doing Trade in Manage Upfront Expansion - UpfrontExpansionTrackingId " + UpfrontExpansionTrackingId.ToString() + " " + exc.Message);

            }
            return _UpfrontExpansionTrackingLineId;
        }

        public bool DeleteTrade(int UpfrontExpansionTrackingLineId, Models.User LoggedOnUser)
        {
            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    UpfrontExpansionTrackingLine trackingLine = _context.UpfrontExpansionTrackingLines.Where(x => x.UpfrontExpansionTrackingLineId == UpfrontExpansionTrackingLineId).Include(x => x.TradeFrom).Include(x => x.TradeTo).Single();
                    _context.UpfrontExpansionTrackingLines.Remove(trackingLine);
                    _context.SaveChanges();

                    _context.UpfrontExpansionTrackingLines_Audit.Add(new UpfrontExpansionTrackingLine_Audit()
                    {
                        Operation = "del",
                        TrackingDt = DateTime.Now,
                        UpdateDt = trackingLine.UpdateDt,
                        UpfrontExpansionTrackingId = trackingLine.UpfrontExpansionTrackingId,
                        UpfrontExpansionTrackingLineId = trackingLine.UpfrontExpansionTrackingLineId,
                        TradedUEDollars = trackingLine.TradedUEDollars,
                        TradeFromClientId = trackingLine.TradeFrom.ClientId,
                        TradeToClientId = trackingLine.TradeTo.ClientId,
                        UpdatedByUserId = LoggedOnUser.UserId
                    });
                    _context.SaveChanges();

                    transaction.Commit();
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUser.UserId, "Error deleting Trade in Manage Upfront Expansion - UpfrontExpansionTrackingLineId " + UpfrontExpansionTrackingLineId.ToString() + " " + exc.Message);
                return false;
            }

            return true;
        }

        public int Save_UpfrontExpansionTracking(int UpfrontId, int UpfrontExpansionTrackingId, decimal UEDollarsAvailable, decimal TotalQuarterUpfrontDollars, Models.User LoggedOnUser)
        {
            int _upfrontExpansionTrackingId = 0;
            try
            {
                if (!FoundDuplicateInNetworkGroup(UpfrontId))
                {
                    UpfrontExpansionTracking _upfrontExpansionTracking;
                    DateTime currentTime = DateTime.Now;
                    if (UpfrontExpansionTrackingId == 0)
                    {
                        _upfrontExpansionTracking = new UpfrontExpansionTracking()
                        {
                            CreateDt = currentTime,
                            UpdateDt = currentTime,
                            UpdatedBy = LoggedOnUser,
                            Upfront = _context.Upfronts.Where(x => x.UpfrontId == UpfrontId).Single(),
                            TotalUpfrontDollars = TotalQuarterUpfrontDollars,
                            UEDollarsAvailable = UEDollarsAvailable
                        };
                        _context.Add(_upfrontExpansionTracking);
                    }
                    else
                    {
                        _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.UpfrontExpansionTrackingId == UpfrontExpansionTrackingId).Single();
                        _upfrontExpansionTracking.TotalUpfrontDollars = TotalQuarterUpfrontDollars;
                        _upfrontExpansionTracking.UEDollarsAvailable = UEDollarsAvailable;
                        _upfrontExpansionTracking.UpdateDt = currentTime;
                        _upfrontExpansionTracking.UpdatedBy = LoggedOnUser;
                        _context.Entry(_upfrontExpansionTracking).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                    }

                    _context.SaveChanges();
                    _upfrontExpansionTrackingId = _upfrontExpansionTracking.UpfrontExpansionTrackingId;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUser.UserId, "Error in saving Manage Upfront Expansion (Total Upfront and UE Dollars Available) - UpfrontId " + UpfrontId.ToString() + " " + exc.Message);

            }
            return _upfrontExpansionTrackingId;
        }

        public bool Save_UpfrontExpansionTracking(int UpfrontExpansionTrackingId, decimal UEDollarsAvailable, decimal TotalUpfrontDollars, decimal YearUEDollarsAvailable, decimal YearTotalUpfrontDollars, Models.User LoggedOnUser)
        {
            try
            {

                UpfrontExpansionTracking _upfrontExpansionTracking;
                DateTime currentTime = DateTime.Now;
                _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.UpfrontExpansionTrackingId == UpfrontExpansionTrackingId).Include(x => x.Upfront).Single();
                if (!FoundDuplicateInNetworkGroup(_upfrontExpansionTracking.Upfront.UpfrontId))
                {
                    _upfrontExpansionTracking.UEDollarsAvailable = UEDollarsAvailable;
                    _upfrontExpansionTracking.TotalUpfrontDollars = TotalUpfrontDollars;
                    _upfrontExpansionTracking.YearlyUEDollarsAvailable = YearUEDollarsAvailable;
                    _upfrontExpansionTracking.YearlyTotalUpfrontDollars = YearTotalUpfrontDollars;
                    _upfrontExpansionTracking.UpdateDt = currentTime;
                    _upfrontExpansionTracking.UpdatedBy = LoggedOnUser;

                    //Save YearlyUEDollarsAvailable and YearlyTotalUpfrontDollars for all quarters in this year
                    int Year;
                    List<int> upfrontIds;
                    if (_context.Upfronts.Where(x => x.UpfrontId == _upfrontExpansionTracking.Upfront.UpfrontId).Single().PlanYrType == "B")
                    {
                        Year = _context.Quarter.Where(x => x.QuarterId == _upfrontExpansionTracking.Upfront.QuarterId).Select(x => x.BroadcastYr).Single();
                        upfrontIds = _context.Upfronts.Where(x => x.NetworkId == _upfrontExpansionTracking.Upfront.NetworkId && x.UpfrontTypeId == 2)
                            .Join(_context.Quarter.Where(x => x.BroadcastYr == Year), a => a.QuarterId, b => b.QuarterId, (a, b) => a.UpfrontId).ToList();
                    }
                    else
                    {
                        Year = _context.Quarter.Where(x => x.QuarterId == _upfrontExpansionTracking.Upfront.QuarterId).Select(x => x.CalendarYr).Single();
                        upfrontIds = _context.Upfronts.Where(x => x.NetworkId == _upfrontExpansionTracking.Upfront.NetworkId && x.UpfrontTypeId == 2)
                            .Join(_context.Quarter.Where(x => x.CalendarYr == Year), a => a.QuarterId, b => b.QuarterId, (a, b) => a.UpfrontId).ToList();
                    }
                    _context.UpfrontExpansionTracking.Where(x => upfrontIds.Contains(x.Upfront.UpfrontId)).ToList().ForEach(x => x.YearlyUEDollarsAvailable = YearUEDollarsAvailable);
                    _context.UpfrontExpansionTracking.Where(x => upfrontIds.Contains(x.Upfront.UpfrontId)).ToList().ForEach(x => x.YearlyTotalUpfrontDollars = YearTotalUpfrontDollars);
                    _context.SaveChanges();
                    return true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUser.UserId, "Error in saving Yearly Manage Upfront Expansion - UpfrontExpansionTrackingId " + UpfrontExpansionTrackingId.ToString() + exc.Message);

            }
            return false;
        }
        public bool SaveYearlyOrQuarterlyUpfrontExpansion(int UpfrontId, bool YearlyQuarterly, int LoggedOnUserId)
        {
            try
            {
                if (!FoundDuplicateInNetworkGroup(UpfrontId))
                {
                    int Year;
                    List<int> upfrontIds;
                    var upfront = _context.Upfronts.Where(x => x.UpfrontId == UpfrontId).Single();

                    if (_context.Upfronts.Where(x => x.UpfrontId == UpfrontId).Single().PlanYrType == "B")
                    {
                        Year = _context.Quarter.Where(x => x.QuarterId == upfront.QuarterId).Select(x => x.BroadcastYr).Single();
                        upfrontIds = _context.Upfronts.Where(x => x.NetworkId == upfront.NetworkId && x.UpfrontTypeId == 2)
                        .Join(_context.Quarter.Where(x => x.BroadcastYr == Year), a => a.QuarterId, b => b.QuarterId, (a, b) => a.UpfrontId).ToList();
                    }
                    else
                    {
                        Year = _context.Quarter.Where(x => x.QuarterId == upfront.QuarterId).Select(x => x.CalendarYr).Single();
                        upfrontIds = _context.Upfronts.Where(x => x.NetworkId == upfront.NetworkId && x.UpfrontTypeId == 2)
                        .Join(_context.Quarter.Where(x => x.CalendarYr == Year), a => a.QuarterId, b => b.QuarterId, (a, b) => a.UpfrontId).ToList();
                    }

                    DateTime currentTime = DateTime.Now;
                    var user = _context.Users.Where(y => y.UserId == LoggedOnUserId).Single();
                    _context.UpfrontExpansionTracking.Where(x => upfrontIds.Contains(x.Upfront.UpfrontId)).ToList().ForEach(x => { x.Yearly = YearlyQuarterly; x.UpdatedBy = user; x.UpdateDt = currentTime; });

                    //Create Upfront Expansion Tracking for quarters that do not exist
                    foreach (var id in upfrontIds)
                    {
                        if (_context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == id).Count() == 0)
                        {
                            _context.Add(new UpfrontExpansionTracking()
                            {
                                CreateDt = currentTime,
                                UpdateDt = currentTime,
                                UpdatedBy = user,
                                Upfront = _context.Upfronts.Where(x => x.UpfrontId == id).Single(),
                                UEDollarsAvailable = 0,
                                TotalUpfrontDollars = 0,
                                YearlyUEDollarsAvailable = 0,
                                YearlyTotalUpfrontDollars = 0,
                                Yearly = YearlyQuarterly
                            });
                        }
                    }

                    if (_context.ChangeTracker.HasChanges())
                        if (_context.SaveChanges() < 0)
                            return false;

                    return true;

                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in saving (Yearly/Quarterly Settings) - UpfrontId " + UpfrontId.ToString() + " " + exc.Message);

            }

            return false;
        }

        private bool FoundDuplicateInNetworkGroup(int UpfrontId)
        {
            var GroupId = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == UpfrontId).Join(_context.UpfrontExpansionNetworkGroup,
                a => new { a.Upfront.Network.NetworkId, a.Upfront.Quarter.QuarterId }, b => new { b.Network.NetworkId, b.QuarterId }, (a, b) => b.GroupId).SingleOrDefault();
            if (GroupId != 0)
            {
                var upfrontIds_ForGroup = _context.UpfrontExpansionNetworkGroup.Where(x => x.GroupId == GroupId)
                    .Join(_context.Upfronts.Where(x => x.UpfrontTypeId == 2), a => new { a.Network.NetworkId, a.QuarterId },
                    b => new { b.Network.NetworkId, b.Quarter.QuarterId }, (a, b) => b.UpfrontId).ToArray();

                var UpfrontExpansionTracking_InGroup = _context.UpfrontExpansionTracking.Where(x => upfrontIds_ForGroup.Contains(x.Upfront.UpfrontId));
                if (UpfrontExpansionTracking_InGroup.Count() > 1)
                    return true;
                else if (!UpfrontExpansionTracking_InGroup.Contains(_context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == UpfrontId).Single()))
                    return true;
            }
            return false;
        }
        public void GetYearUsageTracker(int UpfrontId, int LoggedOnUserId, out int FundsUsed, out int FundsRemaining)
        {
            FundsUsed = 0;
            FundsRemaining = 0;
            try
            {
                // ST-946 Code Implementation with Dapper
                YearUsageTrackerModel model = new YearUsageTrackerModel();
                string spName = "sp_UpfrontExpansion_GetYearUsageTracker";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                //dbparams.Add("GetAll", false, DbType.Boolean);
                model = FactoryServices.dbFactory.SelectCommand_SP(model, spName, dbparams);
                if (model != null)
                {
                    FundsUsed = Convert.ToInt32(model.UEBooked);
                    FundsRemaining = Convert.ToInt32(model.FundsRemaining);
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in retrieving Usage Tracker for the Year | UpfrontId: " + UpfrontId.ToString() + exc.Message);
            }
            finally
            {
            }
        }

        #region Admin Upfront Expansion
        private int[] GetCountryQuarters(int Year, int CountryId)
        {
            int[] quarters;
            string Country = _context.Countries.Where(x => x.CountryId == CountryId).Select(x => x.CountryShort).Single();
            if (Country == "US")
            {
                quarters = _context.Quarter.Where(x => x.BroadcastYr == Year).Select(x => x.QuarterId).ToArray();
            }
            else
            {
                quarters = _context.Quarter.Where(x => x.CalendarYr == Year).Select(x => x.QuarterId).ToArray();
            }
            return quarters;
        }
        private bool NetworksHasManageUE (int Year, string Country, int[] Networks, out string errorMsg) {
            errorMsg = string.Empty;
            //Check if any dollar amounts or trades have been made for these networks for the current Year
            var quarters = GetCountryQuarters(Year, _context.Countries.Where(x => x.CountryShort == Country).Select(x => x.CountryId).Single());
            foreach (int id in Networks)
            {
                var UpfrontIds = _context.Upfronts.Where(x => x.NetworkId == id && quarters.Contains(x.QuarterId ?? 0)).Select(x => x.UpfrontId).ToArray();
                if (_context.UpfrontExpansionTracking.Where(x => (x.TotalUpfrontDollars > 0 || x.UEDollarsAvailable > 0 || x.YearlyTotalUpfrontDollars > 0 || x.YearlyUEDollarsAvailable > 0) && UpfrontIds.Contains(x.Upfront.UpfrontId)).Count() > 0)
                {
                    errorMsg = "There is an existing upfront expansion management for " + _context.Networks.Where(x => x.NetworkId == id).Select(x => x.StdNetName).Single();
                    return true;
                }
                else if (_context.UpfrontExpansionTracking.Where(x => UpfrontIds.Contains(x.Upfront.UpfrontId)).Join(_context.UpfrontExpansionTrackingLines, a => a.UpfrontExpansionTrackingId, b => b.UpfrontExpansionTrackingId,
                    (a, b) => a.UpfrontExpansionTrackingId).Count() > 0)
                {
                    errorMsg = "There are existing trades for network " + _context.Networks.Where(x => x.NetworkId == id).Select(x => x.StdNetName).Single();
                    return true;
                }
            }
            return false;
        }

        private bool NetworksHasManageUE(int UpfrontExpansionNetworkGroupId, out string errorMsg) {
            errorMsg = string.Empty;
            //Check if any dollar amounts or trades have been made for this UpfrontExpansionNetworkGroupId for the current Year
            var quarters = _context.UpfrontExpansionNetworkGroup.Where(x => x.UpfrontExpansionNetworkGroupId == UpfrontExpansionNetworkGroupId).Select(x => x.QuarterId).Distinct().ToArray();
            var networks = _context.UpfrontExpansionNetworkGroup.Where(x => x.UpfrontExpansionNetworkGroupId == UpfrontExpansionNetworkGroupId).Select(x => x.NetworkId).Distinct().ToArray();
            foreach (int id in networks)
            {
                var UpfrontIds = _context.Upfronts.Where(x => x.NetworkId == id && quarters.Contains(x.QuarterId ?? 0)).Select(x => x.UpfrontId).ToArray();
                if (_context.UpfrontExpansionTracking.Where(x => (x.TotalUpfrontDollars > 0 || x.UEDollarsAvailable > 0 || x.YearlyTotalUpfrontDollars > 0 || x.YearlyUEDollarsAvailable > 0) && UpfrontIds.Contains(x.Upfront.UpfrontId)).Count() > 0)
                {
                    errorMsg = "There is an existing upfront expansion management for this network group.";
                    return true;
                }
                else if (_context.UpfrontExpansionTracking.Where(x => UpfrontIds.Contains(x.Upfront.UpfrontId)).Join(_context.UpfrontExpansionTrackingLines, a => a.UpfrontExpansionTrackingId, b => b.UpfrontExpansionTrackingId,
                    (a, b) => a.UpfrontExpansionTrackingId).Count() > 0)
                {
                    errorMsg = "There are existing trades for this network group.";
                    return true;
                }
            }
            return false;
        }
        public IEnumerable<KeyValuePair<int, string>> GetNetworkGroups(int Year, int CountryId, int LoggedOnUserId)
        {
            //try
            //{
            //    var quarters = GetCountryQuarters(Year, CountryId);
            //    var Ids = _context.UpfrontExpansionNetworkGroup.ToList().Where(x => quarters.Contains(x.QuarterId)).Select(x => x.UpfrontExpansionNetworkGroupId).Distinct().ToList();
            //    var DistinctNetworkGroups = _context.UpfrontExpansionNetworkGroup.Include(x => x.Network).Where(x => x.Network.CountryId == CountryId && Ids.Contains(x.UpfrontExpansionNetworkGroupId)).GroupBy(x => new { x.UpfrontExpansionNetworkGroupId, x.Network.NetworkId, x.Network.StdNetName })
            //        .GroupBy(x => x.Key.UpfrontExpansionNetworkGroupId).Select(y => new KeyValuePair<int, string>(y.Key, String.Join(", ", y.Select(x => x.Key.StdNetName))));
            //    return DistinctNetworkGroups.
            //}

            //catch (Exception exc)
            //{
            //    _logger.LogError(LoggedOnUserId, "Error in GetNetworkGroups " + exc.Message);
            //}
            //return null;
            try
            {
                var quarters = GetCountryQuarters(Year, CountryId);
                var Ids = _context.UpfrontExpansionNetworkGroup.Where(x => quarters.Contains(x.QuarterId)).Select(x => x.UpfrontExpansionNetworkGroupId).Distinct();
                //Old Code Giving Error after Migration
                //var DistinctNetworkGroups = _context.UpfrontExpansionNetworkGroup.Include(x => x.Network).Where(x => x.Network.CountryId == CountryId && Ids.Contains(x.UpfrontExpansionNetworkGroupId)).GroupBy(x => new { x.UpfrontExpansionNetworkGroupId, x.Network.NetworkId, x.Network.StdNetName })
                //    .GroupBy(x => x.Key.UpfrontExpansionNetworkGroupId).AsEnumerable().Select(y => new KeyValuePair<int, string>(y.Key, String.Join(", ", y.Select(x => x.Key.StdNetName))));

                //New Code modifed to get the list of values, .NET 6.0
                var Countrygroups = _context.UpfrontExpansionNetworkGroup.Include(n => n.Network).Where(x => x.Network.CountryId.Equals(CountryId)).ToList();                
                var DistinctNetworkGroups = (from a in Countrygroups join b in Ids.ToList() on a.UpfrontExpansionNetworkGroupId equals b select a)
                    .GroupBy(x => new { x.UpfrontExpansionNetworkGroupId, x.Network.NetworkId, x.Network.StdNetName })
                    .GroupBy(x => x.Key.UpfrontExpansionNetworkGroupId).AsEnumerable()
                    .Select(y => new KeyValuePair<int, string>(y.Key, String.Join(", ", y.Select(x => x.Key.StdNetName))));
                return DistinctNetworkGroups;
            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetNetworkGroups " + exc.Message);
            }
            return null;
        }

        public IEnumerable<Network> GetNetworksForGroup(int UpfrontExpansionNetworkGroupId, int LoggedOnUserId)
        {
            try
            {
                return _context.UpfrontExpansionNetworkGroup.Where(x => x.UpfrontExpansionNetworkGroupId == UpfrontExpansionNetworkGroupId).Select(x => x.Network).Distinct().OrderBy(x => x.StdNetName);
            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetNetworks " + exc.Message);
            }
            return null;
        }

        public bool AddNetworkToGroup(int UpfrontExpansionNetworkGroupId, int[] Networks, int Year, string Country, int LoggedOnUserId, out string errorMsg)
        {
            errorMsg = string.Empty;
            try
            {
                //if (NetworksHasManageUE(Year, Country, Networks, out errorMsg))
                //  return false;

                var upfronts = _context.UpfrontExpansionTracking.Where(a => a.Upfront.UpfrontTypeId == 2).Join(_context.UpfrontExpansionNetworkGroup.Where(b => b.UpfrontExpansionNetworkGroupId == UpfrontExpansionNetworkGroupId),
                    a => new { NetworkId = a.Upfront.NetworkId, QuarterId = a.Upfront.QuarterId },
                    b => new { NetworkId = (int?)(b.NetworkId), QuarterId = (int?)b.QuarterId }, (a, b) => new { a.Upfront.UpfrontId, a.Upfront.QuarterId }).ToList();

                int retval = 0;

                //ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("ID", typeof(int));
                foreach (int id in Networks)
                {
                    table.Rows.Add(id);
                }
                string spName = "sp_UpfrontExpansionGroup_AddNetwork";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontExpansionNetworkGroupId", UpfrontExpansionNetworkGroupId, DbType.Int32);
                dbparams.Add("Networks", table.AsTableValuedParameter("dbo.SingleColumnId"));
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                //return retval;

                if (retval > 0)
                {
                    using (var tran = _context.Database.BeginTransaction())
                    {
                        var quarters = GetCountryQuarters(Year, _context.Countries.Where(x => x.CountryShort == Country).Select(x => x.CountryId).Single());

                        var ues = _context.Upfronts.Where(a => Networks.Contains(a.NetworkId ?? 0) && quarters.Contains(a.QuarterId ?? 0) && a.UpfrontTypeId == 2).Join(_context.UpfrontExpansionTracking,
                                  a => a.UpfrontId, b => b.Upfront.UpfrontId, (a, b) => new { a.UpfrontId, a.QuarterId, b.TotalUpfrontDollars, b.UEDollarsAvailable, b.YearlyTotalUpfrontDollars, b.YearlyUEDollarsAvailable }).ToList();

                        var uesGrpByQuarterId = ues.GroupBy(x => x.QuarterId).Select(g => new { QuarterId = g.Key, TotalUpfrontDollars = g.Sum(x => x.TotalUpfrontDollars), UEDollarsAvailable = g.Sum(x => x.UEDollarsAvailable), YearlyTotalUpfrontDollars = g.Sum(x => x.YearlyTotalUpfrontDollars), YearlyUEDollarsAvailable = g.Sum(x => x.YearlyUEDollarsAvailable) });

                        foreach (var ue in uesGrpByQuarterId)
                        {
                            if (upfronts.Count() > 0)
                            {
                                var upfrontId = upfronts.Where(x => x.QuarterId == ue.QuarterId).Select(x => x.UpfrontId).SingleOrDefault();
                                if (upfrontId > 0)
                                {
                                    var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                                    _upfrontExpansionTracking.TotalUpfrontDollars = _upfrontExpansionTracking.TotalUpfrontDollars + ue.TotalUpfrontDollars;
                                    _upfrontExpansionTracking.UEDollarsAvailable = _upfrontExpansionTracking.UEDollarsAvailable + ue.UEDollarsAvailable;
                                    _upfrontExpansionTracking.YearlyTotalUpfrontDollars = _upfrontExpansionTracking.YearlyTotalUpfrontDollars + ue.YearlyTotalUpfrontDollars;
                                    _upfrontExpansionTracking.YearlyUEDollarsAvailable = _upfrontExpansionTracking.YearlyUEDollarsAvailable + ue.YearlyUEDollarsAvailable;

                                    var upfrontIds = ues.Where(x => x.QuarterId == ue.QuarterId).Select(x => x.UpfrontId).ToList();
                                    foreach (var uId in upfrontIds)
                                    {
                                        var _ue = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == uId).Single();
                                        _context.UpfrontExpansionTracking.Remove(_ue);
                                    }
                                    _context.SaveChanges();
                                }
                            }
                            else
                            {
                                var upfrontIds = ues.Where(x => x.QuarterId == ue.QuarterId).Select(x => x.UpfrontId).ToList();
                                var count = 0;
                                if (upfrontIds.Count() > 1)
                                {
                                    foreach (var upfrontId in upfrontIds)
                                    {
                                        if (count == 0)
                                        {
                                            var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                                            _upfrontExpansionTracking.TotalUpfrontDollars = ue.TotalUpfrontDollars;
                                            _upfrontExpansionTracking.UEDollarsAvailable = ue.UEDollarsAvailable;
                                            _upfrontExpansionTracking.YearlyTotalUpfrontDollars = ue.YearlyTotalUpfrontDollars;
                                            _upfrontExpansionTracking.YearlyUEDollarsAvailable = ue.YearlyUEDollarsAvailable;
                                            count += 1;
                                        }
                                        else
                                        {
                                            var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                                            _context.UpfrontExpansionTracking.Remove(_upfrontExpansionTracking);
                                        }

                                    }
                                    _context.SaveChanges();
                                }
                            }
                        }
                        tran.Commit();
                    }
                    return true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AddNetworkToGroup " + exc.Message);
            }

            return false;
        }
        public bool DeleteNetworkInGroup(int NetworkId, int UpfrontExpansionNetworkGroupId, int LoggedOnUserId, out string errorMsg)
        {
            errorMsg = string.Empty;
            try
            {
                if (NetworksHasManageUE(UpfrontExpansionNetworkGroupId, out errorMsg))
                    return false;

                //ST-946 Code Implementation with Dapper
                Int32 retval = 0;
                string spName = "sp_UpfrontExpansionGroup_DeleteNetwork";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontExpansionNetworkGroupId", UpfrontExpansionNetworkGroupId, System.Data.DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                if (retval > 0)
                {
                    return true;
                }
            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in DeleteNetworkInGroup " + exc.Message);
                return false;
            }
            return true;
        }
        public bool AddNewNetworkGroup(int Year, string Country, int[] Networks, out string errorMsg, int LoggedOnUserId)
        {
            errorMsg = string.Empty;
            try
            {
                //Check if the network already belongs to another group

                //foreach (int id in Networks)
                //{
                //    if (_context.UpfrontExpansionNetworkGroup.Where(x => x.NetworkId == id && quarters.Contains(x.QuarterId)).Count() > 0)
                //    {
                //        errorMsg = _context.Networks.Where(x => x.NetworkId == id).Select(x => x.StdNetName).Single() + " already exists in another Network Group for Year " + Year;
                //        return false;
                //    }                        
                //}

                //if (NetworksHasManageUE(Year, Country, Networks, out errorMsg))
                //    return false;                

                //ST-946 Code Implementation with Dapper
                int retval = 0;
                DataTable table = new DataTable();
                table.Columns.Add("ID", typeof(int));
                foreach (int id in Networks)
                {
                    table.Rows.Add(id);
                }
                string spName = "sp_UpfrontExpansionGroup_AddGroup";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("Year", Year, DbType.Int32);
                dbparams.Add("Country", Country, DbType.String);
                dbparams.Add("Networks", table.AsTableValuedParameter("dbo.SingleColumnId"));
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);

                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                //return retval;

                if (retval > 0)
                {
                    using (var tran = _context.Database.BeginTransaction())
                    {
                        var quarters = GetCountryQuarters(Year, _context.Countries.Where(x => x.CountryShort == Country).Select(x => x.CountryId).Single());

                        var ues = _context.Upfronts.Where(a => Networks.Contains(a.NetworkId ?? 0) && quarters.Contains(a.QuarterId ?? 0) && a.UpfrontTypeId == 2).Join(_context.UpfrontExpansionTracking,
                           a => a.UpfrontId, b => b.Upfront.UpfrontId, (a, b) => new { a.UpfrontId, a.QuarterId, b.TotalUpfrontDollars, b.UEDollarsAvailable, b.YearlyTotalUpfrontDollars, b.YearlyUEDollarsAvailable }).ToList();

                        var uesGrpByQuarterId = ues.GroupBy(x => x.QuarterId).
                            Select(g => new { Count = g.Count(), QuarterId = g.Key, TotalUpfrontDollars = g.Sum(x => x.TotalUpfrontDollars), UEDollarsAvailable = g.Sum(x => x.UEDollarsAvailable), YearlyTotalUpfrontDollars = g.Sum(x => x.YearlyTotalUpfrontDollars), YearlyUEDollarsAvailable = g.Sum(x => x.YearlyUEDollarsAvailable) }).Where(g => g.Count > 1).ToList();

                        if (uesGrpByQuarterId.Count() > 0)
                        {
                            foreach (var ue in uesGrpByQuarterId)
                            {
                                var upfrontIds = ues.Where(x => x.QuarterId == ue.QuarterId).Select(x => x.UpfrontId).ToList();
                                var count = 0;
                                foreach (var upfrontId in upfrontIds)
                                {
                                    if (count == 0)
                                    {
                                        var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                                        _upfrontExpansionTracking.TotalUpfrontDollars = ue.TotalUpfrontDollars;
                                        _upfrontExpansionTracking.UEDollarsAvailable = ue.UEDollarsAvailable;
                                        _upfrontExpansionTracking.YearlyTotalUpfrontDollars = ue.YearlyTotalUpfrontDollars;
                                        _upfrontExpansionTracking.YearlyUEDollarsAvailable = ue.YearlyUEDollarsAvailable;
                                        count += 1;
                                    }
                                    else
                                    {
                                        var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                                        _context.UpfrontExpansionTracking.Remove(_upfrontExpansionTracking);
                                    }
                                    _context.SaveChanges();
                                }
                            }
                            tran.Commit();
                            return true;
                        }
                    }
                }
                //    using (DbConnection conn = _spcontext.Database.GetDbConnection())
                //{
                //    if (conn.State == ConnectionState.Closed)
                //    {
                //        conn.Open();
                //    }
                //    using (DbCommand command = conn.CreateCommand())
                //    {
                //        command.CommandText = "sp_UpfrontExpansionGroup_AddGroup";
                //        command.CommandType = CommandType.StoredProcedure;

                //        SqlParameter param = new SqlParameter("@Year", SqlDbType.Int);
                //        param.Value = Year;
                //        command.Parameters.Add(param);
                //        param = new SqlParameter("@Country", SqlDbType.NVarChar, 2);
                //        param.Value = Country;
                //        command.Parameters.Add(param);

                //        DataTable table = new DataTable();
                //        table.Columns.Add("ID", typeof(int));
                //        foreach (int id in Networks)
                //        {
                //            table.Rows.Add(id);
                //        }
                //        param = new SqlParameter("@Networks", SqlDbType.Structured);
                //        param.TypeName = "dbo.SingleColumnId";
                //        param.Value = table;
                //        command.Parameters.Add(param);

                //        param = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //        param.Value = LoggedOnUserId;
                //        command.Parameters.Add(param);

                //        if (command.ExecuteNonQuery() > 0)
                //        {
                //            using (var tran = _context.Database.BeginTransaction())
                //            {
                //                var quarters = GetCountryQuarters(Year, _context.Countries.Where(x => x.CountryShort == Country).Select(x => x.CountryId).Single());
                                                               
                //                var ues = _context.Upfronts.Where(a => Networks.Contains(a.NetworkId ?? 0) && quarters.Contains(a.QuarterId ?? 0) && a.UpfrontTypeId == 2).Join(_context.UpfrontExpansionTracking,
                //                   a => a.UpfrontId, b => b.Upfront.UpfrontId, (a, b) => new { a.UpfrontId, a.QuarterId, b.TotalUpfrontDollars, b.UEDollarsAvailable, b.YearlyTotalUpfrontDollars, b.YearlyUEDollarsAvailable }).ToList();

                //                var uesGrpByQuarterId = ues.GroupBy(x => x.QuarterId).
                //                    Select(g => new { Count = g.Count(), QuarterId = g.Key, TotalUpfrontDollars = g.Sum(x => x.TotalUpfrontDollars), UEDollarsAvailable = g.Sum(x => x.UEDollarsAvailable), YearlyTotalUpfrontDollars = g.Sum(x => x.YearlyTotalUpfrontDollars), YearlyUEDollarsAvailable = g.Sum(x => x.YearlyUEDollarsAvailable) }).Where(g => g.Count > 1).ToList();

                //                if (uesGrpByQuarterId.Count() > 0)
                //                {
                //                    foreach (var ue in uesGrpByQuarterId)
                //                    {
                //                        var upfrontIds = ues.Where(x => x.QuarterId == ue.QuarterId).Select(x => x.UpfrontId).ToList();
                //                        var count = 0;
                //                        foreach (var upfrontId in upfrontIds)
                //                        {
                //                            if (count == 0)
                //                            {
                //                                var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                //                                _upfrontExpansionTracking.TotalUpfrontDollars = ue.TotalUpfrontDollars;
                //                                _upfrontExpansionTracking.UEDollarsAvailable = ue.UEDollarsAvailable;
                //                                _upfrontExpansionTracking.YearlyTotalUpfrontDollars = ue.YearlyTotalUpfrontDollars;
                //                                _upfrontExpansionTracking.YearlyUEDollarsAvailable = ue.YearlyUEDollarsAvailable;                                                
                //                                count += 1;
                //                            }
                //                            else
                //                            {
                //                                var _upfrontExpansionTracking = _context.UpfrontExpansionTracking.Where(x => x.Upfront.UpfrontId == upfrontId).Single();
                //                                _context.UpfrontExpansionTracking.Remove(_upfrontExpansionTracking);
                //                            }
                //                            _context.SaveChanges();
                //                        }
                //                    }
                //                    tran.Commit();
                //                    return true;
                //                }
                //            }
                //        }
                //    }
                //}
            }

            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in AddNewNetworkGroup " + exc.Message);
                return false;
            }
            return true;
        }
        public IEnumerable<string> GetNetworkGroup(int? NetworkId, int? QuarterId, int LoggedOnUserId)
        {
            try
            {
                var groupId = _context.UpfrontExpansionNetworkGroup.Where(u => u.NetworkId == NetworkId && u.QuarterId == QuarterId).Select(u => u.GroupId).SingleOrDefault();
                return _context.UpfrontExpansionNetworkGroup.Where(x => x.GroupId == groupId).Select(x => x.Network.StdNetName).ToList();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetNetworkGroup " + exc.Message);
            }
            return null;
        }
        #endregion
    }
}
