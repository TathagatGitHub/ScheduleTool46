using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using NuGet.Protocol;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace OM_ScheduleTool.Controllers
{
    public class ScheduleProposalController : Controller
    {
        private IAppFeatureRepository _appFeatureRepository;
        private IConfiguration _config;
        private IClientRepository _clientRepository;
        private IDealpointRepository _dealpointRepository;
        private IDemographicSettingsRepository _demoRepository;
        private INetworkRepository _networkRepository;
        private IScheduleRepository _scheduleRepository;
        private IPropertyRepository _propertyRepository;
        private IProposalRepository _proposalRepository;
        private IUserRepository _userRepository;
        private IGeneralRepository _generalRepository;

        public ScheduleProposalController(
            IAppFeatureRepository appFeatureRepository
            , IConfiguration config
            , IClientRepository clientRepository
            , IDealpointRepository dealPointRepository
            , IDemographicSettingsRepository demoRepository
            , INetworkRepository networkRepository
            , IScheduleRepository scheduleRepository
            , IPropertyRepository propertyRepository
            , IProposalRepository proposalRepository
            , IUserRepository userRepository
            , IGeneralRepository generalRepository

        )
        {
            _appFeatureRepository = appFeatureRepository;
            _config = config;
            _userRepository = userRepository;
            _clientRepository = clientRepository;
            _demoRepository = demoRepository;
            _networkRepository = networkRepository;
            _scheduleRepository = scheduleRepository;
            _propertyRepository = propertyRepository;
            _proposalRepository = proposalRepository;
            _dealpointRepository = dealPointRepository;
            _generalRepository = generalRepository;
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ViewSP(int id)
        {
            try
            {
                return View(GetScheduleProposalViewModel(id, true));
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        private ScheduleProposalViewModel GetScheduleProposalViewModel(int ScheduleId, bool ViewOnly)
        {

            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ScheduleProposalViewModel spvm = new ScheduleProposalViewModel();

            spvm.LoggedOnUser = LoggedOnUser;
            //spvm.MainInfo = _scheduleRepository.GetScheduleById(LoggedOnUser.UserId, ScheduleId);
            //spvm.Quarter = _propertyRepository.GetQuarter(spvm.Info.QtrName);
            //spvm.ClientInfo = _clientRepository.GetClient(spvm.Info.ClientId);
            //spvm.ProposalLines = _proposalRepository.GetProposalLinesFlat(LoggedOnUser.UserId, ProposalId);
            //spvm.ClientWeeklyCommissionRates = _proposalRepository.GetClientQuarterWeeklyCommissionRates(LoggedOnUser.UserId, spvm.ClientInfo.ClientId, spvm.ProposalQuarter.QuarterId);
            /*
            spvm.UserFeaturePermissionInfo = _appFeatureRepository.GetUserFeaturePermissions(LoggedOnUser.UserId, null);
            spvm.ProposalNotes = _proposalRepository.GetScheduleProposalNotes(LoggedOnUser.UserId, ProposalId).ToList();
            spvm.Networks = _networkRepository.GetAllNetworks();
            spvm.DemographicSettings = _propertyRepository.GetDemoNames(spvm.ProposalInfo.CountryId);
            */

            /* OLD CODE
            foreach (ScheduleLine pl in spvm.ProposalLines)
            {
                spvm.Wk01_TotalSpots += pl.Wk01_Spots;
                spvm.Wk02_TotalSpots += pl.Wk02_Spots;
                spvm.Wk03_TotalSpots += pl.Wk03_Spots;
                spvm.Wk04_TotalSpots += pl.Wk04_Spots;
                spvm.Wk05_TotalSpots += pl.Wk05_Spots;
                spvm.Wk06_TotalSpots += pl.Wk06_Spots;
                spvm.Wk07_TotalSpots += pl.Wk07_Spots;
                spvm.Wk08_TotalSpots += pl.Wk08_Spots;
                spvm.Wk09_TotalSpots += pl.Wk09_Spots;
                spvm.Wk10_TotalSpots += pl.Wk10_Spots;
                spvm.Wk11_TotalSpots += pl.Wk11_Spots;
                spvm.Wk12_TotalSpots += pl.Wk12_Spots;
                spvm.Wk13_TotalSpots += pl.Wk13_Spots;
                spvm.Wk14_TotalSpots += pl.Wk14_Spots;

                spvm.Wk01_GrossDollars += (pl.Wk01_Spots * pl.Rate.RateAmt);
                spvm.Wk02_GrossDollars += (pl.Wk02_Spots * pl.Rate.RateAmt);
                spvm.Wk03_GrossDollars += (pl.Wk03_Spots * pl.Rate.RateAmt);
                spvm.Wk04_GrossDollars += (pl.Wk04_Spots * pl.Rate.RateAmt);
                spvm.Wk05_GrossDollars += (pl.Wk05_Spots * pl.Rate.RateAmt);
                spvm.Wk06_GrossDollars += (pl.Wk06_Spots * pl.Rate.RateAmt);
                spvm.Wk07_GrossDollars += (pl.Wk07_Spots * pl.Rate.RateAmt);
                spvm.Wk08_GrossDollars += (pl.Wk08_Spots * pl.Rate.RateAmt);
                spvm.Wk09_GrossDollars += (pl.Wk09_Spots * pl.Rate.RateAmt);
                spvm.Wk10_GrossDollars += (pl.Wk10_Spots * pl.Rate.RateAmt);
                spvm.Wk11_GrossDollars += (pl.Wk11_Spots * pl.Rate.RateAmt);
                spvm.Wk12_GrossDollars += (pl.Wk12_Spots * pl.Rate.RateAmt);
                spvm.Wk13_GrossDollars += (pl.Wk13_Spots * pl.Rate.RateAmt);
                spvm.Wk14_GrossDollars += (pl.Wk14_Spots * pl.Rate.RateAmt);

                spvm.Wk01_GrossImpressions += (pl.Wk01_Spots * pl.Rate.Impressions);
                spvm.Wk02_GrossImpressions += (pl.Wk02_Spots * pl.Rate.Impressions);
                spvm.Wk03_GrossImpressions += (pl.Wk03_Spots * pl.Rate.Impressions);
                spvm.Wk04_GrossImpressions += (pl.Wk04_Spots * pl.Rate.Impressions);
                spvm.Wk05_GrossImpressions += (pl.Wk05_Spots * pl.Rate.Impressions);
                spvm.Wk06_GrossImpressions += (pl.Wk06_Spots * pl.Rate.Impressions);
                spvm.Wk07_GrossImpressions += (pl.Wk07_Spots * pl.Rate.Impressions);
                spvm.Wk08_GrossImpressions += (pl.Wk08_Spots * pl.Rate.Impressions);
                spvm.Wk09_GrossImpressions += (pl.Wk09_Spots * pl.Rate.Impressions);
                spvm.Wk10_GrossImpressions += (pl.Wk10_Spots * pl.Rate.Impressions);
                spvm.Wk11_GrossImpressions += (pl.Wk11_Spots * pl.Rate.Impressions);
                spvm.Wk12_GrossImpressions += (pl.Wk12_Spots * pl.Rate.Impressions);
                spvm.Wk13_GrossImpressions += (pl.Wk13_Spots * pl.Rate.Impressions);
                spvm.Wk14_GrossImpressions += (pl.Wk14_Spots * pl.Rate.Impressions);

                spvm.Wk01_ClientDollars += (pl.Wk01_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk02_ClientDollars += (pl.Wk02_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk03_ClientDollars += (pl.Wk03_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk04_ClientDollars += (pl.Wk04_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk05_ClientDollars += (pl.Wk05_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk06_ClientDollars += (pl.Wk06_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk07_ClientDollars += (pl.Wk07_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk08_ClientDollars += (pl.Wk08_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk09_ClientDollars += (pl.Wk09_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk10_ClientDollars += (pl.Wk10_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk11_ClientDollars += (pl.Wk11_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk12_ClientDollars += (pl.Wk12_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk13_ClientDollars += (pl.Wk13_Spots * (pl.Rate.RateAmt * (decimal)0.85));
                spvm.Wk14_ClientDollars += (pl.Wk14_Spots * (pl.Rate.RateAmt * (decimal)0.85));

                spvm.Wk01_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk01_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk02_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk02_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk03_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk03_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk04_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk04_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk05_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk05_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk06_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk06_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk07_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk07_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk08_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk08_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk09_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk09_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk10_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk10_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk11_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk11_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk12_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk12_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk13_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk13_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
                spvm.Wk14_GRP += (pl.Rate.DemographicSettingsPerQtr.Universe <= 0 ? 0 : spvm.Wk14_GrossImpressions / ((decimal).1 * pl.Rate.DemographicSettingsPerQtr.Universe));
            }

            spvm.Wk01_GrossCPM = (spvm.Wk01_GrossImpressions <= 0 ? 0 : spvm.Wk01_GrossDollars / spvm.Wk01_GrossImpressions);
            spvm.Wk02_GrossCPM = (spvm.Wk02_GrossImpressions <= 0 ? 0 : spvm.Wk02_GrossDollars / spvm.Wk02_GrossImpressions);
            spvm.Wk03_GrossCPM = (spvm.Wk03_GrossImpressions <= 0 ? 0 : spvm.Wk03_GrossDollars / spvm.Wk03_GrossImpressions);
            spvm.Wk04_GrossCPM = (spvm.Wk04_GrossImpressions <= 0 ? 0 : spvm.Wk04_GrossDollars / spvm.Wk04_GrossImpressions);
            spvm.Wk05_GrossCPM = (spvm.Wk05_GrossImpressions <= 0 ? 0 : spvm.Wk05_GrossDollars / spvm.Wk05_GrossImpressions);
            spvm.Wk06_GrossCPM = (spvm.Wk06_GrossImpressions <= 0 ? 0 : spvm.Wk06_GrossDollars / spvm.Wk06_GrossImpressions);
            spvm.Wk07_GrossCPM = (spvm.Wk07_GrossImpressions <= 0 ? 0 : spvm.Wk07_GrossDollars / spvm.Wk07_GrossImpressions);
            spvm.Wk08_GrossCPM = (spvm.Wk08_GrossImpressions <= 0 ? 0 : spvm.Wk08_GrossDollars / spvm.Wk08_GrossImpressions);
            spvm.Wk09_GrossCPM = (spvm.Wk09_GrossImpressions <= 0 ? 0 : spvm.Wk09_GrossDollars / spvm.Wk09_GrossImpressions);
            spvm.Wk10_GrossCPM = (spvm.Wk10_GrossImpressions <= 0 ? 0 : spvm.Wk10_GrossDollars / spvm.Wk10_GrossImpressions);
            spvm.Wk11_GrossCPM = (spvm.Wk11_GrossImpressions <= 0 ? 0 : spvm.Wk11_GrossDollars / spvm.Wk11_GrossImpressions);
            spvm.Wk12_GrossCPM = (spvm.Wk12_GrossImpressions <= 0 ? 0 : spvm.Wk12_GrossDollars / spvm.Wk12_GrossImpressions);
            spvm.Wk13_GrossCPM = (spvm.Wk13_GrossImpressions <= 0 ? 0 : spvm.Wk13_GrossDollars / spvm.Wk13_GrossImpressions);
            spvm.Wk14_GrossCPM = (spvm.Wk14_GrossImpressions <= 0 ? 0 : spvm.Wk14_GrossDollars / spvm.Wk14_GrossImpressions);
            */

            //spvm.ClientCommissionRates = _proposalRepository.GetClientQuarterCommissionRates(LoggedOnUser.UserId, spvm.Info.ClientId, spvm.Quarter.QuarterId);

            // OLD CODE
            //spvm.ClientExchangeRate = _proposalRepository.GetClientExchangeRate(LoggedOnUser.UserId, spvm.ProposalInfo.ClientId, spvm.ProposalQuarter.QuarterId);
            //if (DiscountPrice == -1)
            //{
            //    spvm.DiscountPrice = spvm.ClientCommissionRates.FirstOrDefault<float>();
            //}
            //else
            //{
            //    spvm.DiscountPrice = DiscountPrice;
            //}
            //int DemoCount = spvm.ProposalLines.GroupBy(d => d.DemoName).Count();
            //if (DemoCount == 1)
            //{
            //    spvm.UniqueDemo = true;
            //}
            //else
            //{
            //    spvm.UniqueDemo = false;
            //}

            return spvm;
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetScheduleByClient(int ClientId, int BroadcastYr)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            IEnumerable<SchedulePermissions> schedule = _scheduleRepository.GetScheduleByClient(LoggedOnUser.UserId, ClientId, BroadcastYr);
            return Json(schedule);
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetProposalByClient(int ClientId, int BroadcastYr)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            IEnumerable<Schedule> schedule = _proposalRepository.GetProposalByClient(LoggedOnUser.UserId, ClientId, BroadcastYr);
            return Json(schedule);
        }

        [SessionExpireChildFilter]
        public ActionResult GetChangeCount(int ScheduleId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _scheduleRepository.GetChangedCount(LoggedOnUser.UserId, ScheduleId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText,
                    changeCount = (em.Success == true ? em.ResponseCode : 0)
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult IsLineInUse(int ScheduleLineId)
        {
            try
            {
                //User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _proposalRepository.IsInUse(ScheduleLineId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText,
                    inUse = em.ResponseCode
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                    inUse = true
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult DeleteLine(int ScheduleLineId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _proposalRepository.DeleteLine(LoggedOnUser.UserId, ScheduleLineId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                    inUse = true
                });
            }
        }


        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetUpfrontExpansionInfo(int ScheduleProposalId, string NetworkNames, string BuyTypeCodes, bool CalcExch)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            SPUpfrontExpansionInfo spue = _proposalRepository.GetUpfrontExpansionInfo(LoggedOnUser.UserId, ScheduleProposalId, NetworkNames, BuyTypeCodes, CalcExch);
            if (spue == null)
            {
                return Json(new { success = false, responseText = "UE Information not found" });
            }
            else
            {
                return Json(new
                {
                    success = spue.ErrorMessage.Success,
                    responseCode = spue.ErrorMessage.ResponseCode,
                    responseText = spue.ErrorMessage.ResponseText,
                    availableUE = spue.AvailableUE,
                    bookedUE = spue.BookedUE,
                    staticAvailableUE = spue.StaticAvailableUE,
                    staticBookedUE = spue.StaticBookedUE,
                    ueCount = spue.UECount,
                    billingType = spue.BillingType,
                    networkCount = spue.NetworkCount,
                    errorDescription = spue.ErrorDescription,

                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult LockSchedule(int ScheduleId)
        {
            try
            {                
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                string Status = _scheduleRepository.LockSchedule(LoggedOnUser.UserId, ScheduleId);
                if (Status == "")
                {
                    return Json(new { success = true, responseText = "Successfully locked schedule." });

                }
                else
                {
                    return Json(new { success = false, responseText = Status });
                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult LockProposal(int ProposalId)
        {
            try
            {                
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                string LoggedOnUserId = HttpContext.Session.GetString("UserId");//ST-724
                bool PremiereFilter = !string.IsNullOrEmpty(HttpContext.Session.GetString("PremiereFilter")) ? Convert.ToBoolean(HttpContext.Session.GetString("PremiereFilter")) : false;//ST-807
                string session = HttpContext.Session.GetString("partialLockingObject");
                string Status = "";
                if (session != null)
                {
                   ProposalNetworkModel ObjProposal1 = JsonSerializer.Deserialize<ProposalNetworkModel>(HttpContext.Session.GetString("partialLockingObject"));
                   InsertProposalLockDetail(ObjProposal1);
                }
                else
                {
                    List<ProposalNetworkModel> lstLockedNetworks = _proposalRepository.GetNetworkListForSchedule(0, ProposalId, Convert.ToInt32(LoggedOnUserId));
                    if (lstLockedNetworks.Where(x => x.LockedByUserId > 0).Count() == 0)
                    {
                        Status = _proposalRepository.LockProposalWithNetwork(LoggedOnUser.UserId, ProposalId, "", true, PremiereFilter);
                    }                     
                }           
               
                if (Status == "")
                {
                    return Json(new { success = true, responseText = "Successfully locked proposal." });

                }
                else
                {
                    return Json(new { success = false, responseText = Status });
                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult FullyLockProposal(int ProposalId,int ClientId)//ST-724 20230926 Added Client Id in fully locked function
        {            
            try
            {
                string LoggedOnUserId = HttpContext.Session.GetString("UserId");
                HttpContext.Session.Remove("partialLockingObject");
                List<ProposalNetworkModel> lstNetworks = _proposalRepository.GetNetworkListForSchedule(ClientId, ProposalId, Convert.ToInt32(LoggedOnUserId));
                string Status = "";
                if (lstNetworks.Where(x => x.LockedByUserId > 0).Count() > 0)
                {                    
                    string[] DistinctLockedUsers = lstNetworks.Where(x => !string.IsNullOrEmpty(x.LockedByUserName) == true).Select(name => name.LockedByUserName.Replace("(locked by ", "").Replace(")", "")).Distinct().OrderBy(name => name).ToArray();
                    Status = "Proposal is partially locked by : " + string.Join(",", DistinctLockedUsers);
                    return Json(new Value { success = false, responseText = Status});
                }
                else
                {
                    var json = LockProposal(ProposalId).ToJson();
                    JsonResponse deserializedResponse = JsonSerializer.Deserialize<JsonResponse>(json);                   
                    return Json(new Value { success = deserializedResponse.Value.success, responseText = deserializedResponse.Value.responseText});
                }
                return null; 
            }
            catch (Exception ex)
            {
                return Json(new Value { success = false, responseText = ex.Message });
            }            
        }

        [SessionExpireChildFilter]
        public IActionResult DisplaySchedules()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DisplaySchedulesViewModel duf = new DisplaySchedulesViewModel();
            duf.LoggedOnUser = LoggedOnUser;
            duf.Schedules = _scheduleRepository.GetSchedules(LoggedOnUser.UserId);
            return View(duf);
        }

        [SessionExpireChildFilter]
        public IActionResult DisplayProposals()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DisplaySchedulesViewModel duf = new DisplaySchedulesViewModel();
            duf.LoggedOnUser = LoggedOnUser;
            duf.Schedules = _proposalRepository.GetProposals(LoggedOnUser.UserId);
            return View(duf);
        }

        [HttpGet]
        public ActionResult ExportSchedulesExcel(int ClientId, int NetworkId, string DateFrom, string DateTo)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DisplaySchedulesViewModel duf = new DisplaySchedulesViewModel();
            duf.LoggedOnUser = LoggedOnUser;
            duf.Schedules = _scheduleRepository.GetSchedules(LoggedOnUser.UserId);

            byte[] filecontent = ExcelExportHelper.ExportExcel(duf);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "OM_UpfrontsList.xlsx");
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ViewSchedule(int ScheduleId)
        {
            return ViewProposal(ScheduleId);

        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ViewProposal(int ProposalId)
        {
            var model = this.GetViewProposalViewModel(ProposalId, -1);
            return View(model);
        }

        private ProposalViewModel GetViewProposalViewModel(int ProposalId, double DiscountRate)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ProposalViewModel spvm = new ProposalViewModel();
            spvm.LoggedOnUser = LoggedOnUser;
            spvm.ProposalInfo = _proposalRepository.GetProposalById(LoggedOnUser.UserId, ProposalId);
            if (spvm.ProposalInfo.ScheduleTypeId == 1)
            {
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Proposal?ProposalId=" + ProposalId.ToString());
            }
            else
            {
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Schedule?ScheduleId=" + ProposalId.ToString());
                spvm.SchedWeekLock = _scheduleRepository.GetSchedWeekLockStatus(ProposalId);
            }
            spvm.ProposalQuarter = _propertyRepository.GetQuarter(spvm.ProposalInfo.QtrName);
            spvm.ClientInfo = _clientRepository.GetClient(spvm.ProposalInfo.ClientId);
            //spvm.ProposalLines = _proposalRepository.GetProposalLinesFlat(LoggedOnUser.UserId, ProposalId);
            //spvm.ClientWeeklyCommissionRates = _proposalRepository.GetClientQuarterWeeklyCommissionRates(LoggedOnUser.UserId, spvm.ClientInfo.ClientId, spvm.ProposalQuarter.QuarterId);
            spvm.ClientWeeklyExchangeRate = _proposalRepository.GetClientQuarterWeeklyExchangeRates(LoggedOnUser.UserId, spvm.ClientInfo.ClientId, spvm.ProposalQuarter.QuarterId);
            spvm.UserFeaturePermissionInfo = _appFeatureRepository.GetUserFeaturePermissions(LoggedOnUser.UserId, null);
            spvm.ProposalNotes = _proposalRepository.GetScheduleProposalNotes(LoggedOnUser.UserId, ProposalId).ToList();
            spvm.Networks = _proposalRepository.GetNetworks(spvm.ProposalInfo.ClientId, spvm.ProposalQuarter.QuarterId, spvm.ProposalInfo.CountryId, ProposalId, LoggedOnUser.UserId);
            spvm.DemographicSettings = _propertyRepository.GetDemoNames(spvm.ProposalInfo.CountryId);

            spvm.ProposalAllNetworks = _proposalRepository.GetProposalAllNetworks(ProposalId, LoggedOnUser.UserId);
            spvm.NetworksAvailable = spvm.ProposalAllNetworks.Where(x => (x.ApprvUnits == true && x.UnApprvUnits == false) || x.ScheduledUnits == true).Select(p => new Network { NetworkId = p.NetworkId, StdNetName = p.StdNetName });
            spvm.NetworksNeedAttention = spvm.ProposalAllNetworks.Where(x => x.UnApprvUnits == true).Select(p => new Network { NetworkId = p.NetworkId, StdNetName = p.StdNetName });
            spvm.NetworksNotAvailable = spvm.ProposalAllNetworks.Where(x => x.ApprvUnits == false && x.UnApprvUnits == false && x.ScheduledUnits == false).Select(p => new Network { NetworkId = p.NetworkId, StdNetName = p.StdNetName });

            //spvm.NetworksAvailable = _proposalRepository.GetNetworksAvailable(ProposalId, LoggedOnUser.UserId);
            //spvm.NetworksNeedAttention = _proposalRepository.GetNetworksNeedAttention(ProposalId, LoggedOnUser.UserId);
            //spvm.NetworksNotAvailable = _proposalRepository.GetNetworksNotAvailable(ProposalId, LoggedOnUser.UserId);

            spvm.ClientCommissionRates = _proposalRepository.GetClientQuarterCommissionRates(LoggedOnUser.UserId, spvm.ProposalInfo.ClientId, spvm.ProposalQuarter.QuarterId);
            spvm.ClientExchangeRate = _proposalRepository.GetClientExchangeRate(LoggedOnUser.UserId, spvm.ProposalInfo.ClientId, spvm.ProposalQuarter.QuarterId);
            //int DemoCount = spvm.ProposalLines.GroupBy(d => d.DemoName).Count();
            //if (DemoCount == 1)
            //{
            //    spvm.UniqueDemo = true;
            //}
            //else
            //{
            //    spvm.UniqueDemo = false;
            //}         
            if (spvm.ProposalInfo.ScheduleTypeId == 1)
            {
                spvm.ScheduleNetworkNotInProposal = _proposalRepository.GetScheduleNetworksNotInProposal(ProposalId, LoggedOnUser.UserId);
            }
            return spvm;
        }

        [HttpPost]
        public IActionResult _Proposal_DataTable(int ProposalId, float DiscountPrice)
        {
            var model = this.GetViewProposalViewModel(ProposalId, DiscountPrice);
            return PartialView("_Proposal_DataTable", model);
        }

        [HttpPost]
        public IActionResult _AddNewProperty_AvailableProperties(int ProposalId, float DiscountPrice)
        {
            var model = this.GetViewProposalViewModel(ProposalId, DiscountPrice);
            return PartialView("_AddNewProperty_AvailableProperties", model);
        }

        private ProposalViewModel GetEditProposalViewModel(int ProposalId, float DiscountPrice)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            // _proposalRepository.LockProposal(LoggedOnUser.UserId, ProposalId);
            return GetViewProposalViewModel(ProposalId, DiscountPrice);
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult EditProposal(int ProposalId)
        {
            //User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            bool PremiereFilter = !string.IsNullOrEmpty(HttpContext.Session.GetString("PremiereFilter")) ? Convert.ToBoolean(HttpContext.Session.GetString("PremiereFilter")) : false;//ST-807
            string Message = "";
            string session = HttpContext.Session.GetString("partialLockingObject");
            string Status = "";
            if (session != null)
            {
                ProposalNetworkModel ObjProposal1 = JsonSerializer.Deserialize<ProposalNetworkModel>(HttpContext.Session.GetString("partialLockingObject"));
                Message = InsertProposalLockDetail(ObjProposal1);
            }
            else
            {
                List<ProposalNetworkModel> lstLockedNetworks = _proposalRepository.GetNetworkListForSchedule(0, ProposalId, Convert.ToInt32(LoggedOnUserId));

                if (lstLockedNetworks.Where(x => x.LockedByUserId > 0).Count() == 0)
                    Message = _proposalRepository.LockProposalWithNetwork(Convert.ToInt32(LoggedOnUserId), ProposalId, "", true, PremiereFilter);
            }
                if (Message.Length > 0)
            {
                return RedirectToAction("500" + @"/This proposal is locked by another user.  Please try again later.", "StatusCode");
            }
            else
            {
                return View(this.GetEditProposalViewModel(ProposalId, -1));
            }
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult GrossIncome(int ProposalId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            return View(this.GetEditProposalViewModel(ProposalId, -1));
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ExhangeRates(int ProposalId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            return PartialView();
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult EditSchedule(int ScheduleId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            string Message = _scheduleRepository.LockSchedule(LoggedOnUser.UserId, ScheduleId);
            if (Message.Length > 0)
            {
                return RedirectToAction("500" + @"/This schedule is locked by another user.  Please try again later.", "StatusCode");
            }
            else
            {
                return EditProposal(ScheduleId);
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetProposalDataForDropdowns(int ProposalId, float DiscountRate, bool ViewOnly, int PageNum, int PageLength
            ,bool CalledForDropDown,bool FilterForEdit)//ST-724, Addedd CalledForDropDown,FilterForEdit parameters
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<ScheduleProposalLinesFlat> proposallines = _proposalRepository.GetProposalLinesFlat(
                        LoggedOnUser.UserId
                        , ProposalId
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , PageNum
                        , PageLength // int.Parse(Request.Form["length"].ToString())
                        , DiscountRate
                        , ViewOnly
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        , ""
                        //, ""
                        //, ""
                        //, ""
                        //, ""
                        //, ""
                        //, ""
                        //, ""
                        , "",
                        CalledForDropDown,
                        FilterForEdit,
                        false
                        )
                        .ToList();

                
                    return Json(new
                    {
                        recordsTotal = proposallines.Count,
                        recordsFiltered = "",
                        data = proposallines,
                        success = true,
                        responseText = "",
                        responseCode = 0
                    });
                              
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ScheduleProposalLinesFlat>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = 0
                });
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetProposalData(int ProposalId, float DiscountRate, bool ViewOnly, int PageNum, int PageLength, bool ShowTotals,bool IsPremiereFilter,
            string filterBuyTypes, string filterDemoNames, string filterNetworkName, bool CalcExch, bool GI, bool Schedule, bool ProposalReportTotals, bool isDRBT)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (Request.Form["action"] == "edit")
                {
                    /*
                    ErrorMessage em = _propertyRepository.UpdateProperty(LoggedOnUser.UserId, Request);
                    if (em.Success == false)
                    {
                        return Json(new
                        {
                            success = em.Success,
                            responseText = em.ResponseText,
                            responseCode = em.ResponseCode
                        });
                    */
                }

                // 05/21/2019 CSP   Refer to /Views/ScheduleProposal/_DataTable_Edit.cshtml to decode the chaos that is custom data tables to figure out 
                //                  the column numbering easily.
                int Sort = 0;
                string searchValue = Request.Form["search[value]"];

                string sortColumnDirection = Request.Form["order[0][dir]"];
                if (Request.Form["order[0][column]"].FirstOrDefault() != null)
                {
                    Sort = (int.Parse(Request.Form["order[0][column]"])) * (sortColumnDirection == "asc" ? 1 : -1);
                }

                string approvedDesc = "";
                try
                {
                    approvedDesc = Request.Form["columns[1][search][value]"];
                }
                catch { }

                string status = "";
                try
                {
                    status = Request.Form["columns[2][search][value]"];
                    if (status == null) status = "";
                }
                catch { }

                string revNo = "";
                try

                {
                    revNo = Request.Form["columns[29][search][value]"];
                    if (revNo == null) revNo = "";
                }
                catch { }

                string revisedDate = "";
                try
                {
                    revisedDate = Request.Form["columns[30][search][value]"];
                    if (revisedDate == null) revisedDate = "";

                    // Make sure they are all valid dates
                    string[] checkDates = revisedDate.Split('~');
                    foreach (string date in checkDates)
                    {
                        try
                        {
                            string dateToParse = date.Replace("\\", "");
                            DateTime res;
                            if (DateTime.TryParse(dateToParse, out res) == false)
                            {
                                revisedDate = revisedDate.Replace(date + ",", "");
                                revisedDate = revisedDate.Replace(date, "");
                            }
                        }
                        catch (Exception)
                        {
                        }
                    }
                }
                catch { }

                string demoName = "";
                try
                {
                    if (filterDemoNames != null)
                    {
                        demoName = filterDemoNames;
                    }
                    else
                    {
                        demoName = Request.Form["columns[6][search][value]"];
                        if (demoName == null) demoName = "";
                    }

                }
                catch { }

                string networkName = "";
                try
                {
                    if (filterNetworkName != null)
                    {
                        networkName = filterNetworkName;
                    }
                    else
                    {
                        networkName = Request.Form["columns[7][search][value]"];
                        if (networkName == null) networkName = "";
                    }

                }
                catch { }

                string propertyName = "";
                try
                {
                    propertyName = Request.Form["columns[8][search][value]"];
                    if (propertyName == null) propertyName = "";
                }
                catch { }

                string effDate = "";
                try
                {
                    effDate = Request.Form["columns[9][search][value]"];
                    if (effDate == null) revisedDate = "";

                    // Make sure they are all valid dates
                    if (effDate != null)
                    {

                        string[] checkDates = effDate.Split('~');
                        foreach (string date in checkDates)
                        {
                            try
                            {
                                string dateToParse = date.Replace("\\", "");
                                DateTime res;
                                if (DateTime.TryParse(dateToParse, out res) == false)
                                {
                                    effDate = effDate.Replace(date + ",", "");
                                    effDate = effDate.Replace(date, "");
                                }
                            }
                            catch (Exception)
                            {
                            }
                        }
                    }
                }
                catch { }

                string expDate = "";
                try
                {
                    expDate = Request.Form["columns[10][search][value]"];
                    if (expDate == null) expDate = "";

                    // Make sure they are all valid dates
                    string[] checkDates = expDate.Split('~');
                    foreach (string date in checkDates)
                    {
                        try
                        {
                            string dateToParse = date.Replace("\\", "");
                            DateTime res;
                            if (DateTime.TryParse(dateToParse, out res) == false)
                            {
                                expDate = expDate.Replace(date + ",", "");
                                expDate = expDate.Replace(date, "");
                            }
                        }
                        catch (Exception)
                        {
                        }
                    }
                }
                catch { }

                string DOW = "";
                try
                {
                    DOW = Request.Form["columns[11][search][value]"];
                    if (DOW == null) DOW = "";
                }
                catch { }


                //string Monday = "";
                //try
                //{
                //    Monday = Request.Form["columns[11][search][value]"];
                //    if (Monday == null) Monday = "";
                //}
                //catch { }

                //string Tuesday = "";
                //try
                //{
                //    Tuesday = Request.Form["columns[12][search][value]"];
                //    if (Tuesday == null) Tuesday = "";
                //}
                //catch { }
                //string Wednesday = "";
                //try
                //{
                //    Wednesday = Request.Form["columns[13][search][value]"];
                //    if (Wednesday == null) Wednesday = "";
                //}
                //catch { }
                //string Thursday = "";
                //try
                //{
                //    Thursday = Request.Form["columns[14][search][value]"];
                //    if (Thursday == null) Thursday = "";
                //}
                //catch { }
                //string Friday = "";
                //try
                //{
                //    Friday = Request.Form["columns[15][search][value]"];
                //    if (Friday == null) Friday = "";
                //}
                //catch { }
                //string Saturday = "";
                //try
                //{
                //    Saturday = Request.Form["columns[16][search][value]"];
                //    if (Saturday == null) Saturday = "";
                //}
                //catch { }
                //string Sunday = "";
                //try
                //{
                //    Sunday = Request.Form["columns[17][search][value]"];
                //    if (Sunday == null) Sunday = "";
                //}
                //catch { }

                string dp = "";
                try
                {
                    dp = Request.Form["columns[18][search][value]"];
                    if (dp == null) dp = "";
                }
                catch { }

                string startToEnd = "";
                try
                {
                    startToEnd = Request.Form["columns[19][search][value]"];
                    if (dp == null) startToEnd = "";
                }
                catch { }

                string omdp = "";
                try
                {
                    omdp = Request.Form["columns[20][search][value]"];
                    if (omdp == null) omdp = "";
                }
                catch { }


                string spotLen = "";
                try
                {
                    spotLen = Request.Form["columns[22][search][value]"];
                    if (spotLen == null) spotLen = "";
                }
                catch { }

                string buyType = "";
                try
                {
                    if (filterBuyTypes != null)
                    {
                        buyType = filterBuyTypes;
                    }
                    else
                    {
                        buyType = Request.Form["columns[23][search][value]"];
                        if (buyType == null) buyType = "";
                    }
                }
                catch { }


                string rate = "";
                try
                {
                    rate = Request.Form["columns[24][search][value]"];
                    if (rate == null) rate = "";
                }
                catch { }

                string discount = "";
                try
                {
                    discount = Request.Form["columns[25][search][value]"];
                    if (discount == null) discount = "";
                    //if (discount == "12:06") discount = ""; //'PK'
                }
                catch { }

                string usd = "";
                try
                {
                    usd = Request.Form["columns[26][search][value]"];
                    if (usd == null) usd = "";
                }
                catch { }

                string cpm = "";
                try
                {
                    cpm = Request.Form["columns[27][search][value]"];
                    if (cpm == null) cpm = "";
                }
                catch { }

                string impressions = "";
                try
                {
                    impressions = Request.Form["columns[28][search][value]"];
                    if (impressions == null) impressions = "";
                }
                catch { }

                string totalSpots = "";
                try
                {
                    totalSpots = Request.Form["columns[31][search][value]"];
                    if (totalSpots == null) totalSpots = "";
                }
                catch { }

                string spBuy = "";
                try
                {
                    spBuy = Request.Form["columns[21][search][value]"];
                    if (spBuy == null) spBuy = "";
                }
                catch { }
                string wk01Spots = "";
                try
                {
                    wk01Spots = Request.Form["columns[32][search][value]"];
                    if (wk01Spots == null) wk01Spots = "";
                }
                catch { }
                string wk02Spots = "";
                try
                {
                    wk02Spots = Request.Form["columns[33][search][value]"];
                    if (wk02Spots == null) wk02Spots = "";
                }
                catch { }
                string wk03Spots = "";
                try
                {
                    wk03Spots = Request.Form["columns[34][search][value]"];
                    if (wk03Spots == null) wk03Spots = "";
                }
                catch { }
                string wk04Spots = "";
                try
                {
                    wk04Spots = Request.Form["columns[35][search][value]"];
                    if (wk04Spots == null) wk04Spots = "";
                }
                catch { }
                string wk05Spots = "";
                try
                {
                    wk05Spots = Request.Form["columns[36][search][value]"];
                    if (wk05Spots == null) wk05Spots = "";
                }
                catch { }
                string wk06Spots = "";
                try
                {
                    wk06Spots = Request.Form["columns[37][search][value]"];
                    if (wk06Spots == null) wk06Spots = "";
                }
                catch { }
                string wk07Spots = "";
                try
                {
                    wk07Spots = Request.Form["columns[38][search][value]"];
                    if (wk07Spots == null) wk07Spots = "";
                }
                catch { }
                string wk08Spots = "";
                try
                {
                    wk08Spots = Request.Form["columns[39][search][value]"];
                    if (wk08Spots == null) wk08Spots = "";
                }
                catch { }
                string wk09Spots = "";
                try
                {
                    wk09Spots = Request.Form["columns[40][search][value]"];
                    if (wk09Spots == null) wk09Spots = "";
                }
                catch { }
                string wk10Spots = "";
                try
                {
                    wk10Spots = Request.Form["columns[41][search][value]"];
                    if (wk10Spots == null) wk10Spots = "";
                }
                catch { }
                string wk11Spots = "";
                try
                {
                    wk11Spots = Request.Form["columns[42][search][value]"];
                    if (wk11Spots == null) wk11Spots = "";
                }
                catch { }
                string wk12Spots = "";
                try
                {
                    wk12Spots = Request.Form["columns[43][search][value]"];
                    if (wk12Spots == null) wk12Spots = "";
                }
                catch { }
                string wk13Spots = "";
                try
                {
                    wk13Spots = Request.Form["columns[44][search][value]"];
                    if (wk13Spots == null) wk13Spots = "";
                }
                catch { }
                string wk14Spots = "";
                try
                {
                    wk14Spots = Request.Form["columns[45][search][value]"];
                    if (wk14Spots == null) wk14Spots = "";
                }
                catch { }
                bool PremiereFilter = !string.IsNullOrEmpty(HttpContext.Session.GetString("PremiereFilter")) ? Convert.ToBoolean(HttpContext.Session.GetString("PremiereFilter")) : false;//ST-807

                if (ShowTotals == false)
                {
                    List<ScheduleProposalLinesFlat> proposallines = _proposalRepository.GetProposalLinesFlat(
                        LoggedOnUser.UserId
                        , ProposalId
                        , approvedDesc
                        , status
                        , revNo
                        , revisedDate.Replace("\\", "")
                        , demoName.Replace("\\", "")
                        , networkName.Replace("\\", "")
                        , propertyName.Replace("\\", "")
                        , dp
                        , omdp
                        , buyType
                        , spotLen
                        , rate.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , impressions.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , cpm.Replace("\\", "").Replace("$", "").Replace("Select All,", "").Replace("Select All", "")
                        , (effDate == null) ? "" : effDate.Replace("\\", "")
                        , expDate.Replace("\\", "")
                        , discount.Replace("Select All,", "").Replace("Select All", "").Replace("\\", "")
                        , totalSpots.Replace("\\", "")
                        , (startToEnd == null) ? "" : startToEnd.Replace("\\", "")
                        , usd.Replace("\\", "").Replace("$", "").Replace("Select All,", "").Replace("Select All", "")
                        , PageNum
                        , PageLength // int.Parse(Request.Form["length"].ToString())
                        , DiscountRate
                        , ViewOnly
                        , spBuy.Replace("Select All,", "").Replace("Select All", "")
                        , wk01Spots
                        , wk02Spots
                        , wk03Spots
                        , wk04Spots
                        , wk05Spots
                        , wk06Spots
                        , wk07Spots
                        , wk08Spots
                        , wk09Spots
                        , wk10Spots
                        , wk11Spots
                        , wk12Spots
                        , wk13Spots
                        , wk14Spots                           
                        //, Monday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        //, Tuesday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        //, Wednesday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        //, Thursday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        //, Friday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        //, Saturday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        //, Sunday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , DOW.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        ,false, false //ST-724, Addedd CalledForDropDown,FilterForEdit parameters
                        , IsPremiereFilter //ST-807
                        )
                        .ToList();

                    int FullCount = 0;
                    int RecordsFiltered = 0;
                    if (proposallines.Count() > 0)
                    {
                        FullCount = proposallines[0].FullCount;
                        RecordsFiltered = proposallines[0].RecordsFiltered;
                    }
                    if (Sort == 0)
                    {
                        proposallines = proposallines.OrderBy(x => x.NetworkName).ThenBy(x => x.PropertyName).ThenBy(x => x.SpotLen).ThenBy(x => x.RateUpdateDt).ThenBy(x => x.RateRevision.Trim() == "0" ? 0 : x.RateRevision.Trim() == "PC" ? -1 : int.Parse(x.RateRevision.Trim().Substring(2, 2))).ToList();
                    }
                    if (Sort == -8)
                    {
                        proposallines = proposallines.OrderByDescending(x => x.PropertyName).ThenBy(x => x.SpotLen).ThenBy(x => x.RateUpdateDt).ThenBy(x => x.RateRevision.Trim() == "0" ? 0 : x.RateRevision.Trim() == "PC" ? -1 : int.Parse(x.RateRevision.Trim().Substring(2, 2))).ToList();
                    }
                    else if (Sort == 8)
                    {
                        proposallines = proposallines.OrderBy(x => x.PropertyName).ThenBy(x => x.SpotLen).ThenBy(x => x.RateUpdateDt).ThenBy(x => x.RateRevision.Trim() == "0" ? 0 : x.RateRevision.Trim() == "PC" ? -1 : int.Parse(x.RateRevision.Trim().Substring(2, 2))).ToList();
                    }

                    return Json(new
                    {
                        recordsTotal = FullCount,
                        recordsFiltered = RecordsFiltered,
                        data = proposallines,
                        success = true,
                        responseText = "",
                        responseCode = 0
                    });
                }
                else
                {
                    List<ScheduleProposalLinesFlatTotals> proposallines = _proposalRepository.GetProposalLinesFlatTotals(
                        LoggedOnUser.UserId
                        , ProposalId
                        , approvedDesc
                        , status
                        , revNo
                        , revisedDate.Replace("\\", "")
                        , demoName.Replace("\\", "")
                        , networkName.Replace("\\", "")
                        , propertyName.Replace("\\", "")
                        , dp
                        , omdp
                        , buyType
                        , spotLen
                        , rate.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , impressions.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , cpm.Replace("\\", "").Replace("$", "").Replace("Select All,", "").Replace("Select All", "")
                        , (effDate == null) ? "" : effDate.Replace("\\", "")
                        , expDate.Replace("\\", "")
                        , discount.Replace("Select All,", "").Replace("Select All", "")
                        , totalSpots.Replace("\\", "")
                        , (startToEnd == null) ? "" : startToEnd.Replace("\\", "")
                        , usd.Replace("\\", "").Replace("$", "").Replace("Select All,", "").Replace("Select All", "")
                        , PageNum
                        , PageLength // int.Parse(Request.Form["length"].ToString())
                        , DiscountRate
                        , ViewOnly
                        , CalcExch
                        , Schedule
                        , GI
                        , ProposalReportTotals
                        , isDRBT
                        , IsPremiereFilter //ST-807
                        )
                        .ToList();

                    return Json(new
                    {
                        recordsTotal = proposallines.Count(),
                        recordsFiltered = proposallines.Count(),
                        data = proposallines,
                        success = true,
                        responseText = "",
                        responseCode = 0
                    });
                }
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<ScheduleProposalLinesFlat>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = 0
                });
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetScheduleById(int ScheduleId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Schedule ScheduleInfo = _scheduleRepository.GetScheduleById(LoggedOnUser.UserId, ScheduleId);

                return Json(new
                {
                    success = true,
                    data = ScheduleInfo
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message
                });
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult UnlockOnRefresh(int ScheduleProposalId, bool IsCalledFromBtn)
        {
            try
            {
                if (ScheduleProposalId == 0)
                {
                    //return Json(new { success = false, responseText = "Not a valid call!" });
                    Uri uri = new Uri(Request.GetTypedHeaders().Referer.ToString());
                    ScheduleProposalId = Convert.ToInt32(HttpUtility.ParseQueryString(uri.Query).Get("ProposalId"));
                }
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (_proposalRepository.UnlockProposal(LoggedOnUser.UserId, ScheduleProposalId, IsCalledFromBtn) == true)
                {
                    LockProposal(ScheduleProposalId);
                    return Json(new { success = true, responseText = "Successfully unlocked schedule/proposal." });

                }
                else
                {
                    return Json(new { success = false, responseText = "Error unlocking schedule/proposal" });

                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult Unlock(int ScheduleProposalId, bool IsCalledFromBtn)
        {
            try
            {
                if(ScheduleProposalId == 0) 
                {
                    return Json(new { success = false, responseText = "Not a valid call!" });
                    //Uri uri = new Uri(Request.GetTypedHeaders().Referer.ToString());
                    //ScheduleProposalId = Convert.ToInt32(HttpUtility.ParseQueryString(uri.Query).Get("ProposalId"));
                }
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (_proposalRepository.UnlockProposal(LoggedOnUser.UserId, ScheduleProposalId, IsCalledFromBtn) == true)
                {
                    return Json(new { success = true, responseText = "Successfully unlocked schedule/proposal." });

                }
                else
                {
                    return Json(new { success = false, responseText = "Error unlocking schedule/proposal" });

                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult DeleteScheduleProposal(int ScheduleProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _proposalRepository.Delete(LoggedOnUser.UserId, ScheduleProposalId);
                return Json(new
                {
                    success = err.Success,
                    responseCode = err.ResponseCode,
                    responseText = err.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult CreateProposal(int ClientId, int DemographicSettingsId, string QuarterName, string ScheduleName, string RateIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _proposalRepository.CreateProposal(ClientId, DemographicSettingsId, QuarterName, ScheduleName, RateIds, LoggedOnUser.UserId);
                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
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
        [SessionExpireChildFilter]
        public ActionResult GetDemoNames(int ScheduleProposalId, string filterNetworkNames, string filterBuyTypeCodes, string sels, string reload)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsDemoNames = _scheduleRepository.GetDemoNames(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames
                    , filterBuyTypeCodes);
                if (reload == "true")
                {
                    DropdownViewModel obj = new DropdownViewModel();
                    obj.ResultsStr = lsDemoNames.Distinct();
                    obj.Sels = sels;

                    return PartialView("_DropdownPartialView", obj);
                }
                else
                {
                    return Json(new
                    {
                        success = true,
                        data = lsDemoNames
                    });
                }
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetNetworksForProposal(int ClientId, int QuarterId, int CountryId, int ProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<Network> lsNetworkNames = _proposalRepository.GetNetworks(ClientId, QuarterId, CountryId, ProposalId, LoggedOnUser.UserId);

                return Json(new
                {
                    success = true,
                    data = lsNetworkNames
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }


        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetDemoNamesForAddProperty(int ClientId, int QuarterId, int NetworkId, int ScheduleProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DemoNames> lsDemoNames = _proposalRepository.GetDemoNames(ClientId, QuarterId, NetworkId, ScheduleProposalId, LoggedOnUser.UserId);

                return Json(new
                {
                    success = true,
                    data = lsDemoNames
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetAvailableProperties(int ProposalId, int NetworkId, int DemoId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<PropertyAddNew> props = _proposalRepository.GetAvailableProperties(ProposalId, NetworkId, DemoId, LoggedOnUser.UserId);

                return Json(new
                {
                    recordsTotal = props.Count(),
                    recordsFiltered = props.Count(),
                    data = props.Where(x => x.Status != "DO NOT BUY"),
                    success = true,
                    responseText = "",
                    responseCode = 0
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<PropertyAddNew>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetPropertyNames(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsPropertyName = _scheduleRepository.GetPropertyNames(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsPropertyName.Distinct();
                obj.Sels = sels;
                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsPropertyName
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }
        public ActionResult GetApproved(int ScheduleProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsApproved = _scheduleRepository.GetApproved(LoggedOnUser.UserId, ScheduleProposalId);

                return Json(new
                {
                    success = true,
                    data = lsApproved
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetDoNotBuyTypes(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsStatus = _scheduleRepository.GetDoNotBuyTypes(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames).Select(x => x.Description).Distinct();

                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsStatus;
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //List<string> lsStatusStrings = new List<string>();
                //foreach (DoNotBuyType dnbt in lsStatus)
                //{
                //    lsStatusStrings.Add(dnbt.Description);
                //}

                //return Json(new
                //{
                //    success = true,
                //    data = lsStatusStrings
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetRevisions(int ScheduleProposalId, string FilterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsRevNo = _scheduleRepository.GetRevNo(LoggedOnUser.UserId, ScheduleProposalId, FilterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsRevNo.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsRevNo
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetRevisedDates(int ScheduleId, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsRevDates = _scheduleRepository.GetRateRevisedDates(LoggedOnUser.UserId, ScheduleId);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDt = lsRevDates.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsRevDates
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetEffectiveDates(int ScheduleId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsEffDates = _scheduleRepository.GetEffectiveDates(LoggedOnUser.UserId, ScheduleId, filterNetworkNames);

                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDt = lsEffDates.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);

                //return Json(new
                //{
                //    success = true,
                //    data = lsRevDates
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetExpirationDates(int ScheduleId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsExpDates = _scheduleRepository.GetExpirationDates(LoggedOnUser.UserId, ScheduleId, filterNetworkNames);

                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDt = lsExpDates.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);

                //return Json(new
                //{
                //    success = true,
                //    data = lsRevDates
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetDayParts(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsDayPart = _scheduleRepository.GetDPs(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsDayPart.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsDayPart
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetOMDPs(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsOMDP = _scheduleRepository.GetOMDPs(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsOMDP.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);


                //return Json(new
                //{
                //    success = true,
                //    data = lsOMDP
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetNetworkNames(int ScheduleProposalId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsNetworkNames = _scheduleRepository.GetNetworkNames(LoggedOnUser.UserId, ScheduleProposalId);
               
                return Json(new
                {
                    success = true,
                    data = lsNetworkNames
                });
                
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetBuyTypesAndDemos(int ScheduleProposalId, string filterNetworkNames, string filterBuyTypes)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<BuyTypesAndDemosByNetworks> lstBuyTypes = _scheduleRepository.GetBuyTypesAndDemos(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames, filterBuyTypes);
              
                return Json(new
                {
                    success = true,
                    data = lstBuyTypes
                });                            
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetStartToEnd(int ScheduleProposalId, string sels, string filterNetworkNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsStartToEnd = _scheduleRepository.GetStartToEnd(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsStartToEnd.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsStartToEnd
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetLens(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsSpotLen = _scheduleRepository.GetLens(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsStr = lsSpotLen.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsSpotLen
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetRateAmts(int ScheduleId, string sels, string filterNetworkNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsRateAmt = _scheduleRepository.GetRateAmt(LoggedOnUser.UserId, ScheduleId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDbl = lsRateAmt.Distinct();
                obj.Sels = sels;
                obj.IsCurrency = true;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsRateAmt
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetUSDRate(int ScheduleId, string sels, string filterNetworkNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsUSD = _scheduleRepository.GetUSDRate(LoggedOnUser.UserId, ScheduleId, filterNetworkNames);

                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDbl = lsUSD.Distinct();
                obj.Sels = sels;
                obj.IsCurrency = true;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsUSD
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetDiscounts(int ScheduleId, float DiscountRate, string filterNetworkNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsDiscount = _scheduleRepository.GetDiscounts(LoggedOnUser.UserId, ScheduleId, DiscountRate, filterNetworkNames);

                return Json(new
                {
                    success = true,
                    data = lsDiscount
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetImpressions(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsImpressions = _scheduleRepository.GetImpressions(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDbl = lsImpressions.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsImpressions
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetCPM(int ScheduleId, string sels, string filterNetworkNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsCPM = _scheduleRepository.GetCPM(LoggedOnUser.UserId, ScheduleId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsDbl = lsCPM.Distinct();
                obj.Sels = sels;
                obj.IsCurrency = true;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsCPM
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetTotalSpots(int ScheduleProposalId, string filterNetworkNames, string sels)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<int> lsTotalSpots = _scheduleRepository.GetTotalSpots(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsInt = lsTotalSpots.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
                //return Json(new
                //{
                //    success = true,
                //    data = lsTotalSpots
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult SaveWeeklySpot(int ScheduleLineId, int WeekNo, int Spots)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _scheduleRepository.SaveWeeklySpots(LoggedOnUser.UserId, ScheduleLineId, WeekNo, Spots);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText,
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetWeeklySpot(int ScheduleLineId, int WeekNo)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _scheduleRepository.GetWeeklySpot(LoggedOnUser.UserId, ScheduleLineId, WeekNo);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText,
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult SaveChanges(int ScheduleId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _scheduleRepository.SaveChanges(LoggedOnUser.UserId, ScheduleId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult AddScheduleLines(int ProposalId, string RateIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _proposalRepository.AddScheduleLines(ProposalId, RateIds, LoggedOnUser.UserId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult CopyToSchedule(int ProposalId, string NetworkIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _proposalRepository.CopyToSchedule(ProposalId, NetworkIds, LoggedOnUser.UserId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult CopySpots(int ProposalId, int CopyWeek, int EndCopyWeek, string NetworkName, string ScheduleLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _proposalRepository.CopySpots(ProposalId, CopyWeek, EndCopyWeek, NetworkName, LoggedOnUser.UserId, ScheduleLineIds);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        //[SessionExpireChildFilter]
        //[LogonLayout("_LayoutFullNoMenuv2")]
        //public IActionResult ProposalReport(int ProposalId, string NetworkName, string bt /* buytypes */, string de /* demonamesid */)
        //{
        //    ProposalViewModel pvm = this.GetViewProposalViewModel(ProposalId, -1);
        //    ProposalReportViewModel prvm = new ProposalReportViewModel();
        //    prvm.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

        //    prvm.ReportName = "Proposal Approval";
        //    prvm.Client = pvm.ClientInfo.ClientName;
        //    prvm.ProposalInfo = pvm.ProposalInfo;
        //    prvm.NetworkInfo = _networkRepository.GetNetworkByName(NetworkName, prvm.ProposalInfo.CountryId);

        //    // Feed Type
        //    prvm.FeedType = prvm.NetworkInfo.FeedType.Description;

        //    // Media
        //    prvm.Media = prvm.NetworkInfo.MediaType.MediaTypeCode;

        //    // Quarter
        //    prvm.Quarter = pvm.ProposalQuarter;

        //    // Guaranteed
        //    prvm.Guaranteed = ((prvm.NetworkInfo.GuarImp == null || prvm.NetworkInfo.GuarImp == 0) ? "NO" : "YES");

        //    prvm.DealPointInfo = _dealpointRepository.GetDealpoint(prvm.NetworkInfo.NetworkId, prvm.Quarter.BroadcastYr, "UP");

        //    var drType = false;
        //    var nonDRType = false;
        //    prvm.IsDRBuyType = false;
        //    prvm.IsDRBT = false;
        //    if (!string.IsNullOrEmpty(bt))
        //    {
        //        var buyTypes = _generalRepository.GetBuyTypes().ToList();
        //        string[] arrayBuytypes = bt.Split(new[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
        //        foreach (string buytype in arrayBuytypes)
        //        {
        //            if (!drType)
        //            {
        //                drType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == true) ? true : false;
        //            }
        //            if (!nonDRType && buytype != "M" && buytype != "B")
        //            {
        //                nonDRType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == false) ? true : false;
        //            }
        //        }
        //        if (pvm.ClientInfo.Country.CountryShort == "US" && drType && !nonDRType)
        //        {
        //            prvm.IsDRBuyType = true;
        //        }
        //        if (drType && !nonDRType)
        //        {
        //            prvm.IsDRBT = true;
        //        }
        //    }
        //    prvm.QuaterlyClientNote = _proposalRepository.GetQuarterlyClientNote(ProposalId, prvm.LoggedOnUser.UserId);
        //    return View(prvm);
        //}

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult SaveFilterState(int proposalId, string profileKey, string currentFilters)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _proposalRepository.SaveFilterState(proposalId, profileKey, currentFilters, LoggedOnUser.UserId);

                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetSPBuy(int ScheduleProposalId, string sels, string filterNetworkNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<SelectListItem> lsSPBuy = _scheduleRepository.GetSPBuy(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultSelListItems = lsSPBuy;
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [HttpGet]
        public ActionResult ExportToExcel(int proposalId, string networkName, float disc, string bt, string de)
        {

            ProposalViewModel pvm = this.GetViewProposalViewModel(proposalId, -1);
            ProposalReportViewModel prvm = new ProposalReportViewModel();
            prvm.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            prvm.ReportName = "Proposal Approval";
            prvm.ProposalInfo = pvm.ProposalInfo;
            prvm.NetworkInfo = _networkRepository.GetNetworkByName(networkName, prvm.ProposalInfo.CountryId);

            prvm.FeedType = prvm.NetworkInfo.FeedType.Description;
            prvm.Media = prvm.NetworkInfo.MediaType.MediaTypeCode;
            prvm.Quarter = pvm.ProposalQuarter;
            prvm.Guaranteed = ((prvm.NetworkInfo.GuarImp == null || prvm.NetworkInfo.GuarImp == 0) ? "NO" : "YES");
            prvm.DealPointInfo = _dealpointRepository.GetDealpoint(prvm.NetworkInfo.NetworkId, prvm.Quarter.BroadcastYr, "UP");

            if (prvm.DealPointInfo == null)
            {
                prvm.DealPointInfo = new Dealpoint();
            }
            prvm.BusinessName = _config.GetSection("OfficeAddress:Business").Value;
            prvm.BusinessStreet1 = _config.GetSection("OfficeAddress:Street1").Value;
            prvm.BusinessCity = _config.GetSection("OfficeAddress:City").Value;
            prvm.BusinessState = _config.GetSection("OfficeAddress:State").Value;
            prvm.BusinessZip = _config.GetSection("OfficeAddress:Zip").Value;
            prvm.BusinessPhone = _config.GetSection("OfficeAddress:Phone").Value;

            //prvm.ProposalLines = _proposalRepository.GetProposalLinesFlat(prvm.LoggedOnUser.UserId, proposalId, null, null, null, null, de, networkName, null
            // , null, null, bt, null, null, null, null, null, null, null, null, null, null, 0, 0, disc, true, null).ToList();

            prvm.ProposalLines = _proposalRepository.ExcelGetProposalLinesFlat(prvm.LoggedOnUser.UserId, proposalId, null, null, null, null, de, networkName, null
             , null, null, bt, null, null, null, null, null, null, null, null, null, null, 0, 0, disc, true, null).ToList();


            var drType = false;
            var nonDRType = false;
            prvm.IsDRBuyType = false;
            prvm.IsDRBT = false;
            if (!string.IsNullOrEmpty(bt))
            {
                var buyTypes = _generalRepository.GetBuyTypes().ToList();
                string[] arrayBuytypes = bt.Split(new[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
                foreach (string buytype in arrayBuytypes)
                {
                    if (!drType)
                    {
                        drType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == true) ? true : false;
                    }
                    if (!nonDRType && buytype != "M" && buytype != "B")
                    {
                        nonDRType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == false) ? true : false;
                    }
                }
                if (pvm.ClientInfo.Country.CountryShort == "US" && drType && !nonDRType)
                {
                    prvm.IsDRBuyType = true;
                }
                if (drType && !nonDRType)
                {
                    prvm.IsDRBT = true;
                }
            }
            prvm.QuaterlyClientNote = _proposalRepository.GetQuarterlyClientNote(proposalId, prvm.LoggedOnUser.UserId);
            prvm.ProposalLinesFlatTotals = _proposalRepository.ExcelGetProposalLinesFlatTotals(prvm.LoggedOnUser.UserId, proposalId, null
            , null, null, null, de, networkName, null, null, null, bt, null, null, null, null, null, null, null, null, null, null, 0, 0, disc, true, false, false, false, true, prvm.IsDRBT).ToList();

            byte[] filecontent = ExcelExportHelper.ExportExcel(prvm);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "ProposalExport_" + prvm.Quarter.QuarterName + "_" + prvm.ProposalInfo.Client.ClientName + "_" + prvm.NetworkInfo.StdNetName + ".xlsx");
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult CreateProposalVisible(int clientId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                bool result = _proposalRepository.CreateProposalVisible(clientId, LoggedOnUser.UserId);
                return Json(result);

            }
            catch (Exception exc)
            {
                return Json(false);
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult BuyTypeValidation(string bt)
        {
            var drType = false;
            var nonDRType = false;
            var result = "";
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (!string.IsNullOrEmpty(bt))
                {
                    string[] arrayBuytypes = bt.Split(new[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
                    var buyTypes = _generalRepository.GetBuyTypes().ToList();
                    var bBuyType = false;
                    var mBuyType = false;
                    if (arrayBuytypes.Length == 1 || arrayBuytypes.Length == 2)
                    {
                        foreach (string buytype in arrayBuytypes)
                        {
                            if (buytype == "M") { mBuyType = true; }
                            if (buytype == "B") { bBuyType = true; }
                        }

                        if (arrayBuytypes.Length == 1 && (bBuyType || mBuyType))
                        {
                            return Json(new
                            {
                                responseText = "M and/or B can not be select alone. Select either DR or non-DR Buytype along with M and/or B"
                            });
                        }
                        if (arrayBuytypes.Length == 2 && bBuyType && mBuyType)
                        {
                            return Json(new
                            {
                                responseText = "M and/or B can not be select alone. Select either DR or non-DR Buytype along with M and/or B"
                            });
                        }

                    }
                    foreach (string buytype in arrayBuytypes)
                    {
                        if (!drType)
                        {
                            drType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == true) ? true : false;
                        }
                        if (!nonDRType && buytype != "M" && buytype != "B")
                        {
                            nonDRType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == false) ? true : false;
                        }
                    }
                    if (drType && nonDRType)
                    {
                        result = "Either select DR OR Non-DR Buytype";
                    }
                }
                return Json(new
                {
                    responseText = result
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult SaveQuarterlyClientNote(int proposalId, string note)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            try
            {
                ErrorMessage err = _proposalRepository.SaveQuarterlyClientNote(proposalId, note, LoggedOnUser.UserId);
                return Json(new { success = err.Success, responseText = err.ResponseText });
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }

        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetQuarterlyClientNote(int proposalId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            try
            {
                string result = _proposalRepository.GetQuarterlyClientNote(proposalId, LoggedOnUser.UserId);
                return Json(new { success = true, note = result });
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetWKSpots(int ScheduleProposalId, string filterNetworkNames, string sels, int weekNo)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<int> lsWKSpots = _scheduleRepository.GetWKSpots(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames, weekNo);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultsInt = lsWKSpots.Distinct();
                obj.Sels = sels;

                return PartialView("_DropdownPartialView", obj);

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }



        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetWeekDay(int ScheduleProposalId, string filterNetworkNames, string sels, int WeekDayId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<SelectListItem> weekdayValues = _scheduleRepository.GetWeekDay(LoggedOnUser.UserId, ScheduleProposalId, filterNetworkNames, WeekDayId);
                DropdownViewModel obj = new DropdownViewModel();
                obj.ResultSelListItems = weekdayValues.Distinct();
                obj.Sels = sels;
                return PartialView("_DropdownPartialView", obj);
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult CheckDealPoint(int proposalId, string bt, string networkName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (!string.IsNullOrEmpty(bt))
                {
                    var drType = false;
                    var nonDRType = false;
                    string[] arrayBuytypes = bt.Split(new[] { '~' }, StringSplitOptions.RemoveEmptyEntries);
                    var proposal = _proposalRepository.GetProposalById(LoggedOnUser.UserId, proposalId);
                    var country = _clientRepository.GetClient(proposal.ClientId).Country.CountryShort;
                    var networkId = _networkRepository.GetNetworkByName(networkName, proposal.CountryId).NetworkId;
                    var broadcastYr = _propertyRepository.GetQuarter(proposal.QtrName).BroadcastYr;
                    var buyTypes = _generalRepository.GetBuyTypes().ToList();
                    foreach (string buytype in arrayBuytypes)
                    {
                        if (!drType)
                        {
                            drType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == true) ? true : false;
                        }
                        if (!nonDRType && buytype != "M" && buytype != "B")
                        {
                            nonDRType = (buyTypes.Where(x => x.BuyTypeCode == buytype).Select(x => x.DRType).Single() == false) ? true : false;
                        }
                    }
                    if (drType && !nonDRType && country == "US")
                    {
                        return Json(new
                        {
                            responseText = ""
                        });
                    }
                    else
                    {
                        var dealpoint = _dealpointRepository.GetDealpoint(networkId, broadcastYr, "UP");
                        if (dealpoint == null)
                        {
                            return Json(new
                            {
                                responseText = "No Deal Points Cancel Policy Found."
                            });
                        }
                    }
                }
                return Json(new
                {
                    responseText = ""
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message
                });
            }
        }

        [HttpGet]
        public ActionResult ExportScheduleExcel(int ScheduleId, float Discount)
        {

            ProposalViewModel pvm = this.GetViewProposalViewModel(ScheduleId, -1);
            ScheduleViewModel svm = new ScheduleViewModel();
            svm.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            svm.ProposalInfo = pvm.ProposalInfo;
            svm.ProposalQuarter = pvm.ProposalQuarter;
            svm.ProposalLines = _proposalRepository.ExcelGetProposalLinesFlat(svm.LoggedOnUser.UserId, ScheduleId, null, null, null, null, null, null, null
             , null, null, null, null, null, null, null, null, null, null, null, null, null, 0, 0, Discount, true, null).ToList();
            byte[] filecontent = ExcelExportHelper.ExportExcel(svm);
            return File(filecontent, ExcelExportHelper.ExcelContentType, svm.ProposalInfo.Client.ClientName + "_" + svm.ProposalQuarter.QuarterName + "_" + DateTime.Now + ".xlsx");
        }

        #region Functions for Proposals Automation
        // By Shariq ST-338, Check Unallocated Spots

        private List<UnAllocatedProposals> GetUnAllocatedProposalsData(int ClientId, string QuarterName, bool GetCount, bool Archived,string Mode)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            List<UnAllocatedProposals> proposals = new List<UnAllocatedProposals>();
            proposals = _proposalRepository.GetUnAllocatedProposals(ClientId, QuarterName, GetCount, LoggedOnUserId, Archived,Mode);
            return proposals;
        }

        [SessionExpireChildFilter]
        [HttpGet]
        public ActionResult CheckAvailableUnAllocatedProposalsData(int ClientId, string QuarterName, bool Archived,string Mode)
        {
            try
            {
                List<UnAllocatedProposals> proposals = GetUnAllocatedProposalsData(ClientId, QuarterName, false, Archived,Mode);
                return Json(new
                {
                    proposals = proposals,
                    responseCode = "200",
                    responseText = "Success"
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult UnAllocatedProposals(int ClientId, string QuarterName, bool GetCount, bool Archived,String Model)
        {
            List<UnAllocatedProposals> lstModel = GetUnAllocatedProposalsData(ClientId, QuarterName, GetCount, Archived, Model);
            return View(lstModel);
        }

        [SessionExpireChildFilter]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ArchiveUnAllocatedProposals(int ClientId, string QuarterName, string Networkids, string SourceFileNames, bool Archived = true)
        {

            //List<UnAllocatedProposals> lstModel = GetUnAllocatedArchiveProposalsData(ClientId, QuarterName, Networkids);
            //return View(lstModel);
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            //string[] network = networkId
            int retval = 0;
            retval = _proposalRepository.ArchiveProposals(ClientId, QuarterName, Networkids, SourceFileNames, Archived,Convert.ToInt32(LoggedOnUserId));
            return Json(retval);
        }

        [SessionExpireChildFilter]
        public IActionResult UnArchiveUnAllocatedProposals(int ClientId, string QuarterName, string Networkids,string SourceFileNames, bool Archived)
        {

            //List<UnAllocatedProposals> lstModel = GetUnAllocatedArchiveProposalsData(ClientId, QuarterName, Networkids);
            //return View(lstModel);
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            //string[] network = networkId
            int retval = 0;
            retval = _proposalRepository.ArchiveProposals(ClientId, QuarterName, Networkids, SourceFileNames, Archived, Convert.ToInt32(LoggedOnUserId));
            return Json(retval);
        }

        [SessionExpireChildFilter]
        public IActionResult GetImportProposals(int ClientId, string QuarterName, int NetworkId, string SourceFileName,string FileAction, int CountryId,string Mode, bool ShowTotals = false)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            var retval = _proposalRepository.GetImportingProposals(ClientId, QuarterName, NetworkId, SourceFileName,FileAction, CountryId, ShowTotals, Mode, Convert.ToInt32(LoggedOnUserId));
            Quarter SelectedQtr = _propertyRepository.GetQuarter(QuarterName);
            //return Json(retval);
            if (ShowTotals)
            {
                return Json(new
                {
                    totalSection = retval,
                    responseCode = "200",
                    responseText = "Success"
                });
            }
            else
            {
                return Json(new
                {
                    proposals = retval,
                    selectedQtr = SelectedQtr,
                    responseCode = "200",
                    responseText = "Success"
                });
            }
        }
        //[SessionExpireChildFilter]
        //public IActionResult SaveProposalAutomationData(int ClientId, string QuarterName, int NetworkId, string SourceFileName, int CountryId, 
        //    int ProposalId, int RateId,string Mode,
        //    int wk1, int wk2, int wk3, int wk4, int wk5, int wk6, int wk7, int wk8,
        //    int wk9, int wk10, int wk11, int wk12, int wk13, int wk14)
        //{
        //    string LoggedOnUserId = HttpContext.Session.GetString("UserId");
        //    SaveUnallocatedProposalResponse retval = _proposalRepository.SaveUnAllocateProposals(ClientId, QuarterName, NetworkId, SourceFileName, CountryId, ProposalId, RateId,Mode,
        //        wk1, wk2, wk3, wk4, wk5, wk6, wk7, wk8, wk9, wk10, wk11, wk12, wk13, wk14, Convert.ToInt32(LoggedOnUserId));
        //    return Json(new
        //    {
        //        retvalData = retval,
        //        responseCode = "200",
        //        responseText = "Success"
        //    });
        //}

        [SessionExpireChildFilter]
        public IActionResult SaveProposalVersionHistory(int ClientId, string QuarterName, string Mode, string SourceFileName, string FileAction)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            SaveUnallocatedProposalResponse retval = _proposalRepository.SaveUnAllocateProposalsVersionHistory(ClientId, QuarterName, Mode, SourceFileName, FileAction, Convert.ToInt32(LoggedOnUserId));
            return Json(new
            {
                retvalData = retval,
                responseCode = "200",
                responseText = "Success"
            });
        }

        [SessionExpireChildFilter]
        public IActionResult SaveProposalAutomationData(int ProposalId, int RateId,int PropertyId, int ClientId, string QuarterName, Int64 PAJourneyId
            , int wk1, int wk2, int wk3, int wk4, int wk5, int wk6, int wk7, int wk8,
            int wk9, int wk10, int wk11, int wk12, int wk13, int wk14)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            SaveUnallocatedProposalResponse retval = _proposalRepository.SaveUnAllocateProposals(ProposalId, RateId, PropertyId, ClientId, QuarterName, PAJourneyId,
            wk1, wk2, wk3, wk4, wk5, wk6, wk7, wk8,
            wk9, wk10, wk11, wk12, wk13, wk14, Convert.ToInt32(LoggedOnUserId));
            return Json(new
            {
                retvalData = retval,
                responseCode = "200",
                responseText = "Success"
            });
        }
        //#region Functions for Proposals Automation
        //// By Shariq ST-338, Check Unallocated Spots

        [SessionExpireChildFilter]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult UnAllocatedProposalsMarkAsAllocated(int ClientId, string QuarterName, string Networkid,string SourceFile,int ProposalId)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            int retval = 0;
            retval = _proposalRepository.MarkProposalAsAlocated(ClientId, QuarterName, Networkid, SourceFile, ProposalId,Convert.ToInt32(LoggedOnUserId));
            return Json(retval);
        }
        
        [HttpGet]
        //[SessionExpireRawFileDownloadFilter]
        public IActionResult ExportRawProposals(int ClientId, string QuarterName, int NetworkId, string SourceFileName, int CountryId, string clientName, string NetworkName)
        {
            try
            {
                //if (HttpContext.Session.GetString("AccountName") == null || HttpContext.Session.GetString("AccountName") == "")
                //{
                //    return new RedirectResult("~/StatusCode/408");
                //}
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                string LoggedOnUserId = HttpContext.Session.GetString("UserId");
                List<ProposalsRawFileExportModel> exportModel = new List<ProposalsRawFileExportModel>();
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

        [SessionExpireChildFilter]
        public IActionResult GetSTSpotsForProposals(string RateIds, int ScheduleId, int ActWeekNum, bool FromST)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            var retval = _proposalRepository.GetSTSpotsForPrposal(RateIds, ScheduleId, FromST, ActWeekNum, Convert.ToInt32(LoggedOnUserId));

            return Json(new
            {
                proposalsSpots = retval,
                responseCode = "200",
                responseText = "Success"
            });
        }

        #region ST-710, Proposal Automation User Journey Functions

        [SessionExpireChildFilter]
        public IActionResult AddUserJourneyMaster(int ClientId, int NetworkId, string QuarterName,string ScreenName, int ScheduleId, int Deal, string SourceFile, string ActionTaken, string Description)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            var retval = _proposalRepository.AddUserJourneyMaster(ClientId, NetworkId, QuarterName, ScreenName, ScheduleId, Deal, SourceFile, ActionTaken, Description, Convert.ToInt32(LoggedOnUserId));
            return Json(new
            {
                paJourneyId = retval,
                responseCode = "200",
                responseText = "Success"
            });
        }
        #endregion
        #region ST-691 functions
        public List<UnAllocatedProposals> GetProcessedProposalsData(int ClientId, string QuarterName,int CountryId)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            List<UnAllocatedProposals> proposals = new List<UnAllocatedProposals>();
            proposals = _proposalRepository.GetProcessedProposals(ClientId, QuarterName, Convert.ToInt32(LoggedOnUserId));
            return proposals;
        }
        #endregion

        //[SessionExpireChildFilter]
        //public IActionResult SaveProposalVersionHistory(int ClientId, string QuarterName, string Mode, string SourceFileName, string FileAction)
        //{
        //    string LoggedOnUserId = HttpContext.Session.GetString("UserId");
        //    SaveUnallocatedProposalResponse retval = _proposalRepository.SaveUnAllocateProposalsVersionHistory(ClientId, QuarterName, Mode, SourceFileName, FileAction, Convert.ToInt32(LoggedOnUserId));
        //    return Json(new
        //    {
        //        retvalData = retval,
        //        responseCode = "200",
        //        responseText = "Success"
        //    });
        //}
        [SessionExpireChildFilter]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult UnAllocatedProposalsMarkAsAllocatedIgnored(int ClientId, string QuarterName, string Networkid, string SourceFile, int ProposalId, string Mode, string SourceFileName, string FileAction)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            SaveUnallocatedProposalResponse retval = _proposalRepository.SaveUnAllocateProposalsVersionHistoryIgnored(ClientId, QuarterName, Mode, SourceFileName, FileAction, Convert.ToInt32(LoggedOnUserId));
            //return Json(new
            //{
            //    retvalData = retval,
            //    responseCode = "200",
            //    responseText = "Success"
            //});

            //string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            int retval2 = 0;
            retval2 = _proposalRepository.MarkProposalAsAlocated(ClientId, QuarterName, Networkid, SourceFile, ProposalId, Convert.ToInt32(LoggedOnUserId));
            return Json(retval2);
        }
        #endregion

        #region ST-724 Function Started Here
        [SessionExpireChildFilter]
        public IActionResult GetNetworkListForSchedule(int ClientId, int ScheduleId)
        {
            string LoggedOnUserId = HttpContext.Session.GetString("UserId");
            List<ProposalNetworkModel> lstNetworks = _proposalRepository.GetNetworkListForSchedule(ClientId, ScheduleId, Convert.ToInt32(LoggedOnUserId));
            if (lstNetworks.Any())
            {
                if (lstNetworks.FirstOrDefault().Success)
                {
                    return Json(new
                    {
                        networkList = lstNetworks,
                        success = true,
                        responseCode = "200",
                        responseText = "Success"
                    });
                }
                else
                {
                    return Json(new
                    {
                        networkList = lstNetworks,
                        success = false,
                        responseCode = "-1",
                        responseText = lstNetworks.FirstOrDefault().ResponseText
                    });
                }
            }
            else
            {
                return Json(new
                {
                    networkList = lstNetworks,
                    success = false,
                    responseCode = "-1",
                    responseText = "No Networks Found for this Proposals/Schedule"
                });
            }
        }
        #endregion


        #region ST-724 Function Started Here
        [SessionExpireChildFilter]
        public string InsertProposalLockDetail(ProposalNetworkModel ObjProposal)
        {
            string retval = "";
            try
            {
                string LoggedOnUserId = HttpContext.Session.GetString("UserId");
                bool PremiereFilter = !string.IsNullOrEmpty(HttpContext.Session.GetString("PremiereFilter")) ? Convert.ToBoolean(HttpContext.Session.GetString("PremiereFilter")) : false;//ST-807
                HttpContext.Session.SetString("partialLockingObject", JsonSerializer.Serialize<ProposalNetworkModel>(ObjProposal));
                retval = _proposalRepository.LockProposalWithNetwork(Convert.ToInt32(LoggedOnUserId), ObjProposal.ScheduleId, String.Join(",", ObjProposal.NetworkIdList), ObjProposal.NetworkIdList.Length == Convert.ToInt32(ObjProposal.TotalNetworks) ? true : false, PremiereFilter);
            }
            catch (Exception ex)
            {
                retval = "Error";
            }
            return retval;
        }
        #endregion
        public string ApplyPremiereFilter()
        {
            if (HttpContext.Session.GetString("PremiereFilter") != null)
            {
                HttpContext.Session.Remove("PremiereFilter");
                //if (HttpContext.Session.GetString("PremiereFilter") == "True")
                //    HttpContext.Session.SetString("PremiereFilter", "False");
                //else
                //{
                //    HttpContext.Session.SetString("PremiereFilter", "True");
                //}
            }
            else
            {
                HttpContext.Session.SetString("PremiereFilter", "True");
            }
            return "1";
        }

        #region Functions for Child Proeprties

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddChildProperties(PropertyAddNew PropertyModel, int ProposalId)
        {
            try
            {
                ErrorMessage err = new ErrorMessage();               
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));                            
                err = _proposalRepository.AddChildProperties(PropertyModel, ProposalId, LoggedOnUser.UserId);
                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
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
        public ActionResult CheckChildPropertiesUniqueness(PropertyAddNew PropertyModel)
        {
            try
            {
                ErrorMessage err = new ErrorMessage();                
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                err = _proposalRepository.CheckChildPropertiesUniqueness(PropertyModel, LoggedOnUser.UserId);
                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
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
        #endregion

    }

}
