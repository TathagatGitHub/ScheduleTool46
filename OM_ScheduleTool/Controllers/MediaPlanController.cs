using Dapper;
using MessagePack;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using NuGet.Protocol;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using OM_ScheduleTool.Dapper;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using System.Web;

namespace OM_ScheduleTool.Controllers
{
    public class MediaPlanController : Controller
    {
        private IAppFeatureRepository _appFeatureRepository;
        private IConfiguration _config;
        private IClientRepository _clientRepository;
        private IUserRepository _userRepository;
        private IGeneralRepository _generalRepository;
        private IMediaPlanRepository _mediaPlanRepository;

        public MediaPlanController(
            IAppFeatureRepository appFeatureRepository
            , IConfiguration config
            , IClientRepository clientRepository
            , IUserRepository userRepository
            , IMediaPlanRepository mediaPlanRepository
            , IGeneralRepository generalRepository
        )
        {
            _appFeatureRepository = appFeatureRepository;
            _config = config;
            _userRepository = userRepository;
            _clientRepository = clientRepository;
            _mediaPlanRepository = mediaPlanRepository;
            _generalRepository = generalRepository;
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult GetAllMediaPlans()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            List<MediaPlan> mediaPlans = _mediaPlanRepository.GetAllMediaPlans(LoggedOnUser.UserId);
            int lastQuarterSelected = 0;
            try
            {
                lastQuarterSelected = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_BroadcastQuarterNbr"));
            }
            catch
            {
                lastQuarterSelected = 0;
            }
            return Json(new { MediaPlans = mediaPlans, LastQuarterSelected = lastQuarterSelected });
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult GetMediaPlanByClient(int ClientId, int BroadcastYr)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            List<MediaPlan> mediaPlans = _mediaPlanRepository.GetAllMediaPlansForClientAndYear(LoggedOnUser.UserId, ClientId, BroadcastYr);
            return Json(new { CurrentUserId = LoggedOnUser.UserId, MediaPlans = mediaPlans });
        }


        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult DeleteMediaPlan(int mediaPlanid)
        {
            try
            {
                int Retval = 0;
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Retval = _mediaPlanRepository.DeleteMediaPlan(LoggedOnUser.UserId, mediaPlanid, "Delete");
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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
        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult TogglePublishMediaPlan(int mediaPlanid, string MediaPlanStatus)
        {
            try
            {
                int Retval = 0;
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Retval = _mediaPlanRepository.TogglePublishMediaPlan(LoggedOnUser.UserId, mediaPlanid, MediaPlanStatus);
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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

        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult CopyMediaPlan(int mediaPlanid, int clientid, string QtrName)
        {
            try
            {
                int Retval = 0;
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Retval = _mediaPlanRepository.CopyMediaPlan(LoggedOnUser.UserId, mediaPlanid, clientid, QtrName, 0);
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Summary_BudgetDisplay_" + Convert.ToString(Retval), "Client Net");// ST-1047 Added Default Budget Display to Client Net
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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

        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult CopyMediaPlanFromYrAndQtr(int mediaPlanid, int clientid, string QtrName, int Year)
        {
            try
            {                
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                _mediaPlanRepository.CopyMediaPlan(LoggedOnUser.UserId, mediaPlanid, clientid, QtrName, Year);                
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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
        public ActionResult GetMediaPlanForEdit(int MediaPlanId)
        {
            try
            {
                EditMediaPlanViewModel editMediaPlan = _mediaPlanRepository.EditMediaPlanByMediaPlanId(MediaPlanId);
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = editMediaPlan
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult CreateEditMediaPlan(string MediaPlanName, string BudgetPeriod, decimal GrossBudget, decimal Percentage,
            int ClientId, int PlanYear, string QuarterName, string BTGDemos, string BTGNetworks, string Action, int MediaPlanId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _mediaPlanRepository.CreateEditMediaPlan(LoggedOnUser.UserId, MediaPlanName, BudgetPeriod, GrossBudget, Percentage,
                ClientId, PlanYear, QuarterName, BTGDemos, BTGNetworks, Action, MediaPlanId);
                if (Action.ToLower() != "update")
                {
                    _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Summary_BudgetDisplay_" + Convert.ToString(err.ResponseCode), "Client Net");// ST-1047 Added Default Budget Display to Client Net
                }
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

        public ActionResult MediaPlanGetPlanYears()
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> planYears = _generalRepository.GetPlanYears().Select(s => s.Value).Distinct();
                int LastPlanYearSelected = 0;
                try
                {
                    LastPlanYearSelected = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_PlanYear"));
                }
                catch
                {
                    LastPlanYearSelected = DateTime.Now.Year;
                }

                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = planYears,
                    lastSelectedYear = LastPlanYearSelected
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        public ActionResult MediaPlanGetQuartersAndWeeks(int Year)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<MediaPlanQuarter> mpQuarters = _mediaPlanRepository.GetMediaPlanQuartersAndWeeks(Year, LoggedOnUser.UserId).ToList();
                int LastQuarterSelected = 0;
                try
                {
                    LastQuarterSelected = int.Parse(_userRepository.GetUserProfile(LoggedOnUser.UserId, "PlanningLog_BroadcastQuarterNbr"));
                }
                catch
                {
                    LastQuarterSelected = 0;
                }
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = mpQuarters,
                    lastSelectedQuarter = LastQuarterSelected
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        public ActionResult GetMediaPlanDemos(int MediaPlanId, string BuyTypeGroup)
        {
            try
            {
                List<MediaPlanDemo> mediaPlanDemos = _mediaPlanRepository.GetMediaPlanDemos(MediaPlanId, BuyTypeGroup);

                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = mediaPlanDemos
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        public ActionResult GetMediaPlanProperties(string QuarterName, int CountryId, int NetworkId, int DemoId, string BuyTypeGroup, int PlanYear, int MediaPlanId)
        {
            try
            {
                List<MediaPlanProperties> mediaPlanProperties = _mediaPlanRepository.GetMediaPlanProperties(QuarterName, CountryId, NetworkId, DemoId, BuyTypeGroup, PlanYear, MediaPlanId);

                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = mediaPlanProperties
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        public ActionResult GetMediaPlanPropertyById(int MediaPlanPropertyId, int QuarterId)
        {
            try
            {
                MediaPlanPropertyEditGet mediaPlanProperty = _mediaPlanRepository.GetMediaPlanPropertyById(MediaPlanPropertyId, QuarterId);
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = mediaPlanProperty
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult DeleteMediaPlanPropertyById(int MediaPlanPropertyId)
        {
            try
            {
                int Retval = 0;
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Retval = _mediaPlanRepository.DeleteMediaPlanPropertyById(LoggedOnUser.UserId, MediaPlanPropertyId);
                if (Retval == 0)
                {
                    return Json(new
                    {
                        success = false,
                        responseCode = -1,
                        responseText = "Unexpected error occurred. Couldn't delete the property."
                    });
                }
                else
                {
                    return Json(new
                    {
                        success = true,
                        responseCode = 200,
                        responseText = "Success"
                    });
                }                
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
        public ActionResult UpdateMediaPlanPropertyById(int MediaPlanPropertyId, decimal AdjustedRatePercentage, decimal AdjustedImpressionPercentage, string MediaPlanPropertyName,
            int DayPartId, int BuyTypeId, int SpotLen, decimal RateAmount, decimal Impressions, decimal CPM, int Wk01Spots, int Wk02Spots, int Wk03Spots, int Wk04Spots, int Wk05Spots
            , int Wk06Spots, int Wk07Spots, int Wk08Spots, int Wk09Spots, int Wk10Spots, int Wk11Spots, int Wk12Spots, int Wk13Spots, int Wk14Spots)
        {
            try
            {       
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _mediaPlanRepository.UpdateMediaPlanPropertyById(LoggedOnUser.UserId, MediaPlanPropertyId, AdjustedRatePercentage, AdjustedImpressionPercentage, MediaPlanPropertyName,
                DayPartId, BuyTypeId, SpotLen, RateAmount, Impressions, CPM, Wk01Spots, Wk02Spots, Wk03Spots, Wk04Spots, Wk05Spots, Wk06Spots, Wk07Spots, Wk08Spots, Wk09Spots, Wk10Spots, Wk11Spots,
                Wk12Spots, Wk13Spots, Wk14Spots);                
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
        public ActionResult MediaPlanUnlock(int MediaPlanId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (MediaPlanId != 0)
                {
                    EditMediaPlanViewModel editMediaPlan = _mediaPlanRepository.EditMediaPlanByMediaPlanId(MediaPlanId);
                    if (editMediaPlan.MediaPlan.LockedByUserId == LoggedOnUser.UserId)
                    {
                        _mediaPlanRepository.MediaPlanUnlock(LoggedOnUser.UserId, MediaPlanId);
                    }
                }
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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
        public ActionResult MediaPlanUnlockFromHomePage(int MediaPlanId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (MediaPlanId != 0)
                {
                    EditMediaPlanViewModel editMediaPlan = _mediaPlanRepository.EditMediaPlanByMediaPlanId(MediaPlanId);            
                    _mediaPlanRepository.MediaPlanUnlock(LoggedOnUser.UserId, MediaPlanId);
                    
                }
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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
        public ActionResult MediaPlanLock(int MediaPlanId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (MediaPlanId != 0)
                {
                    EditMediaPlanViewModel editMediaPlan = _mediaPlanRepository.EditMediaPlanByMediaPlanId(MediaPlanId);               
                    _mediaPlanRepository.MediaPlanLock(LoggedOnUser.UserId, MediaPlanId);
                                      
                }
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success"
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
        public ActionResult MediaPlanCheckLock(int MediaPlanId, string Action)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {                
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (MediaPlanId != 0)
                {
                  err = _mediaPlanRepository.MediaPlanCheckLock(LoggedOnUser.UserId, MediaPlanId, Action);
                }
                return Json(err);
            }
            catch (Exception exc)
            {
                err.ResponseText = exc.Message;
                return Json(err);
            }
        }
        [HttpGet]
        public ActionResult GetMediaPlanForUnlock(int MediaPlanId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                MediaPlanLocked mediaPlanLocked = _mediaPlanRepository.GetLockedMediaPlans(LoggedOnUser.UserId).Where(mp => mp.MediaPlanId == MediaPlanId).FirstOrDefault();
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = mediaPlanLocked
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        #region Functions for Media Plan Summary Page
        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult Summary(int mediaPlanid)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                ManageMediaViewModel mmm = new ManageMediaViewModel();
                mmm.LoggedOnUser = LoggedOnUser;
                mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);

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
                //MediaPlanSummaryViewModel objMediaPlanSummaryViewModel = _mediaPlanRepository.GetMeadiaPlanSummaryHeaderAndDropDown(mediaPlanid, LoggedOnUser.UserId);
                //if (objMediaPlanSummaryViewModel != null)
                //{
                //    objMediaPlanSummaryViewModel.manageMediaViewModel = mmm;
                //}
                ViewBag.MediaPlanId = mediaPlanid;
                if (!mmm.CanSeeMediaPlan)
                {
                    _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Index?UpfrontId=0");
                    return RedirectToAction("Index", "StatusCode", new { StatusCode = 403 });

                }
                else
                {
                    _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Planning");
                }
                return View(mmm);
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }
        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetMediaPlanSummaryData(Int32 MediaPlanId, string BudgetDisplay, string NetworkIds, string BuyTypeGroups, string MediaTypeIds, bool SelectionChanged)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (string.IsNullOrEmpty(BuyTypeGroups) && SelectionChanged)
            {
                BuyTypeGroups = "";
            }
            if (string.IsNullOrEmpty(NetworkIds) && SelectionChanged)
            {
                NetworkIds = "";
            }
            if (string.IsNullOrEmpty(MediaTypeIds) && SelectionChanged)
            {
                MediaTypeIds = "";
            }
            //if(NetworkIds=="" || BuyTypeGroups=="")
            //{
            //    NetworkIds = "";
            //    BuyTypeGroups = "";
            //}
            MediaPlanSummaryViewModel objMediaPlanSummaryViewModel = _mediaPlanRepository.GetMeadiaPlanSummaryHeaderAndDropDown(MediaPlanId, LoggedOnUser.UserId, BudgetDisplay, BuyTypeGroups, NetworkIds, MediaTypeIds);
            return Json(objMediaPlanSummaryViewModel);
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult GetSummaryPublishedToggleMessage(Int32 MediaPlanId, string MediaPlanName)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _mediaPlanRepository.GetSummaryPublishedToggleMessage(MediaPlanId, LoggedOnUser.UserId, MediaPlanName);
            return Json(err);
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult SetUserBudgetDisplay(Int32 MediaPlanId, string DisplayBudgetValue)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Summary_BudgetDisplay_" + Convert.ToString(MediaPlanId), DisplayBudgetValue);
                err = new ErrorMessage
                {
                    Success = true,
                    ResponseCode = 200,
                    ResponseText = "success"
                };
            }
            catch (Exception ex)
            {
                err = new ErrorMessage
                {
                    Success = true,
                    ResponseCode = 200,
                    ResponseText = "Failed to set media plan budget display for user"
                };
            }
            return Json(err);


        }



        #endregion

        #region Functions for BT Group Summary Page
        [HttpGet]
        [SessionExpireChildFilter]
        public ActionResult BuyTypeGroupSummary(int mediaPlanid, string BTGroup)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                ManageMediaViewModel mmm = new ManageMediaViewModel();
                mmm.LoggedOnUser = LoggedOnUser;
                mmm.CanSeeMediaPlan = _mediaPlanRepository.GetMediaPlanPermission(LoggedOnUser.UserId);

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
                ViewBag.MediaPlanId = mediaPlanid;
                ViewBag.BuyTypeGroupName = BTGroup.Replace('_', ' ') + " Summary View";
                ViewBag.BTGroupName = BTGroup.Replace('_', ' ');
                if (!mmm.CanSeeMediaPlan)
                {
                    _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Index?UpfrontId=0");
                    return RedirectToAction("Index", "StatusCode", new { StatusCode = 403 });

                }
                else
                {
                    _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Planning");
                }
                return View(mmm);
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }


        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetMediaPlanBTGroupNetworks(int MediaPlanId, string BuyTypeGroup)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                //List<MediaPlanBTPageNetworks> lstMediaPlanBTPageNetworks = _mediaPlanRepository.GetMediaPlanBTGroupNetworks(MediaPlanId, LoggedOnUser.UserId, BuyTypeGroup);
                //return Json(lstMediaPlanBTPageNetworks);
                MediaPlanBTPageSummaryViewModel objMediaPlanSummaryViewModel = _mediaPlanRepository.GetMeadiaPlanBTPageSummary(MediaPlanId, LoggedOnUser.UserId, BuyTypeGroup);
                return Json(objMediaPlanSummaryViewModel);
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        [RequestSizeLimit(5368709120)]
        public ActionResult SaveMediaPlanProperties(int MediaPlanId,int ClientId,string MediaPlanName, MediaPlanProperties lstProps)
        {
            try
            {
                
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _mediaPlanRepository.SaveMediaPlanProperties(LoggedOnUser.UserId, MediaPlanId, MediaPlanName, ClientId, lstProps);
                
                return Json(err);
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }
        [HttpPost]
        [SessionExpireChildFilter]
        [RequestSizeLimit(5368709120)]
        public ActionResult SaveMediaPlanDRClearance(int MediaPlanId, int ClientId, string MediaPlanName, MediaPlanProperties drClearance)
        {
            try
            {

                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _mediaPlanRepository.SaveMediaPlanDRClearance(LoggedOnUser.UserId, MediaPlanId, MediaPlanName, ClientId, drClearance);

                return Json(err);
            }
            catch (Exception exc)
            {
                throw exc;
            }
        }
        #endregion

        [HttpGet]
        [SessionExpireFilter]
        public ActionResult GetMediaPlanBuyTypes(string BuyTypeGroup)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<SelectListItem> buytypes = _mediaPlanRepository.GetMediaPlanBuyTypes(BuyTypeGroup, LoggedOnUser.UserId).ToList();
                return Json(buytypes);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }
        [HttpGet]
        [SessionExpireFilter]
        public ActionResult GetMediPlanDayPart(string BuyTypeGroup)
        {
            List<SelectListItem> lstDPData = new List<SelectListItem>();
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DayPart> lstDP = _generalRepository.GetAllDayParts(LoggedOnUser.UserId).ToList();
                if (lstDP != null && lstDP.Count > 0)
                {
                    foreach (DayPart dp in lstDP)
                    {
                        lstDPData.Add(new SelectListItem { Value = dp.DayPartId.ToString(), Text = dp.DayPartCd + " (" + dp.DayPartDesc + ")" });
                    }
                }
                return Json(lstDPData);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpGet]
        public ActionResult GetWeeklyBudget(int MediaPlanId)
        {

            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _mediaPlanRepository.GetWeeklyBudget(LoggedOnUser.UserId, MediaPlanId);
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
                });
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MediaPlanAttachment>>> GetAllMediaPlanAttachments(int MediaPlanId)
        {
            var attachments = await _mediaPlanRepository.GetAllMediaPlanAttachmentsAsync(MediaPlanId);
            return Json(new {
                success = true,
                responseCode = 200,
                responseText = "Success",
                data = attachments.ToList()            
            });
        }

        [HttpPost]
        public async Task<IActionResult> UploadFileAttachments(IFormFile File, int MediaPlanId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (LoggedOnUser == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "Unauthorized access!",
                });
            }

            if (File == null || File.Length == 0)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "No file uploaded!",
                });
            }

            try
            {
                FileAttachementResult result = await _mediaPlanRepository.UploadFileAsync(File, MediaPlanId, LoggedOnUser.UserId);

                if (result == null)
                {
                    return StatusCode(500, new { message = "Internal server error while saving the file." });
                }

                if (result.ErrorCode == 409)
                {
                    return Json(new
                    {
                        success = false,
                        responseCode = -1,
                        responseText = "File "  + result.FileName + " already exists in this media plan.",                       
                    });
                }
                
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "File uploaded successfully!",
                    data = result.MediaPlanAttachments.ToList()
                });
            }
            catch (Exception ex)
            {             
                return StatusCode(500, new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "An error occurred while processing your request.",
                    error = ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> DownloadFileAttachments(int MediaPlanId, string FileName)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (LoggedOnUser == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "Unauthorized access!",
                });
            }

            try
            {
                FileStreamResult fileResult = await _mediaPlanRepository.DownloadFileAsync(MediaPlanId, FileName);
                if (fileResult == null)
                {
                    return NotFound(new
                    {
                        success = false,
                        responseCode = -1,
                        responseText = "File not found!",
                    });
                }
                _mediaPlanRepository.MediaPlanLock(LoggedOnUser.UserId, MediaPlanId);
                return fileResult;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "An error occurred while processing your request.",
                    error = ex.Message
                });
            }
        }

        [HttpPost]
        public async Task<IActionResult> DeleteFileAttachments(int MediaPlanId, string FileName, int MediaPlanAttachmentId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (LoggedOnUser == null)
            {
                return Unauthorized(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "Unauthorized access!",
                });
            }

            try
            {
                var deleteResult = await _mediaPlanRepository.DeleteFileAsync(MediaPlanId, FileName, MediaPlanAttachmentId);
                if (deleteResult == null)
                {
                    return StatusCode(500, new
                    {
                        success = false,
                        responseCode = -1,
                        responseText = "Internal server error while deleting the file.",
                    });
                }

                return Json(new
                {
                    success = true,
                    responseCode = deleteResult.ResponseCode,
                    responseText = "File deleted successfully!",
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "An error occurred while processing your request.",
                    error = ex.Message
                });
            }
        }       

        #region Media Plan Notes
        [HttpPost]
        public ActionResult SaveMediaPlanNote(int MediaPlanId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));                
                ErrorMessage em = _mediaPlanRepository.SaveMedialPlanNote(MediaPlanId, LoggedOnUser.UserId,Note,LoggedOnUser.DisplayName);
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
                });
            }
        }

        public ActionResult UpdateMediaPlanNote(int MediaPlanNoteId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _mediaPlanRepository.UpdateMedialPlanNote(MediaPlanNoteId, LoggedOnUser.UserId, Note);
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
                });
            }
        }

