using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mime;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace OM_ScheduleTool.Controllers
{
    public class ManageMediaController : Controller
    {
        private IConfiguration _config;
        private IAppFeatureRepository _appFeatureRepository;
        private IBuyTypeRepository _buyTypeRepository;
        private IClientRepository _clientRepository;
        private IDealpointRepository _dealpointRepository;
        private IDemographicSettingsRepository _demographicSettingsRepository;
        private IGeneralRepository _generalRepository;
        private INetworkRepository _networkRepository;
        private IPropertyRepository _propertyRepository;
        private IProposalRepository _proposalRepository;
        private IRemnantRepository _remnantRepository;
        private IScheduleRepository _scheduleRepository;
        private IUpfrontRepository _upfrontRepository;
        private IUserRepository _userRepository;
        private IPreLogRepository _prelogRepository;
        private IPostLogRepository _postlogRepository;
        private IMediaPlanRepository _mediaPlanRepository;

        public ManageMediaController(IAppFeatureRepository appFeatureRepository
            , IBuyTypeRepository buyTypeRepository
            , IClientRepository clientRepository
            , IConfiguration config
            , IDealpointRepository dealpointRepository
            , IDemographicSettingsRepository demographicSettingsRepository
            , IGeneralRepository generalRepository
            , INetworkRepository networkRepository
            , IPropertyRepository propertyRepository
            , IProposalRepository proposalRepository
            , IRemnantRepository remnantRepository
            , IScheduleRepository scheduleRepository
            , IUpfrontRepository upfrontRepository
            , IUserRepository userRepository
            , IPreLogRepository prelogRepository
            , IPostLogRepository postlogRepository,
            IMediaPlanRepository mediaPlanRepository
            )
        {
            _appFeatureRepository = appFeatureRepository;
            _buyTypeRepository = buyTypeRepository;
            _config = config;
            _clientRepository = clientRepository;
            _dealpointRepository = dealpointRepository;
            _demographicSettingsRepository = demographicSettingsRepository;
            _generalRepository = generalRepository;
            _networkRepository = networkRepository;
            _propertyRepository = propertyRepository;
            _proposalRepository = proposalRepository;
            _remnantRepository = remnantRepository;
            _scheduleRepository = scheduleRepository;
            _upfrontRepository = upfrontRepository;
            _userRepository = userRepository;
            _prelogRepository = prelogRepository;
            _postlogRepository = postlogRepository;
            _mediaPlanRepository= mediaPlanRepository;
        }

        [SessionExpireFilter]
        public IActionResult Index(int UpfrontId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Index?UpfrontId=" + UpfrontId.ToString());

            ManageMediaViewModel mmm = new ManageMediaViewModel();
            mmm.LoggedOnUser = LoggedOnUser;
            mmm.Countries = _networkRepository.GetAllCountries();
            //mmm.UserFeaturePermissionInfo = _appFeatureRepository.GetUserFeaturePermissions(LoggedOnUser.UserId, null);
            mmm.UpfrontLockedCount = _upfrontRepository.GetUpfrontLockCount();
            mmm.RemnantLockedCount = _remnantRepository.GetRemnantLockCount();
            mmm.ScheduleLockedCount = _scheduleRepository.GetScheduleLockCount();
            mmm.ProposalLockedCount = _proposalRepository.GetProposalLockCount();
            mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);
            /* Set which media type is currently using this page */
            if (HttpContext.Request.Path.HasValue == true)
            {
                if (HttpContext.Request.Path.Value.IndexOf("Index") >= 0)
                {
                    mmm.CurrentMediaSelection = 1;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Remnants") >= 0)
                {
                    mmm.CurrentMediaSelection = 2;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Schedule") >= 0)
                {
                    mmm.CurrentMediaSelection = 3;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Proposal") >= 0)
                {
                    mmm.CurrentMediaSelection = 4;
                }
                else if (HttpContext.Request.Path.Value.ToLower().IndexOf("planning") >= 0)
                {
                    mmm.CurrentMediaSelection = 6;
                }
                else
                {
                    mmm.CurrentMediaSelection = 1;
                }
            }


            //try
            //{
            //    mmm.LastSelectedClientId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_ClientId"));
            //}
            //catch { }

            try
            {
                mmm.LastSelectedNetworkId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_NetworkId"));
            }
            catch { }

            try
            {
                mmm.LastSelectedPlanYear = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_PlanYear"));
            }
            catch
            {
                mmm.LastSelectedPlanYear = DateTime.Now.Year;
            }

            try
            {
                mmm.LastSelectedCountryId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_CountryId"));
            }
            catch
            {
                mmm.LastSelectedCountryId = 5; // US
            }

            //try
            //{
            //    mmm.LastWindowWidth = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowWidth"));
            //}
            //catch
            //{
                mmm.LastWindowWidth = 1024;
            //}

            //try
            //{
            //    mmm.LastWindowHeight = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowHeight"));
            //}
            //catch
            //{
                mmm.LastWindowHeight = 800;
            //}

            try
            {
                mmm.LastQuarter = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_BroadcastQuarterNbr"));
            }
            catch
            {
                mmm.LastQuarter = 1;
            }

            return View(mmm);
        }

        [SessionExpireFilter]
        public IActionResult Remnants(int UpfrontId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Remnants?UpfrontId=" + UpfrontId.ToString());

            ManageMediaViewModel mmm = new ManageMediaViewModel();
            mmm.LoggedOnUser = LoggedOnUser;
            mmm.Countries = _networkRepository.GetAllCountries();
            //mmm.UserFeaturePermissionInfo = _appFeatureRepository.GetUserFeaturePermissions(LoggedOnUser.UserId, null);
            mmm.UpfrontLockedCount = _upfrontRepository.GetUpfrontLockCount();
            mmm.RemnantLockedCount = _remnantRepository.GetRemnantLockCount();
            mmm.ScheduleLockedCount = _scheduleRepository.GetScheduleLockCount();
            mmm.ProposalLockedCount = _proposalRepository.GetProposalLockCount();
            mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);
            /* Set which media type is currently using this page */
            if (HttpContext.Request.Path.HasValue == true)
            {
                if (HttpContext.Request.Path.Value.IndexOf("Index") >= 0)
                {
                    mmm.CurrentMediaSelection = 1;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Remnants") >= 0)
                {
                    mmm.CurrentMediaSelection = 2;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Schedule") >= 0)
                {
                    mmm.CurrentMediaSelection = 3;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Proposal") >= 0)
                {
                    mmm.CurrentMediaSelection = 4;
                }
                else
                {
                    mmm.CurrentMediaSelection = 1;
                }
            }

            //try
            //{
            //    mmm.LastSelectedClientId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_ClientId"));
            //}
            //catch { }

            try
            {
                mmm.LastSelectedNetworkId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_NetworkId"));
            }
            catch { }

            try
            {
                mmm.LastSelectedPlanYear = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_PlanYear"));
            }
            catch
            {
                mmm.LastSelectedPlanYear = DateTime.Now.Year;
            }

            try
            {
                mmm.LastSelectedCountryId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_CountryId"));
            }
            catch
            {
                mmm.LastSelectedCountryId = 5; // US
            }

            //try
            //{
            //    mmm.LastWindowWidth = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowWidth"));
            //}
            //catch
            //{
                mmm.LastWindowWidth = 1024;
            //}

            //try
            //{
            //    mmm.LastWindowHeight = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowHeight"));
            //}
            //catch
            //{
                mmm.LastWindowHeight = 800;
            //}

            try
            {
                mmm.LastQuarter = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "UpfrontRemnant_BroadcastQuarterNbr"));
            }
            catch
            {
                mmm.LastQuarter = 1;
            }

            return View(mmm);
        }


        [SessionExpireFilter]
        public IActionResult DisplayUpfronts()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DisplayUpfrontsViewModel duf = new DisplayUpfrontsViewModel();
            duf.LoggedOnUser = LoggedOnUser;
            duf.Upfronts = _upfrontRepository.GetUpfronts(LoggedOnUser.UserId);
            return View(duf);
        }

        [SessionExpireFilter]
        public IActionResult Planning()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            
            ManageMediaViewModel mmm = new ManageMediaViewModel();
            mmm.LoggedOnUser = LoggedOnUser;
            mmm.Countries = _networkRepository.GetAllCountries();
            mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);
            Uri uri = null;
            int MediaPlanId = 0;
            if (Request.GetTypedHeaders().Referer != null)
            {
                uri = new Uri(Request.GetTypedHeaders().Referer.ToString());
                MediaPlanId = Convert.ToInt32(HttpUtility.ParseQueryString(uri.Query).Get("MediaPlanId"));
            }
            
            if (MediaPlanId != 0)
            {
                EditMediaPlanViewModel editMediaPlan = _mediaPlanRepository.EditMediaPlanByMediaPlanId(MediaPlanId);
                if(editMediaPlan.MediaPlan.LockedByUserId == LoggedOnUser.UserId)
                {
                    _mediaPlanRepository.MediaPlanUnlock(LoggedOnUser.UserId, MediaPlanId);
                }                
            }
           
            if (mmm.CanSeeMediaPlan)
            {
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Planning");
            }
            else
            {
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Index?UpfrontId=0");
                return RedirectToAction("Index","StatusCode",new { StatusCode= 403 });
            }
            if (HttpContext.Request.Path.HasValue == true)
            {
                if (HttpContext.Request.Path.Value.IndexOf("Planning") >= 0)
                {
                    mmm.CurrentMediaSelection = 6;
                }
            }
            try
            {
                mmm.LastSelectedClientId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_ClientId"));
            }
            catch { }

            try
            {
                mmm.LastSelectedPlanYear = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_PlanYear"));
            }
            catch
            {
                mmm.LastSelectedPlanYear = DateTime.Now.Year;
            }

            try
            {
                mmm.LastSelectedCountryId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_CountryId"));
            }
            catch
            {
                mmm.LastSelectedCountryId = 5; // US
            }

            mmm.LastWindowWidth = 1024;
            mmm.LastWindowHeight = 800;

            try
            {
                mmm.LastQuarter = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_BroadcastQuarterNbr"));
            }
            catch
            {
                mmm.LastQuarter = 1;
            }
            return View(mmm);
        }

        [HttpGet]
        public ActionResult ExportUpfrontsExcel(int ClientId, int NetworkId, string DateFrom, string DateTo)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DisplayUpfrontsViewModel duf = new DisplayUpfrontsViewModel();
            duf.LoggedOnUser = LoggedOnUser;
            duf.Upfronts = _upfrontRepository.GetUpfronts(LoggedOnUser.UserId);

            byte[] filecontent = ExcelExportHelper.ExportExcel(duf);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "OM_UpfrontsList.xlsx");
        }


        [SessionExpireFilter]
        public IActionResult DisplayRemnants()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DisplayUpfrontsViewModel duf = new DisplayUpfrontsViewModel();
            duf.LoggedOnUser = LoggedOnUser;
            duf.Upfronts = _remnantRepository.GetRemnants(LoggedOnUser.UserId);
            return View(duf);
        }

        [SessionExpireFilter]
        public IActionResult Schedule(int ScheduleId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Schedule?ScheduleId=" + ScheduleId.ToString());
            //if (ScheduleId > 0)
            //{
            //    _userRepository.SetLastProposalId(LoggedOnUser.UserId, ScheduleId);
            //}
            ManageMediaViewModel mmm = new ManageMediaViewModel();
            mmm.LoggedOnUser = LoggedOnUser;
            mmm.Countries = _networkRepository.GetAllCountries();
            mmm.UpfrontLockedCount = _upfrontRepository.GetUpfrontLockCount();
            mmm.RemnantLockedCount = _remnantRepository.GetRemnantLockCount();
            mmm.ScheduleLockedCount = _scheduleRepository.GetScheduleLockCount();
            mmm.ProposalLockedCount = _proposalRepository.GetProposalLockCount();
            mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);
            /* Set which media type is currently using this page */
            if (HttpContext.Request.Path.HasValue == true)
            {
                if (HttpContext.Request.Path.Value.IndexOf("Index") >= 0)
                {
                    mmm.CurrentMediaSelection = 1;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Remnants") >= 0)
                {
                    mmm.CurrentMediaSelection = 2;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Schedule") >= 0)
                {
                    mmm.CurrentMediaSelection = 3;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Proposal") >= 0)
                {
                    mmm.CurrentMediaSelection = 4;
                }
                else
                {
                    mmm.CurrentMediaSelection = 1;
                }
            }
            
            try
            {
                mmm.LastSelectedClientId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_ClientId"));
            }
            catch { }

            try
            {
                mmm.LastSelectedPlanYear = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_PlanYear"));
            }
            catch
            {
                mmm.LastSelectedPlanYear = DateTime.Now.Year;
            }

            try
            {
                mmm.LastSelectedCountryId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_CountryId"));
            }
            catch
            {
                mmm.LastSelectedCountryId = 5; // US
            }
                       
                mmm.LastWindowWidth = 1024;           
                mmm.LastWindowHeight = 800;           
            try
            {
                mmm.LastQuarter = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_BroadcastQuarterNbr"));
            }
            catch
            {
                mmm.LastQuarter = 1;
            }

            //try
            //{
            //    int Month = DateTime.Now.Month;
            //    mmm.LastQuarter = (Month / 3) + 2;
            //    if (mmm.LastQuarter > 3)
            //    {
            //        mmm.LastQuarter = 1;
            //        mmm.LastSelectedPlanYear = DateTime.Now.Year + 1;
            //    }
            //    else
            //    {
            //        mmm.LastSelectedPlanYear = DateTime.Now.Year;
            //    }
            //    mmm.LastSelectedCountryId = 5; // US
            //    mmm.LastWindowWidth = 1024;
            //    mmm.LastWindowHeight = 800;

            //    int ActiveScheduleId = ScheduleId;
            //    if (ActiveScheduleId == 0)
            //    {
            //        ActiveScheduleId = _userRepository.GetLastScheduleId(LoggedOnUser.UserId);
            //    }
            //    if (ActiveScheduleId > 0)
            //    {
            //        ScheduleSummary sp = _scheduleRepository.GetScheduleById(LoggedOnUser.UserId, ActiveScheduleId);
            //        mmm.LastQuarter = sp.BroadcastQuarterNbr;
            //        mmm.LastSelectedClientId = sp.ClientId;
            //        mmm.LastSelectedNetworkId = sp.NetworkId;
            //        if (sp.PlanYrType == "B" && sp.BroadcastQuarterNbr == 1)
            //        {
            //            mmm.LastSelectedPlanYear = sp.PlanYr + 1;
            //        }
            //        else
            //        {
            //            mmm.LastSelectedPlanYear = sp.PlanYr;
            //        }
            //        mmm.LastSelectedCountryId = sp.CountryId;
            //        mmm.LastWindowWidth = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowWidth"));
            //        mmm.LastWindowHeight = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowHeight"));
            //    }
            //}
            //catch
            //{
            //}


            return View(mmm);
        }

        [SessionExpireFilter]
        public IActionResult Proposal (int ProposalId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Proposal?ProposalId=" + ProposalId.ToString());
            //if (ProposalId > 0)
            //{
            //    _userRepository.SetLastProposalId(LoggedOnUser.UserId, ProposalId);
            //}
            ManageMediaViewModel mmm = new ManageMediaViewModel();
            mmm.LoggedOnUser = LoggedOnUser;
            mmm.Countries = _networkRepository.GetAllCountries();
            mmm.UpfrontLockedCount = _upfrontRepository.GetUpfrontLockCount();
            mmm.RemnantLockedCount = _remnantRepository.GetRemnantLockCount();
            mmm.ScheduleLockedCount = _scheduleRepository.GetScheduleLockCount();
            mmm.ProposalLockedCount = _proposalRepository.GetProposalLockCount();
            mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);
            /* Set which media type is currently using this page */
            if (HttpContext.Request.Path.HasValue == true)
            {
                if (HttpContext.Request.Path.Value.IndexOf("Index") >= 0)
                {
                    mmm.CurrentMediaSelection = 1;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Remnants") >= 0)
                {
                    mmm.CurrentMediaSelection = 2;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Schedule") >= 0)
                {
                    mmm.CurrentMediaSelection = 3;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Proposal") >= 0)
                {
                    mmm.CurrentMediaSelection = 4;
                }
                else
                {
                    mmm.CurrentMediaSelection = 1;
                }
            }
            try
            {
                mmm.LastSelectedClientId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_ClientId"));
            }
            catch { }
            
            try
            {
                mmm.LastSelectedPlanYear = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_PlanYear"));
            }
            catch
            {
                mmm.LastSelectedPlanYear = DateTime.Now.Year;
            }

            try
            {
                mmm.LastSelectedCountryId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_CountryId"));
            }
            catch
            {
                mmm.LastSelectedCountryId = 5; // US
            }
                        
            mmm.LastWindowWidth = 1024;            
            mmm.LastWindowHeight = 800;    

            try
            {
                mmm.LastQuarter = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_BroadcastQuarterNbr"));
            }
            catch
            {
                mmm.LastQuarter = 1;
            }
            //try
            //{
            //    int Month = DateTime.Now.Month;
            //    mmm.LastQuarter = (Month / 3) + 2;
            //    if (mmm.LastQuarter > 3)
            //    {
            //        mmm.LastQuarter = 1;
            //        mmm.LastSelectedPlanYear = DateTime.Now.Year + 1;
            //    }
            //    else
            //    {
            //        mmm.LastSelectedPlanYear = DateTime.Now.Year;
            //    }
            //    mmm.LastSelectedCountryId = 5; // US
            //    mmm.LastWindowWidth = 1024;
            //    mmm.LastWindowHeight = 800;

            //    int ActiveProposalId = ProposalId;
            //    if (ActiveProposalId == 0)
            //    {
            //        ActiveProposalId = _userRepository.GetLastProposalId(LoggedOnUser.UserId);
            //    }
            //    if (ActiveProposalId > 0)
            //    {
            //        SchedulePermissions sp = _proposalRepository.GetProposalById(LoggedOnUser.UserId, ActiveProposalId);
            //        if (sp.ScheduleId > 0)
            //        {
            //            mmm.LastQuarter = sp.BroadcastQuarterNbr;
            //            mmm.LastSelectedClientId = sp.ClientId;
            //            mmm.LastSelectedNetworkId = sp.NetworkId;
            //            if (sp.PlanYrType == "B" && sp.BroadcastQuarterNbr == 1)
            //            {
            //                mmm.LastSelectedPlanYear = sp.PlanYr + 1;
            //            }
            //            else
            //            {
            //                mmm.LastSelectedPlanYear = sp.PlanYr;
            //            }
            //            mmm.LastSelectedCountryId = sp.CountryId;
            //        }
            //        else
            //        {
            //            mmm.LastQuarter = 1;
            //            mmm.LastSelectedClientId = 1;
            //            mmm.LastSelectedNetworkId = 1;
            //            mmm.LastSelectedPlanYear = DateTime.Now.Year + 1;
            //            mmm.LastSelectedCountryId = 5;
            //        }
            //        mmm.LastWindowWidth = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowWidth"));
            //        mmm.LastWindowHeight = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowHeight"));
            //    }
            //}
            //catch
            //{
            //}

            return View(mmm);
        }

        [HttpGet]
        [SessionExpireRawFileDownloadFilter]
        public IActionResult ExportRawProposals(int ClientId, string QuarterName, int NetworkId, string SourceFileName, int CountryId, string clientName, string NetworkName)
        {
            try
            {
                if (HttpContext.Session.GetString("AccountName") == null || HttpContext.Session.GetString("AccountName") == "")
                {
                    return new RedirectResult("~/StatusCode/408");
                }
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                string LoggedOnUserId = HttpContext.Session.GetString("UserId");
                //List<ProposalsRawFileExportModel> exportModel = new List<ProposalsRawFileExportModel>();
                IEnumerable<ProposalsRawFileExportModel> exportModel = Enumerable.Empty<ProposalsRawFileExportModel>();
                //duf.LoggedOnUser = LoggedOnUser;
                exportModel = _proposalRepository.ExportRawProposalsFile(ClientId, QuarterName, NetworkId, SourceFileName, CountryId, Convert.ToInt32(LoggedOnUserId));                
                byte[] filecontent = ExcelExportHelper.ExportExcelRawProposals(exportModel);               
                return File(filecontent, ExcelExportHelper.ExcelContentType, "DealSummary_" + clientName + "_" + NetworkName + "_" + QuarterName.Substring(2) + "/" + QuarterName.Substring(0, 2) + "_" + System.DateTime.Now.ToString("MMddyyyHHmmsstt") + ".xlsx");
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult SaveCancellationPolicy(int NetworkId, int PlanYr, string DR, string CancelLine1, string CancelLine2, string CancelLine3, string CancelLine4, string CancelLine5)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            try
            {
                bool bReturn = _dealpointRepository.SetDealpoint(LoggedOnUser.UserId, NetworkId, PlanYr, DR, CancelLine1, CancelLine2, CancelLine3, CancelLine4, CancelLine5);
                if (bReturn == true)
                {
                    return Json(new { success = true, responseText = "Saved Successfully" });
                }
                else
                {
                    return Json(new { success = false, responseText = "Error occured.  Changes were not saved." });
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString() + ";" + LoggedOnUser.DisplayName + ";" + exc.Message + ";" });
            }

        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult LoadCancellationPolicy(int NetworkId, int PlanYr, string DR)
        {
            try
            {
                Dealpoint dp = _dealpointRepository.GetDealpoint(NetworkId, PlanYr, DR);
                if (dp != null)
                {
                    return Json(new { success = true, responseText = "Saved Successfully"
                        , cancelline1 = dp.BillboardAddedValue
                        , cancelline2 = dp.UpfrontSponsorship
                        , cancelline3 = dp.UpfrontCancellation
                        , cancelline4 = dp.ScatterCancellation
                        , cancelline5 = dp.NetworkSeparationPolicy

                    });
                }
                else
                {
                    return Json(new { success = true, responseText = "Saved Successfully"
                        , cancelline1 = ""
                        , cancelline2 = ""
                        , cancelline3 = ""
                        , cancelline4 = ""
                        , cancelline5 = ""
                    });
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }

        }


        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddNote(string Note, int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int UpfrontNoteId = _upfrontRepository.AddNote(LoggedOnUser.UserId, UpfrontId, Note);
                if (UpfrontNoteId > 0)
                {
                    return Json(new { success = true,
                        responseText = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString() + ";" + LoggedOnUser.DisplayName + ";" + Note + ";",
                        CreateDt = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString(),
                        DisplayName = LoggedOnUser.DisplayName,
                        NewNote = Note,
                        myUpfrontNoteId = UpfrontNoteId

                    });
                }
                else
                {
                    throw new Exception("Unable to save note.");
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddProposalNote(string Note, int ProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int UpfrontNoteId = _proposalRepository.AddNote(LoggedOnUser.UserId, ProposalId, Note);
                if (UpfrontNoteId > 0)
                {
                    return Json(new
                    {
                        success = true,
                        responseText = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString() + ";" + LoggedOnUser.DisplayName + ";" + Note + ";",
                        CreateDt = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString(),
                        DisplayName = LoggedOnUser.DisplayName,
                        NewNote = Note,
                        myUpfrontNoteId = UpfrontNoteId

                    });
                }
                else
                {
                    throw new Exception("Unable to save note.");
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddSubNote(int UpfrontParentNoteId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (_upfrontRepository.AddSubNote(LoggedOnUser.UserId, UpfrontParentNoteId, Note) == true)
                {
                    return Json(new
                    {
                        success = true,
                        responseText = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString() + ";" + LoggedOnUser.DisplayName + ";" + Note + ";",
                        CreateDt = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString(),
                        DisplayName = LoggedOnUser.DisplayName,
                        NewNote = Note

                    });
                }
                else
                {
                    throw new Exception("Unable to save note.");
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddProposalSubNote(int ProposalParentNoteId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (_proposalRepository.AddSubNote(LoggedOnUser.UserId, ProposalParentNoteId, Note) == true)
                {
                    return Json(new
                    {
                        success = true,
                        responseText = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString() + ";" + LoggedOnUser.DisplayName + ";" + Note + ";",
                        CreateDt = DateTime.Now.ToShortDateString() + " " + DateTime.Now.ToShortTimeString(),
                        DisplayName = LoggedOnUser.DisplayName,
                        NewNote = Note

                    });
                }
                else
                {
                    throw new Exception("Unable to save note.");
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult UnlockUpfront(int UpfrontId)
        {
            try
            {
                if (Convert.ToString(TempData["UnlockUpfront"]) == "0")
                {
                    return Json(new { sucess = false, responseText = "" });
                }
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (_upfrontRepository.UnlockUpfront(LoggedOnUser.UserId, UpfrontId) == true)
                {
                    return Json(new { success = true, responseText = "Successfully unlocked upfront." });

                }
                else
                {
                    return Json(new { success = false, responseText = "Error unlocking upfront" });

                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }


        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetNetworkByCountryId(int countryid)
        {
            List<Network> objNetwork = new List<Network>();
            Country country = _networkRepository.GetCountry(countryid);
            objNetwork = _networkRepository.GetAllNetworks().Where(m => m.Country.CountryId == countryid).ToList();
            SelectList obgNetwork = new SelectList(objNetwork, "NetworkId", "StdNetName", 0);
            return Json(obgNetwork);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetClientsByCountryId(int countryid)
        {
            List<Client> objClient = new List<Client>();
            Country country = _networkRepository.GetCountry(countryid);
            objClient = _networkRepository.GetAllClients().Where(m => m.Country.CountryId == countryid && m.Active == true).ToList();
            SelectList obgClient = new SelectList(objClient, "ClientId", "ClientName", 0);
            return Json(obgClient);
        }

        [SessionExpireFilter]
        public IActionResult Logs()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Logs");
            LogsViewModel logsViewModel = new LogsViewModel();            
            ManageMediaViewModel mmm = new ManageMediaViewModel();
            mmm.LoggedOnUser = LoggedOnUser;
            mmm.Countries = _networkRepository.GetAllCountries();
            mmm.UpfrontLockedCount = _upfrontRepository.GetUpfrontLockCount();
            mmm.RemnantLockedCount = _remnantRepository.GetRemnantLockCount();
            mmm.ScheduleLockedCount = _scheduleRepository.GetScheduleLockCount();
            mmm.ProposalLockedCount = _proposalRepository.GetProposalLockCount();
            mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);
            /* Set which media type is currently using this page */
            if (HttpContext.Request.Path.HasValue == true)
            {
                if (HttpContext.Request.Path.Value.IndexOf("Index") >= 0)
                {
                    mmm.CurrentMediaSelection = 1;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Remnants") >= 0)
                {
                    mmm.CurrentMediaSelection = 2;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Schedule") >= 0)
                {
                    mmm.CurrentMediaSelection = 3;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Proposal") >= 0)
                {
                    mmm.CurrentMediaSelection = 4;
                }
                else if (HttpContext.Request.Path.Value.IndexOf("Logs") >= 0)
                {
                    mmm.CurrentMediaSelection = 5;
                }
                else
                {
                    mmm.CurrentMediaSelection = 1;
                }
            }

            try
            {
                mmm.LastSelectedClientId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_ClientId"));
            }
            catch { }

            //try
            //{
            //    mmm.LastSelectedNetworkId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_NetworkId"));
            //}
            //catch { }

            try
            {
                mmm.LastSelectedPlanYear = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_PlanYear"));
            }
            catch
            {
                mmm.LastSelectedPlanYear = DateTime.Now.Year;
            }

            try
            {
                mmm.LastSelectedCountryId = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_CountryId"));
            }
            catch
            {
                mmm.LastSelectedCountryId = 5; // US
            }


            //try
            //{
            //    mmm.LastWindowHeight = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ManageMedia_WindowHeight"));
            //}
            //catch
            //{
            //    mmm.LastWindowHeight = 800;
            //}
            try
            {
                mmm.LastQuarter = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "ScheduleProposalLog_BroadcastQuarterNbr"));
            }
            catch
            {
                mmm.LastQuarter = 1;
            }
            logsViewModel.manageMediaViewModel = mmm;
            var PreAndPostLogWeeks  = _prelogRepository.GetPreAndPostLogWeeks(mmm.LastSelectedPlanYear, mmm.LastQuarter, mmm.LastSelectedClientId, LoggedOnUser.UserId);
            logsViewModel.SchedID = PreAndPostLogWeeks.SchedID;
            logsViewModel.prelogs = PreAndPostLogWeeks.prelogWeeks;
            logsViewModel.postlogs = PreAndPostLogWeeks.postlogWeeks;

            return View(logsViewModel);
        }

        [SessionExpireFilter]
        public PartialViewResult LogsTab_Change(int Year, int BroadcastQuarterNbr, int ClientId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            LogsViewModel logsViewModel = new LogsViewModel();
            var PreAndPostLogWeeks = _prelogRepository.GetPreAndPostLogWeeks(Year, BroadcastQuarterNbr, ClientId, LoggedOnUser.UserId);
            logsViewModel.SchedID = PreAndPostLogWeeks.SchedID;
            logsViewModel.prelogs = PreAndPostLogWeeks.prelogWeeks;
            logsViewModel.postlogs = PreAndPostLogWeeks.postlogWeeks;
            ManageMediaViewModel obj = new ManageMediaViewModel();
            obj.LoggedOnUser = LoggedOnUser;
            logsViewModel.manageMediaViewModel = obj;
            return PartialView("../Logs/_LogsWeeks", logsViewModel);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetNetworksForDemo(int countryid, string quartername, int clientid, int DemographicSettingsId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<Network> objNetworks = _networkRepository.GetNetworksForCreate(countryid, quartername, clientid, DemographicSettingsId, LoggedOnUser.UserId);
                return Json(new
                {
                    recordsTotal = objNetworks.Count(),
                    recordsFiltered = objNetworks.Count(),
                    data = objNetworks,
                    success = true,
                    responseText = "Successfully retrieved networks.",
                    responseCode = 0
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = 0
                });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetPropertiesForNetwork(string networkids, string quartername, int clientid, int DemographicSettingsId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<Rate> objProperties = _proposalRepository.GetPropertiesForCreate(networkids, quartername, clientid, DemographicSettingsId, LoggedOnUser.UserId).ToList();
                return Json(new
                {
                    recordsTotal = objProperties.Count(),
                    recordsFiltered = objProperties.Count(),
                    data = objProperties.Where(x => x.DoNotBuyType.Description != "DO NOT BUY"),
                    success = true,
                    responseText = "Successfully retrieved properties.",
                    responseCode = 0
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = 0
                });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetDemoByClientQuarter(int countryid, string quartername, int clientid)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettings> objDemo = _demographicSettingsRepository.GetClientQuarter(countryid, quartername, clientid, LoggedOnUser.UserId).OrderBy(o => o.DemoName).ToList();
                SelectList obgDemo = new SelectList(objDemo, "DemographicSettingsId", "DemoName", 0);
                return Json(obgDemo);
            }
            catch
            {
                return Json(new SelectList(Enumerable.Empty<SelectListItem>()));

            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetDemoByProposal(int scheduleid)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettings> objDemo = _demographicSettingsRepository.GetDemosByProposalId(scheduleid, LoggedOnUser.UserId);
                SelectList obgDemo = new SelectList(objDemo, "DemographicSettingsId", "DemoName", 0);
                return Json(obgDemo);
            }
            catch
            {
                return Json(new SelectList(Enumerable.Empty<SelectListItem>()));

            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetProposalVersion(int scheduleid)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int Version = _proposalRepository.GetProposalVersion(scheduleid, LoggedOnUser.UserId);
                return Json(new
                {
                    success = true,
                    responseText = "",
                    responseCode = 0,
                    data = Version
                });

            }
            catch
            {
                return Json(new SelectList(Enumerable.Empty<SelectListItem>()));

            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetNetworksForDemoProposal(int DemographicSettingsId, int ProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<Network> objNetworks = _networkRepository.GetNetworksForDemoProposal(DemographicSettingsId, ProposalId, LoggedOnUser.UserId);
                return Json(new
                {
                    recordsTotal = objNetworks.Count(),
                    recordsFiltered = objNetworks.Count(),
                    data = objNetworks,
                    success = true,
                    responseText = "Successfully retrieved networks.",
                    responseCode = 0
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = 0
                });
            }
        }

    }
}
