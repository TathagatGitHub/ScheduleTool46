using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;

namespace OM_ScheduleTool.Controllers
{
    public class ClientCommissionController : Controller
    {
        private IAppFeatureRepository _appFeatureRepository;
        private IClientRepository _clientRepository;
        private IClientCommissionRepository _clientCommissionRepository;
        private IGeneralRepository _generalRepository;
        private IConfiguration _config;
        private INetworkRepository _networkRepository;
        private IUserRepository _userRepository;

        public ClientCommissionController(IAppFeatureRepository appFeatureRepository
            , IClientRepository clientRepository
            , IClientCommissionRepository clientCommissionRepository
            , IGeneralRepository generalRepository
            , INetworkRepository networkRepository
            , IUserRepository userRepository
            , IConfiguration config)
        {
            _appFeatureRepository = appFeatureRepository;
            _clientRepository = clientRepository;
            _clientCommissionRepository = clientCommissionRepository;
            _generalRepository = generalRepository;
            _networkRepository = networkRepository;
            _userRepository = userRepository;
            _config = config;
        }

        [SessionExpireFilter]
        public IActionResult Index()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ClientCommissionViewModel ccvw = new ClientCommissionViewModel();
            ccvw.LoggedOnUser = LoggedOnUser;
            ccvw.Countries = _generalRepository.GetAllCountries();
            ccvw.Clients = _clientRepository.GetAllClientsByCountry (1000);  // Something that doesn't exist so it'll return an empty list.
            ccvw.Quarters = _generalRepository.GetQuarters(0, LoggedOnUser.UserId);  // Something that doesn't exist so it'll return an empty list.
            ccvw.StartWeeks = new List<SelectListItem>();
            ccvw.EndWeeks = new List<SelectListItem>();
            ccvw.AvgCommRate = _clientRepository.GetAvgClientRate(LoggedOnUser.UserId);

            ccvw.TieredSels = new List<SelectListItem>();
            ccvw.TieredSels.Add(new SelectListItem { Text = "TRUE", Value = "1" });
            ccvw.TieredSels.Add(new SelectListItem { Text = "FALSE", Value = "0" });

            ccvw.CommStructures = new List<SelectListItem>();
            ccvw.CommStructures.Add(new SelectListItem { Text = "GROSS", Value = "GROSS" });
            ccvw.CommStructures.Add(new SelectListItem { Text = "NET", Value = "NET" });
            ccvw.CommStructures.Add(new SelectListItem { Text = "FEE", Value = "FEE" });

            ccvw.PlanYears = _generalRepository.GetPlanYears();

            ccvw.ErrMessage = new ErrorMessage(false, 0, "");

            ccvw.ShowRates = 0;

            return View(ccvw);
        }

        [SessionExpireFilter]
        public IActionResult ExportPostLog(int ClientId, int NetworkId, string DateFrom, string DateTo, int Month, int PlanYear, string PlanYearType)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (LoggedOnUser.Finance == false)
            {
                return RedirectToAction("500" + @"/" + "You do not have permission to export post logs.", "StatusCode");
            }

            ExportPostLogViewModel eplvm = new ExportPostLogViewModel();

            eplvm.ErrMessage = new ErrorMessage(false, 0, "");

            eplvm.CountryId = 5;

            try
            {
                eplvm.ClientId = ClientId;
                eplvm.NetworkId = NetworkId;
                eplvm.Month = Month;
                eplvm.PlanYear = PlanYear;
                eplvm.PlanYearType = PlanYearType;
                eplvm.DateFrom = DateTime.Parse(DateFrom);
                eplvm.DateTo = DateTime.Parse(DateTo);

                ExcelExportPostLogViewModel exp = new ExcelExportPostLogViewModel();

                try
                {
                    exp.ExportPostLogs = _clientCommissionRepository.GenerateExportPostLog(ClientId, NetworkId, DateTime.Parse(DateFrom), DateTime.Parse(DateTo), LoggedOnUser.UserId);
                    if (exp.ExportPostLogs.Count > 0)
                    {
                        byte[] filecontent = ExcelExportHelper.ExportExcel(exp);
                        return File(filecontent, ExcelExportHelper.ExcelContentType, "OceanMedia_PostLog.xlsx");
                    }
                    else
                    {
                        Client client = _clientRepository.GetClient(ClientId);
                        eplvm.ErrMessage = new ErrorMessage(false, 0, "No records found for " + client.ClientName + " from " + DateFrom + " to " + DateTo + ".");
                    }
                }
                catch (Exception exc)
                {
                    eplvm.ErrMessage = new ErrorMessage(false, 0, "Please contact administrator.  An unexpected error occurred.  " + exc.Message);
                }
            }
            catch
            { }


