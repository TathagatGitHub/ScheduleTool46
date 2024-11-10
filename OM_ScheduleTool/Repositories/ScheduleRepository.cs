using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AppContext = OM_ScheduleTool.Models.AppContext;
using OM_ScheduleTool.Dapper;
using Dapper;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;
using OfficeOpenXml.Core.Worksheet.Fill;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using static DataTables.Upload;
using System.Runtime.Intrinsics.Arm;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.AspNetCore.HttpOverrides;
using OM_ScheduleTool.ViewModels;

namespace OM_ScheduleTool.Repositories
{
    public class ScheduleProposalRepository : IScheduleProposalRepository
    {
        protected AppContext _context;
        protected StoredProcsContext _spcontext;
        protected ILogger<PropertyRepository> _logger;
        protected IUserRepository _userRepository;
        protected int _scheduleTypeId;


        protected ScheduleProposalRepository(AppContext context
            , StoredProcsContext spcontext
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger)
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
            _userRepository = userRepository;
            _scheduleTypeId = 2;
        }

        public int GetLockCount()
        {
            return _context.Schedule
                .Where(u => u.LockedDt != null && u.ScheduleTypeId == _scheduleTypeId)
                .Count();

        }

        public ErrorMessage GetChangedCount(int LoggedOnUserId, int ScheduleId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_ChangeCount";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleId", ScheduleId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }

