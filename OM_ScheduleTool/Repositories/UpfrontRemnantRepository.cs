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
using Dapper;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using OM_ScheduleTool.Dapper;
using Microsoft.Build.Framework;

namespace OM_ScheduleTool.Repositories
{
    public class UpfrontRemnantRepository
    {
        protected AppContext _context;
        protected StoredProcsContext _spcontext;
        protected IUserRepository _userRepository;
        protected IPropertyRepository _propertyRepository;
        protected ILogger<PropertyRepository> _logger;
        protected int _upfrontTypeId;


        protected UpfrontRemnantRepository(AppContext context
            , StoredProcsContext spcontext
            , IUserRepository userRepository
            , IPropertyRepository propertyRepository
            , ILogger<PropertyRepository> logger
            )
        {
            _context = context;
            _spcontext = spcontext;
            _userRepository = userRepository;
            _propertyRepository = propertyRepository;

            _logger = logger;
            _upfrontTypeId = 2;
        }

        public Upfront GetUpfrontRemnantById(int LoggedOnUserId, int Id)
        {
            return _context
                .Upfronts
                .Include(uf => uf.UpfrontType)
                .Include(n => n.Network)
                .Include(q => q.Quarter)
                .Include(b => b.BuyerName)
                .Include(u => u.UpdatedByUser)
                .Include(ul => ul.UpfrontLockedBy)
                .Where(u => u.UpfrontId == Id).FirstOrDefault<Upfront>();
        }

        protected IEnumerable<UpfrontPermissions> GetUpfrontRemnantByNetwork(int LoggedOnUserId, int NetworkId, int Year)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                List<UpfrontPermissions> upfronts = new List<UpfrontPermissions>();
                ErrorMessage em = new ErrorMessage();
                string spName = "sp_Upfront_GetInfoByNetwork";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("Year", Year, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontTypeId", _upfrontTypeId, DbType.Int32);

                upfronts = FactoryServices.dbFactory.SelectCommand_SP(upfronts, spName, dbparams);
                foreach (var upfront in upfronts)
                {
                    upfront.Quarter = new Quarter();
                    upfront.Quarter = _context.Quarter.Where(x => x.QuarterId == Convert.ToInt32(upfront.QuarterId)).FirstOrDefault();
                    if (upfront.UpfrontLockedByUserId != null)
                    {
                        upfront.UpfrontLockedBy = new User();
                        upfront.UpfrontLockedBy.UserId = Convert.ToInt32(upfront.UpfrontLockedByUserId);
                        upfront.UpfrontLockedBy.DisplayName = _context.Users.Where(x => x.UserId == Convert.ToInt32(upfront.UpfrontLockedByUserId)).Select(x => x.DisplayName).Single();
                    }
                    if(upfront.UpdatedByUserId!=null)
                    {
                        upfront.UpdatedByUser = new User();
                        upfront.UpdatedByUser.UserId = Convert.ToInt32(upfront.UpdatedByUserId);
                        upfront.UpdatedByUser.DisplayName = _context.Users.Where(x => x.UserId == Convert.ToInt32(upfront.UpdatedByUserId)).Select(x => x.DisplayName).Single();
                    }

                }
                return upfronts;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. NetworkId: " + NetworkId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;
        }

        protected Upfront GetUpfront(int LoggedOnUserId, int NetworkId, int QuarterId, int UpfrontTypeId)
        {
            try
            {
                return _context
                    .Upfronts
                    .Include(uf => uf.UpfrontType)
                    .Include(n => n.Network)
                    .Include(q => q.Quarter)
                    .Include(b => b.BuyerName)
                    .Include(ul => ul.UpfrontLockedBy)
                    .Where(u => u.UpfrontTypeId==UpfrontTypeId && u.NetworkId==NetworkId && u.QuarterId==QuarterId)
                    .FirstOrDefault<Upfront>();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to check lock. NetworkId: " + NetworkId.ToString() + " | QuarterId:  "
                    + QuarterId.ToString() + " | UpfrontTypeId: " + UpfrontTypeId.ToString() + "|" + exc.Message);
            }
            finally
            {
            }