            eplvm.LoggedOnUser = LoggedOnUser;
            eplvm.Countries = _generalRepository.GetAllCountries();
            eplvm.PlanYears = _generalRepository.GetPlanYears();
            eplvm.Clients = _clientRepository.GetAllClientsByCountry(eplvm.CountryId);  // Default is US always
            eplvm.Networks = _networkRepository.GetAllNetworksByCountry(eplvm.CountryId);

            eplvm.PlanYearTypes = new List<SelectListItem>();
            eplvm.PlanYearTypes.Add(new SelectListItem { Text = "Calendar", Value = "C" });
            eplvm.PlanYearTypes.Add(new SelectListItem { Text = "Broadcast", Value = "B" });

            eplvm.Months = new List<SelectListItem>();
            eplvm.Months.Add(new SelectListItem { Text = "January", Value = "1" });
            eplvm.Months.Add(new SelectListItem { Text = "February", Value = "2" });
            eplvm.Months.Add(new SelectListItem { Text = "March", Value = "3" });
            eplvm.Months.Add(new SelectListItem { Text = "April", Value = "4" });
            eplvm.Months.Add(new SelectListItem { Text = "May", Value = "5" });
            eplvm.Months.Add(new SelectListItem { Text = "June", Value = "6" });
            eplvm.Months.Add(new SelectListItem { Text = "July", Value = "7" });
            eplvm.Months.Add(new SelectListItem { Text = "August", Value = "8" });
            eplvm.Months.Add(new SelectListItem { Text = "September", Value = "9" });
            eplvm.Months.Add(new SelectListItem { Text = "October", Value = "10" });
            eplvm.Months.Add(new SelectListItem { Text = "November", Value = "11" });
            eplvm.Months.Add(new SelectListItem { Text = "December", Value = "12" });


