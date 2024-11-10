using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using OM_ScheduleTool.Common;

namespace OM_ScheduleTool.Controllers
{
    public class CanadianExchangeController : Controller
    {
        private IConfiguration _config;

        private IAppFeatureRepository _appFeatureRepository;
        private ICanadianExchangeRateRepository _canadianExchangeRateRepository;
        private IClientRepository _clientRepository;
        private IGeneralRepository _generalRepository;
        private IUserRepository _userRepository;

        public CanadianExchangeController(
              IUserRepository userRepository
            , IAppFeatureRepository appFeatureRepository 
            , ICanadianExchangeRateRepository canadianExchangeRateRepository
            , IClientRepository clientRepository
            , IGeneralRepository generalRepository
            , IConfiguration config)
        {
            _appFeatureRepository = appFeatureRepository;
            _canadianExchangeRateRepository = canadianExchangeRateRepository;
            _clientRepository = clientRepository;
            _generalRepository = generalRepository;
            _userRepository = userRepository;
            _config = config;
        }

        /*
         * HomePage for Canadian Exchange Rates
         */
        [SessionExpireFilter]
        public IActionResult Index()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            CanadianExchangeViewModel cevw = new CanadianExchangeViewModel();
            cevw.LoggedOnUser = LoggedOnUser;
            cevw.PlanYears = _generalRepository.GetPlanYears();
            cevw.Clients = _clientRepository.GetAllClientsByCountry(Constants.CA_COUNTRY_ID);
            cevw.ErrMessage = new ErrorMessage (false, 0, "");

            return View(cevw);
        }

        /*
         * OnClick "Save Exchange Rate" button
         */
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult Index(CanadianExchangeViewModel cevw)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            try
            {
                ErrorMessage em = _canadianExchangeRateRepository.AddExchangeRate(LoggedOnUser.UserId, 
                    cevw.CanadianExchange_SelectedClient,
                    cevw.CanadianExchange_SelectedQuarter,
                    cevw.CanadianExchange_Rate
                    );

                CanadianExchangeViewModel cevwRet = new CanadianExchangeViewModel();
                cevwRet.LoggedOnUser = LoggedOnUser;
                cevwRet.PlanYears = _generalRepository.GetPlanYears();
                cevwRet.Clients = _clientRepository.GetAllClientsByCountry(Constants.CA_COUNTRY_ID);
                cevwRet.ErrMessage = em;

                return View (cevwRet);
            }
            catch (Exception exc)
            {
                cevw.ErrMessage = new ErrorMessage(false, 0, exc.Message);

                return View(cevw);
            }
        }

        [SessionExpireFilter]
        public ActionResult ExchangeRateDemo()
        {
            ExchangeRateDemoViewModel erdvm = new ExchangeRateDemoViewModel();
            erdvm.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            erdvm.StartDate = DateTime.Now.ToString("MM/dd/yyyy");
            return View(erdvm);
        }

        [HttpGet]
        [SessionExpireFilter]
        public ActionResult ExchangeRateDemo(ExchangeRateDemoViewModel erdvm)
        {
            ExchangeRateDemoViewModel erdvm1 = new ExchangeRateDemoViewModel();
            erdvm1.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            erdvm1.StartDate = erdvm.StartDate;
            erdvm1.ReturnedJson = "";

            try
            {
                ServicePointManager.ServerCertificateValidationCallback = (sender, cert, chain, sslPolicyErrors) => true;
                string Url = String.Format("https://api.exchangeratesapi.io/{0}?base=CAD&symbols=USD", DateTime.Parse(erdvm.StartDate).ToString("yyyy-MM-dd"));
                HttpWebRequest request = HttpWebRequest.Create(Url) as HttpWebRequest;
                request.UserAgent = @"Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko";
                request.Timeout = Convert.ToInt32(new TimeSpan(0, 5, 0).TotalMilliseconds);
                request.Method = "GET";
                WebResponse webResponse = request.GetResponse();
                StreamReader responseText = new StreamReader(webResponse.GetResponseStream());
                using (JsonTextReader reader = new JsonTextReader(responseText))
                {
                    JObject o2 = (JObject)JToken.ReadFrom(reader);
                    erdvm1.ReturnedJson = (string) o2["rates"]["USD"];
                }
            }
            catch (Exception exc)
            {
                erdvm1.ReturnedJson = exc.Message;
            }



            return View(erdvm1);
        }

        [SessionExpireFilter]
        public IActionResult ExchangeRateActuals()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ExchangeRateActualsViewModel eravm = new ExchangeRateActualsViewModel();
            eravm.LoggedOnUser = LoggedOnUser;
            eravm.Years = _generalRepository.GetPlanYears();
            eravm.Quarters = _generalRepository.GetQuarters(1000, LoggedOnUser.UserId);

            Quarter quarter = _generalRepository.GetWeekStartDatesByQuarter(1, LoggedOnUser.UserId);

            eravm.ErrMessage = new ErrorMessage(false, 0, "");

            if (quarter != null)
            {
                List<SelectListItem> objWeeks = new List<SelectListItem>();
                if (quarter.Wk01_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk01_Date), Value = "1" });
                if (quarter.Wk02_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk02_Date), Value = "2" });
                if (quarter.Wk03_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk03_Date), Value = "3" });
                if (quarter.Wk04_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk04_Date), Value = "4" });
                if (quarter.Wk05_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk05_Date), Value = "5" });
                if (quarter.Wk06_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk06_Date), Value = "6" });
                if (quarter.Wk07_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk07_Date), Value = "7" });
                if (quarter.Wk08_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk08_Date), Value = "8" });
                if (quarter.Wk09_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk09_Date), Value = "9" });
                if (quarter.Wk10_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk10_Date), Value = "10" });
                if (quarter.Wk11_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk11_Date), Value = "11" });
                if (quarter.Wk12_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk12_Date), Value = "12" });
                if (quarter.Wk13_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk13_Date), Value = "13" });
                if (quarter.Wk14_Date != null) objWeeks.Add(new SelectListItem { Text = String.Format("{0:MM/dd/yyyy}", quarter.Wk14_Date), Value = "14" });
                SelectList obgWeeks = new SelectList(objWeeks, "Value", "Text", 0);
                eravm.Weeks = obgWeeks;
            }


            return View(eravm);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetHistory(int QuarterId, string Week)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            try
            {
                DateTime result;
                List<CanadaActualExchangeRate> caer = null;
                if (DateTime.TryParse(Week, out result) == false)
                {
                    caer = _canadianExchangeRateRepository.GetActualExchangeRateHistory(QuarterId, LoggedOnUser.UserId, (DateTime?)null).ToList();
                }
                else
                {
                    caer = _canadianExchangeRateRepository.GetActualExchangeRateHistory(QuarterId, LoggedOnUser.UserId, result).ToList();
                }


                return Json(caer);
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = "Actual history not found. " + exc.Message,
                });
            }
        }
        
        [HttpGet]
        public FileContentResult ExporttoExcel(int PlanYear)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            CanadianExchangeViewModel objCanadianExchangeViewModel = new CanadianExchangeViewModel();
            objCanadianExchangeViewModel.ListCanadaClientExchangeRateExport = _canadianExchangeRateRepository.GetCanadianClientExchangeRate(PlanYear, LoggedOnUser.UserId);

            byte[] filecontent = ExcelExportHelper.ExportExcel(objCanadianExchangeViewModel);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "CandianClientExchange.xlsx");
        }


    }
}