        public ActionResult DeleteMediaPlanNote(int MediaPlanNoteId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _mediaPlanRepository.DeleteMediaPlanNote(MediaPlanNoteId, LoggedOnUser.UserId);
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
                });
            }
        }

        [HttpGet]
        public ActionResult GetAllMediaPlanNotes(int MediaPlanId)
        {
            List<MediaPlanNotesModel> lstMediaPlanNotes = new List<MediaPlanNotesModel>();
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                lstMediaPlanNotes = _mediaPlanRepository.GetAllMediaPlansNotes(MediaPlanId, LoggedOnUser.UserId);
                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "success",
                    NotesList = lstMediaPlanNotes                   
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }
        #endregion Media Plan Notes

        #region Media Plan Quick Plan

        public ActionResult GetQuickPlanDetails(int QuarterId, int CountryId, int NetworkId, int DemoId, int BuyTypeGroupId, int CurYear, int BuytypeId, int MediaPlanId,int PlanYear,int PlanQuarterId)
        {
            try
            {
                List<MediaPlanQuickPlan> quickPlanDetails = _mediaPlanRepository.GetQuickPlanDetails(QuarterId, CountryId, NetworkId, DemoId, BuyTypeGroupId, CurYear, BuytypeId, MediaPlanId, PlanYear, PlanQuarterId);

                return Json(new
                {
                    success = true,
                    responseCode = 200,
                    responseText = "Success",
                    responseData = quickPlanDetails
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = exc.Message,
                });
            }
        }

        [HttpPost]
        public ActionResult SaveMediaQuickPlan(MediaPlanQuickPlan mediaPlanQuickPlan)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                mediaPlanQuickPlan.CreatedBy = LoggedOnUser.UserId;
                ErrorMessage em = _mediaPlanRepository.SaveMedialQuickPlan(mediaPlanQuickPlan);
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
                });
            }
        }
        #endregion

    }

}