            return null;
        }


        public IEnumerable<_DeleteProperty> GetUpfrontRemnantLinesDeleteGroup(int LoggedOnUserId, params int[] UpfrontLineIds)
        {
            int UpfrontLineId = 0;
            string LineIds = "";
            try
            {
                List<_DeleteProperty> upfrontlines = new List<_DeleteProperty>();

                foreach (int currentUpfrontLineId in UpfrontLineIds)
                {
                    LineIds = currentUpfrontLineId.ToString() + ",";
                }
                // ST-946 Code Implementation with Dapper
                string spName = "GetPropsToDeleteByUpfrontDemoandProp_SP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontRemnantLinesFlatLineIds", LineIds, DbType.String);
                upfrontlines = FactoryServices.dbFactory.SelectCommand_SP(upfrontlines, spName, dbparams);
                return upfrontlines;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. UpfrontId: " + UpfrontLineId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;
        }

        public IEnumerable<_ReviseEstimate> GetUpfrontRemnantLinesReviseLines(int LoggedOnUserId, int UpfrontId, bool DRRateRevise)
        {
            try
            {
                List<_ReviseEstimate> upfrontlines = new List<_ReviseEstimate>();
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Remnants_GetReviseEstimateList";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("DRRateRevision", DRRateRevise, System.Data.DbType.Boolean);

                upfrontlines= FactoryServices.dbFactory.SelectCommand_SP(upfrontlines, spName, dbparams);
                return upfrontlines;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. UpfrontId: " + UpfrontId.ToString() + " | " + exc.Message);
                throw exc;
            }
            finally
            {
            }
        }