            return err;

        }

        public ErrorMessage Delete(int LoggedOnUserId, int ScheduleProposalId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_Delete";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }

            return err;

        }

        public ErrorMessage SaveWeeklySpots(int LoggedOnUserId, int ScheduleLineId, int WeekNo, int Spots)
        {
            string Message = "";
            try
            {
                // ST-946 Code Implementation with Dapper
                ErrorMessage err = new ErrorMessage();
                string spName = "sp_ScheduleProposal_SaveWeeklySpot";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleLineId", ScheduleLineId, System.Data.DbType.Int32);
                dbparams.Add("WeekNo", WeekNo, System.Data.DbType.Int32);
                dbparams.Add("Spots", Spots, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                return err;
            }
            catch (Exception exc)
            {
                Message = "Unable to save weekly spot. " + exc.Message;
                _logger.LogError(LoggedOnUserId, Message);
                return new ErrorMessage(false, -1, Message);
            }
            finally
            {
            }

            return new ErrorMessage(false, -2, "No records found.");

        }

        public ErrorMessage GetWeeklySpot(int LoggedOnUserId, int ScheduleLineId, int WeekNo)
        {
            string Message = "";
            try
            {
                // ST-946 Code Implementation with Dapper
                ErrorMessage err = new ErrorMessage();
                string spName = "sp_ScheduleProposal_GetWeeklySpot";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleLineId", ScheduleLineId, System.Data.DbType.Int32);
                dbparams.Add("WeekNo", WeekNo, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                if (err != null)
                    if (err.Value > 0)
                    {
                        err.ResponseCode = err.Value;
                        if (!string.IsNullOrEmpty(err.Color))
                        {
                            err.ResponseText = err.Color;
                        }
                    }
            }
            catch (Exception exc)
            {
                Message = "Unable to get weekly spot. " + exc.Message;
                _logger.LogError(LoggedOnUserId, Message);
                return new ErrorMessage(false, -1, Message);
            }
            finally
            {
               // conn.Close();
            }

            return new ErrorMessage(false, -2, "No records found.");

        }

        public ErrorMessage SaveChanges(int LoggedOnUserId, int ScheduleId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                //_context.Database.GetDbConnection().Open();

                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_SaveChanges";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleId", ScheduleId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }

            return err;

        }

        public string Lock(int LoggedOnUserId, int Id)
        {
            string Message = "";
           // DbConnection conn = _context.Database.GetDbConnection();
            try
            {
                // ST-946 Code Implementation with Dapper
                ErrorMessage err = new ErrorMessage();
                string spName = "sp_Schedule_Lock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleId", Id, System.Data.DbType.Int32);
                dbparams.Add("IsFullyLocked", false, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                Message = err.ResponseText;
                if (err.Success)
                {
                    return "";
                }
                else
                {
                    return Message;
                }
            }
            catch (Exception exc)
            {
                Message = "Unable to lock schedule. " + exc.Message;
                _logger.LogError(LoggedOnUserId, Message);
                return Message;
            }
            finally
            {
            }

            return Message;
        }
        public bool Unlock(int LoggedOnUserId, int Id, bool IsCalledFromBtn)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                string retval = "";
                string spName = "sp_Schedule_Unlock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("Id", Id, System.Data.DbType.Int32);
                dbparams.Add("IsCalledFromBtn", IsCalledFromBtn, System.Data.DbType.Boolean);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to lock schedule. " + exc.Message);
                return false;
            }
            finally
            {
            }

            return true;
        }

        public ErrorMessage DeleteLine(int LoggedOnUserId, int LineId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_DeleteScheduleLine";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleLineId", LineId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                if (err.ResponseCode == 1)
                    err.Success = true;
                else
                    err.Success = false;
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;
            }
            finally
            {
            }

            return err;
        }


        public SchedulePermissions GetInfoById(int LoggedOnUserId, int Id)
        {
            try
            {

                // ST-946 Code Implementation with Dapper
                SchedulePermissions proposal = new SchedulePermissions();
                string spName = "sp_Proposal_GetInfoById";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", Id, System.Data.DbType.Int32);

                proposal = FactoryServices.dbFactory.SelectCommand_SP(proposal, spName, dbparams);

                if (proposal != null && proposal.ScheduleId > 0)
                {
                    proposal.ScheduleType = _context
                                .ScheduleTypes
                                .Where(st => st.ScheduleTypeId == proposal.ScheduleTypeId)
                                .FirstOrDefault<ScheduleType>();
                    proposal.Client = _context
                                .Clients
                                .Where(c => c.ClientId == proposal.ClientId)
                                .FirstOrDefault<Client>();
                    if(proposal.BuyerUserId != null && proposal.BuyerUserId>0)
                    {
                        proposal.BuyerUser = _context
                                    .Users
                                    .Where(u => u.UserId == Convert.ToInt32(proposal.BuyerUserId))
                                    .FirstOrDefault<Models.User>();
                    }
                    if (proposal.BuyerAsstUserId != null && proposal.BuyerAsstUserId > 0)
                    {
                        proposal.BuyerAsstUser = _context
                                    .Users
                                    .Where(u => u.UserId == Convert.ToInt32(proposal.BuyerAsstUserId))
                                    .FirstOrDefault<Models.User>();
                    }
                    if (proposal.UpdatedByUserId != null && proposal.UpdatedByUserId>0)
                    {
                        proposal.UpdatedBy = new Models.User();
                        proposal.UpdatedBy.UserId = Convert.ToInt32(proposal.UpdatedByUserId);
                        proposal.UpdatedBy.DisplayName = Convert.ToString(proposal.UpdatedByName);
                    }
                    if (proposal.LockedByUserId != null && proposal.LockedByUserId > 0)
                    {
                        proposal.LockedByUser = new Models.User();
                        proposal.LockedByUser.UserId = Convert.ToInt32(proposal.LockedByUserId);
                        proposal.LockedByUser.DisplayName = Convert.ToString(proposal.ProposalLockedByName);
                        proposal.LockedDt = proposal.ProposalLockedDate;
                    }
                }
                return proposal;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load schedule. Id: " + Id.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public IEnumerable<SchedulePermissions> GetInfoByClient(int LoggedOnUserId, int ClientId, int BroadcastYr)
        {
            try
            {
                List<SchedulePermissions> proposal2 = new List<SchedulePermissions>();
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetInfoByClient";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("Year", BroadcastYr, System.Data.DbType.Int32);
                dbparams.Add("ScheduleTypeId", _scheduleTypeId, System.Data.DbType.Int32);

                proposal2 = FactoryServices.dbFactory.SelectCommand_SP(proposal2, spName, dbparams);
                for (int x = 0; x < proposal2.Count; x++)
                {
                    if (proposal2[x] != null && proposal2[x].ScheduleId > 0)
                    {
                        proposal2[x].ScheduleType = _context
                                    .ScheduleTypes
                                    .Where(st => st.ScheduleTypeId == proposal2[x].ScheduleTypeId)
                                    .FirstOrDefault<ScheduleType>();
                        proposal2[x].Client = _context
                                    .Clients
                                    .Where(c => c.ClientId == proposal2[x].ClientId)
                                    .FirstOrDefault<Client>();
                        if (proposal2[x].BuyerUserId != null && proposal2[x].BuyerUserId > 0)
                        {
                            proposal2[x].BuyerUser = _context
                                        .Users
                                        .Where(u => u.UserId == Convert.ToInt32(proposal2[x].BuyerUserId))
                                        .FirstOrDefault<Models.User>();
                        }
                        if (proposal2[x].BuyerAsstUserId != null && proposal2[x].BuyerAsstUserId > 0)
                        {
                            proposal2[x].BuyerAsstUser = _context
                                        .Users
                                        .Where(u => u.UserId == Convert.ToInt32(proposal2[x].BuyerAsstUserId))
                                        .FirstOrDefault<Models.User>();
                        }
                        if (proposal2[x].UpdatedByUserId != null && proposal2[x].UpdatedByUserId > 0)
                        {
                            proposal2[x].UpdatedBy = new Models.User();
                            proposal2[x].UpdatedBy.UserId = Convert.ToInt32(proposal2[x].UpdatedByUserId);
                            proposal2[x].UpdatedBy.DisplayName = Convert.ToString(proposal2[x].UpdatedByName);
                        }
                        if (proposal2[x].LockedByUserId != null && proposal2[x].LockedByUserId > 0)
                        {
                            proposal2[x].LockedByUser = new Models.User();
                            proposal2[x].LockedByUser.UserId = Convert.ToInt32(proposal2[x].LockedByUserId);
                            proposal2[x].LockedByUser.DisplayName = Convert.ToString(proposal2[x].ProposalLockedByName);
                            proposal2[x].LockedDt = proposal2[x].ProposalLockedDate;
                        }

                    }
                }
              //  List<SchedulePermissions> proposal3 = schedules;
                return proposal2;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load schedule. ClientId: " + ClientId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;
        }

        public IEnumerable<ProposalNote> GetScheduleProposalNotes(int LoggedOnUserId, int ProposalId)
        {
            try
            {
                List<ProposalNote> proposalnotes2 = new List<ProposalNote>();
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ProposalNotes_Get";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("ProposalId", ProposalId, System.Data.DbType.Int32);

                proposalnotes2 = FactoryServices.dbFactory.SelectCommand_SP(proposalnotes2, spName, dbparam);
                for (int x = 0; x < proposalnotes2.Count; x++)
                {
                    if (proposalnotes2[x] != null && proposalnotes2[x].CreatedByUserId > 0)
                    {
                        proposalnotes2[x].CreatedBy = _context
                                    .Users
                                    .Where(u => u.UserId == Convert.ToInt32(proposalnotes2[x].CreatedByUserId))
                                    .FirstOrDefault<Models.User>();
                    }
                }
                return proposalnotes2;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load proposal notes. ProposalId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }
            return null;
        }

        public int AddNote(int LoggedOnUserId, int ProposalId, string Note)
        {
            try
            {
                ProposalNote newNote = new ProposalNote();
                newNote.CreatedByUserId = LoggedOnUserId;
                newNote.ProposalId = ProposalId;
                newNote.Note = Note;

                _context.ProposalNotes.Add(newNote);
                int NewId = _context.SaveChanges();
                return newNote.ProposalNoteId;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to add note. " + exc.Message);
                return -1;
            }

        }

        public bool AddSubNote(int LoggedOnUserId, int ProposalParentNoteId, string Note)
        {
            try
            {
                ProposalNote parentNote = _context.ProposalNotes.Where(u => u.ProposalNoteId == ProposalParentNoteId).FirstOrDefault();
                ProposalNote newNote = new ProposalNote();
                newNote.CreatedByUserId = LoggedOnUserId;
                newNote.ProposalId = parentNote.ProposalId;
                newNote.ParentNoteId = ProposalParentNoteId;
                newNote.Note = Note;

                _context.ProposalNotes.Add(newNote);
                _context.SaveChanges();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to add note. " + exc.Message);
                return false;
            }

            return true;
        }

        public SPUpfrontExpansionInfo GetUpfrontExpansionInfo(int LoggedOnUserId, int ScheduleProposalId, string NetworkNames, string BuyTypeCodes, bool ExchangeRate)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_GetUpfrontExpansionInfo";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparam.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparam.Add("NetworkNames", NetworkNames, System.Data.DbType.String);
                dbparam.Add("BuyTypeCodes", BuyTypeCodes, System.Data.DbType.String);
                dbparam.Add("USD", ExchangeRate, System.Data.DbType.Boolean);
                SPUpfrontExpansionInfo spue = new SPUpfrontExpansionInfo();
                spue = FactoryServices.dbFactory.SelectCommand_SP(spue, spName, dbparam);
                if(spue!= null)
                {
                    spue.ErrorMessage = new ErrorMessage(spue.Success, spue.ResponseCode, spue.ResponseText);
                }
                return spue;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable upfront expansion info. ScheduleProposalId: " + ScheduleProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        // GetNetworks () -- Gets all networks where properties can be added from
        public IEnumerable<Network> GetNetworks(int ClientId, int QuarterId, int CountryId, int ProposalId, int UserId)
        {
            List<Network> networks = new List<Network>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_AddProp_GetNetworks";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparam.Add("CountryId", CountryId, System.Data.DbType.Int32);
                dbparam.Add("QuarterId", QuarterId, System.Data.DbType.Int32);
                dbparam.Add("ScheduleProposalId", ProposalId, System.Data.DbType.Int32);
                dbparam.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                networks = FactoryServices.dbFactory.SelectCommand_SP(networks, spName, dbparam);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to call sp_ScheduleProposal_AddProp_GetNetworks.  (" + UserId.ToString() + " " + CountryId.ToString() + ") " + exc.Message);

            }
            finally
            {
            }
            return networks;

        }

        public IEnumerable<DemoNames> GetDemoNames(int ClientId, int QuarterId, int NetworkId, int ScheduleProposalId, int LoggedOnUserId)
        {
            List<DemoNames> lds = new List<DemoNames>();
            List<DemosModel> lds2 = new List<DemosModel>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_AddProp_GetDemos";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("QuarterId", QuarterId, System.Data.DbType.Int32);
                dbparam.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparam.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparam.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparam.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds2 = FactoryServices.dbFactory.SelectCommand_SP(lds2, spName, dbparam);
                if (lds2.Any())
                {
                    foreach (DemosModel dm in lds2)
                    {
                        lds.Add(new DemoNames(dm.DemographicSettingsId,dm.DemoName));
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_ScheduleProposal_AddProp_GetDemos. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<PropertyAddNew> GetAvailableProperties(int ScheduleProposalId, int NetworkId, int DemoId, int LoggedOnUserId)
        {
            List<PropertyAddNew> lds = new List<PropertyAddNew>();
            List<PropertyAddNew> lds2 = new List<PropertyAddNew>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_AddProp_GetAvailable";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparam.Add("NetworkId", NetworkId == 0 ? 396 : NetworkId, System.Data.DbType.Int32);
                dbparam.Add("DemographicSettingsId", DemoId, System.Data.DbType.Int32);
                dbparam.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds2 = FactoryServices.dbFactory.SelectCommand_SP(lds2, spName, dbparam);
                //if (lds2.Any())
                //{
                //    for (int x = 0; x < lds2.Count; x++)
                //    {
                //        //lds2[x].StartTimeFormatted = DateTime.Parse(reader["StartTime"].ToString()).ToString("hh:mm tt");
                //        //lds2[x].EndTimeFormatted = DateTime.Parse(reader["EndTime"].ToString()).ToString("hh:mm tt");
                //    }
                //}
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed ProposalRepository.GetAvailableProperties. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds2;
        }


        public ErrorMessage AddScheduleLines(int ProposalId, string RateIds, int UserId)
        {

            ErrorMessage err = new ErrorMessage(false, -1, "Unknown Error");
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_AddScheduleLines";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                dbparam.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                dbparam.Add("RateIds", RateIds, System.Data.DbType.String);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparam);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }
            finally
            {

            }
            return err;
        }

        public IEnumerable<ScheduleProposalLinesFlat> GetProposalLinesFlat(
                int LoggedOnUserId,
                int ProposalId,
                string ApprovedDesc,
                string Status,
                string RevNo,
                string RevisedDate,
                string DemoNames,
                string NetworkName,
                string PropertyName,
                string DP,
                string OMDP,
                string BuyType,
                string SpotLens,
                string RateAmt,
                string Impressions,
                string CPM,
                string EffectiveDate,
                string ExpirationDate,
                string Discounts,
                string TotalSpots,
                string StartToEnd,
                string usdRates,
                int PageNumber,
                int PageSize,
                float DiscountRate,
                bool ViewOnly,
                string SPBuy,
                string WK01Spots,
                string WK02Spots,
                string WK03Spots,
                string WK04Spots,
                string WK05Spots,
                string WK06Spots,
                string WK07Spots,
                string WK08Spots,
                string WK09Spots,
                string WK10Spots,
                string WK11Spots,
                string WK12Spots,
                string WK13Spots,
                string WK14Spots
                //, string Monday, string Tuesday, string Wednesday
                //, string Thursday, string Friday, string Saturday, string Sunday
                , string DOW
                ,bool CalledForDropDown, bool FilterForEdit//ST-724, Addedd CalledForDropDown,FilterForEdit parameters
                ,bool PremiereFilter //ST-807
                )
        {
            try
            {
                List<ScheduleProposalLinesFlat> scheduleLines = new List<ScheduleProposalLinesFlat>();
               // List<ScheduleProposalLinesFlat> scheduleLines2 = new List<ScheduleProposalLinesFlat>();

                //DbConnection conn = _context.Database.GetDbConnection();
                //if (conn.State == ConnectionState.Closed)
                //{
                //    conn.Open();
                //}

                //DbCommand command = conn.CreateCommand();
                //command.CommandText = "sp_Schedule_GetScheduleLines";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramId = new SqlParameter("@ScheduleId", SqlDbType.Int);
                //paramId.Value = ProposalId;
                //command.Parameters.Add(paramId);

                //SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //paramLoggedOnUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramLoggedOnUserId);

                //if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                //{
                //    SqlParameter paramApproved = new SqlParameter("@ApprovedDesc", SqlDbType.VarChar, 50);
                //    paramApproved.Value = ApprovedDesc;
                //    command.Parameters.Add(paramApproved);
                //}

                //if (Status != null && Status.Length > 0)
                //{
                //    SqlParameter paramStatus = new SqlParameter("@Status", SqlDbType.VarChar, 2000);
                //    paramStatus.Value = Status;
                //    command.Parameters.Add(paramStatus);
                //}

                //if (RevNo != null && RevNo.Length > 0)
                //{
                //    SqlParameter paramRevNo = new SqlParameter("@RevNo", SqlDbType.VarChar, 2000);
                //    paramRevNo.Value = RevNo;
                //    command.Parameters.Add(paramRevNo);
                //}

                //if (RevisedDate != null && RevisedDate.Length > 0)
                //{
                //    SqlParameter paramRevisedDate = new SqlParameter("@RevisedDate", SqlDbType.VarChar, 2000);
                //    paramRevisedDate.Value = RevisedDate;
                //    command.Parameters.Add(paramRevisedDate);
                //}

                //if (EffectiveDate != null && EffectiveDate.Length > 0)
                //{
                //    SqlParameter paramEffectiveDate = new SqlParameter("@EffectiveDate", SqlDbType.VarChar, 2000);
                //    paramEffectiveDate.Value = EffectiveDate;
                //    command.Parameters.Add(paramEffectiveDate);
                //}

                //if (ExpirationDate != null && ExpirationDate.Length > 0)
                //{
                //    SqlParameter paramExpirationDate = new SqlParameter("@ExpirationDate", SqlDbType.VarChar, 2000);
                //    paramExpirationDate.Value = ExpirationDate;
                //    command.Parameters.Add(paramExpirationDate);
                //}

                //if (DemoNames != null && DemoNames.Length > 0)
                //{
                //    SqlParameter paramDemoNames = new SqlParameter("@DemoNames", SqlDbType.VarChar, 2000);
                //    paramDemoNames.Value = DemoNames;
                //    command.Parameters.Add(paramDemoNames);
                //}

                //if (NetworkName != null && NetworkName.Length > 0)
                //{
                //    SqlParameter paramNetworkName = new SqlParameter("@NetworkNames", SqlDbType.VarChar, 2000);
                //    paramNetworkName.Value = NetworkName;
                //    command.Parameters.Add(paramNetworkName);
                //}

                //if (TotalSpots != null && TotalSpots.Length > 0)
                //{
                //    SqlParameter paramTotalSpots = new SqlParameter("@TotalSpots", SqlDbType.VarChar, 2000);
                //    paramTotalSpots.Value = TotalSpots;
                //    command.Parameters.Add(paramTotalSpots);
                //}

                //if (PropertyName != null && PropertyName.Length > 0)
                //{
                //    SqlParameter paramNPropertyName = new SqlParameter("@PropertyName", SqlDbType.VarChar, 8000);
                //    paramNPropertyName.Value = PropertyName;
                //    command.Parameters.Add(paramNPropertyName);
                //}

                //if (DP != null && DP.Length > 0)
                //{
                //    SqlParameter paramDP = new SqlParameter("@dp", SqlDbType.VarChar, 2000);
                //    paramDP.Value = DP;
                //    command.Parameters.Add(paramDP);
                //}

                //if (OMDP != null && OMDP.Length > 0)
                //{
                //    SqlParameter paramOMDP = new SqlParameter("@OMDP", SqlDbType.VarChar, 2000);
                //    paramOMDP.Value = OMDP;
                //    command.Parameters.Add(paramOMDP);
                //}

                //if (SpotLens != null && SpotLens.Length > 0)
                //{
                //    SqlParameter paramSpotLen = new SqlParameter("@SpotLen", SqlDbType.VarChar, 50);
                //    paramSpotLen.Value = SpotLens;
                //    command.Parameters.Add(paramSpotLen);
                //}

                //if (RateAmt != null && RateAmt.Length > 0)
                //{
                //    SqlParameter paramRate = new SqlParameter("@Rate", SqlDbType.VarChar, 2000);
                //    paramRate.Value = RateAmt;
                //    command.Parameters.Add(paramRate);
                //}

                //if (Discounts != null && Discounts.Length > 0)
                //{
                //    SqlParameter paramDiscounts = new SqlParameter("@Discounts", SqlDbType.VarChar, 8000);
                //    paramDiscounts.Value = Discounts;
                //    command.Parameters.Add(paramDiscounts);
                //}

                //if (Impressions != null && Impressions.Length > 0)
                //{
                //    SqlParameter paramImp = new SqlParameter("@Impressions", SqlDbType.VarChar, 2000);
                //    paramImp.Value = Impressions;
                //    command.Parameters.Add(paramImp);
                //}

                //if (BuyType != null && BuyType.Length > 0)
                //{
                //    SqlParameter paramBuyTypes = new SqlParameter("@BuyTypes", SqlDbType.VarChar, 2000);
                //    paramBuyTypes.Value = BuyType;
                //    command.Parameters.Add(paramBuyTypes);
                //}

                //if (StartToEnd != null && StartToEnd.Length > 0)
                //{
                //    SqlParameter paramStartToEnd = new SqlParameter("@StartToEnd", SqlDbType.VarChar, 2000);
                //    paramStartToEnd.Value = StartToEnd;
                //    command.Parameters.Add(paramStartToEnd);
                //}

                //if (CPM != null && CPM.Length > 0)
                //{
                //    SqlParameter paramCPM = new SqlParameter("@CPM", SqlDbType.VarChar, 8000);
                //    paramCPM.Value = CPM;
                //    command.Parameters.Add(paramCPM);
                //}

                //if (usdRates != null && usdRates.Length > 0)
                //{
                //    SqlParameter paramUSD = new SqlParameter("@usdRates", SqlDbType.VarChar, 2000);
                //    paramUSD.Value = usdRates;
                //    command.Parameters.Add(paramUSD);
                //}

                //SqlParameter paramPage = new SqlParameter("@Page", SqlDbType.Int);
                //paramPage.Value = PageNumber;
                //command.Parameters.Add(paramPage);

                //SqlParameter paramPageSize = new SqlParameter("@PageSize", SqlDbType.Int);
                //paramPageSize.Value = PageSize;
                //command.Parameters.Add(paramPageSize);

                //SqlParameter paramViewOnly = new SqlParameter("@ViewOnly", SqlDbType.Bit);
                //paramViewOnly.Value = ViewOnly;
                //command.Parameters.Add(paramViewOnly);

                //SqlParameter paramDiscount = new SqlParameter("@DiscountRate", SqlDbType.Float);
                //paramDiscount.Value = DiscountRate;
                //command.Parameters.Add(paramDiscount);

                //SqlParameter paramTotalsOnly = new SqlParameter("@ShowTotalsOnly", SqlDbType.Bit);
                //paramTotalsOnly.Value = false;
                //command.Parameters.Add(paramTotalsOnly);

                //if (SPBuy != null && SPBuy.Length > 0)
                //{
                //    SqlParameter paramSPBuy = new SqlParameter("@SPBuy", SqlDbType.VarChar, 10);
                //    paramSPBuy.Value = SPBuy;
                //    command.Parameters.Add(paramSPBuy);
                //}
                //if (WK01Spots != null && WK01Spots.Length > 0)
                //{
                //    SqlParameter paramWK01Spots = new SqlParameter("@WK01Spots", SqlDbType.VarChar, 2000);
                //    paramWK01Spots.Value = WK01Spots;
                //    command.Parameters.Add(paramWK01Spots);
                //}
                //if (WK02Spots != null && WK02Spots.Length > 0)
                //{
                //    SqlParameter paramWK02Spots = new SqlParameter("@WK02Spots", SqlDbType.VarChar, 2000);
                //    paramWK02Spots.Value = WK02Spots;
                //    command.Parameters.Add(paramWK02Spots);
                //}
                //if (WK03Spots != null && WK03Spots.Length > 0)
                //{
                //    SqlParameter paramWK03Spots = new SqlParameter("@WK03Spots", SqlDbType.VarChar, 2000);
                //    paramWK03Spots.Value = WK03Spots;
                //    command.Parameters.Add(paramWK03Spots);
                //}
                //if (WK04Spots != null && WK04Spots.Length > 0)
                //{
                //    SqlParameter paramWK04Spots = new SqlParameter("@WK04Spots", SqlDbType.VarChar, 2000);
                //    paramWK04Spots.Value = WK04Spots;
                //    command.Parameters.Add(paramWK04Spots);
                //}
                //if (WK05Spots != null && WK05Spots.Length > 0)
                //{
                //    SqlParameter paramWK05Spots = new SqlParameter("@WK05Spots", SqlDbType.VarChar, 2000);
                //    paramWK05Spots.Value = WK05Spots;
                //    command.Parameters.Add(paramWK05Spots);
                //}
                //if (WK06Spots != null && WK06Spots.Length > 0)
                //{
                //    SqlParameter paramWK06Spots = new SqlParameter("@WK06Spots", SqlDbType.VarChar, 2000);
                //    paramWK06Spots.Value = WK06Spots;
                //    command.Parameters.Add(paramWK06Spots);
                //}
                //if (WK07Spots != null && WK07Spots.Length > 0)
                //{
                //    SqlParameter paramWK07Spots = new SqlParameter("@WK07Spots", SqlDbType.VarChar, 2000);
                //    paramWK07Spots.Value = WK07Spots;
                //    command.Parameters.Add(paramWK07Spots);
                //}
                //if (WK08Spots != null && WK08Spots.Length > 0)
                //{
                //    SqlParameter paramWK08Spots = new SqlParameter("@WK08Spots", SqlDbType.VarChar, 2000);
                //    paramWK08Spots.Value = WK08Spots;
                //    command.Parameters.Add(paramWK08Spots);
                //}
                //if (WK09Spots != null && WK09Spots.Length > 0)
                //{
                //    SqlParameter paramWK09Spots = new SqlParameter("@WK09Spots", SqlDbType.VarChar, 2000);
                //    paramWK09Spots.Value = WK09Spots;
                //    command.Parameters.Add(paramWK09Spots);
                //}
                //if (WK10Spots != null && WK10Spots.Length > 0)
                //{
                //    SqlParameter paramWK10Spots = new SqlParameter("@WK10Spots", SqlDbType.VarChar, 2000);
                //    paramWK10Spots.Value = WK10Spots;
                //    command.Parameters.Add(paramWK10Spots);
                //}
                //if (WK11Spots != null && WK11Spots.Length > 0)
                //{
                //    SqlParameter paramWK11Spots = new SqlParameter("@WK11Spots", SqlDbType.VarChar, 2000);
                //    paramWK11Spots.Value = WK11Spots;
                //    command.Parameters.Add(paramWK11Spots);
                //}
                //if (WK12Spots != null && WK12Spots.Length > 0)
                //{
                //    SqlParameter paramWK12Spots = new SqlParameter("@WK12Spots", SqlDbType.VarChar, 2000);
                //    paramWK12Spots.Value = WK12Spots;
                //    command.Parameters.Add(paramWK12Spots);
                //}
                //if (WK13Spots != null && WK13Spots.Length > 0)
                //{
                //    SqlParameter paramWK13Spots = new SqlParameter("@WK13Spots", SqlDbType.VarChar, 2000);
                //    paramWK13Spots.Value = WK13Spots;
                //    command.Parameters.Add(paramWK13Spots);
                //}
                //if (WK14Spots != null && WK14Spots.Length > 0)
                //{
                //    SqlParameter paramWK14Spots = new SqlParameter("@WK14Spots", SqlDbType.VarChar, 2000);
                //    paramWK14Spots.Value = WK14Spots;
                //    command.Parameters.Add(paramWK14Spots);
                //}

                //if (DOW != null && DOW.Length > 0)
                //{
                //    SqlParameter paramDOW = new SqlParameter("@DOW", SqlDbType.VarChar, 2000);
                //    paramDOW.Value = DOW;
                //    command.Parameters.Add(paramDOW);
                //}
                ////ST-724 Added Added Parameters for Filters if Edit
                //SqlParameter paramCalledForDropDown = new SqlParameter("@CalledForDropDown", SqlDbType.Bit);
                //paramCalledForDropDown.Value = CalledForDropDown;
                //command.Parameters.Add(paramCalledForDropDown);
                //SqlParameter paramFilterForEdit = new SqlParameter("@FilterForEdit", SqlDbType.Bit);
                //paramFilterForEdit.Value = FilterForEdit;
                //command.Parameters.Add(paramFilterForEdit);

                //SqlParameter paramPremiereFilter = new SqlParameter("@PremiereFilter", SqlDbType.Bit);
                //paramPremiereFilter.Value = PremiereFilter;
                //command.Parameters.Add(paramPremiereFilter);


                //Thread.Sleep(1000);
                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        ScheduleProposalLinesFlat schedLine = new ScheduleProposalLinesFlat();

                //        if (reader["ScheduleLineId"] != DBNull.Value)
                //            schedLine.ScheduleLineId = (int)reader["ScheduleLineId"];

                //        if (reader["Approved"] != DBNull.Value)
                //            schedLine.Approved = (bool)reader["Approved"];

                //        if (reader["ApprovedDesc"] != DBNull.Value)
                //            schedLine.ApprovedDesc = reader["ApprovedDesc"].ToString();

                //        if (reader["DoNotBuyTypeId"] != DBNull.Value)
                //            schedLine.DoNotBuyTypeId = (int)reader["DoNotBuyTypeId"];

                //        if (reader["DoNotBuyTypeDescription"] != DBNull.Value)
                //            schedLine.DoNotBuyTypeDescription = reader["DoNotBuyTypeDescription"].ToString();

                //        if (reader["RateRevision"] != DBNull.Value)
                //            schedLine.RateRevision = reader["RateRevision"].ToString();

                //        if (reader["RateUpdateDt"] != DBNull.Value)
                //            schedLine.RateUpdateDt = DateTime.Parse(reader["RateUpdateDt"].ToString());

                //        if (reader["DemoUniverse"] != DBNull.Value)
                //            schedLine.DemoUniverse = (int)reader["DemoUniverse"];

                //        if (reader["DemoName"] != DBNull.Value)
                //            schedLine.DemoName = reader["DemoName"].ToString();

                //        if (reader["NetworkName"] != DBNull.Value)
                //            schedLine.NetworkName = reader["NetworkName"].ToString();

                //        if (reader["PropertyName"] != DBNull.Value)
                //            schedLine.PropertyName = reader["PropertyName"].ToString();

                //        if (reader["EffectiveDate"] != DBNull.Value)
                //            schedLine.EffectiveDate = DateTime.Parse(reader["EffectiveDate"].ToString());

                //        if (reader["ExpirationDate"] != DBNull.Value)
                //            schedLine.ExpirationDate = DateTime.Parse(reader["ExpirationDate"].ToString());
                      
                //        string dow = "";

                //        if (reader["Monday"] != DBNull.Value)
                //        {
                //            schedLine.Monday = (bool)reader["Monday"];
                //            dow += ((bool)reader["Monday"] == true ? "M" : "-");
                //        }

                //        if (reader["Tuesday"] != DBNull.Value)
                //        {
                //            schedLine.Tuesday = (bool)reader["Tuesday"];
                //            dow += ((bool)reader["Tuesday"] == true ? "T" : "-");
                //        }

                //        if (reader["Wednesday"] != DBNull.Value)
                //        {
                //            schedLine.Wednesday = (bool)reader["Wednesday"];
                //            dow += ((bool)reader["Wednesday"] == true ? "W" : "-");
                //        }

                //        if (reader["Thursday"] != DBNull.Value)
                //        {
                //            schedLine.Thursday = (bool)reader["Thursday"];
                //            dow += ((bool)reader["Thursday"] == true ? "Th" : "-");
                //        }

                //        if (reader["Friday"] != DBNull.Value)
                //        {
                //            schedLine.Friday = (bool)reader["Friday"];
                //            dow += ((bool)reader["Friday"] == true ? "F" : "-");
                //        }

                //        if (reader["Saturday"] != DBNull.Value)
                //        {
                //            schedLine.Saturday = (bool)reader["Saturday"];
                //            dow += ((bool)reader["Saturday"] == true ? "Sa" : "-");
                //        }

                //        if (reader["Sunday"] != DBNull.Value)
                //        {
                //            schedLine.Sunday = (bool)reader["Sunday"];
                //            dow += ((bool)reader["Sunday"] == true ? "Su" : "-");
                //        }
                //        schedLine.DOW = dow;

                //        if (reader["DayPartCd"] != DBNull.Value)
                //            schedLine.DayPartCd = reader["DayPartCd"].ToString();

                //        if (reader["StartTime"] != DBNull.Value)
                //            schedLine.StartToEndTime = reader["StartToEndTime"].ToString();

                //        if (reader["OMDP"] != DBNull.Value)
                //            schedLine.OMDP = reader["OMDP"].ToString();

                //        if (reader["SpotLen"] != DBNull.Value)
                //            schedLine.SpotLen = (int)reader["SpotLen"];

                //        if (reader["BuyTypeCode"] != DBNull.Value)
                //            schedLine.BuyTypeCode = reader["BuyTypeCode"].ToString();

                //        if (reader["RateAmt"] != DBNull.Value)
                //            schedLine.RateAmt = double.Parse(reader["RateAmt"].ToString());

                //        if (reader["Discount"] != DBNull.Value)
                //            schedLine.Discount = float.Parse(reader["Discount"].ToString());

                //        if (reader["USDRate"] != DBNull.Value)
                //            schedLine.UsdRate = double.Parse(reader["USDRate"].ToString());

                //        if (reader["CPM"] != DBNull.Value)
                //            schedLine.CPM = float.Parse(reader["CPM"].ToString());

                //        if (reader["Impressions"] != DBNull.Value)
                //            schedLine.Impressions = double.Parse(reader["Impressions"].ToString());

                //        if (reader["Wk01_Spots"] != DBNull.Value)
                //            schedLine.Wk01_Spots = int.Parse(reader["Wk01_Spots"].ToString());

                //        if (reader["Wk02_Spots"] != DBNull.Value)
                //            schedLine.Wk02_Spots = int.Parse(reader["Wk02_Spots"].ToString());

                //        if (reader["Wk03_Spots"] != DBNull.Value)
                //            schedLine.Wk03_Spots = int.Parse(reader["Wk03_Spots"].ToString());

                //        if (reader["Wk04_Spots"] != DBNull.Value)
                //            schedLine.Wk04_Spots = int.Parse(reader["Wk04_Spots"].ToString());

                //        if (reader["Wk05_Spots"] != DBNull.Value)
                //            schedLine.Wk05_Spots = int.Parse(reader["Wk05_Spots"].ToString());

                //        if (reader["Wk06_Spots"] != DBNull.Value)
                //            schedLine.Wk06_Spots = int.Parse(reader["Wk06_Spots"].ToString());

                //        if (reader["Wk07_Spots"] != DBNull.Value)
                //            schedLine.Wk07_Spots = int.Parse(reader["Wk07_Spots"].ToString());

                //        if (reader["Wk08_Spots"] != DBNull.Value)
                //            schedLine.Wk08_Spots = int.Parse(reader["Wk08_Spots"].ToString());

                //        if (reader["Wk09_Spots"] != DBNull.Value)
                //            schedLine.Wk09_Spots = int.Parse(reader["Wk09_Spots"].ToString());

                //        if (reader["Wk10_Spots"] != DBNull.Value)
                //            schedLine.Wk10_Spots = int.Parse(reader["Wk10_Spots"].ToString());

                //        if (reader["Wk11_Spots"] != DBNull.Value)
                //            schedLine.Wk11_Spots = int.Parse(reader["Wk11_Spots"].ToString());

                //        if (reader["Wk12_Spots"] != DBNull.Value)
                //            schedLine.Wk12_Spots = int.Parse(reader["Wk12_Spots"].ToString());

                //        if (reader["Wk13_Spots"] != DBNull.Value)
                //            schedLine.Wk13_Spots = int.Parse(reader["Wk13_Spots"].ToString());

                //        if (reader["Wk14_Spots"] != DBNull.Value)
                //            schedLine.Wk14_Spots = int.Parse(reader["Wk14_Spots"].ToString());

                //        if (reader["Wk01_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk01_UpdateDt = DateTime.Parse(reader["Wk01_UpdateDt"].ToString());

                //        if (reader["Wk02_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk02_UpdateDt = DateTime.Parse(reader["Wk02_UpdateDt"].ToString());

                //        if (reader["Wk03_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk03_UpdateDt = DateTime.Parse(reader["Wk03_UpdateDt"].ToString());

                //        if (reader["Wk04_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk04_UpdateDt = DateTime.Parse(reader["Wk04_UpdateDt"].ToString());

                //        if (reader["Wk05_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk05_UpdateDt = DateTime.Parse(reader["Wk05_UpdateDt"].ToString());

                //        if (reader["Wk06_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk06_UpdateDt = DateTime.Parse(reader["Wk06_UpdateDt"].ToString());

                //        if (reader["Wk07_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk07_UpdateDt = DateTime.Parse(reader["Wk07_UpdateDt"].ToString());

                //        if (reader["Wk08_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk08_UpdateDt = DateTime.Parse(reader["Wk08_UpdateDt"].ToString());

                //        if (reader["Wk09_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk09_UpdateDt = DateTime.Parse(reader["Wk09_UpdateDt"].ToString());

                //        if (reader["Wk10_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk10_UpdateDt = DateTime.Parse(reader["Wk10_UpdateDt"].ToString());

                //        if (reader["Wk11_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk11_UpdateDt = DateTime.Parse(reader["Wk11_UpdateDt"].ToString());

                //        if (reader["Wk12_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk12_UpdateDt = DateTime.Parse(reader["Wk12_UpdateDt"].ToString());

                //        if (reader["Wk13_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk13_UpdateDt = DateTime.Parse(reader["Wk13_UpdateDt"].ToString());

                //        if (reader["Wk14_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk14_UpdateDt = DateTime.Parse(reader["Wk14_UpdateDt"].ToString());

                //        if (reader["TotalSpots"] != DBNull.Value)
                //            schedLine.TotalSpots = int.Parse(reader["TotalSpots"].ToString());

                //        if (reader["FullCount"] != DBNull.Value)
                //            schedLine.FullCount = int.Parse(reader["FullCount"].ToString());

                //        if (reader["CanDelete"] != DBNull.Value)
                //            schedLine.CanDelete = bool.Parse(reader["CanDelete"].ToString());

                //        if (reader["RecordsFiltered"] != DBNull.Value)
                //            schedLine.RecordsFiltered = int.Parse(reader["RecordsFiltered"].ToString());

                //        if (reader["Wk01_Locked"] != DBNull.Value)
                //            schedLine.Wk01_Locked = bool.Parse(reader["Wk01_Locked"].ToString());

                //        if (reader["Wk02_Locked"] != DBNull.Value)
                //            schedLine.Wk02_Locked = bool.Parse(reader["Wk02_Locked"].ToString());

                //        if (reader["Wk03_Locked"] != DBNull.Value)
                //            schedLine.Wk03_Locked = bool.Parse(reader["Wk03_Locked"].ToString());

                //        if (reader["Wk04_Locked"] != DBNull.Value)
                //            schedLine.Wk04_Locked = bool.Parse(reader["Wk04_Locked"].ToString());

                //        if (reader["Wk05_Locked"] != DBNull.Value)
                //            schedLine.Wk05_Locked = bool.Parse(reader["Wk05_Locked"].ToString());

                //        if (reader["Wk06_Locked"] != DBNull.Value)
                //            schedLine.Wk06_Locked = bool.Parse(reader["Wk06_Locked"].ToString());

                //        if (reader["Wk07_Locked"] != DBNull.Value)
                //            schedLine.Wk07_Locked = bool.Parse(reader["Wk07_Locked"].ToString());

                //        if (reader["Wk08_Locked"] != DBNull.Value)
                //            schedLine.Wk08_Locked = bool.Parse(reader["Wk08_Locked"].ToString());

                //        if (reader["Wk09_Locked"] != DBNull.Value)
                //            schedLine.Wk09_Locked = bool.Parse(reader["Wk09_Locked"].ToString());

                //        if (reader["Wk10_Locked"] != DBNull.Value)
                //            schedLine.Wk10_Locked = bool.Parse(reader["Wk10_Locked"].ToString());

                //        if (reader["Wk11_Locked"] != DBNull.Value)
                //            schedLine.Wk11_Locked = bool.Parse(reader["Wk11_Locked"].ToString());

                //        if (reader["Wk12_Locked"] != DBNull.Value)
                //            schedLine.Wk12_Locked = bool.Parse(reader["Wk12_Locked"].ToString());

                //        if (reader["Wk13_Locked"] != DBNull.Value)
                //            schedLine.Wk13_Locked = bool.Parse(reader["Wk13_Locked"].ToString());

                //        if (reader["Wk14_Locked"] != DBNull.Value)
                //            schedLine.Wk14_Locked = bool.Parse(reader["Wk14_Locked"].ToString());

                //        if (reader["SPBuy"] != DBNull.Value)
                //            schedLine.SPBuy = reader["SPBuy"].ToString();

                //        scheduleLines.Add(schedLine);
                //    }
                //}

                //conn.Close();
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetScheduleLines";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevisedDate != null && RevisedDate.Length > 0)
                {
                    dbparams.Add("RevisedDate", RevisedDate, System.Data.DbType.String);
                }

                if (EffectiveDate != null && EffectiveDate.Length > 0)
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, System.Data.DbType.String);
                }

                if (ExpirationDate != null && ExpirationDate.Length > 0)
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, System.Data.DbType.String);
                }

                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (NetworkName != null && NetworkName.Length > 0)
                {
                    dbparams.Add("NetworkNames", NetworkName, System.Data.DbType.String);
                }

                if (TotalSpots != null && TotalSpots.Length > 0)
                {
                    dbparams.Add("TotalSpots", TotalSpots, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                }

                if (DP != null && DP.Length > 0)
                {
                    dbparams.Add("dp", DP, System.Data.DbType.String);
                }

                if (OMDP != null && OMDP.Length > 0)
                {
                    dbparams.Add("OMDP", OMDP, System.Data.DbType.String);
                }

                if (SpotLens != null && SpotLens.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLens, System.Data.DbType.String);
                }

                if (RateAmt != null && RateAmt.Length > 0)
                {
                    dbparams.Add("Rate", RateAmt, System.Data.DbType.String);
                }

                if (Discounts != null && Discounts.Length > 0)
                {
                    dbparams.Add("Discounts", Discounts, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }

                if (BuyType != null && BuyType.Length > 0)
                {
                    dbparams.Add("BuyTypes", BuyType, System.Data.DbType.String);
                }

                if (StartToEnd != null && StartToEnd.Length > 0)
                {
                    dbparams.Add("StartToEnd", StartToEnd, System.Data.DbType.String);
                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (usdRates != null && usdRates.Length > 0)
                {
                    dbparams.Add("usdRates", usdRates, System.Data.DbType.String);
                }
                dbparams.Add("Page", PageNumber, System.Data.DbType.Int32);
                dbparams.Add("PageSize", PageSize, System.Data.DbType.Int32);
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);
                dbparams.Add("ShowTotalsOnly", false, System.Data.DbType.Boolean);
                
                if (SPBuy != null && SPBuy.Length > 0)
                {
                    dbparams.Add("SPBuy", SPBuy, System.Data.DbType.String);
                }
                if (WK01Spots != null && WK01Spots.Length > 0)
                {
                    dbparams.Add("WK01Spots", WK01Spots, System.Data.DbType.String);
                }
                if (WK02Spots != null && WK02Spots.Length > 0)
                {
                    dbparams.Add("WK02Spots", WK02Spots, System.Data.DbType.String);
                }
                if (WK03Spots != null && WK03Spots.Length > 0)
                {
                    dbparams.Add("WK03Spots", WK03Spots, System.Data.DbType.String);
                }
                if (WK04Spots != null && WK04Spots.Length > 0)
                {
                    dbparams.Add("WK04Spots", WK04Spots, System.Data.DbType.String);
                }
                if (WK05Spots != null && WK05Spots.Length > 0)
                {
                    dbparams.Add("WK05Spots", WK05Spots, System.Data.DbType.String);
                }
                if (WK06Spots != null && WK06Spots.Length > 0)
                {
                    dbparams.Add("WK06Spots", WK06Spots, System.Data.DbType.String);
                }
                if (WK07Spots != null && WK07Spots.Length > 0)
                {
                    dbparams.Add("WK07Spots", WK07Spots, System.Data.DbType.String);
                }
                if (WK08Spots != null && WK08Spots.Length > 0)
                {
                    dbparams.Add("WK08Spots", WK08Spots, System.Data.DbType.String);
                }
                if (WK09Spots != null && WK09Spots.Length > 0)
                {
                    dbparams.Add("WK09Spots", WK09Spots, System.Data.DbType.String);
                }
                if (WK10Spots != null && WK10Spots.Length > 0)
                {
                    dbparams.Add("WK10Spots", WK10Spots, System.Data.DbType.String);
                }
                if (WK11Spots != null && WK11Spots.Length > 0)
                {
                    dbparams.Add("WK11Spots", WK11Spots, System.Data.DbType.String);
                }
                if (WK12Spots != null && WK12Spots.Length > 0)
                {
                    dbparams.Add("WK12Spots", WK12Spots, System.Data.DbType.String);
                }
                if (WK13Spots != null && WK13Spots.Length > 0)
                {
                    dbparams.Add("WK13Spots", WK13Spots, System.Data.DbType.String);
                }
                if (WK14Spots != null && WK14Spots.Length > 0)
                {
                    dbparams.Add("WK14Spots", WK14Spots, System.Data.DbType.String);
                }

                if (DOW != null && DOW.Length > 0)
                {
                    dbparams.Add("DOW", DOW, System.Data.DbType.String);
                }
                //ST-724 Added Added Parameters for Filters if Edit
                dbparams.Add("CalledForDropDown", CalledForDropDown, System.Data.DbType.Boolean);
                dbparams.Add("FilterForEdit", FilterForEdit, System.Data.DbType.Boolean);
                dbparams.Add("PremiereFilter", PremiereFilter, System.Data.DbType.Boolean);
                Thread.Sleep(2000);
                scheduleLines = FactoryServices.dbFactory.SelectCommand_SP(scheduleLines, spName, dbparams);
                return scheduleLines;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load schedule/proposal. ScheduleId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        // Start Over from Here
        public IEnumerable<ScheduleProposalLinesFlat> ExcelGetProposalLinesFlat(int LoggedOnUserId, int ProposalId, string ApprovedDesc, string Status,
           string RevNo, string RevisedDate, string DemoNames, string NetworkName,
           string PropertyName, string DP, string OMDP, string BuyType, string SpotLens,
           string RateAmt, string Impressions, string CPM, string EffectiveDate,
           string ExpirationDate, string Discounts, string TotalSpots, string StartToEnd,
           string usdRates, int PageNumber, int PageSize, float DiscountRate, bool ViewOnly, string SPBuy)
        {
            try
            {
                List<ScheduleProposalLinesFlat> scheduleLines = new List<ScheduleProposalLinesFlat>();

                //DbConnection conn = _context.Database.GetDbConnection();
                //if (conn.State == ConnectionState.Closed)
                //{
                //    conn.Open();
                //}

                //DbCommand command = conn.CreateCommand();
                //command.CommandText = "sp_Schedule_GetScheduleLines";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramId = new SqlParameter("@ScheduleId", SqlDbType.Int);
                //paramId.Value = ProposalId;
                //command.Parameters.Add(paramId);

                //SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //paramLoggedOnUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramLoggedOnUserId);

                //if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                //{
                //    SqlParameter paramApproved = new SqlParameter("@ApprovedDesc", SqlDbType.VarChar, 50);
                //    paramApproved.Value = ApprovedDesc;
                //    command.Parameters.Add(paramApproved);
                //}

                //if (Status != null && Status.Length > 0)
                //{
                //    SqlParameter paramStatus = new SqlParameter("@Status", SqlDbType.VarChar, 2000);
                //    paramStatus.Value = Status;
                //    command.Parameters.Add(paramStatus);
                //}

                //if (RevNo != null && RevNo.Length > 0)
                //{
                //    SqlParameter paramRevNo = new SqlParameter("@RevNo", SqlDbType.VarChar, 2000);
                //    paramRevNo.Value = RevNo;
                //    command.Parameters.Add(paramRevNo);
                //}

                //if (RevisedDate != null && RevisedDate.Length > 0)
                //{
                //    SqlParameter paramRevisedDate = new SqlParameter("@RevisedDate", SqlDbType.VarChar, 2000);
                //    paramRevisedDate.Value = RevisedDate;
                //    command.Parameters.Add(paramRevisedDate);
                //}

                //if (EffectiveDate != null && EffectiveDate.Length > 0)
                //{
                //    SqlParameter paramEffectiveDate = new SqlParameter("@EffectiveDate", SqlDbType.VarChar, 2000);
                //    paramEffectiveDate.Value = EffectiveDate;
                //    command.Parameters.Add(paramEffectiveDate);
                //}

                //if (ExpirationDate != null && ExpirationDate.Length > 0)
                //{
                //    SqlParameter paramExpirationDate = new SqlParameter("@ExpirationDate", SqlDbType.VarChar, 2000);
                //    paramExpirationDate.Value = ExpirationDate;
                //    command.Parameters.Add(paramExpirationDate);
                //}

                //if (DemoNames != null && DemoNames.Length > 0)
                //{
                //    SqlParameter paramDemoNames = new SqlParameter("@DemoNames", SqlDbType.VarChar, 2000);
                //    paramDemoNames.Value = DemoNames;
                //    command.Parameters.Add(paramDemoNames);
                //}

                //if (NetworkName != null && NetworkName.Length > 0)
                //{
                //    SqlParameter paramNetworkName = new SqlParameter("@NetworkNames", SqlDbType.VarChar, 2000);
                //    paramNetworkName.Value = NetworkName;
                //    command.Parameters.Add(paramNetworkName);
                //}

                //if (TotalSpots != null && TotalSpots.Length > 0)
                //{
                //    SqlParameter paramTotalSpots = new SqlParameter("@TotalSpots", SqlDbType.VarChar, 2000);
                //    paramTotalSpots.Value = TotalSpots;
                //    command.Parameters.Add(paramTotalSpots);
                //}

                //if (PropertyName != null && PropertyName.Length > 0)
                //{
                //    SqlParameter paramNPropertyName = new SqlParameter("@PropertyName", SqlDbType.VarChar, 8000);
                //    paramNPropertyName.Value = PropertyName;
                //    command.Parameters.Add(paramNPropertyName);
                //}

                //if (DP != null && DP.Length > 0)
                //{
                //    SqlParameter paramDP = new SqlParameter("@dp", SqlDbType.VarChar, 2000);
                //    paramDP.Value = DP;
                //    command.Parameters.Add(paramDP);
                //}

                //if (OMDP != null && OMDP.Length > 0)
                //{
                //    SqlParameter paramOMDP = new SqlParameter("@OMDP", SqlDbType.VarChar, 2000);
                //    paramOMDP.Value = OMDP;
                //    command.Parameters.Add(paramOMDP);
                //}

                //if (SpotLens != null && SpotLens.Length > 0)
                //{
                //    SqlParameter paramSpotLen = new SqlParameter("@SpotLen", SqlDbType.VarChar, 50);
                //    paramSpotLen.Value = SpotLens;
                //    command.Parameters.Add(paramSpotLen);
                //}

                //if (RateAmt != null && RateAmt.Length > 0)
                //{
                //    SqlParameter paramRate = new SqlParameter("@Rate", SqlDbType.VarChar, 2000);
                //    paramRate.Value = RateAmt;
                //    command.Parameters.Add(paramRate);
                //}

                //if (Discounts != null && Discounts.Length > 0)
                //{
                //    SqlParameter paramDiscounts = new SqlParameter("@Discounts", SqlDbType.VarChar, 2000);
                //    paramDiscounts.Value = Discounts;
                //    command.Parameters.Add(paramDiscounts);
                //}

                //if (Impressions != null && Impressions.Length > 0)
                //{
                //    SqlParameter paramImp = new SqlParameter("@Impressions", SqlDbType.VarChar, 2000);
                //    paramImp.Value = Impressions;
                //    command.Parameters.Add(paramImp);
                //}

                //if (BuyType != null && BuyType.Length > 0)
                //{
                //    SqlParameter paramBuyTypes = new SqlParameter("@BuyTypes", SqlDbType.VarChar, 2000);
                //    paramBuyTypes.Value = BuyType;
                //    command.Parameters.Add(paramBuyTypes);
                //}

                //if (StartToEnd != null && StartToEnd.Length > 0)
                //{
                //    SqlParameter paramStartToEnd = new SqlParameter("@StartToEnd", SqlDbType.VarChar, 2000);
                //    paramStartToEnd.Value = StartToEnd;
                //    command.Parameters.Add(paramStartToEnd);
                //}

                //if (CPM != null && CPM.Length > 0)
                //{
                //    SqlParameter paramCPM = new SqlParameter("@CPM", SqlDbType.VarChar, 2000);
                //    paramCPM.Value = CPM;
                //    command.Parameters.Add(paramCPM);
                //}

                //if (usdRates != null && usdRates.Length > 0)
                //{
                //    SqlParameter paramUSD = new SqlParameter("@usdRates", SqlDbType.VarChar, 2000);
                //    paramUSD.Value = usdRates;
                //    command.Parameters.Add(paramUSD);
                //}

                //SqlParameter paramPage = new SqlParameter("@Page", SqlDbType.Int);
                //paramPage.Value = PageNumber;
                //command.Parameters.Add(paramPage);

                //SqlParameter paramPageSize = new SqlParameter("@PageSize", SqlDbType.Int);
                //paramPageSize.Value = PageSize;
                //command.Parameters.Add(paramPageSize);

                //SqlParameter paramViewOnly = new SqlParameter("@ViewOnly", SqlDbType.Bit);
                //paramViewOnly.Value = ViewOnly;
                //command.Parameters.Add(paramViewOnly);

                //SqlParameter paramDiscount = new SqlParameter("@DiscountRate", SqlDbType.Float);
                //paramDiscount.Value = DiscountRate;
                //command.Parameters.Add(paramDiscount);

                //SqlParameter paramTotalsOnly = new SqlParameter("@ShowTotalsOnly", SqlDbType.Bit);
                //paramTotalsOnly.Value = false;
                //command.Parameters.Add(paramTotalsOnly);

                //if (SPBuy != null && SPBuy.Length > 0)
                //{
                //    SqlParameter paramSPBuy = new SqlParameter("@SPBuy", SqlDbType.VarChar, 10);
                //    paramSPBuy.Value = SPBuy;
                //    command.Parameters.Add(paramSPBuy);
                //}
                //SqlParameter paramCalledForExport = new SqlParameter("@CalledForExport", SqlDbType.Bit);
                //paramCalledForExport.Value = true;
                //command.Parameters.Add(paramCalledForExport);
                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        ScheduleProposalLinesFlat schedLine = new ScheduleProposalLinesFlat();

                //        if (reader["ScheduleLineId"] != DBNull.Value)
                //            schedLine.ScheduleLineId = (int)reader["ScheduleLineId"];

                //        if (reader["Approved"] != DBNull.Value)
                //            schedLine.Approved = (bool)reader["Approved"];

                //        if (reader["ApprovedDesc"] != DBNull.Value)
                //            schedLine.ApprovedDesc = reader["ApprovedDesc"].ToString();

                //        if (reader["DoNotBuyTypeId"] != DBNull.Value)
                //            schedLine.DoNotBuyTypeId = (int)reader["DoNotBuyTypeId"];

                //        if (reader["DoNotBuyTypeDescription"] != DBNull.Value)
                //            schedLine.DoNotBuyTypeDescription = reader["DoNotBuyTypeDescription"].ToString();

                //        if (reader["RateRevision"] != DBNull.Value)
                //            schedLine.RateRevision = reader["RateRevision"].ToString();

                //        if (reader["RateUpdateDt"] != DBNull.Value)
                //            schedLine.RateUpdateDt = DateTime.Parse(reader["RateUpdateDt"].ToString());

                //        if (reader["DemoUniverse"] != DBNull.Value)
                //            schedLine.DemoUniverse = (int)reader["DemoUniverse"];

                //        if (reader["DemoName"] != DBNull.Value)
                //            schedLine.DemoName = reader["DemoName"].ToString();

                //        if (reader["NetworkName"] != DBNull.Value)
                //            schedLine.NetworkName = reader["NetworkName"].ToString();

                //        if (reader["PropertyName"] != DBNull.Value)
                //            schedLine.PropertyName = reader["PropertyName"].ToString();

                //        if (reader["EffectiveDate"] != DBNull.Value)
                //            schedLine.EffectiveDate = DateTime.Parse(reader["EffectiveDate"].ToString());

                //        if (reader["ExpirationDate"] != DBNull.Value)
                //            schedLine.ExpirationDate = DateTime.Parse(reader["ExpirationDate"].ToString());

                //        if (reader["Monday"] != DBNull.Value)
                //            schedLine.Monday = (bool)reader["Monday"];

                //        if (reader["Tuesday"] != DBNull.Value)
                //            schedLine.Tuesday = (bool)reader["Tuesday"];

                //        if (reader["Wednesday"] != DBNull.Value)
                //            schedLine.Wednesday = (bool)reader["Wednesday"];

                //        if (reader["Thursday"] != DBNull.Value)
                //            schedLine.Thursday = (bool)reader["Thursday"];

                //        if (reader["Friday"] != DBNull.Value)
                //            schedLine.Friday = (bool)reader["Friday"];

                //        if (reader["Saturday"] != DBNull.Value)
                //            schedLine.Saturday = (bool)reader["Saturday"];

                //        if (reader["Sunday"] != DBNull.Value)
                //            schedLine.Sunday = (bool)reader["Sunday"];

                //        if (reader["DayPartCd"] != DBNull.Value)
                //            schedLine.DayPartCd = reader["DayPartCd"].ToString();

                //        if (reader["StartTime"] != DBNull.Value)
                //            schedLine.StartToEndTime = reader["StartToEndTime"].ToString();

                //        if (reader["OMDP"] != DBNull.Value)
                //            schedLine.OMDP = reader["OMDP"].ToString();

                //        if (reader["SpotLen"] != DBNull.Value)
                //            schedLine.SpotLen = (int)reader["SpotLen"];

                //        if (reader["BuyTypeCode"] != DBNull.Value)
                //            schedLine.BuyTypeCode = reader["BuyTypeCode"].ToString();

                //        if (reader["RateAmt"] != DBNull.Value)
                //            schedLine.RateAmt = double.Parse(reader["RateAmt"].ToString());

                //        if (reader["Discount"] != DBNull.Value)
                //            schedLine.Discount = float.Parse(reader["Discount"].ToString());

                //        if (reader["USDRate"] != DBNull.Value)
                //            schedLine.UsdRate = double.Parse(reader["USDRate"].ToString());

                //        if (reader["CPM"] != DBNull.Value)
                //            schedLine.CPM = float.Parse(reader["CPM"].ToString());

                //        if (reader["Impressions"] != DBNull.Value)
                //            schedLine.Impressions = double.Parse(reader["Impressions"].ToString());

                //        if (reader["Wk01_Spots"] != DBNull.Value)
                //            if (int.Parse(reader["Wk01_Spots"].ToString()) == 0)
                //                schedLine.Wk01_Spots = null;
                //            else
                //                schedLine.Wk01_Spots = int.Parse(reader["Wk01_Spots"].ToString());

                //        if (reader["Wk02_Spots"] != DBNull.Value)
                //            if (int.Parse(reader["Wk02_Spots"].ToString()) == 0)
                //                schedLine.Wk02_Spots = null;
                //            else
                //                schedLine.Wk02_Spots = int.Parse(reader["Wk02_Spots"].ToString());

                //        if (reader["Wk03_Spots"] != DBNull.Value)
                //            if (int.Parse(reader["Wk03_Spots"].ToString()) == 0)
                //                schedLine.Wk03_Spots = null;
                //            else
                //                schedLine.Wk03_Spots = int.Parse(reader["Wk03_Spots"].ToString());

                //        if (reader["Wk04_Spots"] != DBNull.Value)
                //            //schedLine.Wk04_Spots = int.Parse(reader["Wk04_Spots"].ToString());
                //            if (int.Parse(reader["Wk04_Spots"].ToString()) == 0)
                //                schedLine.Wk04_Spots = null;
                //            else
                //                schedLine.Wk04_Spots = int.Parse(reader["Wk04_Spots"].ToString());

                //        if (reader["Wk05_Spots"] != DBNull.Value)
                //            //schedLine.Wk05_Spots = int.Parse(reader["Wk05_Spots"].ToString());
                //            if (int.Parse(reader["Wk05_Spots"].ToString()) == 0)
                //                schedLine.Wk05_Spots = null;
                //            else
                //                schedLine.Wk05_Spots = int.Parse(reader["Wk05_Spots"].ToString());

                //        if (reader["Wk06_Spots"] != DBNull.Value)
                //            //schedLine.Wk06_Spots = int.Parse(reader["Wk06_Spots"].ToString());
                //            if (int.Parse(reader["Wk06_Spots"].ToString()) == 0)
                //                schedLine.Wk06_Spots = null;
                //            else
                //                schedLine.Wk06_Spots = int.Parse(reader["Wk06_Spots"].ToString());

                //        if (reader["Wk07_Spots"] != DBNull.Value)
                //            //schedLine.Wk07_Spots = int.Parse(reader["Wk07_Spots"].ToString());
                //            if (int.Parse(reader["Wk07_Spots"].ToString()) == 0)
                //                schedLine.Wk07_Spots = null;
                //            else
                //                schedLine.Wk07_Spots = int.Parse(reader["Wk07_Spots"].ToString());

                //        if (reader["Wk08_Spots"] != DBNull.Value)
                //            //schedLine.Wk08_Spots = int.Parse(reader["Wk08_Spots"].ToString());
                //            if (int.Parse(reader["Wk08_Spots"].ToString()) == 0)
                //                schedLine.Wk08_Spots = null;
                //            else
                //                schedLine.Wk08_Spots = int.Parse(reader["Wk08_Spots"].ToString());

                //        if (reader["Wk09_Spots"] != DBNull.Value)
                //            //schedLine.Wk09_Spots = int.Parse(reader["Wk09_Spots"].ToString());
                //            if (int.Parse(reader["Wk09_Spots"].ToString()) == 0)
                //                schedLine.Wk09_Spots = null;
                //            else
                //                schedLine.Wk09_Spots = int.Parse(reader["Wk09_Spots"].ToString());

                //        if (reader["Wk10_Spots"] != DBNull.Value)
                //            //schedLine.Wk10_Spots = int.Parse(reader["Wk10_Spots"].ToString());
                //            if (int.Parse(reader["Wk10_Spots"].ToString()) == 0)
                //                schedLine.Wk10_Spots = null;
                //            else
                //                schedLine.Wk10_Spots = int.Parse(reader["Wk10_Spots"].ToString());

                //        if (reader["Wk11_Spots"] != DBNull.Value)
                //            //schedLine.Wk11_Spots = int.Parse(reader["Wk11_Spots"].ToString());
                //            if (int.Parse(reader["Wk11_Spots"].ToString()) == 0)
                //                schedLine.Wk11_Spots = null;
                //            else
                //                schedLine.Wk11_Spots = int.Parse(reader["Wk11_Spots"].ToString());

                //        if (reader["Wk12_Spots"] != DBNull.Value)
                //            //schedLine.Wk12_Spots = int.Parse(reader["Wk12_Spots"].ToString());
                //            if (int.Parse(reader["Wk12_Spots"].ToString()) == 0)
                //                schedLine.Wk12_Spots = null;
                //            else
                //                schedLine.Wk12_Spots = int.Parse(reader["Wk12_Spots"].ToString());

                //        if (reader["Wk13_Spots"] != DBNull.Value)
                //            //schedLine.Wk13_Spots = int.Parse(reader["Wk13_Spots"].ToString());
                //            if (int.Parse(reader["Wk13_Spots"].ToString()) == 0)
                //                schedLine.Wk13_Spots = null;
                //            else
                //                schedLine.Wk13_Spots = int.Parse(reader["Wk13_Spots"].ToString());

                //        if (reader["Wk14_Spots"] != DBNull.Value)
                //            //schedLine.Wk14_Spots = int.Parse(reader["Wk14_Spots"].ToString());
                //            if (int.Parse(reader["Wk14_Spots"].ToString()) == 0)
                //                schedLine.Wk14_Spots = null;
                //            else
                //                schedLine.Wk14_Spots = int.Parse(reader["Wk14_Spots"].ToString());

                //        if (reader["Wk01_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk01_UpdateDt = DateTime.Parse(reader["Wk01_UpdateDt"].ToString());

                //        if (reader["Wk02_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk02_UpdateDt = DateTime.Parse(reader["Wk02_UpdateDt"].ToString());

                //        if (reader["Wk03_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk03_UpdateDt = DateTime.Parse(reader["Wk03_UpdateDt"].ToString());

                //        if (reader["Wk04_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk04_UpdateDt = DateTime.Parse(reader["Wk04_UpdateDt"].ToString());

                //        if (reader["Wk05_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk05_UpdateDt = DateTime.Parse(reader["Wk05_UpdateDt"].ToString());

                //        if (reader["Wk06_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk06_UpdateDt = DateTime.Parse(reader["Wk06_UpdateDt"].ToString());

                //        if (reader["Wk07_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk07_UpdateDt = DateTime.Parse(reader["Wk07_UpdateDt"].ToString());

                //        if (reader["Wk08_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk08_UpdateDt = DateTime.Parse(reader["Wk08_UpdateDt"].ToString());

                //        if (reader["Wk09_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk09_UpdateDt = DateTime.Parse(reader["Wk09_UpdateDt"].ToString());

                //        if (reader["Wk10_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk10_UpdateDt = DateTime.Parse(reader["Wk10_UpdateDt"].ToString());

                //        if (reader["Wk11_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk11_UpdateDt = DateTime.Parse(reader["Wk11_UpdateDt"].ToString());

                //        if (reader["Wk12_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk12_UpdateDt = DateTime.Parse(reader["Wk12_UpdateDt"].ToString());

                //        if (reader["Wk13_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk13_UpdateDt = DateTime.Parse(reader["Wk13_UpdateDt"].ToString());

                //        if (reader["Wk14_UpdateDt"] != DBNull.Value)
                //            schedLine.Wk14_UpdateDt = DateTime.Parse(reader["Wk14_UpdateDt"].ToString());

                //        if (reader["TotalSpots"] != DBNull.Value)
                //            schedLine.TotalSpots = int.Parse(reader["TotalSpots"].ToString());

                //        if (reader["FullCount"] != DBNull.Value)
                //            schedLine.FullCount = int.Parse(reader["FullCount"].ToString());

                //        if (reader["CanDelete"] != DBNull.Value)
                //            schedLine.CanDelete = bool.Parse(reader["CanDelete"].ToString());

                //        if (reader["RecordsFiltered"] != DBNull.Value)
                //            schedLine.RecordsFiltered = int.Parse(reader["RecordsFiltered"].ToString());

                //        if (reader["Wk01_Locked"] != DBNull.Value)
                //            schedLine.Wk01_Locked = bool.Parse(reader["Wk01_Locked"].ToString());

                //        if (reader["Wk02_Locked"] != DBNull.Value)
                //            schedLine.Wk02_Locked = bool.Parse(reader["Wk02_Locked"].ToString());

                //        if (reader["Wk03_Locked"] != DBNull.Value)
                //            schedLine.Wk03_Locked = bool.Parse(reader["Wk03_Locked"].ToString());

                //        if (reader["Wk04_Locked"] != DBNull.Value)
                //            schedLine.Wk04_Locked = bool.Parse(reader["Wk04_Locked"].ToString());

                //        if (reader["Wk05_Locked"] != DBNull.Value)
                //            schedLine.Wk05_Locked = bool.Parse(reader["Wk05_Locked"].ToString());

                //        if (reader["Wk06_Locked"] != DBNull.Value)
                //            schedLine.Wk06_Locked = bool.Parse(reader["Wk06_Locked"].ToString());

                //        if (reader["Wk07_Locked"] != DBNull.Value)
                //            schedLine.Wk07_Locked = bool.Parse(reader["Wk07_Locked"].ToString());

                //        if (reader["Wk08_Locked"] != DBNull.Value)
                //            schedLine.Wk08_Locked = bool.Parse(reader["Wk08_Locked"].ToString());

                //        if (reader["Wk09_Locked"] != DBNull.Value)
                //            schedLine.Wk09_Locked = bool.Parse(reader["Wk09_Locked"].ToString());

                //        if (reader["Wk10_Locked"] != DBNull.Value)
                //            schedLine.Wk10_Locked = bool.Parse(reader["Wk10_Locked"].ToString());

                //        if (reader["Wk11_Locked"] != DBNull.Value)
                //            schedLine.Wk11_Locked = bool.Parse(reader["Wk11_Locked"].ToString());

                //        if (reader["Wk12_Locked"] != DBNull.Value)
                //            schedLine.Wk12_Locked = bool.Parse(reader["Wk12_Locked"].ToString());

                //        if (reader["Wk13_Locked"] != DBNull.Value)
                //            schedLine.Wk13_Locked = bool.Parse(reader["Wk13_Locked"].ToString());

                //        if (reader["Wk14_Locked"] != DBNull.Value)
                //            schedLine.Wk14_Locked = bool.Parse(reader["Wk14_Locked"].ToString());

                //        if (reader["SPBuy"] != DBNull.Value)
                //            schedLine.SPBuy = reader["SPBuy"].ToString();

                //        scheduleLines.Add(schedLine);
                //    }
                //}

                //conn.Close();

                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetScheduleLines";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevisedDate != null && RevisedDate.Length > 0)
                {
                    dbparams.Add("RevisedDate", RevisedDate, System.Data.DbType.String);
                }

                if (EffectiveDate != null && EffectiveDate.Length > 0)
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, System.Data.DbType.String);
                }

                if (ExpirationDate != null && ExpirationDate.Length > 0)
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, System.Data.DbType.String);
                }



               
                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (NetworkName != null && NetworkName.Length > 0)
                {
                    dbparams.Add("NetworkNames", NetworkName, System.Data.DbType.String);
                }

                if (TotalSpots != null && TotalSpots.Length > 0)
                {
                    dbparams.Add("TotalSpots", TotalSpots, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                }

                if (DP != null && DP.Length > 0)
                {
                    dbparams.Add("dp", DP, System.Data.DbType.String);
                }

                if (OMDP != null && OMDP.Length > 0)
                {
                    dbparams.Add("OMDP", OMDP, System.Data.DbType.String);
                }

                if (SpotLens != null && SpotLens.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLens, System.Data.DbType.String);
                }

                if (RateAmt != null && RateAmt.Length > 0)
                {
                    dbparams.Add("Rate", RateAmt, System.Data.DbType.String);
                }

                if (Discounts != null && Discounts.Length > 0)
                {
                    dbparams.Add("Discounts", Discounts, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }



                if (BuyType != null && BuyType.Length > 0)
                {
                    dbparams.Add("BuyTypes", BuyType, System.Data.DbType.String);
                }

                if (StartToEnd != null && StartToEnd.Length > 0)
                {
                    dbparams.Add("StartToEnd", StartToEnd, System.Data.DbType.String);
                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (usdRates != null && usdRates.Length > 0)
                {
                    dbparams.Add("usdRates", usdRates, System.Data.DbType.String);
                }
                dbparams.Add("Page", PageNumber, System.Data.DbType.Int32);
                dbparams.Add("PageSize", PageSize, System.Data.DbType.Int32);
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);
                dbparams.Add("ShowTotalsOnly", false, System.Data.DbType.Boolean);

                if (SPBuy != null && SPBuy.Length > 0)
                {
                    dbparams.Add("SPBuy", SPBuy, System.Data.DbType.String);
                }
                
                //ST-724 Added Added Parameters for Filters if Edit
                dbparams.Add("CalledForExport", true, System.Data.DbType.Boolean);

                scheduleLines = FactoryServices.dbFactory.SelectCommand_SP(scheduleLines, spName, dbparams);
                // ST-1010 Added following code by Hunain Manzoor(2024-01-22)
                if(scheduleLines!=null && scheduleLines.Count > 0)
                {
                    for (var i = 0; i < scheduleLines.Count; i++)
                    {                  
                        if (scheduleLines[i].Wk01_Spots == 0)
                        {
                            scheduleLines[i].Wk01_Spots = null;
                        }
                        if (scheduleLines[i].Wk02_Spots == 0)
                        {
                            scheduleLines[i].Wk02_Spots = null;
                        }
                        if (scheduleLines[i].Wk03_Spots == 0)
                        {
                            scheduleLines[i].Wk03_Spots = null;
                        }
                        if (scheduleLines[i].Wk04_Spots == 0)
                        {
                            scheduleLines[i].Wk04_Spots = null;
                        }
                        if (scheduleLines[i].Wk05_Spots == 0)
                        {
                            scheduleLines[i].Wk05_Spots = null;
                        }
                        if (scheduleLines[i].Wk06_Spots == 0)
                        {
                            scheduleLines[i].Wk06_Spots = null;
                        }
                        if (scheduleLines[i].Wk07_Spots == 0)
                        {
                            scheduleLines[i].Wk07_Spots = null;
                        }
                        if (scheduleLines[i].Wk08_Spots == 0)
                        {
                            scheduleLines[i].Wk08_Spots = null;
                        }
                        if (scheduleLines[i].Wk09_Spots == 0)
                        {
                            scheduleLines[i].Wk09_Spots = null;
                        }
                        if (scheduleLines[i].Wk10_Spots == 0)
                        {
                            scheduleLines[i].Wk10_Spots = null;
                        }
                        if (scheduleLines[i].Wk11_Spots == 0)
                        {
                            scheduleLines[i].Wk11_Spots = null;
                        }
                        if (scheduleLines[i].Wk12_Spots == 0)
                        {
                            scheduleLines[i].Wk12_Spots = null;
                        }
                        if (scheduleLines[i].Wk13_Spots == 0)
                        {
                            scheduleLines[i].Wk13_Spots = null;
                        }
                        if (scheduleLines[i].Wk14_Spots == 0)
                        {
                            scheduleLines[i].Wk14_Spots = null;
                        }
                    }
                }
                return scheduleLines;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load schedule/proposal. ScheduleId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public IEnumerable<ScheduleProposalLinesFlatTotals> GetProposalLinesFlatTotals(
            int LoggedOnUserId,
            int ProposalId,
            string ApprovedDesc,
            string Status,
            string RevNo,
            string RevisedDate,
            string DemoNames,
            string NetworkName,
            string PropertyName,
            string DP,
            string OMDP,
            string BuyType,
            string SpotLens,
            string RateAmt,
            string Impressions,
            string CPM,
            string EffectiveDate,
            string ExpirationDate,
            string Discounts,
            string TotalSpots,
            string StartToEnd,
            string usdRates,
            int PageNumber,
            int PageSize,
            float DiscountRate,
            bool ViewOnly,
            bool ExchangeRate,
            bool Schedule,
            bool GI,
            bool ProposalReportTotals,
            bool IsDRBT
            , bool PremiereFilter //ST-807
            )
        {
            try
            {
                List<ScheduleProposalLinesFlatTotals> scheduleLines = new List<ScheduleProposalLinesFlatTotals>();

                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetScheduleLines";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevisedDate != null && RevisedDate.Length > 0)
                {
                    dbparams.Add("RevisedDate", RevisedDate, System.Data.DbType.String);
                }

                if (EffectiveDate != null && EffectiveDate.Length > 0)
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, System.Data.DbType.String);
                }

                if (ExpirationDate != null && ExpirationDate.Length > 0)
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, System.Data.DbType.String);
                }

                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (NetworkName != null && NetworkName.Length > 0)
                {
                    dbparams.Add("NetworkNames", NetworkName, System.Data.DbType.String);
                }

                if (TotalSpots != null && TotalSpots.Length > 0)
                {
                    dbparams.Add("TotalSpots", TotalSpots, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                }

                if (DP != null && DP.Length > 0)
                {
                    dbparams.Add("dp", DP, System.Data.DbType.String);
                }

                if (OMDP != null && OMDP.Length > 0)
                {
                    dbparams.Add("OMDP", OMDP, System.Data.DbType.String);
                }

                if (SpotLens != null && SpotLens.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLens, System.Data.DbType.String);
                }

                if (RateAmt != null && RateAmt.Length > 0)
                {
                    dbparams.Add("Rate", RateAmt, System.Data.DbType.String);
                }

                if (Discounts != null && Discounts.Length > 0)
                {
                    dbparams.Add("Discounts", Discounts, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }

                if (BuyType != null && BuyType.Length > 0)
                {
                    dbparams.Add("BuyTypes", BuyType, System.Data.DbType.String);
                }

                if (StartToEnd != null && StartToEnd.Length > 0)
                {
                    dbparams.Add("StartToEnd", StartToEnd, System.Data.DbType.String);
                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (usdRates != null && usdRates.Length > 0)
                {
                    dbparams.Add("usdRates", usdRates, System.Data.DbType.String);
                }

                dbparams.Add("Page", PageNumber, System.Data.DbType.Int32);
                dbparams.Add("PageSize", PageSize, System.Data.DbType.Int32);
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);
                dbparams.Add("ShowTotalsOnly", true, System.Data.DbType.Boolean);
                dbparams.Add("USD", ExchangeRate, System.Data.DbType.Boolean);
                dbparams.Add("Schedule", Schedule, System.Data.DbType.Boolean);
                dbparams.Add("GI", GI, System.Data.DbType.Boolean);
                dbparams.Add("ProposalReportTotals", ProposalReportTotals, System.Data.DbType.Boolean);
                dbparams.Add("IsDRBT", IsDRBT, System.Data.DbType.Boolean);
                dbparams.Add("PremiereFilter", PremiereFilter, System.Data.DbType.Boolean);
                scheduleLines = FactoryServices.dbFactory.SelectCommand_SP(scheduleLines, spName, dbparams);
                return scheduleLines;
            }            
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. ScheduleId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public IEnumerable<ScheduleProposalLinesFlatTotals> ExcelGetProposalLinesFlatTotals(
            int LoggedOnUserId,
            int ProposalId,
            string ApprovedDesc,
            string Status,
            string RevNo,
            string RevisedDate,
            string DemoNames,
            string NetworkName,
            string PropertyName,
            string DP,
            string OMDP,
            string BuyType,
            string SpotLens,
            string RateAmt,
            string Impressions,
            string CPM,
            string EffectiveDate,
            string ExpirationDate,
            string Discounts,
            string TotalSpots,
            string StartToEnd,
            string usdRates,
            int PageNumber,
            int PageSize,
            float DiscountRate,
            bool ViewOnly,
            bool ExchangeRate,
            bool Schedule,
            bool GI,
            bool ProposalReportTotals,
            bool IsDRBT)
        {
            try
            {
                List<ScheduleProposalLinesFlatTotals> scheduleLines = new List<ScheduleProposalLinesFlatTotals>();

                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetScheduleLines";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevisedDate != null && RevisedDate.Length > 0)
                {
                    dbparams.Add("RevisedDate", RevisedDate, System.Data.DbType.String);
                }

                if (EffectiveDate != null && EffectiveDate.Length > 0)
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, System.Data.DbType.String);
                }

                if (ExpirationDate != null && ExpirationDate.Length > 0)
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, System.Data.DbType.String);
                }

                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (NetworkName != null && NetworkName.Length > 0)
                {
                    dbparams.Add("NetworkNames", NetworkName, System.Data.DbType.String);
                }

                if (TotalSpots != null && TotalSpots.Length > 0)
                {
                    dbparams.Add("TotalSpots", TotalSpots, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                }

                if (DP != null && DP.Length > 0)
                {
                    dbparams.Add("dp", DP, System.Data.DbType.String);
                }

                if (OMDP != null && OMDP.Length > 0)
                {
                    dbparams.Add("OMDP", OMDP, System.Data.DbType.String);
                }

                if (SpotLens != null && SpotLens.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLens, System.Data.DbType.String);
                }

                if (RateAmt != null && RateAmt.Length > 0)
                {
                    dbparams.Add("Rate", RateAmt, System.Data.DbType.String);
                }

                if (Discounts != null && Discounts.Length > 0)
                {
                    dbparams.Add("Discounts", Discounts, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }

                if (BuyType != null && BuyType.Length > 0)
                {
                    dbparams.Add("BuyTypes", BuyType, System.Data.DbType.String);
                }

                if (StartToEnd != null && StartToEnd.Length > 0)
                {
                    dbparams.Add("StartToEnd", StartToEnd, System.Data.DbType.String);
                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (usdRates != null && usdRates.Length > 0)
                {
                    dbparams.Add("usdRates", usdRates, System.Data.DbType.String);
                }

                dbparams.Add("Page", PageNumber, System.Data.DbType.Int32);
                dbparams.Add("PageSize", PageSize, System.Data.DbType.Int32);
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);
                dbparams.Add("ShowTotalsOnly", true, System.Data.DbType.Boolean);
                dbparams.Add("USD", ExchangeRate, System.Data.DbType.Boolean);
                dbparams.Add("Schedule", Schedule, System.Data.DbType.Boolean);
                dbparams.Add("GI", GI, System.Data.DbType.Boolean);
                dbparams.Add("ProposalReportTotals", ProposalReportTotals, System.Data.DbType.Boolean);
                dbparams.Add("IsDRBT", IsDRBT, System.Data.DbType.Boolean);
                dbparams.Add("CalledForExport", true, System.Data.DbType.Boolean);
                scheduleLines = FactoryServices.dbFactory.SelectCommand_SP(scheduleLines, spName, dbparams);
                return scheduleLines;

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. ScheduleId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public IEnumerable<string> GetDemoNames(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames, string filterBuyTypes)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetDemoNames";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("FilterBuyTypeCodes", filterBuyTypes, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed ScheduleRepository.GetDemoNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<string> GetNetworkNames(int LoggedOnUserId, int ScheduleProposalid)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetNetworksBuyTypesAndDemos";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalid, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed ScheduleRepository.GetNetworkNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<string> GetApproved(int LoggedOnUserId, int ScheduleProposalId)
        {
            List<string> lds = new List<string>();
           
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetApproved";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed ScheduleRepository.GetDemoNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<string> GetDPs(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetDP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetDP. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
               // conn.Close();
            }

            return lds;
        }

        public IEnumerable<int> GetTotalSpots(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<int> lds = new List<int>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetTotalSpots";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetDP. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
               // conn.Close();
            }

            return lds;
        }

        public IEnumerable<string> GetOMDPs(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetOMDP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetOMDP. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<BuyTypesAndDemosByNetworks> GetBuyTypesAndDemos(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames, string filterBuyTypes)
        {
            List<BuyTypesAndDemosByNetworks> lstBuyTypesByNetworks = new List<BuyTypesAndDemosByNetworks>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetNetworksBuyTypesAndDemos";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("FilterBuyTypeCodes", filterBuyTypes, System.Data.DbType.String);

                lstBuyTypesByNetworks = FactoryServices.dbFactory.SelectCommand_SP(lstBuyTypesByNetworks, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetNetworksBuyTypesAndDemos. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lstBuyTypesByNetworks;
        }

        public IEnumerable<string> GetStartToEnd(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<string> lbt = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetStartToEnd";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lbt = FactoryServices.dbFactory.SelectCommand_SP(lbt, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetStartToEnd. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lbt;
        }
        public IEnumerable<string> GetLens(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<string> lds = new List<string>();
            
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetLens";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetSpotLen. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<double> GetRateAmt(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetRateAmt";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetRateAmt. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
              //  conn.Close();
            }

            return lds;
        }

        public IEnumerable<double> GetDiscounts(int LoggedOnUserId, int ScheduleProposalId, float DiscountRate, string filterNetworkNames)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetDiscounts";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetDiscounts. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }


        public IEnumerable<double> GetImpressions(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetDiscounts";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetImpressions. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }
        public IEnumerable<double> GetCPM(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetCPM";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetCPM. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<double> GetUSDRate(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetUSDRates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetUSDRates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DoNotBuyType> GetDoNotBuyTypes(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<DoNotBuyType> lds = new List<DoNotBuyType>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetDoNotBuyTypes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetDoNotBuyTypes. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<string> GetRevNo(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<string> lds = new List<string>();
            try
            {
               //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetRevNo";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetRevNo. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }


        public IEnumerable<DateTime> GetRateRevisedDates(int LoggedOnUserId, int ScheduleProposalId)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetRateRevisedDates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetRateRevisedDates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DateTime> GetEffectiveDates(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetEffectiveDates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetEffectiveDates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DateTime> GetExpirationDates(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetExpirationDates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetExpirationDates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<string> GetPropertyNames(int LoggedOnUserId, int ScheduleProposalid, string filterNetworkNames)
        {
            List<string> lds = new List<string>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetPropertyNames";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalid, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetPropertyNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<SelectListItem> GetWeekDay(int LoggedOnUserId, int ScheduleProposalid, string filterNetworkNames, int WeekDayId)
        {
            List<SelectListItem> lds = new List<SelectListItem>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetWeekDay";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalid, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("WeekDayId", WeekDayId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetWeekDay. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds.Distinct();
        }

        public IEnumerable<SelectListItem> GetSPBuy(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames)
        {
            List<SelectListItem> lds = new List<SelectListItem>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetSPBuy";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetSPBuy. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<int> GetWKSpots(int LoggedOnUserId, int ScheduleProposalId, string filterNetworkNames, int WKNo)
        {
            List<int> lds = new List<int>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Schedule_GetWKSpots";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleProposalId", ScheduleProposalId, System.Data.DbType.Int32);
                dbparams.Add("FilterNetworkNames", filterNetworkNames, System.Data.DbType.String);
                dbparams.Add("WKNo", WKNo, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Schedule_GetWKSpots. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

    }

    public class ScheduleRepository : ScheduleProposalRepository, IScheduleRepository, IScheduleProposalRepository
    {
        public ScheduleRepository(AppContext context
            , StoredProcsContext spcontext
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger) : base(context, spcontext, userRepository, logger)
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
            _userRepository = userRepository;
            _scheduleTypeId = 2;
        }

        public ScheduleSummary GetScheduleById(int LoggedOnUserId, int ScheduleId)
        {
            return GetInfoById(LoggedOnUserId, ScheduleId);
        }


        public IEnumerable<SchedulePermissions> GetScheduleByClient(int LoggedOnUserId, int ClientId, int BroadcastYr)
        {
            return GetInfoByClient(LoggedOnUserId, ClientId, BroadcastYr);
        }

        public IEnumerable<ScheduleLine> GetScheduleLines(int LoggedOnUser, int ScheduleId)
        {
            return _context
                .ScheduleLines
                .Include(dbt => dbt.Rate.DoNotBuyType)
                .Include(s => s.Schedule.ScheduleType)
                .Include(d => d.Rate.DemographicSettingsPerQtr.Demo)
                .Include(dq => dq.Rate.DemographicSettingsPerQtr)
                .Include(n => n.Rate.Property.Network)
                .Include(n => n.Rate.Property)
                .Include(dp => dp.Rate.Property.DayPart)
                .Include(bt => bt.Rate.BuyType)
                .Where(sl => sl.ScheduleId == ScheduleId)
                .Where(s => s.Schedule.ScheduleTypeId == 2)
                .ToList();
        }

        public string LockSchedule(int LoggedOnUserId, int ScheduleId)
        {
            return Lock(LoggedOnUserId, ScheduleId);
        }

        public bool UnlockSchedule(int LoggedOnUserId, int ScheduleId)
        {
            return Unlock(LoggedOnUserId, ScheduleId, true);
        }

        public int GetScheduleLockCount()
        {
            return GetLockCount();
        }

        public IEnumerable<Schedule> GetSchedules(int LoggedOnUserId)
        {
            return _context
                .Schedule
                .Include(c => c.Client)
                .Include(co => co.Client.Country)
                .Include(b => b.BuyerUser)
                .Include(l => l.LockedByUser)
                .Include(u => u.UpdatedBy)
                .Where(uf => uf.ScheduleType.Description == "Schedule")
                .ToList();

        }

        public SCHED_WEEK_LOCK_T GetSchedWeekLockStatus(int ScheduleId)
        {
            return _context.SCHED_WEEK_LOCK_T.Where(x => x.SchedId == ScheduleId).FirstOrDefault();
        }


    }

    public class ProposalRepository : ScheduleProposalRepository, IProposalRepository, IScheduleProposalRepository
    {
        public ProposalRepository(AppContext context
            , StoredProcsContext spcontext
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger) : base(context, spcontext, userRepository, logger)
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
            _userRepository = userRepository;
            _scheduleTypeId = 1;
        }

        public SchedulePermissions GetProposalById(int LoggedOnUserId, int ProposalId)
        {
            return GetInfoById(LoggedOnUserId, ProposalId);
        }

        public IEnumerable<SchedulePermissions> GetProposalByClient(int LoggedOnUserId, int ClientId, int BroadcastYr)
        {
            return GetInfoByClient(LoggedOnUserId, ClientId, BroadcastYr);
        }


        public IEnumerable<float> GetClientQuarterCommissionRates(int LoggedOnUserId, int ClientId, int QuarterId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                 List<float> commrates = new List<float>();
                string spName = "sp_Client_GetCommissionRatesByQuarter";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, System.Data.DbType.Int32);
                dbparams.Add("UniqueOnly", true, System.Data.DbType.Boolean);

                commrates = FactoryServices.dbFactory.SelectCommand_SP(commrates, spName, dbparams);

                return commrates;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable get rates. ClientId: " + ClientId.ToString() + " QuarterId: " + QuarterId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public ErrorMessage IsInUse(int LineId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_IsInUse";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ProposalLineid", LineId, System.Data.DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;
            }
            finally
            {
            }

            return err;
        }

        public CAtoUS_ExchangeRates GetClientQuarterWeeklyExchangeRates(int LoggedOnUserId, int ClientId, int QuarterId)
        {
            try
            {
                //DbConnection conn = _spcontext.Database.GetDbConnection();
                //if (conn.State == ConnectionState.Closed)
                //{
                //    conn.Open();
                //}

                //DbCommand command = _spcontext.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Client_GetWeeklyExchangeRate ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramClientId = new SqlParameter("@ClientId", SqlDbType.Int);
                //paramClientId.Value = ClientId;
                //command.Parameters.Add(paramClientId);

                //SqlParameter paramQuarterId = new SqlParameter("@QuarterId", SqlDbType.Int);
                //paramQuarterId.Value = QuarterId;
                //command.Parameters.Add(paramQuarterId);

                //SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //paramLoggedOnUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramLoggedOnUserId);

                //CAtoUS_ExchangeRates commrate = new CAtoUS_ExchangeRates();
                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        if ((int)reader["WkNbr"] == 1)
                //        {
                //            commrate.Week01Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 2)
                //        {
                //            commrate.Week02Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 3)
                //        {
                //            commrate.Week03Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 4)
                //        {
                //            commrate.Week04Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 5)
                //        {
                //            commrate.Week05Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 6)
                //        {
                //            commrate.Week06Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 7)
                //        {
                //            commrate.Week07Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 8)
                //        {
                //            commrate.Week08Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 9)
                //        {
                //            commrate.Week09Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 10)
                //        {
                //            commrate.Week10Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 11)
                //        {
                //            commrate.Week11Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 12)
                //        {
                //            commrate.Week12Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 13)
                //        {
                //            commrate.Week13Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //        else if ((int)reader["WkNbr"] == 14)
                //        {
                //            commrate.Week14Rate = float.Parse(reader["Rate"].ToString());
                //        }
                //    }

                //}

                //conn.Close();

                // ST-946 Code Implementation with Dapper
                  List<WeeklyExchangeRateModel> lstExchaneRate= new List<WeeklyExchangeRateModel>();
                string spName = "sp_Client_GetWeeklyExchangeRate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lstExchaneRate = FactoryServices.dbFactory.SelectCommand_SP(lstExchaneRate, spName, dbparams);
                CAtoUS_ExchangeRates commrate = new CAtoUS_ExchangeRates();
                if (lstExchaneRate != null && lstExchaneRate.Count > 0)
                {
                    foreach (WeeklyExchangeRateModel rm in lstExchaneRate)
                    {

                        if (rm.WkNbr == 1)
                        {
                            commrate.Week01Rate = rm.WeekRate;
                        }
                        else if (rm.WkNbr == 2)
                        {
                            commrate.Week02Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 3)
                        {
                            commrate.Week03Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 4)
                        {
                            commrate.Week04Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 5)
                        {
                            commrate.Week05Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 6)
                        {
                            commrate.Week06Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 7)
                        {
                            commrate.Week07Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 8)
                        {
                            commrate.Week08Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 9)
                        {
                            commrate.Week09Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 10)
                        {
                            commrate.Week10Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 11)
                        {
                            commrate.Week11Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 12)
                        {
                            commrate.Week12Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 13)
                        {
                            commrate.Week13Rate =  rm.WeekRate;
                        }
                        else if (rm.WkNbr == 14)
                        {
                            commrate.Week14Rate =  rm.WeekRate;
                        }
                    }
                }
                return commrate;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable get rates. ClientId: " + ClientId.ToString() + " QuarterId: " + QuarterId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public CommRate GetClientQuarterWeeklyCommissionRates(int LoggedOnUserId, int ClientId, int QuarterId)
        {
            try
            {
                //DbConnection conn = _spcontext.Database.GetDbConnection();
                //if (conn.State == ConnectionState.Closed)
                //{
                //    conn.Open();
                //}

                //DbCommand command = _spcontext.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Client_GetCommissionRatesByQuarter ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramClientId = new SqlParameter("@ClientId", SqlDbType.Int);
                //paramClientId.Value = ClientId;
                //command.Parameters.Add(paramClientId);

                //SqlParameter paramQuarterId = new SqlParameter("@QuarterId", SqlDbType.Int);
                //paramQuarterId.Value = QuarterId;
                //command.Parameters.Add(paramQuarterId);

                //SqlParameter paramUniqueOnly = new SqlParameter("@UniqueOnly", SqlDbType.Bit);
                //paramUniqueOnly.Value = 0;
                //command.Parameters.Add(paramUniqueOnly);

                //CommRate commrate = new CommRate();
                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    if (reader.Read())
                //    {
                //        commrate.Week01Rate = decimal.Parse(reader["Week01Rate"].ToString());
                //        commrate.Week02Rate = decimal.Parse(reader["Week02Rate"].ToString());
                //        commrate.Week03Rate = decimal.Parse(reader["Week03Rate"].ToString());
                //        commrate.Week04Rate = decimal.Parse(reader["Week04Rate"].ToString());
                //        commrate.Week05Rate = decimal.Parse(reader["Week05Rate"].ToString());
                //        commrate.Week06Rate = decimal.Parse(reader["Week06Rate"].ToString());
                //        commrate.Week07Rate = decimal.Parse(reader["Week07Rate"].ToString());
                //        commrate.Week08Rate = decimal.Parse(reader["Week08Rate"].ToString());
                //        commrate.Week09Rate = decimal.Parse(reader["Week09Rate"].ToString());
                //        commrate.Week10Rate = decimal.Parse(reader["Week10Rate"].ToString());
                //        commrate.Week11Rate = decimal.Parse(reader["Week11Rate"].ToString());
                //        commrate.Week12Rate = decimal.Parse(reader["Week12Rate"].ToString());
                //        commrate.Week13Rate = decimal.Parse(reader["Week13Rate"].ToString());
                //        commrate.Week14Rate = decimal.Parse(reader["Week14Rate"].ToString());
                //    }

                //}

                //conn.Close();
                // ST-946 Code Implementation with Dapper
                CommRate commrate = new CommRate();
                string spName = "sp_Client_GetCommissionRatesByQuarter";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, System.Data.DbType.Int32);
                dbparams.Add("UniqueOnly", false, System.Data.DbType.Int32);
                commrate = FactoryServices.dbFactory.SelectCommand_SP(commrate, spName, dbparams);
                return commrate;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable get rates. ClientId: " + ClientId.ToString() + " QuarterId: " + QuarterId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }


        public float GetClientExchangeRate(int LoggedOnUserId, int ClientId, int QuarterId)
        {

            float PlanningRate = 0f;
            try
            {
                //DbConnection conn = _spcontext.Database.GetDbConnection();
                //if (conn.State == ConnectionState.Closed)
                //{
                //    conn.Open();
                //}

                //DbCommand command = _spcontext.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Client_GetExchangeRate ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramClientId = new SqlParameter("@ClientId", SqlDbType.Int);
                //paramClientId.Value = ClientId;
                //command.Parameters.Add(paramClientId);

                //SqlParameter paramQuarterId = new SqlParameter("@QuarterId", SqlDbType.Int);
                //paramQuarterId.Value = QuarterId;
                //command.Parameters.Add(paramQuarterId);

                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    if (reader.Read())
                //    {
                //        PlanningRate = float.Parse(reader["PlanningRate"].ToString());
                //    }

                //}

                //conn.Close();
                // ST-946 Code Implementation with Dapper
                CommRate commrate = new CommRate();
                string spName = "sp_Client_GetExchangeRate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, System.Data.DbType.Int32);
                PlanningRate = FactoryServices.dbFactory.SelectCommand_SP(PlanningRate, spName, dbparams);
                return PlanningRate;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable get rates. ClientId: " + ClientId.ToString() + " QuarterId: " + QuarterId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return 0;

        }

        public IEnumerable<Schedule> GetProposals(int LoggedOnUserId)
        {
            return _context
                .Schedule
                .Include(c => c.Client)
                .Include(co => co.Client.Country)
                .Include(b => b.BuyerUser)
                .Include(l => l.LockedByUser)
                .Include(u => u.UpdatedBy)
                .Where(uf => uf.ScheduleType.Description == "Proposal")
                .ToList();
        }

        public Schedule GetProposal(int ProposalId, int LoggedOnUserId)
        {
            return _context
                .Schedule
                .Include(c => c.Client)
                .Include(co => co.Client.Country)
                .Include(b => b.BuyerUser)
                .Include(l => l.LockedByUser)
                .Include(u => u.UpdatedBy)
                .Where(uf => uf.ScheduleId == ProposalId)
                .FirstOrDefault<Schedule>();

        }


        public IEnumerable<ScheduleLine> GetProposalLines(int LoggedOnUser, int ProposalId)
        {
            return _context
                .ScheduleLines
                .Include(dbt => dbt.Rate.DoNotBuyType)
                .Include(s => s.Schedule.ScheduleType)
                .Include(d => d.Rate.DemographicSettingsPerQtr.Demo)
                .Include(dq => dq.Rate.DemographicSettingsPerQtr)
                .Include(n => n.Rate.Property.Network)
                .Include(n => n.Rate.Property)
                .Include(dp => dp.Rate.Property.DayPart)
                .Include(bt => bt.Rate.BuyType)
                .Where(sl => sl.ScheduleId == ProposalId)
                .Where(s => s.Schedule.ScheduleTypeId == 1)
                .OrderBy(d => d.Rate.DemographicSettingsPerQtr.Demo.DemoName)
                .OrderBy(n => n.Rate.Property.Network.StdNetName)
                .Take(50)
                .ToList();
        }


        public string LockProposal(int LoggedOnUserId, int ScheduleId)
        {
            return Lock(LoggedOnUserId, ScheduleId);
        }

        public bool UnlockProposal(int LoggedOnUserId, int ProposalId, bool IsCalledFromBtn)
        {
            return Unlock(LoggedOnUserId, ProposalId, IsCalledFromBtn);
        }

        public int GetProposalLockCount()
        {
            return GetLockCount();
        }

        public IEnumerable<Network> GetNetworksAvailable(int ProposalId, int UserId)
        {
            List<Network> networks = new List<Network>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetNetworksAvailable";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);

                networks = FactoryServices.dbFactory.SelectCommand_SP(networks, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to call sp_Proposal_GetNetworksAvailable.  (" + UserId.ToString() + " " + ProposalId.ToString() + ") " + exc.Message);

            }
            finally
            {

            }
            return networks;

        }

        public IEnumerable<Network> GetNetworksNeedAttention(int ProposalId, int UserId)
        {
            List<Network> networks = new List<Network>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetNetworksNeedsAttention";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);

                networks = FactoryServices.dbFactory.SelectCommand_SP(networks, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to call sp_Proposal_GetNetworksNeedsAttention.  (" + UserId.ToString() + " " + ProposalId.ToString() + ") " + exc.Message);

            }
            finally
            {

            }
            return networks;

        }

        public IEnumerable<Network> GetNetworksNotAvailable(int ProposalId, int UserId)
        {
            List<Network> networks = new List<Network>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetNetworksNotAvailable";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);

                networks = FactoryServices.dbFactory.SelectCommand_SP(networks, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to call sp_Proposal_GetNetworksNotAvailable.  (" + UserId.ToString() + " " + ProposalId.ToString() + ") " + exc.Message);

            }
            finally
            {

            }
            return networks;

        }


        public ErrorMessage CopyToSchedule(int ProposalId, string NetworkIds, int UserId)
        {

            ErrorMessage err = new ErrorMessage(false, -1, "Unknown Error");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_CopyToScheduleByNet";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("NetworkIds", NetworkIds, System.Data.DbType.String);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }
            finally
            {
            }

            return err;
        }

        public ErrorMessage CopySpots(int ProposalId, int CopyWeek, int EndCopyWeek, string NetworkName, int LoggedOnUserId, string ScheduleLineIds)
        {

            ErrorMessage err = new ErrorMessage(false, -1, "Unknown Error");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_ScheduleProposal_CopyWeeks";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("CopyWeek", CopyWeek, System.Data.DbType.Int32);
                dbparams.Add("EndCopyWeek", EndCopyWeek, System.Data.DbType.Int32);
                dbparams.Add("NetworkName", NetworkName, System.Data.DbType.String);
                if (!string.IsNullOrEmpty(ScheduleLineIds))
                {
                    dbparams.Add("ScheduleLineIds", ScheduleLineIds, System.Data.DbType.String);
                }
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }
            finally
            {

            }

            return err;
        }

        public ErrorMessage CreateProposal(int ClientId, int DemographicSettingsId, string QuarterName, string ScheduleName, string RateIds, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "Unknown Error");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_CreateNew";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("DemographicSettingsId", DemographicSettingsId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("ScheduleName", @ScheduleName, System.Data.DbType.String);
                dbparams.Add("RateIds", RateIds, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }
            finally
            {
            }

            return err;
        }

        public List<Rate> GetPropertiesForCreate(string NetworkIds, string QuarterName, int ClientId, int DemographicSettingsId, int LoggedOnUserId)
        {
            List<Rate> rates = new List<Rate>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetPropertiesForCreate";
                List<PropertiesForCreateModel> lstProps = new List<PropertiesForCreateModel>();
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkIds", NetworkIds, System.Data.DbType.String);
                dbparams.Add("DemographicSettingsId", DemographicSettingsId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);

                lstProps = FactoryServices.dbFactory.SelectCommand_SP(lstProps, spName, dbparams);
                if (lstProps != null && lstProps.Count > 0)
                {
                    foreach(PropertiesForCreateModel model in lstProps)
                    {
                        Rate rate = new Rate();
                        rate.RateId = model.RateID;
                        rate.RateAmt = model.RateAmt;
                        rate.SpotLen = model.SpotLen;

                        rate.Property = new Property();
                        rate.Property.PropertyId = model.PropertyId;
                        rate.Property.PropertyName = model.PropertyName;
                        rate.Property.Monday = model.Monday;
                        rate.Property.Tuesday = model.Tuesday;
                        rate.Property.Wednesday = model.Wednesday;
                        rate.Property.Thursday = model.Thursday;
                        rate.Property.Friday = model.Friday;
                        rate.Property.Saturday = model.Saturday;
                        rate.Property.Sunday = model.Sunday;
                        rate.Property.StartTime = model.StartTime;
                        rate.Property.EndTime = model.EndTime;

                        rate.Split = new Split();
                        rate.Split.SplitId = model.SplitId;
                        rate.Split.SplitNo = model.SplitNo;

                        rate.Property.DayPart = new DayPart();
                        rate.Property.DayPart.DayPartId = model.DayPartId;
                        rate.Property.DayPart.DayPartCd = model.DayPartCd;

                        rate.Property.Network = new Network();
                        rate.Property.Network.NetworkId = model.NetworkId;
                        rate.Property.Network.StdNetName = model.StdNetName;

                        rate.BuyType = new BuyType();
                        rate.BuyType.BuyTypeId = model.BuyTypeId;
                        rate.BuyType.BuyTypeCode = model.BuyTypeCode;

                        rate.DoNotBuyType = new DoNotBuyType();
                        rate.DoNotBuyType.DoNotBuyTypeId = model.DoNotBuyTypeId;
                        rate.DoNotBuyType.Description = model.Status;
                        rate.StartTimeFormatted = model.StartTimeFormatted;
                        rate.EndTimeFormatted = model.EndTimeFormatted;
                        rates.Add(rate);
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load properties for network CREATE PROPOSAL. | " + exc.Message);
            }
            finally
            {
            }

            return rates;

        }

        public int GetProposalVersion(int ProposalId, int LoggedOnUserId)
        {
            int retval = 0;
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetNextVersion";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ScheduleId", ProposalId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get version number. | " + exc.Message);
                retval = 0;
            }
            finally
            {
            }

            return retval;

        }

        public ErrorMessage SaveFilterState(int proposalId, string profileKey, string currentFilters, int userId)
        {
            ErrorMessage err= new ErrorMessage();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_SaveFilterState";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ProposalId", proposalId, System.Data.DbType.Int32 );
                dbparams.Add("profileKey", profileKey, System.Data.DbType.String);
                dbparams.Add("currentFilters", currentFilters, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", userId, System.Data.DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                if(err== null)
                {
                    return new ErrorMessage(false, -1, "Unknown error occured.  Please see admin.");
                }
                return err;
               

            }
            catch (Exception exc)
            {
                _logger.LogError(userId, "Unable to save datatable filer state. | " + exc.Message);
                return new ErrorMessage(false, -1, exc.Message);
            }
            finally
            {
            }

        }


        public IEnumerable<ProposalNetworks> GetProposalAllNetworks(int ProposalId, int UserId)
        {
            List<ProposalNetworks> networks = new List<ProposalNetworks>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetAllNetworks";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                networks = FactoryServices.dbFactory.SelectCommand_SP(networks, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to call sp_Proposal_GetAllNetworks.  (" + UserId.ToString() + " " + ProposalId.ToString() + ") " + exc.Message);

            }
            finally
            {
            }
            return networks;

        }

        public bool CreateProposalVisible(int ClientId, int LoggedOnUserId)
        {
            try
            {
                bool result = false;
                int[] JobId = new int[] { 1, 2, 3 };
                var pl = _context.Users.Include(x => x.PermissionLevel).Where(x => x.UserId == LoggedOnUserId).Select(x => x.PermissionLevel.Description).Single();
                var cuj = _context.ClientUserJob.Include(x => x.Client).Where(x => x.UserId == LoggedOnUserId && x.Client.ClientId == ClientId && JobId.Contains(x.JobId)).ToList();
                if (pl.ToString().ToLower() == "buyer")
                {
                    if (cuj.Count() > 0)
                    {
                        result = true;
                    }
                }
                return result;
            }
            catch (Exception exc)
            {

                _logger.LogError(LoggedOnUserId, "Error in CreateProposalVisible | ClientId: " + ClientId.ToString() + " | " + exc.Message);
                return false;
            }

        }

        public ErrorMessage SaveQuarterlyClientNote(int ProposalId, string Note, int LoggedOnUserId)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_SaveQuarterlyClientNote";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("Note", Note, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in SaveQuarterlyClientNote | ProposalId: " + ProposalId.ToString() + " | " + exc.Message);
                err.Success = false;
                err.ResponseCode = -1;
            }
            finally
            {
            }
            return err;
        }

        public string GetQuarterlyClientNote(int ProposalId, int LoggedOnUserId)
        {
            var note = "";
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetQuarterlyClientNote";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);

                note = FactoryServices.dbFactory.SelectCommand_SP(note, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetQuarterlyClientNote | ProposalId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }
            return note;
        }

        public IEnumerable<Network> GetScheduleNetworksNotInProposal(int ProposalId, int LoggedOnUserId)
        {
            var lstNetworks = new List<Network>();
            try
            {

                var schedule = (from s in _context.Schedule
                                join sl in _context.ScheduleLines on s.ScheduleId equals sl.ScheduleId
                                join r in _context.Rates on sl.RateId equals r.RateId
                                join dspq in _context.DemographicSettingsPerQtr on r.DemographicSettingsPerQtrId equals dspq.DemographicSettingsPerQtrId
                                where s.ScheduleId == ProposalId && s.ScheduleTypeId == 1
                                select new { s.ClientId, dspq.QuarterId }).FirstOrDefault();

                var scheduleId = (from s in _context.Schedule
                                  join sl in _context.ScheduleLines on s.ScheduleId equals sl.ScheduleId
                                  join r in _context.Rates on sl.RateId equals r.RateId
                                  join dspq in _context.DemographicSettingsPerQtr on r.DemographicSettingsPerQtrId equals dspq.DemographicSettingsPerQtrId
                                  where s.ClientId == schedule.ClientId && dspq.QuarterId == schedule.QuarterId && s.ScheduleTypeId == 2
                                  select s.ScheduleId).FirstOrDefault();
                var rateIds = (from sl in _context.ScheduleLines where sl.ScheduleId == ProposalId select sl.RateId);
                lstNetworks = (from sl in _context.ScheduleLines
                               join r in _context.Rates on sl.RateId equals r.RateId
                               join p in _context.Properties on r.PropertyId equals p.PropertyId
                               join swl in _context.SCHED_WEEK_LOCK_T on sl.ScheduleId equals swl.SchedId
                               where sl.ScheduleId == scheduleId
                               && !rateIds.Contains(sl.RateId)
                               && (!_context.POSTLOG_LINE_T.Any(x => x.ScheduleLineID == sl.ScheduleLineId && x.PostLog.Actualize_Date != null && x.PostLog.Actualize_User != null))
                               select new Network { StdNetName = p.Network.StdNetName, NetworkId = p.Network.NetworkId }).ToList();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetScheduleNetworksNotInProposal | ProposalId: " + ProposalId.ToString() + " | " + exc.Message);
            }

            return lstNetworks;

        }

        // V6, With Dapper
        public IEnumerable<ScheduleProposalLinesFlat> GetProposalLinesFlat_New(
                       int LoggedOnUserId,
                int ProposalId,
                string ApprovedDesc,
                string Status,
                string RevNo,
                string RevisedDate,
                string DemoNames,
                string NetworkName,
                string PropertyName,
                string DP,
                string OMDP,
                string BuyType,
                string SpotLens,
                string RateAmt,
                string Impressions,
                string CPM,
                string EffectiveDate,
                string ExpirationDate,
                string Discounts,
                string TotalSpots,
                string StartToEnd,
                string usdRates,
                int PageNumber,
                int PageSize,
                float DiscountRate,
                bool ViewOnly,
                string SPBuy,
                string WK01Spots,
                string WK02Spots,
                string WK03Spots,
                string WK04Spots,
                string WK05Spots,
                string WK06Spots,
                string WK07Spots,
                string WK08Spots,
                string WK09Spots,
                string WK10Spots,
                string WK11Spots,
                string WK12Spots,
                string WK13Spots,
                string WK14Spots
                , string Monday, string Tuesday, string Wednesday
                , string Thursday, string Friday, string Saturday, string Sunday
                        )
        {
            try
            {
                List<ScheduleProposalLinesFlat> scheduleLines = new List<ScheduleProposalLinesFlat>();



                string spName = "sp_Schedule_GetScheduleLines";
                DynamicParameters dbparams = new DynamicParameters();

                dbparams.Add("ScheduleId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevisedDate != null && RevisedDate.Length > 0)
                {
                    dbparams.Add("RevisedDate", RevisedDate, System.Data.DbType.String);
                }

                if (EffectiveDate != null && EffectiveDate.Length > 0)
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, System.Data.DbType.String);
                }

                if (ExpirationDate != null && ExpirationDate.Length > 0)
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, System.Data.DbType.String);
                }

                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (NetworkName != null && NetworkName.Length > 0)
                {
                    dbparams.Add("NetworkNames", NetworkName, System.Data.DbType.String);
                }

                if (TotalSpots != null && TotalSpots.Length > 0)
                {
                    dbparams.Add("TotalSpots", TotalSpots, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                }

                if (DP != null && DP.Length > 0)
                {
                   
                    dbparams.Add("dp", DP, System.Data.DbType.String);
                }

                if (OMDP != null && OMDP.Length > 0)
                {
                    dbparams.Add("OMDP", OMDP, System.Data.DbType.String);
                }

                if (SpotLens != null && SpotLens.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLens, System.Data.DbType.String);
                }

                if (RateAmt != null && RateAmt.Length > 0)
                {
                    dbparams.Add("Rate", RateAmt, System.Data.DbType.String);

                }

                if (Discounts != null && Discounts.Length > 0)
                {
                    dbparams.Add("Discounts", Discounts, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }

                if (BuyType != null && BuyType.Length > 0)
                {
                    dbparams.Add("BuyType", BuyType, System.Data.DbType.String);
                }

                if (StartToEnd != null && StartToEnd.Length > 0)
                {
                    dbparams.Add("StartToEnd", StartToEnd, System.Data.DbType.String);

                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (usdRates != null && usdRates.Length > 0)
                {
                    dbparams.Add("usdRates", usdRates, System.Data.DbType.String);
                }

                dbparams.Add("PageNumber", PageNumber, System.Data.DbType.Int32);

                dbparams.Add("PageSize", PageSize, System.Data.DbType.Int32);
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);
                dbparams.Add("DiscountRate", DiscountRate, System.Data.DbType.Decimal);

                if (SPBuy != null && SPBuy.Length > 0)
                {
                    dbparams.Add("SPBuy", SPBuy, System.Data.DbType.String);
                }
                if (WK01Spots != null && WK01Spots.Length > 0)
                {
                    dbparams.Add("WK01Spots", SPBuy, System.Data.DbType.String);
                }
                if (WK02Spots != null && WK02Spots.Length > 0)
                {
                    dbparams.Add("WK02Spots", WK02Spots, System.Data.DbType.String);
                }
                if (WK03Spots != null && WK03Spots.Length > 0)
                {
                    dbparams.Add("WK03Spots", WK03Spots, System.Data.DbType.String);
                }
                if (WK04Spots != null && WK04Spots.Length > 0)
                {
                    dbparams.Add("WK04Spots", WK04Spots, System.Data.DbType.String);
                }
                if (WK05Spots != null && WK05Spots.Length > 0)
                {
                    dbparams.Add("WK05Spots", WK05Spots, System.Data.DbType.String);
                }
                if (WK06Spots != null && WK06Spots.Length > 0)
                {
                    dbparams.Add("WK06Spots", WK06Spots, System.Data.DbType.String);
                }
                if (WK07Spots != null && WK07Spots.Length > 0)
                {
                    dbparams.Add("WK07Spots", WK07Spots, System.Data.DbType.String);
                }
                if (WK08Spots != null && WK08Spots.Length > 0)
                {
                    dbparams.Add("WK08Spots", WK08Spots, System.Data.DbType.String);
                }
                if (WK09Spots != null && WK09Spots.Length > 0)
                {
                    dbparams.Add("WK09Spots", WK09Spots, System.Data.DbType.String);
                }
                if (WK10Spots != null && WK10Spots.Length > 0)
                {
                    dbparams.Add("WK10Spots", WK10Spots, System.Data.DbType.String);
                }
                if (WK11Spots != null && WK11Spots.Length > 0)
                {
                    dbparams.Add("WK11Spots", WK11Spots, System.Data.DbType.String);
                }
                if (WK12Spots != null && WK12Spots.Length > 0)
                {
                    dbparams.Add("WK12Spots", WK12Spots, System.Data.DbType.String);
                }
                if (WK13Spots != null && WK13Spots.Length > 0)
                {
                    dbparams.Add("WK13Spots", WK13Spots, System.Data.DbType.String);
                }
                if (WK14Spots != null && WK14Spots.Length > 0)
                {
                    dbparams.Add("WK14Spots", WK14Spots, System.Data.DbType.String);
                }

                if (Monday != null && Monday.Length > 0)
                {
                    dbparams.Add("Monday", Monday, System.Data.DbType.String);
                }
                if (Tuesday != null && Tuesday.Length > 0)
                {
                    dbparams.Add("Tuesday", Tuesday, System.Data.DbType.String);
                }
                if (Wednesday != null && Wednesday.Length > 0)
                {
                    dbparams.Add("Wednesday", Wednesday, System.Data.DbType.String);
                }
                if (Thursday != null && Thursday.Length > 0)
                {
                    dbparams.Add("Thursday", Thursday, System.Data.DbType.String);
                }
                if (Friday != null && Friday.Length > 0)
                {
                    dbparams.Add("Friday", Friday, System.Data.DbType.String);
                }
                if (Saturday != null && Saturday.Length > 0)
                {
                    dbparams.Add("Saturday", Saturday, System.Data.DbType.String);
                }
                if (Sunday != null && Sunday.Length > 0)
                {
                    dbparams.Add("Sunday", Sunday, System.Data.DbType.String);
                }
                Thread.Sleep(2000);
                scheduleLines = FactoryServices.dbFactory.SelectCommand_SP(scheduleLines, spName, dbparams);
                return scheduleLines;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load schedule/proposal. ScheduleId: " + ProposalId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        #region Proposal Automation Functions
        public List<UnAllocatedProposals> GetUnAllocatedProposals(int ClientId, string QuarterName, bool GetCount, string LoggedOnUserId, bool Archived,string Mode)
        {
            List<UnAllocatedProposals> unAllocatedProposals = new List<UnAllocatedProposals>();
            try
            {
                string spName = "sp_Proposal_UnAllocatedProposals_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("GetCountOnly", GetCount, System.Data.DbType.Boolean);
                dbparams.Add("Archived", Archived, System.Data.DbType.Boolean);
                dbparams.Add("Mode", Mode, System.Data.DbType.String);

                unAllocatedProposals = FactoryServices.dbFactory.SelectCommand_SP(unAllocatedProposals, spName, dbparams);
                return unAllocatedProposals;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch UnAllocated proposals. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return unAllocatedProposals;
        }

        public int ArchiveProposals(int ClientId, string QuarterName, string NetworkIds, string SourceFileNames, bool Archived, int LoggedOnUserId)
        {
            int retval = 0;
            try
            {
                string spName = "sp_Proposal_UnAllocated_Archive";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("SelNetworkIds", NetworkIds, System.Data.DbType.String);
                dbparams.Add("SelNetworkFiles", SourceFileNames, System.Data.DbType.String);
                dbparams.Add("Archived", Archived, System.Data.DbType.String);

                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                //ST-710 Changes Added by Shariq
                if (retval > 0)
                {
                    string Description = "User " + (Archived == true ? "Archived" : "Unarchived") + " the file";
                    string ActionTaken = (Archived == true ? "Archived" : "Unarchived");
                    int Retval2 = AddUserJourneyMaster(ClientId, Convert.ToInt32(NetworkIds), QuarterName, "FileSelectionScreen", 0, 0, SourceFileNames, ActionTaken, Description, LoggedOnUserId);
                }

                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch Archive Unallocated proposal. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + "| NetworkId: " + NetworkIds + "| SourceFileName: " + SourceFileNames + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return retval;
        }

        public List<ImportingProposals> GetImportingProposals(int ClientId, string QuarterName, int NetworkId, string SourceFileName,string FileAction, int CountryId, bool ShowTotals,string Mode, int LoggedOnUserId)
        {
            List<ImportingProposals> importProposals = new List<ImportingProposals>();
            try
            {
                string spName = "sp_Proposal_UnAllocated_For_Import_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("SourceFileName", SourceFileName, System.Data.DbType.String);
                dbparams.Add("FileAction", FileAction, System.Data.DbType.String);
                dbparams.Add("CountryId", CountryId, System.Data.DbType.String);
                dbparams.Add("Mode", Mode, System.Data.DbType.String);
                dbparams.Add("ShowTotals", ShowTotals, System.Data.DbType.Boolean);

                importProposals = FactoryServices.dbFactory.SelectCommand_SP(importProposals, spName, dbparams);
                return importProposals;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch Import proposals. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return importProposals;
        }

       
        public SaveUnallocatedProposalResponse SaveUnAllocateProposalsVersionHistory(int ClientId, string QuarterName, string Mode, string SourceFileName, string FileAction, int LoggedOnUserId)
        {
            SaveUnallocatedProposalResponse retval = new SaveUnallocatedProposalResponse();
            try
            {
                string spName = "sp_Proposals_UnAllocated_Maintain_Proposal_Versions";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("Mode", Mode, System.Data.DbType.String);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("EDIRawFilesSourceFile", SourceFileName, System.Data.DbType.String);
                dbparams.Add("RawFileAction", FileAction, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Save the Proposal Detail. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return retval;
        }


        public SaveUnallocatedProposalResponse SaveUnAllocateProposals(int ProposalId, int RateId, int PropertyId, int ClientId, string QuarterName, Int64 PAJourneyId
              , int wk1, int wk2, int wk3, int wk4, int wk5, int wk6, int wk7, int wk8,
              int wk9, int wk10, int wk11, int wk12, int wk13, int wk14, int LoggedOnUserId)
        {
            SaveUnallocatedProposalResponse retval = new SaveUnallocatedProposalResponse();
            try
            {
                string spName = "sp_Proposals_UnAllocated_AddToDB";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                dbparams.Add("RateId", RateId, System.Data.DbType.Int32);
                dbparams.Add("PropertyId", PropertyId, System.Data.DbType.Int32);// Added for ST-710
                dbparams.Add("Wk01_Spots", wk1, System.Data.DbType.Int32);
                dbparams.Add("Wk02_Spots", wk2, System.Data.DbType.Int32);
                dbparams.Add("Wk03_Spots", wk3, System.Data.DbType.Int32);
                dbparams.Add("Wk04_Spots", wk4, System.Data.DbType.Int32);
                dbparams.Add("Wk05_Spots", wk5, System.Data.DbType.Int32);
                dbparams.Add("Wk06_Spots", wk6, System.Data.DbType.Int32);
                dbparams.Add("Wk07_Spots", wk7, System.Data.DbType.Int32);
                dbparams.Add("Wk08_Spots", wk8, System.Data.DbType.Int32);
                dbparams.Add("Wk09_Spots", wk9, System.Data.DbType.Int32);
                dbparams.Add("Wk10_Spots", wk10, System.Data.DbType.Int32);
                dbparams.Add("Wk11_Spots", wk11, System.Data.DbType.Int32);
                dbparams.Add("Wk12_Spots", wk12, System.Data.DbType.Int32);
                dbparams.Add("Wk13_Spots", wk13, System.Data.DbType.Int32);
                dbparams.Add("Wk14_Spots", wk14, System.Data.DbType.Int32);

                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("PAJourneyId", PAJourneyId, System.Data.DbType.Int64);

                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Save the Proposal Detail. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return retval;
        }

        public int MarkProposalAsAlocated(int ClientId, string QuarterName, string NetworkIds, string SourceFile,int ProposalId,int LoggedOnUserId)
        {
            int retval = 0;
            try
            {
                string spName = "sp_Proposal_UnAllocated_Complete";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("NetworkId", NetworkIds, System.Data.DbType.String);
                dbparams.Add("SourceFile", SourceFile, System.Data.DbType.String);
                dbparams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);// ST-691
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);// ST-691
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Marck proposal as  Done. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + "| SourceFile: " + SourceFile + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return retval;
        }

        public List<ProposalsRawFileExportModel> ExportRawProposalsFile(int ClientId, string QuarterName, int NetworkId, string SourceFileName, int CountryId,int LoggedOnUserId)
        {
            List<ProposalsRawFileExportModel> exportProposals = new List<ProposalsRawFileExportModel>();
            try
            {
                string spName = "sp_Proposal_UnAllocated_Raw_File_Export";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("SourceFileName", SourceFileName, System.Data.DbType.String);
                dbparams.Add("CountryId", CountryId, System.Data.DbType.String);

                exportProposals = FactoryServices.dbFactory.SelectCommand_SP(exportProposals, spName, dbparams);
                return exportProposals;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch Export proposals. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return exportProposals;
        }

        public List<ImportingSTSpots> GetSTSpotsForPrposal(string RateId, int ScheduleId, bool FromST,int ActWeekNum, int LoggedOnUserId)
        {
            List<ImportingSTSpots> importProposalSpots = new List<ImportingSTSpots>();
            try
            {
                string spName = "sp_Proposal_UnAllocated_STSpots_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("RateId", RateId, System.Data.DbType.String);
                dbparams.Add("ScheduleId", ScheduleId, System.Data.DbType.Int32);
                dbparams.Add("ActWeekNum", ActWeekNum, System.Data.DbType.Int32);
                dbparams.Add("FromST", FromST, System.Data.DbType.Boolean);

                importProposalSpots = FactoryServices.dbFactory.SelectCommand_SP(importProposalSpots, spName, dbparams);
                return importProposalSpots;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch ST Sports for proposals. RateId: " + RateId.ToString() + "| ScheduleId: " + ScheduleId + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return importProposalSpots;
        }
        
        #region ST-710, Proposal Automation User Journey Functions
        public int AddUserJourneyMaster(int ClientId, int NetworkId, string QuarterName,string ScreenName, int ScheduleId, int Deal, string SourceFile, string ActionTaken, string Description, int LoggedOnUserId)
        {
            int retval = 0;
            try
            {
                string spName = "sp_Proposals_UnAllocated_AddUserJourneyData";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("CreatedBy", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("ScreenName", ScreenName, System.Data.DbType.String);
                dbparams.Add("ScheduleId", ScheduleId, System.Data.DbType.Int32);
                dbparams.Add("Deal", Deal, System.Data.DbType.Int32);
                dbparams.Add("SourceFile", SourceFile, System.Data.DbType.String);
                dbparams.Add("ActionTaken", ActionTaken, System.Data.DbType.String);
                dbparams.Add("Description", Description, System.Data.DbType.String);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Add Proposal Automation User journey detaiils. ClientId: "
                    + ClientId.ToString() + "| NetworkId: " + NetworkId + " | SourceFile: " + SourceFile + " | Action Taken: " + ActionTaken + ", | Error: " + exc.Message);
            }
            finally
            {
            }
            return retval;
        }
        #endregion
        #region ST-691
        public List<UnAllocatedProposals> GetProcessedProposals(int ClientId, string QuarterName,int LoggedOnUserId)
        {
            List<UnAllocatedProposals> unAllocatedProposals = new List<UnAllocatedProposals>();
            try
            {
                string spName = "sp_Proposal_UnAllocatedProposals_Processed_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);

                unAllocatedProposals = FactoryServices.dbFactory.SelectCommand_SP(unAllocatedProposals, spName, dbparams);
                return unAllocatedProposals;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch UnAllocated proposals. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return unAllocatedProposals;
        }
        #endregion

        public SaveUnallocatedProposalResponse SaveUnAllocateProposalsVersionHistoryIgnored(int ClientId, string QuarterName, string Mode, string SourceFileName, string FileAction, int LoggedOnUserId)
        {
            SaveUnallocatedProposalResponse retval = new SaveUnallocatedProposalResponse();
            try
            {
                string spName = "sp_Proposals_UnAllocated_Maintain_Proposal_Versions_FullActualized";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("Mode", Mode, System.Data.DbType.String);
                dbparams.Add("QuarterName", QuarterName, System.Data.DbType.String);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("EDIRawFilesSourceFile", SourceFileName, System.Data.DbType.String);
                dbparams.Add("RawFileAction", FileAction, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Save the Proposal Detail. ClientId: " + ClientId.ToString() + "| QuarterName: " + QuarterName + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return retval;
        }
        #endregion
        #region ST-724 Functions Start here
        public List<ProposalNetworkModel> GetNetworkListForSchedule(int ClientId, int ScheduleId, int LoggedOnUserId)
        {
            List<ProposalNetworkModel> importProposals = new List<ProposalNetworkModel>();
            try
            {
                string spName = "sp_ScheduleProposal_GetNetworksList";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ClientId", ClientId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleId", ScheduleId, System.Data.DbType.Int32);
                importProposals = FactoryServices.dbFactory.SelectCommand_SP(importProposals, spName, dbparams);
                return importProposals;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch Networks for proposals/Schedule. ClientId: " + ClientId.ToString() + "| ScheduleId: " + ScheduleId + " | Error: " + exc.Message);
            }
            finally
            {
            }
            return importProposals;
        }

        public List<Schedule> GetPatiallyLockedProposals()
        {
            List<Schedule> PartialProposals = new List<Schedule>();
            ErrorMessage err = new ErrorMessage();
            try
            {
                //_context.Database.GetDbConnection().Open();

                //DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Proposal_Partial_Locked ";
                //command.CommandType = CommandType.StoredProcedure;
                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        Schedule sched = new Schedule();
                //        sched.ScheduleId = (int)reader["ScheduleId"];
                //        sched.ScheduleName = (string)reader["ScheduleName"];

                //        if (reader["LockedDt"] != DBNull.Value)
                //        {
                //            sched.LockedDt = (DateTime)reader["LockedDt"];
                //            sched.LockedByUser = new Models.User();
                //            sched.LockedByUser.UserId = 0;
                //            sched.LockedByUser.DisplayName = (string)reader["DisplayName"];
                //            sched.LockedByUser.ImageUrl = (string)reader["ImageUrl"];
                            
                //        }
                //        if (reader["LastActiveDt"] != DBNull.Value)
                //        {
                //            sched.LockedByUser.LastActiveDt= (DateTime)reader["LastActiveDt"];
                //        }
                //            PartialProposals.Add(sched);
                //    }
                //}
                // ST-946 Code Implementation with Dapper
                List<PartialLockedModel> lstlocked = new List<PartialLockedModel>();
                string spName = "sp_Proposal_Partial_Locked";
                DynamicParameters dbparams = new DynamicParameters();
                lstlocked = FactoryServices.dbFactory.SelectCommand_SP(lstlocked, spName, dbparams);
                if(lstlocked !=null && lstlocked.Count > 0)
                {
                    foreach (PartialLockedModel part in lstlocked)
                    {
                        Schedule sched = new Schedule();

                        sched.ScheduleId = part.ScheduleId;
                        sched.ScheduleName = part.ScheduleName;

                        if (part.LockedDt != null)
                        {
                            sched.LockedDt = part.LockedDt;
                            sched.LockedByUser = new Models.User();
                            sched.LockedByUser.UserId = 0;
                            sched.LockedByUser.DisplayName = part.DisplayName;
                            sched.LockedByUser.ImageUrl = part.ImageUrl;

                        }
                        if (part.LastActiveDt!=null)
                        {
                            sched.LockedByUser.LastActiveDt = part.LastActiveDt;
                        }
                        PartialProposals.Add(sched);
                    }
                }
            }
            catch (Exception exc)
            {

            }

            return PartialProposals;
        }

        public string LockProposalWithNetwork(int LoggedOnUserId, int ScheduleId,string NetworkList,bool IsFullyLocked,bool PremiereFilter)
        {
            string Message = "";
            try
            {
                // ST-946 Code Implementation with Dapper
                ErrorMessage err = new ErrorMessage();
                string spName = "sp_Schedule_Lock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("ScheduleId", ScheduleId, System.Data.DbType.Int32);
                dbparams.Add("NetworkList", NetworkList, System.Data.DbType.String);
                dbparams.Add("IsFullyLocked", IsFullyLocked, System.Data.DbType.Boolean);
                dbparams.Add("PremiereFilter", PremiereFilter, System.Data.DbType.Boolean);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                if (err.Success)
                    return "";
                else
                    return err.ResponseText;
            }
            catch (Exception exc)
            {
                Message = "Unable to lock schedule. " + exc.Message;
                _logger.LogError(LoggedOnUserId, Message);
                return Message;
            }
            finally
            {
            }

            return "";
        }
        #endregion

        #region Child Proeprties Functions
        public ErrorMessage AddChildProperties(PropertyAddNew PropertyModel, int ProposalId, int UserId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                ChildPropertiesModel childPropertiesModel = new ChildPropertiesModel();
                childPropertiesModel.ParentPropertyId = PropertyModel.PropertyId;
                childPropertiesModel.ParentRateId = PropertyModel.RateId;
                childPropertiesModel.PropertyName = PropertyModel.PropertyName;
                childPropertiesModel.NetworkId = PropertyModel.NetworkId;
                childPropertiesModel.QuarterId = PropertyModel.QuarterId;
                childPropertiesModel.DayPartId = PropertyModel.DayPartId;
                TimeSpan startTime;
                TimeSpan endTime;
                if (TimeSpan.TryParse(Convert.ToDateTime(PropertyModel.StartTimeFormatted).TimeOfDay.ToString(), out startTime))
                {
                    childPropertiesModel.StartTime = startTime;
                }
                else
                {
                    childPropertiesModel.StartTime = TimeSpan.Parse("00:00:00");
                }

                if (TimeSpan.TryParse(Convert.ToDateTime(PropertyModel.EndTimeFormatted).TimeOfDay.ToString(), out endTime))
                {
                    childPropertiesModel.EndTime = endTime;
                }
                else
                {
                    childPropertiesModel.EndTime = TimeSpan.Parse("00:00:00");
                }
                childPropertiesModel.Monday = PropertyModel.Monday;
                childPropertiesModel.Tuesday = PropertyModel.Tuesday;
                childPropertiesModel.Wednesday = PropertyModel.Wednesday;
                childPropertiesModel.Thursday = PropertyModel.Thursday;
                childPropertiesModel.Friday = PropertyModel.Friday;
                childPropertiesModel.Saturday = PropertyModel.Saturday;
                childPropertiesModel.Sunday = PropertyModel.Sunday;
                childPropertiesModel.SPBuy = PropertyModel.SPBuy == "" ? false : true;                

                string spName = "SpChildPropertiesAdd";
                DynamicParameters dbParams = new DynamicParameters();
                dbParams.Add("ProposalId", ProposalId, System.Data.DbType.Int32);
                dbParams.Add("ParentPropertyId", childPropertiesModel.ParentPropertyId, System.Data.DbType.Int32);
                dbParams.Add("ParentRateId", childPropertiesModel.ParentRateId, System.Data.DbType.Int32);
                dbParams.Add("ParentPropertyName", childPropertiesModel.PropertyName, System.Data.DbType.String);
                dbParams.Add("StartTime", childPropertiesModel.StartTime, System.Data.DbType.Time);
                dbParams.Add("EndTime", childPropertiesModel.EndTime, System.Data.DbType.Time);
                dbParams.Add("Monday", childPropertiesModel.Monday, System.Data.DbType.Boolean);
                dbParams.Add("Tuesday", childPropertiesModel.Tuesday, System.Data.DbType.Boolean);
                dbParams.Add("Wednesday", childPropertiesModel.Wednesday,    System.Data.DbType.Boolean);
                dbParams.Add("Thursday", childPropertiesModel.Thursday, System.Data.DbType.Boolean);
                dbParams.Add("Friday", childPropertiesModel.Friday, System.Data.DbType.Boolean);
                dbParams.Add("Saturday", childPropertiesModel.Saturday, System.Data.DbType.Boolean);
                dbParams.Add("Sunday", childPropertiesModel.Sunday, System.Data.DbType.Boolean);
                dbParams.Add("SPBuy", childPropertiesModel.SPBuy, System.Data.DbType.Boolean);
                dbParams.Add("DayPartId", childPropertiesModel.DayPartId, System.Data.DbType.Int32);
                dbParams.Add("CreatedByUserId", UserId, System.Data.DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbParams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError("Unable load Parent Property. ParentPropertyId: "  + "" + ex.Message);
            }
            finally
            {
            }
            return em;
        }

        public ErrorMessage CheckChildPropertiesUniqueness(PropertyAddNew PropertyModel, int UserId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                ChildPropertiesModel childPropertiesModel = new ChildPropertiesModel();
                childPropertiesModel.ParentPropertyId = PropertyModel.PropertyId;
                childPropertiesModel.ParentRateId = PropertyModel.RateId;
                childPropertiesModel.PropertyName = PropertyModel.PropertyName;                
                childPropertiesModel.DayPartId = PropertyModel.DayPartId;
                TimeSpan startTime;
                TimeSpan endTime;
                if (TimeSpan.TryParse(Convert.ToDateTime(PropertyModel.StartTimeFormatted).TimeOfDay.ToString(), out startTime))
                {
                    childPropertiesModel.StartTime = startTime;
                }
                else
                {
                    childPropertiesModel.StartTime = TimeSpan.Parse("00:00:00");
                }

                if (TimeSpan.TryParse(Convert.ToDateTime(PropertyModel.EndTimeFormatted).TimeOfDay.ToString(), out endTime))
                {
                    childPropertiesModel.EndTime = endTime;
                }
                else
                {
                    childPropertiesModel.EndTime = TimeSpan.Parse("00:00:00");
                }
                childPropertiesModel.Monday = PropertyModel.Monday;
                childPropertiesModel.Tuesday = PropertyModel.Tuesday;
                childPropertiesModel.Wednesday = PropertyModel.Wednesday;
                childPropertiesModel.Thursday = PropertyModel.Thursday;
                childPropertiesModel.Friday = PropertyModel.Friday;
                childPropertiesModel.Saturday = PropertyModel.Saturday;
                childPropertiesModel.Sunday = PropertyModel.Sunday;
                childPropertiesModel.SPBuy = PropertyModel.SPBuy == "" ? false : true;               

                string spName = "SpChildPropertiesCheckUniqueness";                
                DynamicParameters dbParams = new DynamicParameters();
                dbParams.Add("ParentPropertyId", childPropertiesModel.ParentPropertyId, System.Data.DbType.Int32);
                dbParams.Add("ParentRateId", childPropertiesModel.ParentRateId, System.Data.DbType.Int32);
                dbParams.Add("ParentPropertyName", childPropertiesModel.PropertyName, System.Data.DbType.String);                
                dbParams.Add("DayPartId", childPropertiesModel.DayPartId, System.Data.DbType.Int32);
                dbParams.Add("StartTime", childPropertiesModel.StartTime, System.Data.DbType.Time);
                dbParams.Add("EndTime", childPropertiesModel.EndTime, System.Data.DbType.Time);
                dbParams.Add("Monday", childPropertiesModel.Monday, System.Data.DbType.Boolean);
                dbParams.Add("Tuesday", childPropertiesModel.Tuesday, System.Data.DbType.Boolean);
                dbParams.Add("Wednesday", childPropertiesModel.Wednesday, System.Data.DbType.Boolean);
                dbParams.Add("Thursday", childPropertiesModel.Thursday, System.Data.DbType.Boolean);
                dbParams.Add("Friday", childPropertiesModel.Friday, System.Data.DbType.Boolean);
                dbParams.Add("Saturday", childPropertiesModel.Saturday, System.Data.DbType.Boolean);
                dbParams.Add("Sunday", childPropertiesModel.Sunday, System.Data.DbType.Boolean);
                dbParams.Add("SPBuy", childPropertiesModel.SPBuy, System.Data.DbType.Boolean);
                dbParams.Add("CreatedByUserId", UserId, System.Data.DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbParams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(UserId, "Unable load Parent Property and check uniqueness. ParentPropertyId: " + PropertyModel.PropertyId + "" + ex.Message);
            }
            finally
            {
            }
            return em;
        }
        #endregion
    }
}
