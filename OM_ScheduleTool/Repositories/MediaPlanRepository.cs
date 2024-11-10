using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
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
using OM_ScheduleTool.Dapper;
using System.Text.Json;
using Microsoft.DotNet.MSIdentity.Shared;
using Newtonsoft.Json;
using System.ComponentModel;
using OM_ScheduleTool.Helpers;
using OM_ScheduleTool.ViewModels;
using NuGet.Protocol.Plugins;
using Microsoft.AspNetCore.Connections;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Hosting.Internal;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;

namespace OM_ScheduleTool.Repositories
{
    public class MediaPlanRepository : IMediaPlanRepository
    {
        private AppContext _context;
        private IUserRepository _userRepository;
        private ILogger<MediaPlanRepository> _logger;
        private readonly IWebHostEnvironment _hostingEnvironment;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public MediaPlanRepository(AppContext context
            , IUserRepository userRepository
            , ILogger<MediaPlanRepository> logger
            , IWebHostEnvironment hostingEnvironment
            , IConfiguration configuration
            , IHttpContextAccessor httpContextAccessor
            )
        {
            _context = context;
            _userRepository = userRepository;
            _logger = logger;
            _hostingEnvironment = hostingEnvironment;
            _configuration = configuration;
            _httpContextAccessor = httpContextAccessor;
        }

        public List<MediaPlan> GetAllMediaPlans(int LoggedOnUserId)
        {
            List<MediaPlan> lstMediaPlans = new List<MediaPlan>();
            try
            {
                using (IDbConnection conn = new SqlConnection(DBConnection.Main()))
                {
                    string sql = @"SELECT mp.*, q.QuarterName, q.BroadcastQuarterNbr 
                                   FROM MediaPlans mp 
                                   JOIN Quarter q ON mp.QuarterId = q.QuarterId AND mp.PlanYear=q.BroadcastYr";
                    lstMediaPlans = conn.Query<MediaPlan, Quarter, MediaPlan>(sql,
                        (mediaPlan, quarter) =>
                        {
                            mediaPlan.QuarterName = quarter.QuarterName; 
                            mediaPlan.BroadcastQuarterNbr = quarter.BroadcastQuarterNbr.ToString();
                            return mediaPlan;
                        }, splitOn: "QuarterId").ToList(); 
                }
            }
            catch (Exception ex)
            {                
                _logger.LogError(ex, "Unable to load Media Plans. UserId: {LoggedOnUserId}", LoggedOnUserId);                
            }
            return lstMediaPlans;
        }
       
        public List<MediaPlan> GetAllMediaPlansForClientAndYear(int LoggedOnUserId, int ClientId, int BroadCastYear)
        {
            List<MediaPlan> lstMediaPlans = new List<MediaPlan>();
            try
            {
                string spName = "sp_MediaPlan_GetInfoByClient";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("Year", BroadCastYear, DbType.Int32);
                lstMediaPlans = FactoryServices.dbFactory.SelectCommand_SP(lstMediaPlans, spName, dbparams);
                return lstMediaPlans;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable load Media Plans. ClientId: " + ClientId.ToString() + " |  BoardCastYear: " + BroadCastYear.ToString() + " | " + ex.Message);
            }
            finally
            {
            }
            return lstMediaPlans;
        }
        
        public int CopyMediaPlan(int LoggedOnUserId, int MediaPlanId,int ClientId,string QtrName, int Year)
        {
            int Retval = 0;
            try
            {
               
                string spName = "sp_MediaPlan_Copy";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("QuarterName", QtrName, DbType.String);
                dbparams.Add("Year", Year, DbType.Int32);
                Retval = FactoryServices.dbFactory.SelectCommand_SP(Retval, spName, dbparams);
                return Retval;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable load Media Plans. MediaPlanId: " + MediaPlanId.ToString() + "" + ex.Message);
            }
            finally
            {
            }
            return Retval;
        }      
       
        public int TogglePublishMediaPlan(int LoggedOnUserId, int MediaPlanId, string Action)
        {
            int Retval = 0;
            try
            {
                string spName = "sp_MediaPlan_ChangeStatus";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("Action", Action);
                Retval = FactoryServices.dbFactory.SelectCommand_SP(Retval, spName, dbparams);
                return Retval;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable load Media Plans. MediaPlanId: " + MediaPlanId.ToString() + "" + ex.Message);
            }
            finally
            {
            }
            return Retval;
        }
        
        public int DeleteMediaPlan(int LoggedOnUserId, int MediaPlanId, string Action)
        {
            int Retval = 0;
            try
            {
                string spName = "sp_MediaPlan_ChangeStatus";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("Action", Action);
                Retval = FactoryServices.dbFactory.SelectCommand_SP(Retval, spName, dbparams);
                return Retval;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable load Media Plans. MediaPlanId: " + MediaPlanId.ToString() + "" + ex.Message);
            }
            finally
            {
            }
            return Retval;
        }