            return View(eplvm);
        }


        [HttpPost]
        [SessionExpireFilter]
        public IActionResult Index(ClientCommissionViewModel ccvw)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            try
            {
                ErrorMessage em = _clientCommissionRepository.SaveClientCommission(LoggedOnUser.UserId,
                                            ccvw.ClientId,
                                            ccvw.QuarterId,
                                            ccvw.AnniversaryDate,
                                            ccvw.Tiered,
                                            ccvw.CommStructure,
                                            ccvw.Rate,
                                            ccvw.StartWeek,
                                            ccvw.EndWeek,
                                            ccvw.Week01Rate,
                                            ccvw.Week02Rate,
                                            ccvw.Week03Rate,
                                            ccvw.Week04Rate,
                                            ccvw.Week05Rate,
                                            ccvw.Week06Rate,
                                            ccvw.Week07Rate,
                                            ccvw.Week08Rate,
                                            ccvw.Week09Rate,
                                            ccvw.Week10Rate,
                                            ccvw.Week11Rate,
                                            ccvw.Week12Rate,
                                            ccvw.Week13Rate,
                                            ccvw.Week14Rate);

                ClientCommissionViewModel cevwRet = new ClientCommissionViewModel();
                cevwRet.LoggedOnUser = LoggedOnUser;
                cevwRet.Countries = _generalRepository.GetAllCountries();
                cevwRet.Clients = _clientRepository.GetAllClientsByCountry(ccvw.CountryId);
                cevwRet.AvgCommRate = _clientRepository.GetAvgClientRate(LoggedOnUser.UserId);
                cevwRet.Quarters = _generalRepository.GetQuarters(ccvw.PlanYear, LoggedOnUser.UserId);
                cevwRet.StartWeeks = new List<SelectListItem>();
                cevwRet.EndWeeks = new List<SelectListItem>();

                Quarter quarter = _generalRepository.GetWeekStartDatesByQuarter(ccvw.QuarterId, LoggedOnUser.UserId);
                CommRate commrate = _generalRepository.GetWeekCommRatesByClientQuarter(ccvw.ClientId, ccvw.QuarterId, LoggedOnUser.UserId);

                cevwRet.TieredSels = new List<SelectListItem>();
                cevwRet.TieredSels.Add(new SelectListItem { Text = "TRUE", Value = "1" });
                cevwRet.TieredSels.Add(new SelectListItem { Text = "FALSE", Value = "0" });

                cevwRet.CommStructures = new List<SelectListItem>();
                cevwRet.CommStructures.Add(new SelectListItem { Text = "GROSS", Value = "GROSS" });
                cevwRet.CommStructures.Add(new SelectListItem { Text = "NET", Value = "NET" });
                cevwRet.CommStructures.Add(new SelectListItem { Text = "FEE", Value = "FEE" });

                cevwRet.PlanYears = _generalRepository.GetPlanYears();
                cevwRet.ErrMessage = em;

                // Reinitialize with what's saved in the database based on Client Id
                cevwRet.CountryId = ccvw.CountryId;
                cevwRet.ClientId = ccvw.ClientId;
                cevwRet.ShowRates = ccvw.ShowRates;

                if (ccvw.ShowRates == 1)
                {
                    cevwRet.PlanYear = ccvw.PlanYear;
                    cevwRet.QuarterId = ccvw.QuarterId;
                    cevwRet.StartWeek = ccvw.StartWeek;
                    cevwRet.EndWeek = ccvw.EndWeek;

                    cevwRet.Week01Rate = String.Format("{0:G29}", commrate.Week01Rate * 100);
                    cevwRet.Week02Rate = String.Format("{0:G29}", commrate.Week02Rate * 100);
                    cevwRet.Week03Rate = String.Format("{0:G29}", commrate.Week03Rate * 100);
                    cevwRet.Week04Rate = String.Format("{0:G29}", commrate.Week04Rate * 100);
                    cevwRet.Week05Rate = String.Format("{0:G29}", commrate.Week05Rate * 100);
                    cevwRet.Week06Rate = String.Format("{0:G29}", commrate.Week06Rate * 100);
                    cevwRet.Week07Rate = String.Format("{0:G29}", commrate.Week07Rate * 100);
                    cevwRet.Week08Rate = String.Format("{0:G29}", commrate.Week08Rate * 100);
                    cevwRet.Week09Rate = String.Format("{0:G29}", commrate.Week09Rate * 100);
                    cevwRet.Week10Rate = String.Format("{0:G29}", commrate.Week10Rate * 100);
                    cevwRet.Week11Rate = String.Format("{0:G29}", commrate.Week11Rate * 100);
                    cevwRet.Week12Rate = String.Format("{0:G29}", commrate.Week12Rate * 100);
                    cevwRet.Week13Rate = String.Format("{0:G29}", commrate.Week13Rate * 100);
                    cevwRet.Week14Rate = String.Format("{0:G29}", commrate.Week14Rate * 100);

                    /*
                    cevwRet.Week01Date = String.Format("{0:MM/dd/yyyy", quarter.Wk01_Date.ToString());                
                    cevwRet.Week02Date = String.Format("{0:MM/dd/yyyy", quarter.Wk02_Date.ToString());
                    cevwRet.Week03Date = String.Format("{0:MM/dd/yyyy", quarter.Wk03_Date.ToString());
                    cevwRet.Week04Date = String.Format("{0:MM/dd/yyyy", quarter.Wk04_Date.ToString());
                    cevwRet.Week05Date = String.Format("{0:MM/dd/yyyy", quarter.Wk05_Date.ToString());
                    cevwRet.Week06Date = String.Format("{0:MM/dd/yyyy", quarter.Wk06_Date.ToString());
                    cevwRet.Week07Date = String.Format("{0:MM/dd/yyyy", quarter.Wk07_Date.ToString());
                    cevwRet.Week08Date = String.Format("{0:MM/dd/yyyy", quarter.Wk08_Date.ToString());
                    cevwRet.Week09Date = String.Format("{0:MM/dd/yyyy", quarter.Wk09_Date.ToString());
                    cevwRet.Week10Date = String.Format("{0:MM/dd/yyyy", quarter.Wk10_Date.ToString());
                    cevwRet.Week11Date = String.Format("{0:MM/dd/yyyy", quarter.Wk11_Date.ToString());
                    cevwRet.Week12Date = String.Format("{0:MM/dd/yyyy", quarter.Wk12_Date.ToString());
                    cevwRet.Week13Date = String.Format("{0:MM/dd/yyyy", quarter.Wk13_Date.ToString());
                    cevwRet.Week14Date = String.Format("{0:MM/dd/yyyy", quarter.Wk14_Date.ToString());
                    */

                }

                return View(cevwRet);
            }
            catch (Exception exc)
            {
                ccvw.ErrMessage = new ErrorMessage(false, 0, exc.Message);

                return View(ccvw);
            }

        }


        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetStartWeekByQuarter(int QuarterId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            Quarter quarter = _generalRepository.GetWeekStartDatesByQuarter (QuarterId, LoggedOnUser.UserId);

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
                return Json(obgWeeks);
            }
            else
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = "Quarter not found.",
                });
            }

        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetBroadcastDates(int Month, int Year)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            try
            {

                BroadcastDate bd = _generalRepository.GetBroadcastDate(Month, Year, LoggedOnUser.UserId);

                return Json(new
                {
                    Success = true,
                    DateFrom = bd.DateFrom.ToString("MM/dd/yyyy"),
                    DateTo = bd.DateTo.ToString("MM/dd/yyyy"),
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = exc.Message,
                });
            }

        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetCommRateByClientQuarter(int ClientId, int QuarterId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            CommRate commrate = _generalRepository.GetWeekCommRatesByClientQuarter(ClientId, QuarterId, LoggedOnUser.UserId);
            if (commrate != null)
            {
                List<SelectListItem> objCommRates = new List<SelectListItem>();
                if (commrate.Week01Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week01Rate * 100), Value = "1" });
                if (commrate.Week02Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week02Rate * 100), Value = "2" });
                if (commrate.Week02Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week03Rate * 100), Value = "3" });
                if (commrate.Week04Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week04Rate * 100), Value = "4" });
                if (commrate.Week05Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week05Rate * 100), Value = "5" });
                if (commrate.Week06Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week06Rate * 100), Value = "6" });
                if (commrate.Week07Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week07Rate * 100), Value = "7" });
                if (commrate.Week08Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week08Rate * 100), Value = "8" });
                if (commrate.Week09Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week09Rate * 100), Value = "9" });
                if (commrate.Week10Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week10Rate * 100), Value = "10" });
                if (commrate.Week11Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week11Rate * 100), Value = "11" });
                if (commrate.Week12Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week12Rate * 100), Value = "12" });
                if (commrate.Week13Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week13Rate * 100), Value = "13" });
                if (commrate.Week14Rate >= (decimal)0.00) objCommRates.Add(new SelectListItem { Text = String.Format("{0}", commrate.Week14Rate * 100), Value = "14" });
                SelectList obgCommRates = new SelectList(objCommRates, "Value", "Text", 0);
                return Json(obgCommRates);
            }
            else
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = "Commission rates not found.",
                });
            }
        }

        [HttpGet]
        public ActionResult ExportPostLogExcel(int ClientId, int NetworkId, string DateFrom, string DateTo)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ExcelExportPostLogViewModel exc = new ExcelExportPostLogViewModel();
            exc.ExportPostLogs = _clientCommissionRepository.GenerateExportPostLog(ClientId, NetworkId, DateTime.Parse(DateFrom), DateTime.Parse(DateTo), LoggedOnUser.UserId);

            byte[] filecontent = ExcelExportHelper.ExportExcel(exc);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "OceanMedia_PostLog.xlsx");
        }


        [HttpGet]
        public FileContentResult ExporttoExcel(int CountryId,string ClientId,int QuarterId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            ClientCommissionViewModel objClientCommissionViewModel = new ClientCommissionViewModel();
            objClientCommissionViewModel.ListClientCommissionRateExport = _clientCommissionRepository.GetClientCommissionRateExport(CountryId, ClientId, QuarterId,LoggedOnUser.UserId);
            
            byte[] filecontent = ExcelExportHelper.ExportExcel(objClientCommissionViewModel);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "CandianClientExchange.xlsx");
        }

    }
}
