using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Net.Http;
using DataTables;
using System.Collections.Specialized;
using System.Data.Common;
using System.Web;
using OM_ScheduleTool.Helpers;
using Microsoft.AspNetCore.Mvc.Rendering;
using Newtonsoft.Json;

namespace OM_ScheduleTool.Controllers
{
    public class UpfrontRemnantController : Controller
    {
        private IConfiguration _config;
        private IUserRepository _userRepository;
        private IUpfrontRepository _upfrontRepository;
        private IRemnantRepository _remnantRepository;
        private INetworkRepository _networkRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private IGeneralRepository _generalRepository;
        private IPropertyRepository _propertyRepository;
        private IBuyTypeRepository _buyTypeRepository;
        private IDealpointRepository _dealpointRepository;
        private IClientRepository _clientRepository;
        private IDemographicSettingsRepository _demoRepository;

        public UpfrontRemnantController(
            IConfiguration config
            , IUserRepository userRepository
            , IUpfrontRepository upfrontRepository
            , IRemnantRepository remnantRepository
            , INetworkRepository networkRepository
            , IAppFeatureRepository appFeatureRepository
            , IGeneralRepository generalRepository
            , IPropertyRepository propertyRepository
            , IBuyTypeRepository buyTypeRepository
            , IDealpointRepository dealpointRepository
            , IClientRepository clientRepository
            , IDemographicSettingsRepository demoRepository
        )
        {
            _config = config;
            _userRepository = userRepository;
            _upfrontRepository = upfrontRepository;
            _remnantRepository = remnantRepository;
            _networkRepository = networkRepository;
            _appFeatureRepository = appFeatureRepository;
            _generalRepository = generalRepository;
            _propertyRepository = propertyRepository;
            _buyTypeRepository = buyTypeRepository;
            _dealpointRepository = dealpointRepository;
            _clientRepository = clientRepository;
            _demoRepository = demoRepository;
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetUpfrontByNetwork(int NetworkId, int BroadcastYr)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<UpfrontPermissions> upfront = _upfrontRepository.GetUpfrontByNetwork(LoggedOnUser.UserId, NetworkId, BroadcastYr);
                return Json(upfront);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetRemnantByNetwork(int NetworkId, int BroadcastYr)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<UpfrontPermissions> remnant = _remnantRepository.GetRemnantByNetwork(LoggedOnUser.UserId, NetworkId, BroadcastYr);
                return Json(remnant);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult LockUpfront(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _upfrontRepository.LockUpfront(LoggedOnUser.UserId, UpfrontId);
                if (err.ResponseCode > 0)
                {
                    return Json(new { success = true, responseText = "Successfully locked upfront." });

                }
                else
                {
                    return Json(new { success = false, responseText = err.ResponseText });
                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult EditUR(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _upfrontRepository.LockUpfront(LoggedOnUser.UserId, UpfrontId);
                if (err.Success == false)
                {
                    return RedirectToAction("500" + @"/" + err.ResponseText, "StatusCode");
                }
                else
                {
                    TempData["UnlockUpfront"] = "0";
                    return View(GetViewUpfrontsViewModel(UpfrontId, false));
                }
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ViewUR(int UpfrontId)
        {
            try
            {
                return View(GetViewUpfrontsViewModel(UpfrontId, true));
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        private ViewUpfrontsViewModel GetViewUpfrontsViewModel(int UpfrontId, bool ViewOnly)
        {
            return GetViewUpfrontsViewModel(UpfrontId, ViewOnly, 0);

        }

        private ViewUpfrontsViewModel GetViewUpfrontsViewModel(int UpfrontId, bool ViewOnly, int UpfrontLineId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            ViewUpfrontsViewModel efm = new ViewUpfrontsViewModel();

            // For setting default values
            efm.LoggedOnUser = LoggedOnUser;
            efm.UpfrontInfo = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);
            if (efm.UpfrontInfo.UpfrontTypeId == 1)
            {
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Remnants?UpfrontId=" + UpfrontId.ToString());
            }
            else
            {
                _userRepository.SetUserProfile(LoggedOnUser.UserId, "ManageMedia_Page", "/ManageMedia/Index?UpfrontId=" + UpfrontId.ToString());
            }
            if (efm.UpfrontInfo.NetworkId.HasValue)
            {
                efm.NetworkInfo = _networkRepository.GetNetwork((int)efm.UpfrontInfo.NetworkId);
            }
            else
            {
                efm.NetworkInfo = null;
            }
            efm.PlanYear = (efm.UpfrontInfo.PlanYrType == "B") ? efm.UpfrontInfo.Quarter.BroadcastYr : efm.UpfrontInfo.Quarter.CalendarYr;
            efm.ViewOnly = ViewOnly;
            efm.UserFeaturePermissionInfo = _appFeatureRepository.GetUserFeaturePermissions(LoggedOnUser.UserId, efm.UpfrontInfo.NetworkId);
            if (efm.UpfrontInfo.UpfrontTypeId == 2)
            {
                efm.UpfrontPermissions = _upfrontRepository.GetUpfrontByNetwork(LoggedOnUser.UserId, efm.NetworkInfo.NetworkId, efm.PlanYear).ToList();
            }
            else
            {
                efm.UpfrontPermissions = _remnantRepository.GetRemnantByNetwork(LoggedOnUser.UserId, efm.NetworkInfo.NetworkId, efm.PlanYear).ToList();
            }

            //efm.UpfrontLines = _upfrontRepository.GetUpfrontRemnantLinesFlat(LoggedOnUser.UserId, UpfrontId, "", "");
            //if (efm.UpfrontLines.Count() > 0)
            //{
            //efm.DemoNamesAvailable = efm.UpfrontLines.Select(s => s.Demo).Distinct();
            //efm.BuyTypeAvailable = efm.UpfrontLines.Select(s => s.BuyTypeDescription).Distinct();
            //}

            efm.DemoNamesAvailable = _upfrontRepository.GetDemoNames(LoggedOnUser.UserId, UpfrontId);
            efm.ApprovedAvailable = _upfrontRepository.GetApproved(LoggedOnUser.UserId, UpfrontId);
            efm.DPAvailable = _generalRepository.GetAllDayParts(LoggedOnUser.UserId);
            efm.OMDPAvailable = _upfrontRepository.GetOMDPs(LoggedOnUser.UserId, UpfrontId);
            efm.BuyTypeAvailable = _upfrontRepository.GetBuyTypes(LoggedOnUser.UserId, UpfrontId);
            efm.CPMAvailable = _upfrontRepository.GetCPM(LoggedOnUser.UserId, UpfrontId);
            efm.LenAvailable = _upfrontRepository.GetLens(LoggedOnUser.UserId, UpfrontId);
            efm.DoNotBuyTypesAvailable = _upfrontRepository.GetDoNotBuyTypes(LoggedOnUser.UserId, UpfrontId);
            efm.ClientsAvailable = _upfrontRepository.GetClients(LoggedOnUser.UserId, UpfrontId);
            efm.RevisionsAvailable = _upfrontRepository.GetRevNo(LoggedOnUser.UserId, UpfrontId);
            efm.RevisedDatesAvailable = _upfrontRepository.GetRateRevisedDates(LoggedOnUser.UserId, UpfrontId);

            if (ViewOnly == true)
            {
                efm.PropertyNamesAvailable = _upfrontRepository.GetPropertyNames(LoggedOnUser.UserId, UpfrontId);
                efm.StartTimesAvailable = _upfrontRepository.GetStartTimes(LoggedOnUser.UserId, UpfrontId);
                efm.EndTimesAvailable = _upfrontRepository.GetEndTimes(LoggedOnUser.UserId, UpfrontId);
                efm.RatesAvailable = _upfrontRepository.GetRateAmt(LoggedOnUser.UserId, UpfrontId);
                efm.ImpressionsAvailable = _upfrontRepository.GetImpressions(LoggedOnUser.UserId, UpfrontId);
            }

            efm.EffectiveDatesAvailable = _generalRepository.GetEffectiveDates(efm.UpfrontInfo.Quarter.QuarterName);
            efm.ExpirationDatesAvailable = _generalRepository.GetExpirationDates(efm.UpfrontInfo.Quarter.QuarterName);

            List<string> Times = new List<string>();
            DateTime dtCurrent = new DateTime(2018, 9, 2, 0, 0, 0);
            while (dtCurrent < DateTime.Parse("9/3/18 00:00 AM"))
            {
                Times.Add(dtCurrent.ToShortTimeString());
                dtCurrent = dtCurrent.AddMinutes(30);
            }

            efm.UpfrontNotes = _upfrontRepository.GetUpfrontRemnantNotes(LoggedOnUser.UserId, UpfrontId).ToList();

            if (ViewOnly == false)
            {
                CreateNewPropertyViewModel prop = new CreateNewPropertyViewModel();
                prop.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                prop.CountryDefault = efm.NetworkInfo.Country.CountryId;

                prop.PlanYearsDefault = efm.PlanYear.ToString();
                prop.QuarterDefault = efm.UpfrontInfo.Quarter;
                prop.UpfrontTypeDefault = efm.UpfrontInfo.UpfrontTypeId;
                prop.PlanTypeDefault = (efm.UpfrontInfo.PlanYrType == null ? "2" : efm.UpfrontInfo.PlanYrType);
                prop.NetworkDefault = efm.NetworkInfo;
                prop.PlanYears = _generalRepository.GetPlanYears().Select(s => s.Value).Distinct();
                prop.DoNotBuyTypes = _propertyRepository.GetDoNotBuyTypes();
                prop.DayParts = _propertyRepository.GetDayParts();
                prop.BuyTypes = _buyTypeRepository.GetBuyTypes(efm.NetworkInfo.NetworkId, LoggedOnUser.UserId, (efm.UpfrontInfo.UpfrontTypeId == 2 ? true : false));
                prop.EffectiveDates = _generalRepository.GetEffectiveDates(efm.UpfrontInfo.Quarter.QuarterName);
                prop.ExpirationDates = _generalRepository.GetExpirationDates(efm.UpfrontInfo.Quarter.QuarterName);
                prop.Upfront = true;

                efm.createNewPropertyViewModel = prop;

            }

            if (UpfrontLineId != 0)
            {
                efm.ProgramChangeUpfrontLine = _upfrontRepository.GetUpfrontLineById(LoggedOnUser.UserId, UpfrontLineId);
            }
            else
            {
                efm.ProgramChangeUpfrontLine = null;
            }



            return efm;
        }

        public string OpenPopup()
        {
            return "<h1> This Is Modeless Popup Window</h1>";
        }

        [SessionExpireChildFilter]
        [LogonLayout("_Plain")]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult TestPage(int UpfrontId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            return View(GetViewUpfrontsViewModel(UpfrontId, false));
        }

        [SessionExpireChildFilter]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Locks()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            return RedirectToAction("298" + @"/" + "This page is currently under construction.", "StatusCode");
        }


        [SessionExpireChildFilter]
        [HttpGet]
        public ActionResult ReloadDataTable(int UpfrontId, bool ViewOnly, int Type)
        {
            if (ModelState.IsValid)
            {
                return PartialView("_DataTable_Edit", GetViewUpfrontsViewModel(UpfrontId, ViewOnly));
            }

            return new EmptyResult();
        }

        [HttpGet]
        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetEditUpfrontData()
        {

            var dbType = "sqlserver";
            var dbConnection = _config.GetConnectionString("DefaultConnection");

            var formData = HttpContext.Request.Form;
            //var request = System.Web.HttpContext.Current.Request;

            List<KeyValuePair<string, string>> dictionary = new List<KeyValuePair<string, string>>();
            //foreach (string key in formData.Keys)
            //{
            //    dictionary.Add(new KeyValuePair<string, string>(key, formData[key]));
            //    Console.WriteLine("{0} - {1}", key, formData[key]);
            //}

            //DtRequest request = new DtRequest(dictionary.AsEnumerable());
            using (var db = new Database(dbType, dbConnection))
            {
                var response = new Editor(db, "UpfrontRemnantLineFlat")
                    .Model<UpfrontRemnantLineFlat>()
                    .Field(new Field("demoName")
                        .Validator(Validation.NotEmpty())
                    )
                    .TryCatch(false)
                    //.Process(formData)
                    .Data();

                return Json(response);
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult SaveDemoName(int UpfrontLineId, int DemographicSettingsId)
        {
            try
            {
                return Json(new
                {
                    success = true
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
        public ActionResult SavePropertyName(int UpfrontLineId, string PropertyName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SavePropertyName(LoggedOnUser.UserId, UpfrontLineId, PropertyName);

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
        public ActionResult SaveDay(int UpfrontLineId, int Checked, int Day /* Monday=1,...*/)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveDay(LoggedOnUser.UserId, UpfrontLineId, (Checked == 1 ? true : false), Day);

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
        public ActionResult SaveStartTime(int UpfrontLineId, string StartTime)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveStartTime(LoggedOnUser.UserId, UpfrontLineId, StartTime);

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
        public ActionResult SaveEndTime(int UpfrontLineId, string EndTime)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveEndTime(LoggedOnUser.UserId, UpfrontLineId, EndTime);

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
        public ActionResult SaveRateAmt(int UpfrontLineId, decimal RateAmt)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveRateAmt(LoggedOnUser.UserId, UpfrontLineId, RateAmt);

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
        public ActionResult SaveImpressions(int UpfrontLineId, decimal Impressions)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveImpressions(LoggedOnUser.UserId, UpfrontLineId, Impressions);

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
        public ActionResult SaveBuyTypeId(int UpfrontLineId, int BuyTypeId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveBuyTypeId(LoggedOnUser.UserId, UpfrontLineId, BuyTypeId);

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
        public ActionResult SaveDayPartId(int UpfrontLineId, int DayPartId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveDayPartId(LoggedOnUser.UserId, UpfrontLineId, DayPartId);

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
        public ActionResult SaveDoNotBuyTypeId(int UpfrontLineId, int DoNotBuyTypeId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveDoNotBuyTypeId(LoggedOnUser.UserId, UpfrontLineId, DoNotBuyTypeId);

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
        public ActionResult SaveMandateClientId(int UpfrontLineId, int MandateClientId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveMandateClientId(LoggedOnUser.UserId, UpfrontLineId, MandateClientId);

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
        public ActionResult SaveEffectiveDate(int UpfrontLineId, string EffectiveDate)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveEffectiveDate(LoggedOnUser.UserId, UpfrontLineId, EffectiveDate);

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
        public ActionResult SaveExpirationDate(int UpfrontLineId, string ExpirationDate)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveExpirationDate(LoggedOnUser.UserId, UpfrontLineId, ExpirationDate);

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
        public ActionResult AutoApprove(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.AutoApprove(LoggedOnUser.UserId, UpfrontId);

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
                    responseCode = -1000,
                    responseText = exc.Message
                });
            }
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetDoNotBuyTypes(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DoNotBuyType> lsStatus = _upfrontRepository.GetDoNotBuyTypes(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsStatus
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
        public ActionResult GetBuyType(int BuyTypeId, string BuyTypeCode)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (BuyTypeId != 0)
            {
                try
                {
                    BuyType bt = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, 1).Where(buyt => buyt.BuyTypeId == BuyTypeId).FirstOrDefault();
                    if (bt == null)
                    {
                        bt = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, 2).Where(buyt => buyt.BuyTypeId == BuyTypeId).FirstOrDefault();
                    }
                    return Json(new
                    {
                        success = true,
                        data = bt,
                        errormsg = ""
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
            else
            {
                try
                {
                    BuyType bt = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, 1).Where(buyt => buyt.BuyTypeCode == BuyTypeCode).FirstOrDefault();
                    if (bt == null)
                    {
                        bt = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, 2).Where(buyt => buyt.BuyTypeCode == BuyTypeCode).FirstOrDefault();
                    }

                    if (bt == null)
                    {
                        return Json(new
                        {
                            success = false,
                            errormsg = "Buy Type not found"
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            success = true,
                            data = bt
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
        }

        [SessionExpireChildFilter]
        public ActionResult GetUpfrontChangeCount(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.GetPropertyChangedCount(LoggedOnUser.UserId, UpfrontId);

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
        public ActionResult SaveUpfrontChanges(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _propertyRepository.SaveUpfrontChanges(LoggedOnUser.UserId, UpfrontId);

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
        public ActionResult GetUpfrontData(int UpfrontId
            , int FirstTime
            , string bt /* buytypes */
            , string de /* demonamesid */
            , string rne /* RevNoExclude */
            , string sl /* SpotLen */
            , string bte /* BuyTypeExclude */
            , bool ViewOnly)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (Request.Form["action"] == "edit")
                {
                    ErrorMessage em = _propertyRepository.UpdateProperty(LoggedOnUser.UserId, Request);
                    if (em.Success == false)
                    {
                        return Json(new
                        {
                            success = em.Success,
                            responseText = em.ResponseText,
                            responseCode = em.ResponseCode
                        });
                    }
                }

                int Sort = 0;
                string searchValue = Request.Form["search[value]"];

                //sortColumn = Request.Form["columns[" + Request.Form["order[0][column]"] + "][name]"];
                string sortColumnDirection = Request.Form["order[0][dir]"];
                if (Request.Form["order[0][column]"].FirstOrDefault() != null)
                {
                    Sort = (int.Parse(Request.Form["order[0][column]"])) * (sortColumnDirection == "asc" ? 1 : -1);
                }

                string demoName = "";
                try
                {
                    demoName = Request.Form["columns[1][search][value]"];
                    if (FirstTime == 1) demoName = "";
                    if (demoName == null) demoName = "";

                }
                catch { }

                string approvedDesc = "";
                try
                {
                    approvedDesc = Request.Form["columns[2][search][value]"];
                    if (FirstTime == 1) approvedDesc = "";
                    if (approvedDesc == null) approvedDesc = "";
                }
                catch { }

                string propertyName = "";
                try
                {
                    propertyName = Request.Form["columns[3][search][value]"];
                    if (FirstTime == 1) propertyName = "";
                    if (propertyName == null) propertyName = "";
                }
                catch { }
                string Monday = "";
                try
                {
                    Monday = Request.Form["columns[4][search][value]"];
                    if (FirstTime == 1) Monday = "";
                    if (Monday == null) Monday = "";
                }
                catch { }

                string Tuesday = "";
                try
                {
                    Tuesday = Request.Form["columns[5][search][value]"];
                    if (FirstTime == 1) Tuesday = "";
                    if (Tuesday == null) Tuesday = "";
                }
                catch { }
                string Wednesday = "";
                try
                {
                    Wednesday = Request.Form["columns[6][search][value]"];
                    if (FirstTime == 1) Wednesday = "";
                    if (Wednesday == null) Wednesday = "";
                }
                catch { }
                string Thursday = "";
                try
                {
                    Thursday = Request.Form["columns[7][search][value]"];
                    if (FirstTime == 1) Thursday = "";
                    if (Thursday == null) Thursday = "";
                }
                catch { }
                string Friday = "";
                try
                {
                    Friday = Request.Form["columns[8][search][value]"];
                    if (FirstTime == 1) Friday = "";
                    if (Friday == null) Friday = "";
                }
                catch { }
                string Saturday = "";
                try
                {
                    Saturday = Request.Form["columns[9][search][value]"];
                    if (FirstTime == 1) Saturday = "";
                    if (Saturday == null) Saturday = "";
                }
                catch { }
                string Sunday = "";
                try
                {
                    Sunday = Request.Form["columns[10][search][value]"];
                    if (FirstTime == 1) Sunday = "";
                    if (Sunday == null) Sunday = "";
                }
                catch { }

                string startTime = "";
                try
                {
                    startTime = Request.Form["columns[11][search][value]"];
                    if (FirstTime == 1) startTime = "";
                    if (startTime == null) startTime = "";
                }
                catch { }

                string endTime = "";
                try
                {
                    endTime = Request.Form["columns[12][search][value]"];
                    if (FirstTime == 1) endTime = "";
                    if (endTime == null) endTime = "";
                }
                catch { }

                string dp = "";
                try
                {
                    dp = Request.Form["columns[13][search][value]"];
                    if (FirstTime == 1) dp = "";
                    if (dp == null) dp = "";
                }
                catch { }

                string omdp = "";
                try
                {
                    omdp = Request.Form["columns[14][search][value]"];
                    if (FirstTime == 1) omdp = "";
                    if (omdp == null) omdp = "";
                }
                catch { }

                string buyType = "";
                try
                {
                    buyType = Request.Form["columns[16][search][value]"];
                    if (FirstTime == 1) buyType = "";
                    if (buyType == null) buyType = "";
                }
                catch { }

                string buyTypeExclude = bte;

                string spotLen = sl;
                try
                {
                    if (spotLen == null)
                    {
                        spotLen = Request.Form["columns[17][search][value]"];
                        if (FirstTime == 1) spotLen = "";
                        if (spotLen == null) spotLen = "";
                    }
                }
                catch { }

                string rate = "";
                try
                {
                    rate = Request.Form["columns[18][search][value]"];
                    if (FirstTime == 1) rate = "";
                    if (rate == null) rate = "";
                }
                catch { }

                string impressions = "";
                try
                {
                    impressions = Request.Form["columns[19][search][value]"];
                    if (FirstTime == 1) impressions = "";
                    if (impressions == null) impressions = "";
                }
                catch { }

                string cpm = "";
                try
                {
                    cpm = Request.Form["columns[20][search][value]"];
                    if (FirstTime == 1) cpm = "";
                    if (cpm == null) cpm = "";
                }
                catch { }

                string status = "";
                try
                {
                    status = Request.Form["columns[21][search][value]"];
                    if (FirstTime == 1) status = "";
                    if (status == null) status = "";
                }
                catch { }

                string clientName = "";
                try
                {
                    clientName = Request.Form["columns[22][search][value]"];
                    if (FirstTime == 1) clientName = "";
                    if (clientName == null) clientName = "";
                }
                catch { }

                string revNo = "";
                try
                {
                    revNo = Request.Form["columns[23][search][value]"];
                    if (FirstTime == 1) revNo = "";
                    if (revNo == null) revNo = "";
                }
                catch { }

                string revNoExclude = rne;

                string revisedDate = "";
                try
                {
                    revisedDate = Request.Form["columns[24][search][value]"];
                    if (FirstTime == 1) revisedDate = "";
                    if (revisedDate == null) revisedDate = "";
                }
                catch { }

                string effectiveDate = "";
                try
                {
                    effectiveDate = Request.Form["columns[25][search][value]"];
                    if (FirstTime == 1) effectiveDate = "";
                    if (effectiveDate == null) effectiveDate = "";
                }
                catch { }

                string expirationDate = "";
                try
                {
                    expirationDate = Request.Form["columns[26][search][value]"];
                    if (FirstTime == 1) expirationDate = "";
                    if (expirationDate == null) expirationDate = "";
                }
                catch { }

                string spBuy = "";
                try
                {
                    spBuy = Request.Form["columns[15][search][value]"];
                    if (FirstTime == 1) spBuy = "";
                    if (spBuy == null) spBuy = "";
                }
                catch { }

                List<UpfrontRemnantLineFlat> remnantLines =
                    _upfrontRepository.GetUpfrontRemnantLinesFlat(LoggedOnUser.UserId
                        , UpfrontId
                        , buyType
                        , demoName.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , approvedDesc.Replace("Select All,", "").Replace("Select All", "")
                        , propertyName.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Monday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Tuesday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Wednesday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Thursday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Friday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Saturday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Sunday.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , startTime.Replace("Select All,", "").Replace("Select All", "")
                        , endTime.Replace("Select All,", "").Replace("Select All", "")
                        , dp.Replace("Select All,", "").Replace("Select All", "")
                        , omdp.Replace("Select All,", "").Replace("Select All", "")
                        , spotLen.Replace("Select All,", "").Replace("Select All", "")
                        , rate.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")//.Replace("$", "").Replace(",", "")
                        , impressions.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , cpm.Replace("\\", "").Replace("$", "").Replace("Select All,", "").Replace("Select All", "")
                        , status.Replace("Select All,", "").Replace("Select All", "")
                        , clientName.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , revNo.Replace("Select All,", "").Replace("Select All", "")
                        , revisedDate.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , effectiveDate.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , expirationDate.Replace("\\", "").Replace("Select All,", "").Replace("Select All", "")
                        , Sort
                        , searchValue
                        , bt
                        , revNoExclude
                        , buyTypeExclude
                        , ViewOnly
                        , spBuy.Replace("Select All,", "").Replace("Select All", "")).ToList();

                Upfront upfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);

                /* CSP -- DON'T REALLY NEED THIS SO I'M REMOVING TEMPORARILY
                List<SelectOptions> demoNames = new List<SelectOptions>();
                foreach (DemographicSettings ds in _propertyRepository.GetDemoNames(upfront.Network.CountryId).ToList())
                {
                    SelectOptions dn = new SelectOptions(ds.DemographicSettingsId.ToString(), ds.DemoName);
                    demoNames.Add(dn);
                }
                */

                List<SelectOptions> dayPartCdOptions = new List<SelectOptions>();
                dayPartCdOptions.Add(new SelectOptions("-1", "Select"));
                foreach (DayPart daypart in _generalRepository.GetAllDayParts(LoggedOnUser.UserId).ToList())
                {
                    SelectOptions dpo = new SelectOptions(daypart.DayPartId.ToString(), daypart.DayPartCd);
                    dayPartCdOptions.Add(dpo);
                }

                List<SelectOptions> omdpOptions = new List<SelectOptions>();
                foreach (string omdps in _upfrontRepository.GetOMDPs(LoggedOnUser.UserId, UpfrontId).ToList())
                {
                    SelectOptions omdpo = new SelectOptions(omdps, omdps);
                    omdpOptions.Add(omdpo);
                }

                // Only options allowed are those that doesn't need ADU
                List<SelectOptions> buyTypeOptions = new List<SelectOptions>();
                buyTypeOptions.Add(new SelectOptions("-1", "Select"));
                foreach (BuyType buytypes in _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, upfront.UpfrontTypeId).ToList())
                {
                    SelectOptions buytypeo = new SelectOptions(buytypes.BuyTypeId.ToString(), buytypes.BuyTypeCode);
                    buyTypeOptions.Add(buytypeo);
                }

                List<SelectOptions> doNotBuyTypeOptions = new List<SelectOptions>();
                doNotBuyTypeOptions.Add(new SelectOptions("-1", "Select"));
                foreach (DoNotBuyType donotbuytypes in _generalRepository.GetAllDoNotBuyTypes(LoggedOnUser.UserId).Where(dnb => dnb.CanBeSelectedFromGrid == true).ToList())
                {
                    SelectOptions donotbuytypeo = new SelectOptions(donotbuytypes.DoNotBuyTypeId.ToString(), donotbuytypes.Description);
                    doNotBuyTypeOptions.Add(donotbuytypeo);
                }

                List<SelectOptions> clientOptions = new List<SelectOptions>();
                clientOptions.Add(new SelectOptions("-1", "Select"));
                foreach (Client clients in _clientRepository.GetAllClientsByCountry(upfront.Network.CountryId).Where(m => m.Active == true).ToList())
                {
                    SelectOptions cliento = new SelectOptions(clients.ClientId.ToString(), clients.ClientName);
                    clientOptions.Add(cliento);
                }

                List<SelectOptions> expirationDatesOptions = new List<SelectOptions>();
                expirationDatesOptions.Add(new SelectOptions("-1", "Select"));
                foreach (DateTime expdate in _generalRepository.GetExpirationDates(upfront.Quarter.QuarterName).ToList())
                {
                    SelectOptions expdates = new SelectOptions(expdate.ToShortDateString(), expdate.ToShortDateString());
                    expirationDatesOptions.Add(expdates);
                }

                List<SelectOptions> effectiveDatesOptions = new List<SelectOptions>();
                effectiveDatesOptions.Add(new SelectOptions("-1", "Select"));
                foreach (DateTime effdate in _generalRepository.GetEffectiveDates(upfront.Quarter.QuarterName).ToList())
                {
                    SelectOptions effdates = new SelectOptions(effdate.ToShortDateString(), effdate.ToShortDateString());
                    effectiveDatesOptions.Add(effdates);
                }

                List<SelectOptions> time30min = new List<SelectOptions>();
                DateTime dtDefault = DateTime.Parse("01/1/2000 00:00");
                while (dtDefault < DateTime.Parse("01/01/2000 00:00"))
                {
                    SelectOptions times = new SelectOptions(dtDefault.ToString("hh:mm tt"), dtDefault.ToString("hh:mm tt"));
                    time30min.Add(times);
                    dtDefault = dtDefault.AddMinutes(30);
                }

                List<SelectOptions> spBuyOptions = new List<SelectOptions>();
                spBuyOptions.Add(new SelectOptions("-1", "Select"));
                spBuyOptions.Add(new SelectOptions("0", ""));
                spBuyOptions.Add(new SelectOptions("1", "SP"));

                int FullCount = 0;
                if (remnantLines.Count() > 0)
                {
                    FullCount = remnantLines[0].FullCount;
                }
                TempData["UnlockUpfront"] = null;
                return Json(new
                {
                    recordsTotal = FullCount,
                    recordsFiltered = remnantLines.Count(),
                    data = remnantLines,
                    //options = demoNames,
                    daypartcdoptions = dayPartCdOptions,
                    omdpoptions = omdpOptions,
                    buytypeoptions = buyTypeOptions,
                    donotbuytypeoptions = doNotBuyTypeOptions,
                    mandateclientoptions = clientOptions,
                    expirationdateoptions = expirationDatesOptions,
                    effectivedateoptions = effectiveDatesOptions,
                    time30options = time30min,
                    spbuyoptions = spBuyOptions,
                    success = true,
                    responseText = "Successfully updated property",
                    responseCode = 0
                });
            }
            catch (Exception exc)
            {
                TempData["UnlockUpfront"] = null;
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1000
                });
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetUpfrontDemoNamesByBuyTypeId(int UpfrontId, string BuyTypeIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                List<DemographicSettings> ds = _upfrontRepository.GetUpfrontDemoNamesByBuyTypeId(LoggedOnUser.UserId, UpfrontId, BuyTypeIds).ToList();

                return Json(new
                {
                    data = ds,
                    count = ds.Count
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    errormsg = exc.Message
                });
            }
        }

        //[SessionExpireChildFilter]
        //[LogonLayout("_LayoutFullNoMenuv2")]
        //public IActionResult UpfrontReport(int UpfrontId, string DR, string bt /* buytypes */, string de /* demonamesid */)
        //{
        //    UpfrontReportViewModel urvm = new UpfrontReportViewModel();
        //    urvm.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
        //    urvm.UpfrontInfo = _upfrontRepository.GetUpfrontById(urvm.LoggedOnUser.UserId, UpfrontId);
        //    urvm.NetworkInfo = _networkRepository.GetNetwork(urvm.UpfrontInfo.Network.NetworkId);
        //    urvm.DealPointInfo = _dealpointRepository.GetDealpoint(urvm.NetworkInfo.NetworkId, urvm.UpfrontInfo.Quarter.BroadcastYr, DR);

        //    // Report Name
        //    if (urvm.UpfrontInfo.UpfrontTypeId == 2)
        //    {
        //        urvm.ReportName = "Master Upfront/Scatter Proposal";
        //    }
        //    else
        //    {
        //        urvm.ReportName = "Master DR Proposal";
        //    }

        //    // Feed Type
        //    urvm.FeedType = urvm.NetworkInfo.FeedType.Description;

        //    // Media
        //    urvm.Media = urvm.NetworkInfo.MediaType.MediaTypeCode;

        //    // Quarter
        //    urvm.Quarter = urvm.UpfrontInfo.Quarter.QuarterName;

        //    // Guaranteed
        //    urvm.Guaranteed = (urvm.NetworkInfo.GuarImp == 0 ? "NO" : "YES");

        //    urvm.UpfrontLines = _upfrontRepository.GetUpfrontRemnantLinesFlat(urvm.LoggedOnUser.UserId, UpfrontId, bt, de);
        //    if (urvm.UpfrontLines != null)
        //    {
        //        urvm.ClientMandatesAvailable = urvm.UpfrontLines.Where(s => s.MandateClientName != "").Select(s => s.MandateClientName).Distinct();
        //    }
        //    var drType = false;
        //    var nonDRType = false;
        //    urvm.IsDRBuyType = false;
        //    urvm.IsDRBT = false;
        //    if (!string.IsNullOrEmpty(bt))
        //    {
        //        var buyTypes = _generalRepository.GetAllBuyTypes(urvm.LoggedOnUser.UserId, urvm.UpfrontInfo.UpfrontTypeId);
        //        string[] arrayBuytypes = bt.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

        //        foreach (string buytype in arrayBuytypes)
        //        {
        //            if (!drType)
        //            {
        //                drType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == true) ? true : false;
        //            }
        //            if (!nonDRType && buytype != "Mirror" && buytype != "Bonus")
        //            {
        //                nonDRType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == false) ? true : false;
        //            }
        //        }
        //        if (urvm.NetworkInfo.Country.CountryShort == "US" && drType && !nonDRType)
        //        {
        //            urvm.IsDRBuyType = true;
        //        }
        //        if (drType && !nonDRType)
        //        {
        //            urvm.IsDRBT = true;
        //        }
        //    }
        //    return View(urvm);
        //}


        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult ProgramChange(int UpfrontId, int UpfrontLineId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            return View(GetViewUpfrontsViewModel(UpfrontId, false, UpfrontLineId));
        }



        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult AddProperty(int UpfrontId)
        {
            return View(GetViewUpfrontsViewModel(UpfrontId, false));
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public FileContentResult ExportToExcel(int UpfrontId, string DR, string bt /* buytypes */, string de /* demonamesid */)
        {
            UpfrontReportViewModel urvm = new UpfrontReportViewModel();
            urvm.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            urvm.UpfrontInfo = _upfrontRepository.GetUpfrontById(urvm.LoggedOnUser.UserId, UpfrontId);
            urvm.NetworkInfo = _networkRepository.GetNetwork(urvm.UpfrontInfo.Network.NetworkId);
            urvm.DealPointInfo = _dealpointRepository.GetDealpoint(urvm.NetworkInfo.NetworkId, urvm.UpfrontInfo.Quarter.BroadcastYr, DR);
            if (urvm.DealPointInfo == null)
            {
                urvm.DealPointInfo = new Dealpoint();
            }

            // Business Info
            urvm.BusinessName = _config.GetSection("OfficeAddress:Business").Value;
            urvm.BusinessStreet1 = _config.GetSection("OfficeAddress:Street1").Value;
            urvm.BusinessCity = _config.GetSection("OfficeAddress:City").Value;
            urvm.BusinessState = _config.GetSection("OfficeAddress:State").Value;
            urvm.BusinessZip = _config.GetSection("OfficeAddress:Zip").Value;
            urvm.BusinessPhone = _config.GetSection("OfficeAddress:Phone").Value;

            // Report Name
            if (urvm.UpfrontInfo.UpfrontTypeId == 2)
            {
                urvm.ReportName = "Master Upfront/Scatter Proposal";
            }
            else
            {
                urvm.ReportName = "Master DR Proposal";
            }

            // Feed Type
            urvm.FeedType = urvm.NetworkInfo.FeedType.Description;

            // Media
            urvm.Media = urvm.NetworkInfo.MediaType.MediaTypeCode;

            // Quarter
            urvm.Quarter = urvm.UpfrontInfo.Quarter.QuarterName;

            // Guaranteed
            urvm.Guaranteed = (urvm.NetworkInfo.GuarImp == 0 ? "NO" : "YES");

            urvm.UpfrontLines = _upfrontRepository.GetUpfrontRemnantLinesFlat(urvm.LoggedOnUser.UserId, UpfrontId, bt, de);
            if (urvm.UpfrontLines != null)
            {
                urvm.ClientMandatesAvailable = urvm.UpfrontLines.Where(s => s.MandateClientName != "").Select(s => s.MandateClientName).Distinct();
            }
            var drType = false;
            var nonDRType = false;
            urvm.IsDRBuyType = false;
            urvm.IsDRBT = false;

            if (!string.IsNullOrEmpty(bt))
            {
                var buyTypes = _generalRepository.GetAllBuyTypes(urvm.LoggedOnUser.UserId, urvm.UpfrontInfo.UpfrontTypeId);
                string[] arrayBuytypes = bt.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);

                foreach (string buytype in arrayBuytypes)
                {
                    if (!drType)
                    {
                        drType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == true) ? true : false;
                    }
                    if (!nonDRType && buytype != "Mirror" && buytype != "Bonus")
                    {
                        nonDRType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == false) ? true : false;
                    }
                }
                if (urvm.NetworkInfo.Country.CountryShort == "US" && drType && !nonDRType)
                {
                    urvm.IsDRBuyType = true;
                }
                if (drType && !nonDRType)
                {
                    urvm.IsDRBT = true;
                }
            }
            //List<Technology> technologies = StaticData.Technologies;
            //string[] columns = { "Name", "Project", "Developer" };
            byte[] filecontent = ExcelExportHelper.ExportExcel(urvm);
            return File(filecontent, ExcelExportHelper.ExcelContentType, urvm.UpfrontInfo.Name.Replace(" ", "") + ".xlsx");
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetUpfrontById(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Upfront UpfrontInfo = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);

                return Json(new
                {
                    success = true,
                    data = UpfrontInfo
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
        public ActionResult GetUpfrontLine(int UpfrontLineId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                UpfrontLine line = _upfrontRepository.GetUpfrontLineById(LoggedOnUser.UserId, UpfrontLineId);

                return Json(new
                {
                    Success = true,
                    RateApproved = line.Rate.Approved,
                    DemoName = line.Rate.DemographicSettingsPerQtr.Demo.DemoName,
                    Status = line.Rate.DoNotBuyType.Description,
                    PropertyName = line.Rate.Property.PropertyName,
                    StartTime = line.Rate.Property.StartTime,
                    EndTime = line.Rate.Property.EndTime,
                    DayPart = line.Rate.Property.DayPart.DayPartCd + " (" + line.Rate.Property.DayPart.DayPartDesc + ")",
                    DayPartId = line.Rate.Property.DayPart.DayPartId,
                    BuyType = line.Rate.BuyType.BuyTypeCode + " (" + line.Rate.BuyType.BuyTypeDescription + ")",
                    Rate = line.Rate.RateAmt,
                    Impressions = line.Rate.Impressions,
                    CPM = (line.Rate.Impressions != 0 ? line.Rate.RateAmt / line.Rate.Impressions : 0),
                    EffectiveDate = line.Rate.EffectiveDate.ToShortDateString(),
                    ExpirationDate = line.Rate.ExpirationDate.ToShortDateString(),
                    Monday = line.Rate.Property.Monday,
                    Tuesday = line.Rate.Property.Tuesday,
                    Wednesday = line.Rate.Property.Wednesday,
                    Thursday = line.Rate.Property.Thursday,
                    Friday = line.Rate.Property.Friday,
                    Saturday = line.Rate.Property.Saturday,
                    Sunday = line.Rate.Property.Sunday
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = exc.Message
                });
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult DeleteProperty(params int[] UpfrontLineId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                string Msg = _propertyRepository.DeleteProperty(LoggedOnUser.UserId, UpfrontLineId);

                return Json(new
                {
                    success = true,
                    responseText = Msg
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
        public ActionResult GetUpfrontRemnantDeleteLines(params int[] UpfrontLineId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<_DeleteProperty> urlines = _upfrontRepository.GetUpfrontRemnantLinesDeleteGroup(LoggedOnUser.UserId, UpfrontLineId);

                return Json(urlines);
            }
            catch
            {
            }

            return Json(true);
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult ApproveProperty(int UpfrontLineId)
        {
            string Message = "";
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Message = _upfrontRepository.ApproveUpfront(LoggedOnUser.UserId, UpfrontLineId);
                return Json(new { success = true, responseText = Message });
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = Message + " " + exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult UnapproveProperty(int UpfrontLineId)
        {
            string Message = "";
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Message = _upfrontRepository.UnapproveUpfront(LoggedOnUser.UserId, UpfrontLineId);
                string[] msg = Message.Split('|');
                if (msg.Length == 2)
                {
                    if (int.Parse(msg[1]) < 0)
                    {
                        return Json(new { success = false, responseText = msg[0] });
                    }
                    else
                    {
                        return Json(new { success = true, responseText = msg[0] });
                    }
                }
                else
                {
                    return Json(new { success = true, responseText = Message });
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = Message + " " + exc.Message });
            }
        }

        [SessionExpireChildFilter]
        public IActionResult GoProgramChange(int UpfrontLineId,
            string ProgramChange_PropertyName,
            string ProgramChange_PropertyName_New,
            string ProgramChange_StartTime_New,
            string ProgramChange_EndTime_New,
            int ProgramChange_DayPart_New,
            decimal ProgramChange_Rate_New,
            decimal ProgramChange_Impressions_New,
            string ProgramChange_EffDt_New,
            string ProgramChange_ExpDt_New,
            bool ProgramChange_Monday,
            bool ProgramChange_Tuesday,
            bool ProgramChange_Wednesday,
            bool ProgramChange_Thursday,
            bool ProgramChange_Friday,
            bool ProgramChange_Saturday,
            bool ProgramChange_Sunday
            )
        {

            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ChangeProgramModel objModel = new ChangeProgramModel();
                //string Status = _propertyRepository.ChangeProgram(
                //    LoggedOnUser.UserId,
                //    UpfrontLineId,
                //    ProgramChange_PropertyName_New,
                //    ProgramChange_Rate_New,
                //    ProgramChange_Impressions_New,
                //    ProgramChange_DayPart_New,
                //    ProgramChange_Monday,
                //    ProgramChange_Tuesday,
                //    ProgramChange_Wednesday,
                //    ProgramChange_Thursday,
                //    ProgramChange_Friday,
                //    ProgramChange_Saturday,
                //    ProgramChange_Sunday,
                //    ProgramChange_StartTime_New,
                //    ProgramChange_EndTime_New,
                //    ProgramChange_EffDt_New,
                //    ProgramChange_ExpDt_New
                //    );
                //ST-946
                try
                {
                    objModel = _propertyRepository.ChangeProgram(
                    LoggedOnUser.UserId,
                    UpfrontLineId,
                    ProgramChange_PropertyName_New,
                    ProgramChange_Rate_New,
                    ProgramChange_Impressions_New,
                    ProgramChange_DayPart_New,
                    ProgramChange_Monday,
                    ProgramChange_Tuesday,
                    ProgramChange_Wednesday,
                    ProgramChange_Thursday,
                    ProgramChange_Friday,
                    ProgramChange_Saturday,
                    ProgramChange_Sunday,
                    ProgramChange_StartTime_New,
                    ProgramChange_EndTime_New,
                    ProgramChange_EffDt_New,
                    ProgramChange_ExpDt_New
                    );

                    if (!string.IsNullOrEmpty(objModel.Message))
                    {
                        string[] retStatus = objModel.Message.Split('|');
                        if (retStatus.Length == 2)
                        {
                            int PropertyId = int.Parse(retStatus[0]);
                            if (PropertyId < 0)
                            {
                                return Json(new
                                {
                                    success = false,
                                    responseText = retStatus[1]
                                });
                            }
                            else
                            {
                                return Json(new
                                {
                                    success = true,
                                    responseText = "Program successfully changed."
                                });
                            }
                        }
                        else
                        {
                            return Json(new
                            {
                                success = false,
                                responseText = retStatus
                            });
                        }
                    }
                    else
                    {
                        return Json(new
                        {
                            success = false,
                            responseText = objModel.AutoApprove.ToString() + "|" + objModel.CurrentlyApproved.ToString()
                        }); ;
                    }
                }
                catch
                {
                    return Json(new
                    {
                        success = false,
                        responseText = objModel.AutoApprove.ToString() + "|" + objModel.CurrentlyApproved.ToString()
                    });
                }
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
        public ActionResult GetUpfrontRemnantReviseLines(int UpfrontId, bool DRRateRevise)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<_ReviseEstimate> urlines = _remnantRepository.GetUpfrontRemnantLinesReviseLines(LoggedOnUser.UserId, UpfrontId, DRRateRevise);

                return Json(new
                {
                    success = true,
                    recordsTotal = 0,
                    recordsFiltered = urlines.Count(),
                    data = urlines
                });

                //return Json(urlines);
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<_ReviseEstimate>(),
                    responseText = exc.Message
                });
            }

        }

        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult ReviseEstimate(string UpfrontLineIds, string BuytypeCodes)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _remnantRepository.ReviseEstimate(LoggedOnUser.UserId, UpfrontLineIds, BuytypeCodes);


                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
                //return Json(urlines);
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
        public ActionResult ReviseDRRates(string UpfrontLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage em = _remnantRepository.ReviseDRRates(LoggedOnUser.UserId, UpfrontLineIds);


                return Json(new
                {
                    success = em.Success,
                    responseCode = em.ResponseCode,
                    responseText = em.ResponseText
                });
                //return Json(urlines);
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
        public ActionResult IsLocked(int NetworkId, int QuarterId, int UpfrontTypeId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                User UpfrontLockedBy = _upfrontRepository.IsLocked(LoggedOnUser.UserId, NetworkId, QuarterId, UpfrontTypeId);

                if (UpfrontLockedBy == null)
                {
                    return Json(new
                    {
                        success = false,
                        responseText = "",

                    });
                }
                else
                {
                    if (UpfrontLockedBy.UserId != LoggedOnUser.UserId)
                    {
                        return Json(new
                        {
                            success = true,
                            responseText = (UpfrontTypeId == 2 ? "Upfront " : "Remnant ") + "is currently locked by " + UpfrontLockedBy.DisplayName + ".",
                            userData = UpfrontLockedBy
                        });
                    }
                    else
                    {
                        return Json(new
                        {
                            success = false,
                            responseText = "YOU have it locked.",

                        });
                    }
                }
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
        public ActionResult GetDemoNames(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DemoNames> lsDemoNames = _upfrontRepository.GetDemoNames(LoggedOnUser.UserId, UpfrontId);

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

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetPropertyNames(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<Property> lsPropertyName = _upfrontRepository.GetPropertyNames(LoggedOnUser.UserId, UpfrontId);

                return Json(new
                {
                    success = true,
                    data = lsPropertyName
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
        public ActionResult GetStartTimes(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsStartTimes = _upfrontRepository.GetStartTimes(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsStartTimes
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
        public ActionResult GetEndTimes(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsEndTimes = _upfrontRepository.GetEndTimes(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsEndTimes
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
        public ActionResult GetApproved(int UpfrontId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsApproved = _upfrontRepository.GetApproved(LoggedOnUser.UserId, UpfrontId);

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
        public ActionResult GetDayParts(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DayPart> lsDayPart = _upfrontRepository.GetDPs(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsDayPart
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
        public ActionResult GetOMDPs(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsOMDP = _upfrontRepository.GetOMDPs(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsOMDP
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
        public ActionResult GetBuyTypes(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<BuyType> lsBuyType = _upfrontRepository.GetBuyTypes(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsBuyType
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
        public ActionResult GetLens(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsSpotLen = _upfrontRepository.GetLens(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsSpotLen
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
        public ActionResult GetRateAmts(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsRateAmt = _upfrontRepository.GetRateAmt(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsRateAmt
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
        public ActionResult GetImpressions(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsImpressions = _upfrontRepository.GetImpressions(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsImpressions
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
        public ActionResult GetCPM(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<double> lsCPM = _upfrontRepository.GetCPM(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsCPM
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
        public ActionResult GetClients(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<Client> lsClients = _upfrontRepository.GetClients(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsClients
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
        public ActionResult GetRevisions(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsRevNo = _upfrontRepository.GetRevNo(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsRevNo
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
        public ActionResult GetRevisedDates(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsRevDates = _upfrontRepository.GetRateRevisedDates(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsRevDates
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
        public ActionResult GetEffectiveDates(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsEffDates = _upfrontRepository.GetEffectiveDates(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsEffDates
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
        public ActionResult GetExpirationDates(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DateTime> lsExpDates = _upfrontRepository.GetExpirationDates(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsExpDates
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
        public ActionResult GetWeekDay(int UpfrontId, string PropertyNames, int WeekDayId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<bool> lstDaysOptions = _upfrontRepository.GetWeekDay(LoggedOnUser.UserId, UpfrontId, PropertyNames, WeekDayId);

                return Json(new
                {
                    success = true,
                    data = lstDaysOptions
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
        public ActionResult IsSessionActive()
        {
            try
            {
                if (HttpContext.Session.GetString("AccountName") != null && HttpContext.Session.GetString("AccountName") != "")
                {
                    return Json(new
                    {
                        success = true,
                        responseText = ""
                    });
                }
                else
                {
                    return Json(new
                    {
                        success = false,
                        responseText = ""
                    });
                }
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
        public ActionResult GetSPBuy(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> lsSPBuy = _upfrontRepository.GetSPBuy(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = lsSPBuy
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
        public ActionResult CreateUpfront(int NetworkId, string QName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _upfrontRepository.CreateUpfront(NetworkId, QName, LoggedOnUser.UserId);


                if (err.Success == true)
                {
                    err.ResponseText = "Upfront is created successfully";
                }

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText
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
        public ActionResult CreateRemnant(int NetworkId, string QName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _remnantRepository.CreateRemnant(NetworkId, QName, LoggedOnUser.UserId);


                if (err.Success == true)
                {
                    err.ResponseText = "Remnant is created successfully";
                }

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText
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
        public ActionResult SaveSPBuy(int UpfrontLineId, string SPBuy)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (SPBuy == "-1")
                {
                    return Json(new
                    {
                        success = false,
                        responseCode = "-1",
                        responseText = "Please select SP Buy",
                    });
                }
                ErrorMessage em = _propertyRepository.SaveSPBuy(LoggedOnUser.UserId, UpfrontLineId, SPBuy);

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
        public ActionResult BuyTypeValidation(int upfrontId, string bt)
        {
            var drType = false;
            var nonDRType = false;
            var result = "";
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                if (!string.IsNullOrEmpty(bt))
                {
                    string[] arrayBuytypes = bt.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    var buyTypes = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, upfrontId).UpfrontTypeId);
                    var bBuyType = false;
                    var mBuyType = false;
                    if (arrayBuytypes.Length == 1 || arrayBuytypes.Length == 2)
                    {
                        foreach (string buytype in arrayBuytypes)
                        {
                            if (buytype == "Mirror") { mBuyType = true; }
                            if (buytype == "Bonus") { bBuyType = true; }
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
                            drType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == true) ? true : false;
                        }
                        if (!nonDRType && buytype != "Mirror" && buytype != "Bonus")
                        {
                            nonDRType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == false) ? true : false;
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
        [SessionExpireChildFilter]
        public ActionResult CheckDealPoint(int upfrontId, string bt)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            try
            {
                if (!string.IsNullOrEmpty(bt))
                {

                    var drType = false;
                    var nonDRType = false;
                    string[] arrayBuytypes = bt.Split(new[] { ',' }, StringSplitOptions.RemoveEmptyEntries);
                    var upfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, upfrontId);
                    var country = _networkRepository.GetNetwork((int)upfront.Network.NetworkId).Country.CountryShort;
                    var buyTypes = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, upfront.UpfrontTypeId);

                    foreach (string buytype in arrayBuytypes)
                    {
                        if (!drType)
                        {
                            drType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == true) ? true : false;
                        }
                        if (!nonDRType && buytype != "Mirror" && buytype != "Bonus")
                        {
                            nonDRType = (buyTypes.Where(x => x.BuyTypeDescription == buytype).Select(x => x.DRType).Single() == false) ? true : false;
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
                        var dealpoint = _dealpointRepository.GetDealpoint((int)upfront.Network.NetworkId, upfront.Quarter.BroadcastYr, "UP");
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


        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetQuartersForAddProperty(int PlanYear, int BroadcastQtrNumber, int EditedURYear)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<string> listQuarters = _upfrontRepository.GetQuartersForAddProperty(PlanYear, BroadcastQtrNumber, EditedURYear, LoggedOnUser.UserId);

                return Json(new
                {
                    success = true,
                    data = listQuarters
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
        public ActionResult GetQuarterlyAvailableProperties(string QuarterName, int CountryId, int NetworkId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<PropModel> props = _upfrontRepository.GetAvailablePropertiesForQuater(QuarterName, CountryId, NetworkId, LoggedOnUser.UserId).ToList();

                // return new JsonResult(JsonConvert.SerializeObject(props));
                //var data= Json(new
                //{
                //    recordsTotal = props.Count(),
                //    recordsFiltered = props.Count(),
                //    data = props,
                //    success = true,
                //    responseText = "",
                //    responseCode = 0
                //});
                return Json(new
                {
                    recordsTotal = props.Count(),
                    recordsFiltered = props.Count(),
                    data = props,
                    success = true,
                    responseText = "",
                    responseCode = 0
                });
                //return data;
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<QuartersProperty>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }
        [HttpGet]
        [SessionExpireChildFilter]
        public IActionResult GetQuarterlyAvailableProperties_2(string QuarterName, int CountryId, int NetworkId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<QuartersProperty> props = new List<QuartersProperty>();//_upfrontRepository.GetAvailablePropertiesForQuater(QuarterName, CountryId, NetworkId, LoggedOnUser.UserId).ToList();

                 return new JsonResult(JsonConvert.SerializeObject(props));
                //var data = Json(new
                //{
                //    recordsTotal = props.Count(),
                //    recordsFiltered = props.Count(),
                //    data = props,
                //    success = true,
                //    responseText = "",
                //    responseCode = 0
                //});
                //return Json(new
                //{
                //    recordsTotal = props.Count(),()
                //    recordsFiltered = props.Count(),
                //    data = props,
                //    success = true,
                //    responseText = "",
                //    responseCode = 0
                //});
               // return data;
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<QuartersProperty>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }


        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetAllDemos(int CountryId, int PlanYr)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettings> ds = new List<DemographicSettings>();
                //ds = _propertyRepository.GetDemoNames(CountryId);

                List<DemographicSettingsUniverse> demouniv = _demoRepository.GetDemoUniverse(CountryId, PlanYr, LoggedOnUser.UserId, 0, 0);

                //SelectList obgNUJ = new SelectList(ds, "DemographicSettingsId", "DemoName", 0);
                //return Json(obgNUJ);

                return Json(new
                {
                    //data = ds,
                    data = demouniv,
                    success = true,
                    responseText = "",
                    responseCode = 0
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
        public ActionResult GetBuyTypesForQuarterAddProperties(int UpfrontTypeId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            try
            {
                List<BuyType> bt = _generalRepository.GetAllBuyTypes(LoggedOnUser.UserId, UpfrontTypeId).ToList();

                return Json(new
                {
                    success = true,
                    data = bt,
                    errormsg = ""
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
        public ActionResult CheckQuarterlyPropertyCanCreate(string ExistingRateIds, string ProposedDemosIds,
            string ProposedQuarterName, int CopyRateImp, int ProposedBuyTypeId, int UpfrontTypeId, int UpfrontId, bool IsCreatePropertyRates)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                IEnumerable<PropModel> props = _upfrontRepository.CheckQuarterlyPropertyCanCreate
                                                            (
                                                                ExistingRateIds, ProposedDemosIds, ProposedQuarterName,
                                                                CopyRateImp, ProposedBuyTypeId, UpfrontTypeId, UpfrontId,
                                                                IsCreatePropertyRates, LoggedOnUser.UserId
                                                            );
                return Json(props);
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<QuartersProperty>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }



        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetDRAvailableEstimateVerions(int NetworkId, string QuarterName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DREtimateVerions> listDREtimateVerions = _upfrontRepository.GetDRAvailableEstimateVerions(NetworkId, QuarterName, LoggedOnUser.UserId);

                List<SelectOptions> drExpirationDatesOptions = new List<SelectOptions>();
                drExpirationDatesOptions.Add(new SelectOptions("-1", "Select"));
                foreach (DateTime expdate in _generalRepository.GetExpirationDates(QuarterName).ToList())
                {
                    SelectOptions expdates = new SelectOptions(expdate.ToShortDateString(), expdate.ToShortDateString());
                    drExpirationDatesOptions.Add(expdates);
                }

                List<SelectOptions> drEffectiveDatesOptions = new List<SelectOptions>();
                drEffectiveDatesOptions.Add(new SelectOptions("-1", "Select"));
                foreach (DateTime effdate in _generalRepository.GetEffectiveDates(QuarterName).ToList())
                {
                    SelectOptions effdates = new SelectOptions(effdate.ToShortDateString(), effdate.ToShortDateString());
                    drEffectiveDatesOptions.Add(effdates);
                }

                List<SelectOptions> drclientOptions = new List<SelectOptions>();
                drclientOptions.Add(new SelectOptions("-1", "Select"));
                foreach (Client clients in _clientRepository.GetAllClientsByCountry(5).Where(m => m.Active == true).ToList())
                {
                    SelectOptions cliento = new SelectOptions(clients.ClientId.ToString(), clients.ClientName);
                    drclientOptions.Add(cliento);
                }


                return Json(new
                {
                    recordsTotal = listDREtimateVerions.Count(),
                    recordsFiltered = listDREtimateVerions.Count(),
                    data = listDREtimateVerions,
                    drexpirationdateoptions = drExpirationDatesOptions,
                    dreffectivedateoptions = drEffectiveDatesOptions,
                    drmandateclientoptions = drclientOptions,
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
                    data = new List<DREtimateVerions>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }


        [HttpPost]
        [SessionExpireChildFilter]
        public ActionResult GetDRAvailableProperties(int NetworkId, string QuarterName, int EstimateVersion)
        {

            //NetworkId = 190; QuarterName = "3Q2022"; EstimateVersion = 1;
            //NetworkId = 341; QuarterName = "3Q2022"; EstimateVersion = 1;
            try
            {
                //Upfront upfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<PropModel> props = _upfrontRepository.GetDRAvailableProperties(NetworkId, QuarterName, EstimateVersion, LoggedOnUser.UserId);

                return Json(new
                {
                    recordsTotal = props.Count(),
                    recordsFiltered = props.Count(),
                    data = props,
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
                    data = new List<QuartersProperty>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }



        [HttpPost]
        [SessionExpireChildFilter]
        //public ActionResult DRCheckProperties([FromForm] IFormCollection lstDRSelectedProperties) //, int NetworkId, string QuarterName, int EstimateVersion)
        //public ActionResult DRCheckProperties(List<List<DRQuartersProperty>> lstDRSelectedProperties) //, int NetworkId, string QuarterName, int EstimateVersion)
        public ActionResult DRCheckProperties(List<DRQuartersProperty> lstDRSelectedProperties, int NetworkId, string QuarterName, int EstimateVersion, int IsCreateDRPropertyRates)
        {

            try
            {

                //foreach (var item in lstDRSelectedProperties.Keys)
                //{
                //    var lstDRProperties = JsonConvert.DeserializeObject<List<DRQuartersProperty>>(item);
                //}
                //var lstDRProperties = JsonConvert.DeserializeObject<List<DRQuartersProperty>>(lstDRSelectedProperties.keys);

                //Upfront upfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<PropModel> drProps = _upfrontRepository.DRCheckProperties(NetworkId, QuarterName, EstimateVersion, IsCreateDRPropertyRates, lstDRSelectedProperties, LoggedOnUser.UserId);

                //return Json(1);

                return Json(drProps);
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    recordsTotal = 0,
                    recordsFiltered = 0,
                    data = new List<QuartersProperty>(),
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }

        }
        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GerUpfrontHeader(int UpfrontId, string PropertyNames)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                UpfrontHeaderViewModel objHeader= _upfrontRepository.GetUpfrontHeader(LoggedOnUser.UserId, UpfrontId, PropertyNames);

                return Json(new
                {
                    success = true,
                    data = objHeader
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
    }
}





