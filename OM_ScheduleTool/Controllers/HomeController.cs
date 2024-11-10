using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.ViewModels;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;
using OM_ScheduleTool.Repositories;
//using System.Web.SessionState;
//using Excel = Microsoft.Office.Interop.Excel;
using OfficeOpenXml;
using System.Diagnostics;
using System.IO;


namespace OM_ScheduleTool.Controllers
{
    public class HomeController : Controller
    {
        private IUserRepository _userRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private IDeltaListRepository _deltalistRepository;
        private readonly IConfiguration _config;
        private IUpfrontRepository _upfrontRepository;
        private IRemnantRepository _remnantRepository;
        private IScheduleRepository _scheduleRepository;
        private IProposalRepository _proposalRepository;
        private IPostLogRepository _postlogRepository;
        private IPreLogRepository _prelogRepository;
        private IMediaPlanRepository _mediaplanRepository;

        public HomeController(IUserRepository userRepository
            , IAppFeatureRepository appFeatureRepository
            , IDeltaListRepository deltalistRepository
            , IUpfrontRepository upfrontRepository
            , IRemnantRepository remnantRepository
            , IScheduleRepository scheduleRepository
            , IProposalRepository proposalRepository
            , IPostLogRepository postLogRepository
            , IPreLogRepository preLogRepository
            , IMediaPlanRepository mediaPlanRepository
            , IConfiguration config) 
        {
            _userRepository = userRepository;
            _appFeatureRepository = appFeatureRepository;
            _deltalistRepository = deltalistRepository;
            _upfrontRepository = upfrontRepository;
            _remnantRepository = remnantRepository;
            _scheduleRepository = scheduleRepository;
            _proposalRepository = proposalRepository;
            _postlogRepository = postLogRepository;
            _prelogRepository = preLogRepository;
            _mediaplanRepository = mediaPlanRepository;
            _config = config;
        }

        [SessionExpireFilter]
        public IActionResult Index()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            DashboardViewModel dashboard = new DashboardViewModel();
            dashboard.LoggedOnUser = LoggedOnUser;
            dashboard.FeaturePermissions = _appFeatureRepository.GetDashboardPermissions(LoggedOnUser.UserId);
            dashboard.AppFeatureGroups = _appFeatureRepository.GetDashboardGroups(LoggedOnUser.UserId);
            //dashboard.AppFeatureGroups = _appFeatureRepository.GetAllFeatureGroups();
            //dashboard.AppFeatures = _appFeatureRepository.GetAllDefaultPermissions();
            //dashboard.AppFeatureDefaultActions = _appFeatureRepository.GetAppFeatureDefaultActions(dashboard.LoggedOnUser.PermissionLevelId);

            return View(dashboard);
        }

        [SessionExpireFilter]
        public ActionResult LockUnlock()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            LockUnlockViewModel lockUnlock = new LockUnlockViewModel();
            lockUnlock.LoggedOnUser = LoggedOnUser;
            lockUnlock.LockedUpfronts = _upfrontRepository.GetUpfronts(LoggedOnUser.UserId).Where(s => s.UpfrontLockedDate != null).ToList();
            lockUnlock.LockedRemnants = _remnantRepository.GetRemnants(LoggedOnUser.UserId).Where(s => s.UpfrontLockedDate != null).ToList();
            lockUnlock.LockedMediaPlan = _mediaplanRepository.GetLockedMediaPlans(LoggedOnUser.UserId).ToList();
            lockUnlock.LockedSchedules = _scheduleRepository.GetSchedules(LoggedOnUser.UserId).Where(s => s.LockedDt != null).ToList();
            lockUnlock.LockedProposals = _proposalRepository.GetProposals(LoggedOnUser.UserId).Where(s => s.LockedDt != null).ToList();
            if (lockUnlock.LockedProposals != null && lockUnlock.LockedProposals.Count > 0)
            {
                lockUnlock.LockedProposals.AddRange(_proposalRepository.GetPatiallyLockedProposals());
            }
            else
            {
                lockUnlock.LockedProposals = _proposalRepository.GetPatiallyLockedProposals().ToList();
            }
            lockUnlock.LockedPostLogs = _postlogRepository.GetLockedPostLogs(LoggedOnUser.UserId).ToList();
            lockUnlock.LockedPreLogs = _prelogRepository.GetLockedPreLogs(LoggedOnUser.UserId).ToList();
            lockUnlock.ErrMessage = new ErrorMessage(true, 0, "");
            return View(lockUnlock);
        }


        [SessionExpireFilter]
        public IActionResult DeltaList()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            HomeDeltaListViewModel hdl = new HomeDeltaListViewModel();

            hdl.LoggedOnUser = LoggedOnUser;
            hdl.DeltaListChanges = _deltalistRepository.GetAllDeltaListChanges().ToList().OrderByDescending(a => a.CreateDt);

            ViewBag.PageTitle = "Project Delta List";
            return View(hdl);

        }

        [SessionExpireFilter]
        public IActionResult FeaturesCheckList()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            HomeDeltaListViewModel hdl = new HomeDeltaListViewModel();
            hdl.LoggedOnUser = LoggedOnUser;
            return View(hdl);

        }


        public ActionResult SetSession()
        {
            HttpContext.Session.SetString("Test", "Test Value");
            return View();
        }

     //   [SessionExpireFilter]
        [ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public ActionResult Keepalive()
        {
            try
            {
                string curAccName = HttpContext.Session.GetString("AccountName");
                if (!string.IsNullOrEmpty(curAccName))
                {
                    HttpContext.Session.SetString("AccountName", curAccName);
                }
                else
                {
                    curAccName = "ERROR";
                }
                return Json(curAccName);
            }
            catch (Exception)
            {
                return Json("ERROR");
            }
        }

        public ActionResult Logout()
        {
            HttpContext.Session.Clear();
            return View();
            //return RedirectToAction("Logon", "User", new { id = HttpContext.Session.GetString("AccountName") });
        }

        public ActionResult LogoutChild()
        {
            return View();
            //return RedirectToAction("Logon", "User", new { id = HttpContext.Session.GetString("AccountName"), child=1 });
        }

        public ActionResult AjaxClick()
        {
            HttpContext.Session.SetString("Test", "Test Value");
            return Json("OK");
        }

        public ActionResult LoadReportFile()
        {
            var filePath = _config.GetSection("LoadReportPath:FilePath").Value;
            var fileName = _config.GetSection("LoadReportPath:FileName").Value;
            byte[] fileBytes = System.IO.File.ReadAllBytes(filePath);
            return File(fileBytes, System.Net.Mime.MediaTypeNames.Application.Octet, fileName);
        }
    }
}