        public int DeleteMediaPlanPropertyById(int LoggedOnUserId, int MediaPlanPropertyId)
        {
            int Retval = 0;
            try
            {
                string spName = "SpDeleteMediaPlanPropertyById";
                DynamicParameters dbparams = new DynamicParameters();                
                dbparams.Add("MediaPlanPropertyId", MediaPlanPropertyId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);//ST-1301
                Retval = FactoryServices.dbFactory.SelectCommand_SP(Retval, spName, dbparams);
                return Retval;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to delete Media Plan Property. MediaPlanPropertyId: " + MediaPlanPropertyId.ToString() + "" + ex.Message);
            }
            finally
            {
            }
            return Retval;
        }

        public bool GetMediaPlanPermission(int LoggedOnUserId)
        {
            bool CanSeeMediaPlan= false;
            try
            {
                string spName = "sp_MediaPlan_PermissionGet";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                CanSeeMediaPlan = FactoryServices.dbFactory.SelectCommand_SP(CanSeeMediaPlan, spName, dbparams);
                return CanSeeMediaPlan;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable load Media Plans Permission. UserId: " + LoggedOnUserId.ToString() + " | " + ex.Message);
            }
            finally
            {
            }
            return CanSeeMediaPlan;
        }
        public IEnumerable<MediaPlanLocked> GetLockedMediaPlans(int LoggedOnUserId)
        {
            List<MediaPlanLocked> lstMediaPlans = new List<MediaPlanLocked>();
            try
            {                
                string spName = "SpGetLockedMediaPlans";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lstMediaPlans = FactoryServices.dbFactory.SelectCommand_SP(lstMediaPlans, spName, dbparams);
                return lstMediaPlans;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to load Media Plans. UserId: " + LoggedOnUserId.ToString() + " | " + ex.Message);
            }
            finally
            {
            }
            return lstMediaPlans;
        }
        public void MediaPlanLock(int LoggedOnUserId, int MediaPlanId)
        {            
            try
            {
                string spName = "SpMediaPlanLock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                FactoryServices.dbFactory.SelectCommand_SP("",spName, dbparams);               
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable locking Media Plans. UserId: " + LoggedOnUserId.ToString() + " | " + ex.Message);
            }
            finally
            {
            }            
        }

        public void MediaPlanUnlock(int LoggedOnUserId, int MediaPlanId)
        {
            try
            {
                string spName = "SpMediaPlanUnlock";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                FactoryServices.dbFactory.SelectCommand_SP("", spName, dbparams);
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable Unlocking Media Plans. UserId: " + LoggedOnUserId.ToString() + " | " + ex.Message);
            }
            finally
            {
            }
        }

