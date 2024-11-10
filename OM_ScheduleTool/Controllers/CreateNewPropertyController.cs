using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class CreateNewPropertyController : Controller
    {
        private IAppFeatureRepository _appFeatureRepository;
        private IBuyTypeRepository _buyTypeRepository;
        private IClientRepository _clientRepository;
        private IConfiguration _config;
        private IDemographicSettingsRepository _demoRepository;
        private IGeneralRepository _generalRepository;
        private ILogger<CreateNewPropertyController> _logger;
        private INetworkRepository _networkRepository;
        private IPropertyRepository _propertyRepository;
        private IUserRepository _userRepository;

        public CreateNewPropertyController(IAppFeatureRepository appFeatureRepository
            , IBuyTypeRepository buyTypeRepository
            , IClientRepository clientRepository
            , IConfiguration config
            , IDemographicSettingsRepository demoRepository
            , IGeneralRepository generalRepository
            , ILogger<CreateNewPropertyController> logger
            , INetworkRepository networkRepository
            , IPropertyRepository propertyRespository
            , IUserRepository userRepository)
        {
            _appFeatureRepository = appFeatureRepository;
            _buyTypeRepository = buyTypeRepository;
            _clientRepository = clientRepository;
            _config = config;
            _demoRepository = demoRepository;
            _generalRepository = generalRepository;
            _logger = logger;
            _networkRepository = networkRepository;
            _propertyRepository = propertyRespository;
            _userRepository = userRepository;
        }


        [SessionExpireFilter]
        public IActionResult Index(int PlanYr, string Qtr, string PlanType, string NetworkId, int NoMenu)
        {
            CreateNewPropertyViewModel prop = new CreateNewPropertyViewModel();
            Network blankNetwork = new Network();
            blankNetwork.NetworkId = 0;
            Quarter blankQuarter = new Quarter();
            blankQuarter.QuarterId = 0;
            prop.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            prop.PlanYearsDefault = PlanYr.ToString();
            prop.QuarterDefault = (Qtr == null? null : _generalRepository.GetQuarters(PlanYr, prop.LoggedOnUser.UserId).Where(q => q.QuarterName == Qtr).FirstOrDefault());
            prop.PlanTypeDefault = (PlanType == null? "2" : PlanType);
            prop.NetworkDefault = (NetworkId == null? null : (_networkRepository.GetAllNetworks().Where(n => n.NetworkId == int.Parse(NetworkId))).FirstOrDefault());
            prop.PlanYears = _generalRepository.GetPlanYears().Select(s => s.Value).Distinct();
            prop.DoNotBuyTypes = _propertyRepository.GetDoNotBuyTypes();
            prop.DayParts = _propertyRepository.GetDayParts();
            prop.NoMenu = NoMenu;

            prop.Countries = _generalRepository.GetAllCountries();
            prop.CountryDefault = (prop.LoggedOnUser.CA_User == true && prop.LoggedOnUser.US_User == false ? 5 : 2 );

            return View(prop);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetNetworks(int CountryId)
        {
            try
            {
                List<Network> network = new List<Network>();
                network = _propertyRepository.GetNetworks(CountryId);
                SelectList obgNetwork = new SelectList(network, "NetworkId", "StdNetName", 0);
                return Json(obgNetwork);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetQuarters(int Year)
        {
            try
            {
                List<Quarter> quarters = new List<Quarter>();
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                quarters = _generalRepository.GetQuarters(Year, LoggedOnUser.UserId).ToList();
                SelectList obgQtr = new SelectList(quarters, "QuarterId", "QuarterName");
                return Json(obgQtr);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetUniqueNetworkByUserID(int CountryId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<Network> nuj = _networkRepository.GetUniqueNetworkByUserID(LoggedOnUser.UserId, CountryId).ToList();

                SelectList obgNUJ = new SelectList(nuj, "NetworkId", "StdNetName", 0);
                return Json(obgNUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        /*
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetDemoNames(int CountryId, int NetworkId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettings> ds = new List<DemographicSettings>();
                ds = _propertyRepository.GetDemoNames (CountryId);

                SelectList obgNUJ = new SelectList(ds, "DemographicSettingsId", "DemoName", 0);
                return Json(obgNUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }
        */


        /*
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetDemoNames(int CountryId, int NetworkId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettings> ds = new List<DemographicSettings>();
                ds = _propertyRepository.GetDemoNames (CountryId);

                SelectList obgNUJ = new SelectList(ds, "DemographicSettingsId", "DemoName", 0);
                return Json(obgNUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }
        */


        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetBuyTypes(int NetworkId, bool Upfront)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<BuyType> buytypes = _buyTypeRepository.GetBuyTypes(NetworkId, LoggedOnUser.UserId, Upfront).ToList();

                SelectList obgbuytype = new SelectList(buytypes, "BuyTypeId", "BuyTypeCode", 0);
                return Json(obgbuytype);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetClients(int CountryId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<Client> clients = _clientRepository.GetAllClientsByCountry(CountryId).Where(m => m.Active == true).ToList();

                SelectList obgclients = new SelectList(clients, "ClientId", "ClientName", 0);
                return Json(obgclients);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetEffectiveDates (string QtrName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                // Quarter quarter = _propertyRepository.GetQuarter(QtrName);

                List<string> qtrs = new List<string>();
                foreach (DateTime dates in _generalRepository.GetEffectiveDates(QtrName))
                {
                    qtrs.Add(dates.ToString("MM/dd/yyyy"));
                }

                if (qtrs.Count > 0)
                {
                    SelectList obgbuytype = new SelectList(qtrs);
                    return Json(obgbuytype);
                }
                else
                {
                    return Json(new SelectList(Enumerable.Empty<SelectListItem>()));
                }
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetExpirationDates (string QtrName, string EffectiveDate)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<string> qtrs = new List<string>();
                foreach (DateTime dates in _generalRepository.GetExpirationDates(QtrName))
                {
                    if (EffectiveDate == null)
                    {
                        qtrs.Add(dates.ToString("MM/dd/yyyy"));
                    }
                    else
                    {
                        try
                        {
                            if (dates > DateTime.Parse(EffectiveDate))
                            {
                                qtrs.Add(dates.ToString("MM/dd/yyyy"));
                            }
                        }
                        catch
                        {
                            qtrs.Add(dates.ToString("MM/dd/yyyy"));
                        }
                    }
                }


                if (qtrs.Count > 0)
                {
                    SelectList obgbuytype = new SelectList(qtrs);
                    return Json(obgbuytype);
                }
                else
                {
                    return Json(new SelectList(Enumerable.Empty<SelectListItem>()));
                }
            }
            catch (Exception)
            {
                return Json(new SelectList(Enumerable.Empty<SelectListItem>()));
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetDemoNames(int CountryId, int PlanYr, int BuyTypeId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettingsUniverse> demouniv = _demoRepository.GetDemoUniverse(CountryId, PlanYr, LoggedOnUser.UserId, 0, BuyTypeId);

                return Json(demouniv);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult CalculateRates(int CountryId, bool DRType, double RateAmt, double Impressions)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                DemoRateCalculator democalc = _demoRepository.CalculateRates (LoggedOnUser.UserId, CountryId, DRType, RateAmt, Impressions);

                return Json(democalc);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }



        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddNewProperty(int NetworkId, int QuarterId, string PropertyName,  int DayPartId
            , bool Monday, bool Tuesday, bool Wednesday, bool Thursday, bool Friday, bool Saturday, bool Sunday
            , string StartTime, string EndTime, int BuyTypeId, int DoNotBuyTypeId, int MandateClientId, bool Upfront, bool SPBuy)
        {

            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                string Message = _propertyRepository.AddNewProperty(LoggedOnUser.UserId, NetworkId, QuarterId, PropertyName, DayPartId
                    , Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, StartTime, EndTime, BuyTypeId
                    , DoNotBuyTypeId, MandateClientId, Upfront, SPBuy);

                int PropertyId = -1;
                if (int.TryParse(Message, out PropertyId) == true)
                {
                    return Json(new { success = true, propertyId = PropertyId, responseText = "New property successfully created." });
                }
                else
                {
                    return Json(new { success = false, propertyId = -1, responseText = Message });
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }
        [HttpPost]
        public ActionResult GetUpdatedPropertyChangedCount(int UpfrontId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _propertyRepository.GetPropertyChangedCount(LoggedOnUser.UserId, UpfrontId);

            return Json(new { success = err.Success, responseCode = err.ResponseCode, responseText = err.ResponseText });
        }

        /*
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult UpdateProperty(int UpfrontLineId
    , bool Approved
    , string PropertyName
    , bool Monday
    , bool Tuesday
    , bool Wednesday
    , bool Thursday
    , bool Friday
    , bool Saturday
    , bool Sunday
    , string StartTime
    , string EndTime
    , int DayPartId
    , int BuyTypeId
    , string Rate
    , string Impressions
    , int Status
    , int DoNotBuyTypeId
    , int MandateClientId
    , string EffectiveDate
    , string ExpirationDate)
        {
            string Message = "";
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                bool RetVal = _propertyRepository.UpdateProperty(LoggedOnUser.UserId
                    , UpfrontLineId
                    , Approved
                    , PropertyName
                    , Monday
                    , Tuesday
                    , Wednesday
                    , Thursday
                    , Friday
                    , Saturday
                    , Sunday
                    , StartTime
                    , EndTime
                    , DayPartId
                    , BuyTypeId
                    , Rate
                    , Impressions
                    , Status
                    , DoNotBuyTypeId
                    , MandateClientId
                    , EffectiveDate
                    , ExpirationDate
                    , ref Message);

                if (RetVal == true)
                {
                    return Json(new { success = true, responseText = Message });
                }
                else
                {
                    return Json(new { success = false, responseText = Message });
                }
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = Message + " " + exc.Message });
            }
        }
        */

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult AddNewPropertyRates(
            string DemoName
            , int PropertyId
            , int DemographicSettingsId
            , int BuyTypeId
            //, int Rate
            //, int Impressions
            ,decimal Rate
            , decimal Impressions
            , int DoNotBuyTypeId
            , string EffectiveDate
            , string ExpirationDate
            , int MandateClientId
            , bool IsUpfront
            )
        {
            try
            {

                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Property prop = _propertyRepository.GetPropertyById(LoggedOnUser.UserId, PropertyId);

                if (prop != null)
                {
                    ErrorMessage em = _propertyRepository.AddNewPropertyRates(
                        LoggedOnUser.UserId
                        , prop.PropertyId
                        , prop.QuarterId
                        , DemographicSettingsId
                        , BuyTypeId
                        , Rate
                        , Impressions
                        , DoNotBuyTypeId
                        , EffectiveDate
                        , ExpirationDate
                        , MandateClientId
                        , IsUpfront);

                    return Json(new { success = em.Success, responseCode = em.ResponseCode, responseText = em.ResponseText });
                }
                else
                {
                    return Json(new { success = false, responseCode=-200, responseText = "Property rate not created.  " + DemoName + " not saved." });
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return Json(new { success = false, responseCode = -200, responseText = exc.Message + ". " + DemoName + " not saved." });
            }
        }

        //[HttpPost]
        //[SessionExpireFilter]
        //public ActionResult SaveRateAmount(int UpfrontLineId, decimal Rate)
        //{
        //    User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
        //    ErrorMessage err = _propertyRepository.SaveRateAmt(LoggedOnUser.UserId, UpfrontLineId, Rate);

        //    return Json(new { success = err.Success, responseCode = err.ResponseCode, responseText = err.ResponseText });
        //}
    }
}
