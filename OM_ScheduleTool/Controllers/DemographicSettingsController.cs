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
using System.Net;
using System.Net.Mime;

namespace OM_ScheduleTool.Controllers
{
    public class DemographicSettingsController : Controller
    {
        private IConfiguration _config;
        private IUserRepository _userRepository;
        private IPropertyRepository _propertyRepository;
        private IDemographicSettingsRepository _demoRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private ILogger<DemographicSettingsController> _logger;

        public DemographicSettingsController(IConfiguration config
            , IUserRepository userRepository
            , IPropertyRepository propertyRepository
            , IAppFeatureRepository appFeatureRepository
            , ILogger<DemographicSettingsController> logger
            , IDemographicSettingsRepository demoRepository
            )
        {
            _config = config;
            _userRepository = userRepository;
            _propertyRepository = propertyRepository;
            _demoRepository = demoRepository;
            _appFeatureRepository = appFeatureRepository;
            _logger = logger;
        }

        [SessionExpireFilter]
        public IActionResult Index()
        {
            try
            {
                DemographicSettingsViewModel ds = new DemographicSettingsViewModel();
                ds.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ds.DemographicSettingsAction = _appFeatureRepository.GetUserAction(ds.LoggedOnUser.UserId, "Demographic Settings").ActionId;

                _logger.LogInformation(ds.LoggedOnUser.UserId, "Demographic Settings page visited.");

                return View(ds);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        public ActionResult Update(DemographicSettingsUniverse dsu)
        {
            try
            {
                return View();
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetPlanYears (int CountryId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<int> years = _demoRepository.GetPlanYears (CountryId, LoggedOnUser.UserId).ToList();

                SelectList obgyears = new SelectList(years);
                return Json(obgyears);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetDemoUniverse(int CountryId, int PlanYr, int Sort, int BuyTypeId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                List<DemographicSettingsUniverse> demouniv = _demoRepository.GetDemoUniverse(CountryId, PlanYr, LoggedOnUser.UserId, Sort, BuyTypeId);

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
        public ActionResult SaveDemoNameUniverse(int SettingsId, int SortOrder, string DemoName, int Universe, int CountryId, int PlanYr)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                //_logger.LogInformation(LoggedOnUser.UserId, "Save Demographic Settings:  " + SettingsId.ToString() + " " + SortOrder.ToString() + " " + DemoName + " " + Universe.ToString());
                ErrorMessage err = _demoRepository.SaveDemoUniverse(SettingsId, SortOrder, DemoName, Universe, LoggedOnUser.UserId, CountryId, PlanYr);
                if (err.Success == true)
                {
                    //Response.StatusCode = (int)HttpStatusCode.OK;
                    return Json(new { success = true, responseText = DemoName + " successfully saved."});
                }
                else
                {
                    //Response.StatusCode = (int)HttpStatusCode.BadRequest;
                    if (!string.IsNullOrEmpty(err.ResponseText))
                        {
                        return Json(new { success = false, responseText = err.ResponseText});
                    }
                    else {
                        return Json(new { success = false, responseText = DemoName + "Failed to new demographic.   Invalid values." });
                    }
                    //return Json("Failed to new demographic.   Invalid values.");
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }
        
        [HttpGet]
        public FileContentResult ExporttoExcel(int countryId, int planYr)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            DemographicSettingsViewModel objDemographicSettingsViewModel = new DemographicSettingsViewModel();
            objDemographicSettingsViewModel.lstDemographicSettingsExport = _demoRepository.MapListDemographicSettingsUniverseToListDemographicSettingsExport(_demoRepository.GetDemoUniverse(countryId, planYr, LoggedOnUser.UserId, 1, 1));

            byte[] filecontent = ExcelExportHelper.ExportExcel(objDemographicSettingsViewModel);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "DemographicSettings.xlsx");
        }
    }
}