        public ErrorMessage MediaPlanCheckLock(int LoggedOnUserId, int MediaPlanId, string Action)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "SpMediaPlanCheckLock";
                var dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);              
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("CalledFrom", Action, DbType.String);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to check lock on Media Plan. UserId: " + LoggedOnUserId + " - " + ex.Message);
            }
            finally
            {
            }
            return em;

        }

        public ErrorMessage CreateEditMediaPlan(int LoggedOnUserId, string MediaPlanName, string BudgetPeriod, decimal GrossBudget, decimal Percentage,
            int ClientId, int PlanYear, string QuarterName, string BTGDemos, string BTGNetworks, string Action, int MediaPlanId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "sp_MediaPlan_Create_Edit";
                var dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanName", MediaPlanName, DbType.String);              
                dbparams.Add("BudgetPeriod", BudgetPeriod, DbType.String);
                dbparams.Add("GrossBudget", GrossBudget, DbType.Decimal);
                dbparams.Add("Percentage", Percentage, DbType.Decimal);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("PlanYear", PlanYear, DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                List<MediaPlanNetworkDemos> lstBuyTypeDemos = JsonConvert.DeserializeObject<List<MediaPlanNetworkDemos>>(BTGDemos).ToList();
                List<MediaPlanNetworkDemos> lstBuyTypeNetworks = JsonConvert.DeserializeObject<List<MediaPlanNetworkDemos>>(BTGNetworks).ToList();
                DataTable BTGDemosTbl = DBHelper.ConverListToDataTable(lstBuyTypeDemos);
                DataTable BTGNetworksTbl = DBHelper.ConverListToDataTable(lstBuyTypeNetworks);              
                dbparams.Add("tblBTGNetworks", BTGNetworksTbl.AsTableValuedParameter("MediaPlan_BuyTypeGroup_Networks_Demos"));
                dbparams.Add("tblBTGDemos", BTGDemosTbl.AsTableValuedParameter("MediaPlan_BuyTypeGroup_Networks_Demos"));
                dbparams.Add("Action", Action, DbType.String);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to save Media Plan. MediaPlanName: " + MediaPlanName + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }

        public MediaPlanSummaryViewModel GetMeadiaPlanSummaryHeaderAndDropDown(int MediaPlanId,  int LoggedOnUserId, string BudgetDisplay, string BuyTypeGroups = null,string NetwokIds=null, string MediaTypeIds=null, string DemoIds=null)
        {

            MediaPlanSummaryViewModel objVM = new MediaPlanSummaryViewModel();
            try
            {
                string spName = "sp_MediaPlan_Summary_Header_And_DropDownsGet";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("@BudgetDisplay", BudgetDisplay, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                if (BuyTypeGroups != null)
                    dbparams.Add("BuyTypeGroups", BuyTypeGroups, DbType.String);
                if (NetwokIds != null)
                    dbparams.Add("NetwokIds", NetwokIds, DbType.String);
                if (MediaTypeIds != null)
                    dbparams.Add("MediaTypeIds", MediaTypeIds, DbType.String);
                if (DemoIds != null)
                    dbparams.Add("DemoIds", DemoIds, DbType.String);
                

                using (IDbConnection con = _context.Database.GetDbConnection())
                {
                    if (con.State == System.Data.ConnectionState.Closed)
                    {
                        con.Open();
                    }
                    string sqlQuery = spName;

                    using (SqlMapper.GridReader results = con.QueryMultiple(sqlQuery, dbparams, commandType: CommandType.StoredProcedure))
                    {
                        if (results != null)
                        {
                            objVM.mediaPlanSummaryHeader = results.Read<MediaPlanSummaryHeader>().FirstOrDefault();
                            objVM.lstMediaPlanBuyTypeGroups = results.Read<MediaPlanBuyTypeGroups>().ToList();
                            objVM.lstAllMediaPlanNetwork = results.Read<MediaPlanNetwork>().ToList();
                            objVM.lstMediaPlanNetwork = results.Read<MediaPlanNetwork>().ToList();
                            objVM.lstAllMediaPlanDemo = results.Read<MediaPlanDemo>().ToList();
                            objVM.lstMediaPlanDemo = results.Read<MediaPlanDemo>().ToList();
                            objVM.lstMediaType = results.Read<MediaType>().ToList();
                            //objVM.lstBudgetType = results.Read<string>().ToList();
                            objVM.lstBudgetType.Add("ClientNet");
                            objVM.lstBudgetType.Add("Gross");
                            objVM.lstMediaPlanSummary = results.Read<MediaPlanSummary>().ToList();
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_MediaPlan_Summary_Header_And_DropDownsGet. | " + exc.Message + " | " + exc.StackTrace);
            }

            return objVM;
        }

        public ErrorMessage GetSummaryPublishedToggleMessage(int MediaPlanId,int LoggedOnUserId,string MediaPlanName)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "sp_MediaPlan_Published_Message_Get";
                var dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Fetch Media Plan published Status Media Plan. MediaPlanName: " + MediaPlanName + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }

        public EditMediaPlanViewModel EditMediaPlanByMediaPlanId(int MediaPlanId)
        {
            EditMediaPlanViewModel editMediaPlan = new EditMediaPlanViewModel();
            try
            {
                 using (IDbConnection conn = new SqlConnection(DBConnection.Main()))
                {
                    var result = conn.QueryMultiple("sp_MediaPlan_Edit_Get", param: new { MediaPlanId = MediaPlanId },commandType: CommandType.StoredProcedure);
                    editMediaPlan.MediaPlan = result.Read<MediaPlan>().FirstOrDefault();
                    editMediaPlan.MediaPlanDemos = result.Read<MediaPlanDemo>().ToList();
                    editMediaPlan.MediaPlanNetwork = result.Read<MediaPlanNetwork>().ToList();
                }                          
                return editMediaPlan;
            }
            catch (Exception ex)
            {
                _logger.LogError(MediaPlanId, "Unable to edit Media Plans. " + ex.Message);
            }
            finally
            {
            }
            return editMediaPlan;
        }
        public IEnumerable<MediaPlanQuarter> GetMediaPlanQuartersAndWeeks(int Year, int LoggedOnUserId)
        {
            List<MediaPlanQuarter> Quarters = new List<MediaPlanQuarter>();
            try
            {               
                string spName = "sp_MediaPlan_Quarters_Weeks_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("BroadcastYr", Year, DbType.Int32);

                Quarters = FactoryServices.dbFactory.SelectCommand_SP(Quarters, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get quarters and weeks. " + exc.Message);

            }

            return Quarters.AsEnumerable();


        }

        public List<MediaPlanDemo> GetMediaPlanDemos(int MediaPlanId,string BuyTypeGroup)
        {
            List<MediaPlanDemo> mediaPlanDemos = new List<MediaPlanDemo>();
            try
            {
                string spName = "sp_MediaPlan_Demos_Get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("BuyTypeGroup", BuyTypeGroup, DbType.String);
                mediaPlanDemos = FactoryServices.dbFactory.SelectCommand_SP(mediaPlanDemos, spName, dbparams);

                return mediaPlanDemos;
            }
            catch (Exception ex)
            {
                _logger.LogError(MediaPlanId, "Unable to get Media Plan Demos. " + ex.Message);
            }
            finally
            {
            }
            return mediaPlanDemos;
        }

        public List<MediaPlanProperties> GetMediaPlanProperties(string QuarterName, int CountryId, int NetworkId, int DemoId, string BuyTypeGroup, int PlanYear, int MediaPlanId)
        {
            List<MediaPlanProperties> mediaPlanProperties = new List<MediaPlanProperties>();
            try
            {
                string spName = "sp_MediaPlan_GetAvailablePropertiesForQuarter";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("DemoId", DemoId, DbType.Int32);
                dbparams.Add("BuyTypeGroup", BuyTypeGroup, DbType.String);
                dbparams.Add("PlanYear", PlanYear, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                mediaPlanProperties = FactoryServices.dbFactory.SelectCommand_SP(mediaPlanProperties, spName, dbparams);

                return mediaPlanProperties;
            }
            catch (Exception ex)
            {
                _logger.LogError(QuarterName, "Unable to get Media Plan Properties. " + ex.Message);
            }
            finally
            {
            }
            return mediaPlanProperties;
        }

        public MediaPlanPropertyEditGet GetMediaPlanPropertyById(int MediaPlanPropertyId, int QuarterId)
        {
            MediaPlanPropertyEditGet mediaPlanProperty = new MediaPlanPropertyEditGet();
            try
            {
                string spName = "SpGetMediaPlanPropertyById";
                DynamicParameters dbparams = new DynamicParameters();               
                dbparams.Add("MediaPlanPropertyId", MediaPlanPropertyId, DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                mediaPlanProperty = FactoryServices.dbFactory.SelectCommand_SP(mediaPlanProperty, spName, dbparams);

                return mediaPlanProperty;
            }
            catch (Exception ex)
            {
                _logger.LogError("Unable to get Media Plan Property. " + ex.Message);
            }
            finally
            {
            }
            return mediaPlanProperty;
        }
        
        public List<MediaPlanBTPageNetworks> GetMediaPlanBTGroupNetworks(int MediaPlanId, int LoggedOnUserId, string BuyTypeGroup)
        {

            List<MediaPlanBTPageNetworks> lstMedialPlanBTPageNetworks = new List<MediaPlanBTPageNetworks>();
            try
            {
                string spName = "sp_MediaPlan_BTGroupNetworks_get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("BuyTypeGroup", BuyTypeGroup, DbType.String);
                lstMedialPlanBTPageNetworks = FactoryServices.dbFactory.SelectCommand_SP(lstMedialPlanBTPageNetworks, spName, dbparams);
                return lstMedialPlanBTPageNetworks;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to load Buy Type Group Networks for Media Plan "+MediaPlanId+" and BTGroup: "+BuyTypeGroup+". UserId: " + LoggedOnUserId.ToString() + " | " + ex.Message);
            }
            finally
            {
            }
            return lstMedialPlanBTPageNetworks;
        }

        public MediaPlanBTPageSummaryViewModel GetMeadiaPlanBTPageSummary(int MediaPlanId, int LoggedOnUserId, string BuyTypeGroup)
        {

            MediaPlanBTPageSummaryViewModel objBT = new MediaPlanBTPageSummaryViewModel();
            try
            {
                string spName = "sp_MediaPlan_BTGroupNetworks_get";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("BuyTypeGroup", BuyTypeGroup, DbType.String);
                
                using (IDbConnection con = _context.Database.GetDbConnection())
                {
                    if (con.State == System.Data.ConnectionState.Closed)
                    {
                        con.Open();
                    }
                    string sqlQuery = spName;

                    using (SqlMapper.GridReader results = con.QueryMultiple(sqlQuery, dbparams, commandType: CommandType.StoredProcedure))
                    {
                        if (results != null)
                        {
                           objBT.mediaPlanSummaryHeader = results.Read<MediaPlanSummaryHeader>().FirstOrDefault();
                           objBT.lstNetworks = results.Read<MediaPlanBTPageNetworks>().ToList();
                           objBT.lstProperties = results.Read<MediaPlanBTGroupNetworksProperties>().ToList();
                           objBT.lstDayPart = results.Read<MediaPlanBTGroupsDayPart>().ToList();
                           objBT.BuyTypeGroupId = results.Read<int>().FirstOrDefault();
                           objBT.lstQuickPlan = results.Read<QuickPlanBTGSummary>().ToList();
                        }
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_MediaPlan_BTGroupNetworks_get. | " + exc.Message + " | " + exc.StackTrace);
            }

            return objBT;
        }
        
        public ErrorMessage SaveMediaPlanProperties(int LoggedOnUserId, int MediaPlanId,string MediaPlanName, int ClientId,MediaPlanProperties lstProp)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                List<MediaPlanProperties> lstRetProp = new List<MediaPlanProperties>();
                string spName = "Sp_MediaPlanProperties_Insert";
                var dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanid", MediaPlanId, DbType.Int32);
                
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                List<MediaPlanProperties> propdata = new List<MediaPlanProperties>();
                propdata.Add(lstProp);
                DataTable MPProps = DBHelper.ConverListToDataTable(propdata);
                dbparams.Add("tblMediaPlanPropType", MPProps.AsTableValuedParameter("MediaPlanPropType"));
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to save Media Plan Properties. MediaPlanName: " + MediaPlanName + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }

        public ErrorMessage SaveMediaPlanDRClearance(int LoggedOnUserId, int MediaPlanId, string MediaPlanName, int ClientId, MediaPlanProperties drClearance)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                List<MediaPlanProperties> lstRetProp = new List<MediaPlanProperties>();
                string spName = "Sp_MediaPlanDRClearance_Insert";
                var dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanid", MediaPlanId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                List<MediaPlanProperties> clearanceData = new List<MediaPlanProperties>();
                clearanceData.Add(drClearance);
                DataTable DRClear = DBHelper.ConverListToDataTable(clearanceData);
                dbparams.Add("tblMediaPlanPropType", DRClear.AsTableValuedParameter("MediaPlanPropType"));
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to save Media Plan Properties. MediaPlanName: " + MediaPlanName + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }

        public ErrorMessage UpdateMediaPlanPropertyById(int LoggedOnUserId, int MediaPlanPropertyId, decimal AdjustedRatePercentage, decimal AdjustedImpressionPercentage, string MediaPlanPropertyName,
            int DayPartId, int BuyTypeId, int SpotLen, decimal RateAmount, decimal Impressions, decimal CPM, int Wk01Spots, int Wk02Spots, int Wk03Spots, int Wk04Spots, int Wk05Spots
            , int Wk06Spots, int Wk07Spots, int Wk08Spots, int Wk09Spots, int Wk10Spots, int Wk11Spots, int Wk12Spots, int Wk13Spots, int Wk14Spots)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "SpUpdateMediaPlanPropertyById";
                var dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanPropertyId", MediaPlanPropertyId, DbType.Int32);
                dbparams.Add("AdjustedRatePercentage", AdjustedRatePercentage, DbType.Decimal);
                dbparams.Add("AdjustedImpressionPercentage", AdjustedImpressionPercentage, DbType.Decimal);
                dbparams.Add("MediaPlanPropertyName", MediaPlanPropertyName, DbType.String);
                dbparams.Add("DayPartId", DayPartId, DbType.Int32);
                dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                dbparams.Add("SpotLen", SpotLen, DbType.Int32);               
                dbparams.Add("RateAmount", RateAmount, DbType.Decimal);
                dbparams.Add("Impressions", Impressions, DbType.Decimal);
                dbparams.Add("CPM", CPM, DbType.Decimal);
                dbparams.Add("Wk01Spots", Wk01Spots, DbType.Int32);
                dbparams.Add("Wk02Spots", Wk02Spots, DbType.Int32);
                dbparams.Add("Wk03Spots", Wk03Spots, DbType.Int32);
                dbparams.Add("Wk04Spots", Wk04Spots, DbType.Int32);
                dbparams.Add("Wk05Spots", Wk05Spots, DbType.Int32);
                dbparams.Add("Wk06Spots", Wk06Spots, DbType.Int32);
                dbparams.Add("Wk07Spots", Wk07Spots, DbType.Int32);
                dbparams.Add("Wk08Spots", Wk08Spots, DbType.Int32);
                dbparams.Add("Wk09Spots", Wk09Spots, DbType.Int32);
                dbparams.Add("Wk10Spots", Wk10Spots, DbType.Int32);
                dbparams.Add("Wk11Spots", Wk11Spots, DbType.Int32);
                dbparams.Add("Wk12Spots", Wk12Spots, DbType.Int32);
                dbparams.Add("Wk13Spots", Wk13Spots, DbType.Int32);
                dbparams.Add("Wk14Spots", Wk14Spots, DbType.Int32);
                
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update media plan property. MediaPlanPropertyId: " + MediaPlanPropertyId + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }
        
        public IEnumerable<SelectListItem> GetMediaPlanBuyTypes(string BuyTypeGroup, int LoggedOnUserId)
        {
            List<SelectListItem> lsgtBT = new List<SelectListItem>();
            try
            {
                string spName = "sp_MediaPlanBTDropdownGet";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("BuyTypeGroup", BuyTypeGroup, DbType.String);
                lsgtBT = FactoryServices.dbFactory.SelectCommand_SP(lsgtBT, spName, dbparams);
                return lsgtBT;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get buy types. " + exc.Message);
            }
            return lsgtBT;
        }

        public ErrorMessage GetWeeklyBudget(int LoggedOnUserId, int MediaPlanId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "sp_GetMediaPlanWeeklyBudget";
                var dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update media plan property. MediaPlanId: " + MediaPlanId + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }

        public ErrorMessage SaveMedialPlanNote(int MediaPlanId,int LoggedOnUserId, string Note , string Author)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "SpCreateMediaPlanNotes";
                var dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("Note", Note, DbType.String);
                dbparams.Add("Author", Author, DbType.String);
                
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to Save Media Plan Note. MediaPlanId: " + MediaPlanId + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }
        public ErrorMessage UpdateMedialPlanNote(int MediaPlanNoteId, int LoggedOnUserId, string Note)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "SpUpdateMediaPlanNote";
                var dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanNoteId", MediaPlanNoteId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("Note", Note, DbType.String);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update Media Plan Note. MediaPlanNoteId:" + MediaPlanNoteId + "-" + ex.Message);
            }
            finally
            {
            }
            return em;
        }
        public ErrorMessage DeleteMediaPlanNote(int MediaPlanNoteId, int LoggedOnUserId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "SpDeleteMediaPlanNoteById";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanNoteId", MediaPlanNoteId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable to delete Media Plans Notes. MediaPlanNoteId:" + MediaPlanNoteId + "-" + ex.Message);
            }
            finally
            {
            }
            return em;
        }
        public List<MediaPlanNotesModel> GetAllMediaPlansNotes(int MediaPlanId, int LoggedOnUserId)
        {
            List<MediaPlanNotesModel> lstMediaPlansNotes = new List<MediaPlanNotesModel>();
            try
            {
                string spName = "SpGetAllMediaPlanNotes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lstMediaPlansNotes = FactoryServices.dbFactory.SelectCommand_SP(lstMediaPlansNotes, spName, dbparams);
                return lstMediaPlansNotes;
            }
            catch (Exception ex)
            {
                _logger.LogError(LoggedOnUserId, "Unable load Media Plan Notes. MediaPlanId: " + MediaPlanId.ToString() + " |  ErrorMessage: " + ex.Message);
            }
            finally
            {
            }
            return lstMediaPlansNotes;
        }

        public async Task<FileAttachementResult> UploadFileAsync(IFormFile File, int mediaPlanId, int userId)
        {
            try
            {
                var request = _httpContextAccessor.HttpContext.Request;
                string basePath;

                if (request.Host.Host.Contains("qa-") || request.Host.Host.Contains("dev-") || request.Host.Host.Contains("localhost"))
                {
                    basePath = _configuration["MediaPlanAttachmentsPathQA"];
                }
                else
                {
                    basePath = _configuration["MediaPlanAttachmentsPathProd"];
                }
                
                var uploadsFolder = Path.Combine(basePath, mediaPlanId.ToString());
                _logger.LogInformation("Uploads folder path: {UploadsFolder}", uploadsFolder);
                
                if (!Directory.Exists(uploadsFolder))
                {
                    _logger.LogInformation("Directory does not exist. Creating directory: {UploadsFolder}", uploadsFolder);
                    Directory.CreateDirectory(uploadsFolder);
                }

                var filePath = Path.Combine(uploadsFolder, File.FileName);
                _logger.LogInformation("File path: {FilePath}", filePath);

                using (IDbConnection conn = new SqlConnection(DBConnection.Main()))
                {
                    var existingFile = await conn.QueryFirstOrDefaultAsync<MediaPlanAttachment>(
                        "SELECT TOP 1 * FROM MediaPlanAttachments WHERE MediaPlanId = @MediaPlanId AND FileName = @FileName AND FileType = @FileType",
                        new { MediaPlanId = mediaPlanId, FileName = File.FileName, FileType = File.ContentType });


                    if (existingFile != null)
                    {
                        return new FileAttachementResult
                        {
                            FileName = File.FileName,
                            MediaPlanId = mediaPlanId,
                            MediaPlanAttachments = null,
                            ErrorCode = 409
                        };                 
                    }

                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        await File.CopyToAsync(fileStream);
                    }

                    var fileAttachment = new MediaPlanAttachment
                    {
                        MediaPlanId = mediaPlanId,
                        FileName = File.FileName,
                        FilePath = filePath,
                        FileSize = File.Length,
                        FileType = File.ContentType,
                        UploadedBy = userId,
                        UploadedDt = DateTime.Now
                    };

                    var query = @"IF NOT EXISTS (SELECT 1 FROM MediaPlanAttachments WHERE MediaPlanId = @MediaPlanId AND FileName = @FileName)
                                BEGIN
                                    INSERT INTO MediaPlanAttachments (MediaPlanId, FileName, FilePath, FileSize, FileType, UploadedBy, UploadedDt)
                                    VALUES (@MediaPlanId, @FileName, @FilePath, @FileSize, @FileType, @UploadedBy, @UploadedDt)
                                END";

                    await conn.ExecuteAsync(query, fileAttachment);

                    var attachments = await conn.QueryAsync<MediaPlanAttachment>(
                    "SELECT * FROM MediaPlanAttachments WHERE MediaPlanId = @MediaPlanId",
                    new { MediaPlanId = mediaPlanId });

                    return new FileAttachementResult
                    {
                        FileName = File.FileName,
                        MediaPlanId = mediaPlanId,
                        MediaPlanAttachments = attachments.ToList()
                    };
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while uploading the file. - " + mediaPlanId);
                return new FileAttachementResult
                {
                    FilePath = null,
                    FileName = "",
                    MediaPlanId = mediaPlanId
                };
            }
        }
        public async Task<FileStreamResult> DownloadFileAsync(int MediaPlanId, string FileName)
        {
            try
            {
                var request = _httpContextAccessor.HttpContext.Request;
                string basePath;

                if (request.Host.Host.Contains("qa-") || request.Host.Host.Contains("dev-") || request.Host.Host.Contains("localhost"))
                {
                    basePath = _configuration["MediaPlanAttachmentsPathQA"];
                }
                else
                {
                    basePath = _configuration["MediaPlanAttachmentsPathProd"];
                }
                var uploadsFolder = Path.Combine(basePath, MediaPlanId.ToString());
                var filePath = Path.Combine(uploadsFolder, FileName);

                if (!System.IO.File.Exists(filePath))
                {
                    return null; 
                }

                var memory = new MemoryStream();
                using (var stream = new FileStream(filePath, FileMode.Open))
                {
                    await stream.CopyToAsync(memory);
                }
                memory.Position = 0;

                return new FileStreamResult(memory, "application/octet-stream")
                {
                    FileDownloadName = FileName
                };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while downloading the file.");
                return null;
            }
        }
        public async Task<ErrorMessage> DeleteFileAsync(int MediaPlanId, string FileName, int MediaPlanAttachmentId)
        {
            try
            {
                var request = _httpContextAccessor.HttpContext.Request;
                string basePath;

                if (request.Host.Host.Contains("qa-") || request.Host.Host.Contains("dev-") || request.Host.Host.Contains("localhost"))
                {
                    basePath = _configuration["MediaPlanAttachmentsPathQA"];
                }
                else
                {
                    basePath = _configuration["MediaPlanAttachmentsPathProd"];
                }
                var uploadsFolder = Path.Combine(basePath, MediaPlanId.ToString());
                var filePath = Path.Combine(uploadsFolder, FileName);
                var remainingCount = 0;
                if (System.IO.File.Exists(filePath))
                {
                    System.IO.File.Delete(filePath);
                }
                else
                {
                    _logger.LogWarning("File not found: {FilePath}", filePath);
                }
               
                using (IDbConnection conn = new SqlConnection(DBConnection.Main()))
                {
                    var query = "DELETE FROM MediaPlanAttachments WHERE MediaPlanAttachmentId = @MediaPlanAttachmentId";
                    var rowsAffected = await conn.ExecuteAsync(query, new { MediaPlanAttachmentId = MediaPlanAttachmentId });

                    if (rowsAffected == 0)
                    {
                        _logger.LogWarning("No record found with MediaPlanAttachmentId: {MediaPlanAttachmentId}", MediaPlanAttachmentId);
                        return new ErrorMessage { Success = false, ResponseText = "No record found to delete." };
                    }
                    var countQuery = "SELECT COUNT(*) FROM MediaPlanAttachments WHERE MediaPlanId = @MediaPlanId";
                    remainingCount = await conn.ExecuteScalarAsync<int>(countQuery, new { MediaPlanId = MediaPlanId });

                }

                return new ErrorMessage { Success = true, ResponseCode = remainingCount, ResponseText = "File deleted successfully." };
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "An error occurred while deleting the file.");
                return new ErrorMessage { Success = false, ResponseText = "An error occurred while deleting the file." };
            }
        }

        public async Task<IEnumerable<MediaPlanAttachment>> GetAllMediaPlanAttachmentsAsync(int MediaPlanId)
        {
            using (IDbConnection conn = new SqlConnection(DBConnection.Main()))
            {
                string query = "SELECT * FROM MediaPlanAttachments WHERE MediaPlanId = @MediaPlanId";
                return await conn.QueryAsync<MediaPlanAttachment>(query, new { MediaPlanId = MediaPlanId });
            }
        }

        public List<MediaPlanQuickPlan> GetQuickPlanDetails(int QuarterId, int CountryId, int NetworkId, int DemoId, int BuyTypeGroupId, int Year, int BuytypeId, int MediaPlanId, int PlanYear, int PlanQuarterId)
        {
            List<MediaPlanQuickPlan> quickPlanDetails = new List<MediaPlanQuickPlan>();
            try
            {
                string spName = "spMediaPlanGetQuickPlanDetail";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("DemoId", DemoId, DbType.Int32);
                dbparams.Add("BuyTypeGroupId", BuyTypeGroupId, DbType.String);
                dbparams.Add("Year", Year, DbType.Int32);
                dbparams.Add("BuytypeId", BuytypeId, DbType.Int32);                
                dbparams.Add("MediaPlanId", MediaPlanId, DbType.Int32);
                dbparams.Add("PlanYear", PlanYear, DbType.Int32);
                dbparams.Add("PlanQuarterId", PlanQuarterId, DbType.Int32);

                quickPlanDetails = FactoryServices.dbFactory.SelectCommand_SP(quickPlanDetails, spName, dbparams);

                return quickPlanDetails;
            }
            catch (Exception ex)
            {
                _logger.LogError(MediaPlanId, "Unable to get Quick Plan Details. " + ex.Message);
            }
            finally
            {
            }
            return quickPlanDetails;
        }

        
        public ErrorMessage SaveMedialQuickPlan(MediaPlanQuickPlan mediaPlanQuickPlan)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                string spName = "spMediaPlanSaveQuickPlanDetail";
                var dbparams = new DynamicParameters();
                dbparams.Add("QuickPlanId", mediaPlanQuickPlan.QuickPlanId, DbType.Int32);
                dbparams.Add("MediaPlanId", mediaPlanQuickPlan.MediaPlanId, DbType.Int32);
                dbparams.Add("NetworkId", mediaPlanQuickPlan.NetworkId, DbType.Int32);
                dbparams.Add("BuyTypeGroupId", mediaPlanQuickPlan.BuyTypeGroupId, DbType.Int32);
                dbparams.Add("Year", mediaPlanQuickPlan.Year, DbType.Int32);
                dbparams.Add("QuarterId", mediaPlanQuickPlan.QuarterId, DbType.Int32);
                dbparams.Add("DemographicId", mediaPlanQuickPlan.DemographicId, DbType.Int32);
                dbparams.Add("BuyTypeId", mediaPlanQuickPlan.BuyTypeId, DbType.Int32);
                dbparams.Add("AdjustedRates", mediaPlanQuickPlan.AdjustedRates, DbType.Decimal);
                dbparams.Add("AdjustedImps", mediaPlanQuickPlan.AdjustedImps, DbType.Decimal);
                dbparams.Add("AvgRates30Sec", mediaPlanQuickPlan.AvgRates30Sec, DbType.Decimal);
                dbparams.Add("AvgRates15Sec", mediaPlanQuickPlan.AvgRates15Sec, DbType.Decimal);
                dbparams.Add("TotalSpots30Sec", mediaPlanQuickPlan.TotalSpots30Sec, DbType.Int32);
                dbparams.Add("TotalSpots15Sec", mediaPlanQuickPlan.TotalSpots15Sec, DbType.Int32);
                dbparams.Add("Total30SecSpend", mediaPlanQuickPlan.Total30SecSpend, DbType.Decimal);
                dbparams.Add("Total15SecSpend", mediaPlanQuickPlan.Total15SecSpend, DbType.Decimal);
                dbparams.Add("TotalSpend", mediaPlanQuickPlan.TotalSpend, DbType.Decimal);
                dbparams.Add("Imps", mediaPlanQuickPlan.Imps, DbType.Decimal);
                dbparams.Add("TotalImps", mediaPlanQuickPlan.TotalImps, DbType.Decimal);
                dbparams.Add("CPM", mediaPlanQuickPlan.CPM, DbType.Decimal);
                dbparams.Add("CreatedBy", mediaPlanQuickPlan.CreatedBy, DbType.Int32);                
                dbparams.Add("Universe", mediaPlanQuickPlan.Universe, DbType.Int32);
                dbparams.Add("Percent15Sec", mediaPlanQuickPlan.Percent15Sec, DbType.Decimal);              


                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                return em;
            }
            catch (Exception ex)
            {
                _logger.LogError(mediaPlanQuickPlan.CreatedBy, "Unable to Save Media Quick Plan . MediaPlanId: " + mediaPlanQuickPlan.MediaPlanId + " - " + ex.Message);
            }
            finally
            {
            }
            return em;
        }


    }
}