        public ErrorMessage ReviseEstimate(int LoggedOnUserId, string UpfrontLineIds, string BuytypeCodes)
        {
            try
            {
                ErrorMessage em = new ErrorMessage(false, 0, "");
                if (UpfrontLineIds == null)
                {
                    em.Success = false;
                    em.ResponseCode = -1000;
                    em.ResponseText = "No property selected.";
                    return em;
                }
                //ST-946 Code Implementation with Dapper
                Int32 retval = 0;
                BuytypeCodes = BuytypeCodes.EndsWith(",") ? BuytypeCodes.Substring(0, BuytypeCodes.Length - 1) : BuytypeCodes;
                UpfrontLineIds = UpfrontLineIds.EndsWith(",") ? UpfrontLineIds.Substring(0, UpfrontLineIds.Length - 1) : UpfrontLineIds;

                string spName = "sp_Remnants_ReviseEstimate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontLineIds", UpfrontLineIds, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("BuyTypeCodes", BuytypeCodes, System.Data.DbType.String);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);

                em.Success = true;
                em.ResponseCode = 0;
                em.ResponseText = (UpfrontLineIds.Length - 1).ToString() + " lines of revised estimates were created.  Only Rate Amount, Impressions, Status, Client Name, Effective Date and Expiration Date  can be updated for these newly revised estimates.";
                return em;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable revise estimate. UpfrontLineIds: " + UpfrontLineIds.ToString() + " | " + exc.Message);
                return new ErrorMessage(false, -1000, "Unable revise estimate. UpfrontLineIds: " + UpfrontLineIds.ToString() + " | " + exc.Message);
            }
            finally
            {
            }
        }

        public ErrorMessage ReviseDRRates(int LoggedOnUserId, string UpfrontLineIds)
        {
            try
            {
                ErrorMessage em = new ErrorMessage(false, 0, "");
                if (UpfrontLineIds == null)
                {
                    em.Success = false;
                    em.ResponseCode = -1000;
                    em.ResponseText = "No property selected.";
                    return em;
                }

                //ST-946 Code Implementation with Dapper
                Int32 retval = 0;
                string spName = "sp_Remnants_ReviseDRRates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontLineIds", UpfrontLineIds, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                em.Success = true;
                em.ResponseCode = 0;
                em.ResponseText = (UpfrontLineIds.Split(',').Length - 1).ToString() + " lines of revised DR rates were created.  Only Rate Amount, Impressions, Status, Client Name, Effective Date and Expiration Date  can be updated for these newly revised estimates.";
                return em;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable revise dr rate. UpfrontLineIds: " + UpfrontLineIds.ToString() + " | " + exc.Message);
                return new ErrorMessage(false, -1000, "Unable revise dr rate. UpfrontLineIds: " + UpfrontLineIds.ToString() + " | " + exc.Message);
            }
            finally
            {
            }
        }
        public IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(int LoggedOnUserId, int id, string BuyTypesInclude, string DemoNames)
        {
            return GetUpfrontRemnantLines(LoggedOnUserId, id, "", DemoNames, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", 0, "", BuyTypesInclude, "", "", true);
        }

        public IEnumerable<UpfrontRemnantLine> GetUpfrontRemnantLines(int LoggedOnUserId, int id, string BuyTypes, string DemoNames
            , string ApprovedDesc, string PropertyName, string StartTime, string EndTime, string dp, string omdp
            , string SpotLen, string Rate, string Impressions, string CPM, string Status, string ClientName, string RevNo
            , string RevisedDate, string EffectiveDate, string ExpirationDate, int Sort, string SearchBox, string BuyTypesInclude
            , string RevNoExclude, string BuyTypesExclude, bool ViewOnly)
        {
            List<UpfrontRemnantLine> upfrontlines = new List<UpfrontRemnantLine>();
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetUpfrontLines";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", id, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
                }

                if (StartTime != null && StartTime.Length > 0)
                {
                    dbparams.Add("StartTime", StartTime, System.Data.DbType.String);
                }

                if (EndTime != null && EndTime.Length > 0)
                {
                    dbparams.Add("EndTime", EndTime, System.Data.DbType.String);
                }

                if (dp != null && dp.Length > 0)
                {
                    dbparams.Add("dp", dp, System.Data.DbType.String);
                }

                if (omdp != null && omdp.Length > 0)
                {
                    dbparams.Add("omdp", omdp, System.Data.DbType.String);
                }

                // This is bad naming but this one compare with the BuyTypeDescription
                if (BuyTypesInclude != null && BuyTypesInclude.Length > 0)
                {
                    dbparams.Add("BuyTypesInclude", BuyTypesInclude, System.Data.DbType.String);
                }
                else
                {
                    // This Compares with buytypecode
                    if (BuyTypes != null && BuyTypes.Length > 0)
                    {
                        dbparams.Add("BuyTypes", BuyTypes, System.Data.DbType.String);
                    }
                }

                if (BuyTypesExclude != null && BuyTypesExclude.Length > 0)
                {
                    dbparams.Add("BuyTypesExclude", BuyTypesExclude, System.Data.DbType.String);
                }

                if (SpotLen != null && SpotLen.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLen, System.Data.DbType.String);
                }

                if (Rate != null && Rate.Length > 0)
                {
                    dbparams.Add("Rate", Rate, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (ClientName != null && ClientName.Length > 0)
                {
                    dbparams.Add("ClientName", ClientName, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevNoExclude != null && RevNoExclude.Length > 0)
                {
                    dbparams.Add("RevNoExclude", RevNoExclude, System.Data.DbType.String);
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
                }

                    dbparams.Add("Sort", Sort, System.Data.DbType.Int32);

                if (SearchBox != null && SearchBox.Length > 0)
                {
                    dbparams.Add("SearchBox", SearchBox, System.Data.DbType.String);
                }
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);

                upfrontlines = FactoryServices.dbFactory.SelectCommand_SP(upfrontlines, spName, dbparams);
                foreach (var upfrontremnantline in upfrontlines)
                {
                    if (upfrontremnantline.DemographicSettingsId!=null && Convert.ToInt32(upfrontremnantline.DemographicSettingsId) >0)
                    {
                        upfrontremnantline.Demo = new DemoNames(Convert.ToInt32(upfrontremnantline.DemographicSettingsId), Convert.ToString(upfrontremnantline.DemoName));
                    }
                    if (upfrontremnantline.PropertyId != null && upfrontremnantline.PropertyId > 0)
                    {
                        upfrontremnantline.Property = new Property();
                        upfrontremnantline.Property.PropertyId = Convert.ToInt32(upfrontremnantline.PropertyId);
                        upfrontremnantline.Property.PropertyName = Convert.ToString(upfrontremnantline.PropertyName);
                    }
                    upfrontremnantline.AllDemoNames = new List<DemoNames>();
                    foreach (DemographicSettings ds in _context.DemographicSettings)
                    {
                        DemoNames dn = new DemoNames(ds.DemographicSettingsId, ds.DemoName);
                        upfrontremnantline.AllDemoNames.Add(dn);
                    }
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. UpfrontId: " + id.ToString() + " | " + exc.Message);
                throw exc;
            }
            finally
            {

            }

            return upfrontlines;
        }

        public IEnumerable<DemographicSettings> GetUpfrontDemoNamesByBuyTypeId(int LoggedOnUserId, int UpfrontId, string BuyTypeIds)
        {
            try
            {
                //conn.Close();
                //ST-946 Code Implementation with Dapper
                List<DemographicSettings> demos = new List<DemographicSettings>();
                string spName = "sp_Upfront_GetDemoNamesByBuyTypeId";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                if (BuyTypeIds != null && BuyTypeIds.Length > 0)
                {
                    dbparams.Add("BuyTypeIds", BuyTypeIds, System.Data.DbType.String);
                }
                demos = FactoryServices.dbFactory.SelectCommand_SP(demos, spName, dbparams);
                return demos;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. UpfrontId: " + UpfrontId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            return null;
        }

        public IEnumerable<UpfrontRemnantLineFlat> GetUpfrontRemnantLinesFlat(int LoggedOnUserId, int id, string BuyTypesInclude, string DemoNames)
        {
            return GetUpfrontRemnantLinesFlat(LoggedOnUserId, id, "", DemoNames, "", ""
                , "", "", "", "", "", "", ""
                , "", "", "", "", "", "", "", "", "", "", "", "", "", "", 0, "", BuyTypesInclude, "", "", true,""
                );
        }
 
        public IEnumerable<UpfrontRemnantLineFlat> GetUpfrontRemnantLinesFlat (int LoggedOnUserId, int id, string BuyTypes, string DemoNames
            , string ApprovedDesc, string PropertyName
            , string Monday, string Tuesday, string Wednesday
            , string Thursday, string Friday, string Saturday, string Sunday
            , string StartTime, string EndTime, string dp, string omdp
            , string SpotLen, string Rate, string Impressions, string CPM, string Status, string ClientName, string RevNo
            , string RevisedDate, string EffectiveDate, string ExpirationDate, int Sort, string SearchBox, string BuyTypesInclude
            , string RevNoExclude, string BuyTypesExclude, bool ViewOnly, string SPBuy)
        {
            List<UpfrontRemnantLineFlat> upfrontlines = new List<UpfrontRemnantLineFlat>();
            try
            {
                //ST-946 Code Implementation with Dapper
                List<DemographicSettings> demos = new List<DemographicSettings>();
                string spName = "sp_Upfront_GetUpfrontLines";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", id, System.Data.DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);

                if (DemoNames != null && DemoNames.Length > 0)
                {
                    dbparams.Add("DemoNames", DemoNames, System.Data.DbType.String);
                }

                if (ApprovedDesc != null && ApprovedDesc.Length > 0)
                {
                    dbparams.Add("ApprovedDesc", ApprovedDesc, System.Data.DbType.String);
                }

                if (PropertyName != null && PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, System.Data.DbType.String);
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

                if (StartTime != null && StartTime.Length > 0)
                {
                    dbparams.Add("StartTime", StartTime, System.Data.DbType.String);
                }

                if (EndTime != null && EndTime.Length > 0)
                {
                    dbparams.Add("EndTime", EndTime, System.Data.DbType.String);
                }

                if (dp != null && dp.Length > 0)
                {
                    dbparams.Add("dp", dp, System.Data.DbType.String);
                }

                if (omdp != null && omdp.Length > 0)
                {
                    dbparams.Add("omdp", omdp, System.Data.DbType.String);
                }

                // This is bad naming but this one compare with the BuyTypeDescription
                if (BuyTypesInclude != null && BuyTypesInclude.Length > 0)
                {
                    dbparams.Add("BuyTypesInclude", BuyTypesInclude, System.Data.DbType.String);
                }
                else
                {
                    // This Compares with buytypecode
                    if (BuyTypes != null && BuyTypes.Length > 0)
                    {
                        dbparams.Add("BuyTypes", BuyTypes, System.Data.DbType.String);
                    }
                }

                if (BuyTypesExclude != null && BuyTypesExclude.Length > 0)
                {
                    dbparams.Add("BuyTypesExclude", BuyTypesExclude, System.Data.DbType.String);
                }

                if (SpotLen != null && SpotLen.Length > 0)
                {
                    dbparams.Add("SpotLen", SpotLen, System.Data.DbType.String);
                }

                if (Rate != null && Rate.Length > 0)
                {
                    dbparams.Add("Rate", Rate, System.Data.DbType.String);
                }

                if (Impressions != null && Impressions.Length > 0)
                {
                    dbparams.Add("Impressions", Impressions, System.Data.DbType.String);
                }

                if (CPM != null && CPM.Length > 0)
                {
                    dbparams.Add("CPM", CPM, System.Data.DbType.String);
                }

                if (Status != null && Status.Length > 0)
                {
                    dbparams.Add("Status", Status, System.Data.DbType.String);
                }

                if (ClientName != null && ClientName.Length > 0)
                {
                    dbparams.Add("ClientName", ClientName, System.Data.DbType.String);
                }

                if (RevNo != null && RevNo.Length > 0)
                {
                    dbparams.Add("RevNo", RevNo, System.Data.DbType.String);
                }

                if (RevNoExclude != null && RevNoExclude.Length > 0)
                {
                    dbparams.Add("RevNoExclude", RevNoExclude, System.Data.DbType.String);
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
                dbparams.Add("Sort", Sort, System.Data.DbType.Boolean);

                if (SearchBox != null && SearchBox.Length > 0)
                {
                    dbparams.Add("SearchBox", SearchBox, System.Data.DbType.String);
                }
                dbparams.Add("ViewOnly", ViewOnly, System.Data.DbType.Boolean);
                if (SPBuy != null && SPBuy.Length > 0)
                {
                    dbparams.Add("SPBuy", SPBuy, System.Data.DbType.String);
                }
                upfrontlines = FactoryServices.dbFactory.SelectCommand_SP(upfrontlines, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront. UpfrontId: " + id.ToString() + " | " + exc.Message);
                throw exc;
            }
            finally
            {
                
            }

            return upfrontlines;
        }

        public IEnumerable<UpfrontNote> GetUpfrontRemnantNotes(int LoggedOnUserId, int UpfrontId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                List<UpfrontNote> upfrontnotes = new List<UpfrontNote>();
                List<UpfrontNotesModel> lstNotes = new List<UpfrontNotesModel>();
                string spName = "sp_UpfrontNotes_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, System.Data.DbType.Int32);
                lstNotes = FactoryServices.dbFactory.SelectCommand_SP(lstNotes, spName, dbparams);
                for (var x = 0; x < lstNotes.Count; x++)
                {
                    UpfrontNote upfrontnote = new UpfrontNote();
                    upfrontnote.UpfrontNoteId = lstNotes[x].UpfrontNoteId;
                    upfrontnote.UpfrontId = UpfrontId;
                    upfrontnote.Note = lstNotes[x].Note;
                    upfrontnote.CreateDt = lstNotes[x].CreateDt;
                    upfrontnote.CreatedByUserId = lstNotes[x].CreatedByUserId;
                    upfrontnote.CreatedBy = new User();
                    upfrontnote.CreatedBy.UserId = lstNotes[x].CreatedByUserId;
                    upfrontnote.CreatedBy.DisplayName = lstNotes[x].DisplayName;
                    upfrontnote.ParentNoteId = lstNotes[x].ParentNoteId;
                    upfrontnotes.Add(upfrontnote);
                }
                return upfrontnotes;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront notes. UpfrontId: " + UpfrontId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }

            /*
            try
            {
                return _context
                    .UpfrontNotes
                    .Include (u => u.CreatedBy)
                    .Where(u => u.UpfrontId == UpfrontId)
                    .OrderBy (u => (u.ParentNoteId==null? u.UpfrontNoteId : u.ParentNoteId))
                    .OrderBy  (n => n.CreateDt)
                    .ToList();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load upfront notes. UpfrontId: " + UpfrontId.ToString() + " | " + exc.Message);
            }
            finally
            {
            }
            */

            return null;
        }

        // Returns empty string when successful
        public ErrorMessage LockUpfront(int LoggedOnUserId, int UpfrontId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_Lock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);

                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode > 0)
                {
                    em.Success = true;
                }
                else
                    em.Success = false;
                _logger.LogInformation(LoggedOnUserId, em.ResponseText);
                return em;
            }
            catch (Exception exc)
            {
                string Message = "Unable to lock upfront. " + exc.Message;
                _logger.LogError(LoggedOnUserId, Message);
                return new ErrorMessage(false, -1000, Message);
            }
            finally
            {
            }
            return new ErrorMessage(false, -1000, "");
        }

        public string ApproveUpfront(int LoggedOnUserId, int UpfrontLineId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                ErrorMessage err = new ErrorMessage();
                string spName = "sp_UpfrontLine_Approve";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                _logger.LogInformation(LoggedOnUserId, err.ResponseText);
                return err.ResponseText;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to approve upfrontline. " + UpfrontLineId.ToString() + "." + exc.Message);
                return "Unable to approve upfrontline. " + UpfrontLineId.ToString() + "." + exc.Message;
            }
            finally
            {
            }
        }

        public string UnapproveUpfront(int LoggedOnUserId, int UpfrontLineId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                ErrorMessage err = new ErrorMessage();
                string spName = "sp_UpfrontLine_Unapprove";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, System.Data.DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                _logger.LogInformation(LoggedOnUserId, err.ResponseText);
                return err.ResponseText + "|" + err.ResponseCode.ToString();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to unapprove upfrontline. " + UpfrontLineId.ToString() + "." + exc.Message);
                return "Unable to unapprove upfrontline. " + UpfrontLineId.ToString() + "." + exc.Message;
            }
            finally
            {
            }

        }

        protected int GetLockCount()
        {
            return _context.Upfronts
                .Where(u => u.UpfrontLockedDate != null && u.UpfrontTypeId == _upfrontTypeId)
                .Count();

        }

        public bool UnlockUpfront(int LoggedOnUserId, int UpfrontId)
        {
            try
            {

                //ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_Unlock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                dbparams.Add("UpfrontId", UpfrontId, System.Data.DbType.Int32);
                ErrorMessage em = new ErrorMessage();
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em != null && !string.IsNullOrEmpty(em.ResponseText))
                    _logger.LogInformation(LoggedOnUserId, em.ResponseText);
                return true;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to unlock upfront. " + exc.Message);
                return false;
            }
            finally
            {
            }

            return true;
        }

        public bool UnlockUpfront(int LoggedOnUserId)
        {
            try
            {
                //ST-946 Code Implementation with Dapper
                ErrorMessage em = new ErrorMessage();
                string spName = "sp_Upfront_Unlock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                _logger.LogInformation(LoggedOnUserId, em.ResponseText);
                return em.Success;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to unlock upfront. " + exc.Message);
                return false;
            }
            finally
            {
            }

            return true;
        }

        public int AddNote (int LoggedOnUserId, int UpfrontId, string Note)
        {
            try
            {
                UpfrontNote newNote = new UpfrontNote();
                newNote.CreatedByUserId = LoggedOnUserId;
                newNote.UpfrontId = UpfrontId;
                newNote.Note = Note;

                _context.UpfrontNotes.Add(newNote);
                int NewId = _context.SaveChanges();
                return newNote.UpfrontNoteId;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to add note. " + exc.Message);
                return -1;
            }

        }

        public bool AddSubNote(int LoggedOnUserId, int UpfrontParentNoteId, string Note)
        {
            try
            {
                UpfrontNote parentNote = _context.UpfrontNotes.Where(u => u.UpfrontNoteId == UpfrontParentNoteId).FirstOrDefault();
                UpfrontNote newNote = new UpfrontNote();
                newNote.CreatedByUserId = LoggedOnUserId;
                newNote.UpfrontId = parentNote.UpfrontId;
                newNote.ParentNoteId = UpfrontParentNoteId;
                newNote.Note = Note;

                _context.UpfrontNotes.Add(newNote);
                _context.SaveChanges();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to add note. " + exc.Message);
                return false;
            }

            return true;
        }
    }


    public class RemnantRepository : UpfrontRemnantRepository, IRemnantRepository
    {
        public RemnantRepository(AppContext context
            , StoredProcsContext spcontext
            , IUserRepository userRepository
            , IPropertyRepository propertyRepository
            , ILogger<PropertyRepository> logger) : base(context, spcontext, userRepository, propertyRepository, logger)
        {
            _upfrontTypeId = 1;
        }

        public int GetRemnantLockCount()
        {
            return GetLockCount();
        }

        public User IsLocked(int LoggedOnUserId, int NetworkId, int QuarterId, int UpfrontTypeId)
        {
            Upfront remnant = GetUpfront(LoggedOnUserId, NetworkId, QuarterId, UpfrontTypeId);
            if (remnant != null)
            {
                return remnant.UpfrontLockedBy;
            }
            else
            {
                return null;
            }
        }

        public IEnumerable<UpfrontPermissions> GetRemnantByNetwork(int LoggedOnUserId, int NetworkId, int Year)
        {
            return GetUpfrontRemnantByNetwork(LoggedOnUserId, NetworkId, Year);
        }

        public Upfront GetRemnantById(int LoggedOnUserId, int RemnantId)
        {
            return GetUpfrontRemnantById(LoggedOnUserId, RemnantId);
        }

        public IEnumerable<Upfront> GetRemnants(int LoggedOnUserId)
        {
            return _context
                .Upfronts
                .Include(q => q.Quarter)
                .Include(n => n.Network)
                .Include(c => c.Network.Country)
                .Include(b => b.BuyerName)
                .Include(l => l.UpfrontLockedBy)
                .Include(u => u.UpdatedByUser)
                .Where(uf => uf.UpfrontType.Description == "Remnant")
                .ToList();

        }

        public ErrorMessage CreateRemnant(int NetworkId, string QName, int UserId)
        {
            ErrorMessage em = new ErrorMessage(false, 0, "");
            try
            {
                //ST-946 Code Implementation with Dapper
                string spName = "sp_RemnantAdd";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, System.Data.DbType.Int32);
                dbparams.Add("QuarterName", QName, System.Data.DbType.String);
                dbparams.Add("LoggedOnUserId", UserId, System.Data.DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = -1;
                em.ResponseText = exc.Message;
                _logger.LogError(UserId, "Unable to create new Remnant for " + QName + " :-" + exc.Message);
            }
            finally
            {
              //  conn.Close();
            }

            return em;

        }
    }
}
