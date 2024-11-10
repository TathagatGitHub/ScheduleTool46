using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;

namespace OM_ScheduleTool.Controllers
{
    public class BroadcastYearManagementController : Controller
    {
        private IUserRepository _userRepository;
        private IBroadcastYearManagement _broadcastYearManagementRepository;

        public BroadcastYearManagementController(IUserRepository userRepository, IBroadcastYearManagement broadcastYearManagement)
        {
            _userRepository = userRepository;
            _broadcastYearManagementRepository = broadcastYearManagement;
        }
        [SessionExpireFilter]
        public IActionResult Index()
        {            
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            BroadcastYearViewModel model = new BroadcastYearViewModel();
            try
            {
                
                List<int> lstYear = new List<int>();
                lstYear.Add(DateTime.Now.Year + 1);
                lstYear.Add(DateTime.Now.Year + 2);                
                model.LoggedOnUser = LoggedOnUser;
                model.Year = lstYear;
                return View(model);
            }
            catch(Exception exc)
            {
                return View(model);
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult GetBroadcastYear(int Year)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                BroadcastYearViewModel model = new BroadcastYearViewModel();
                var lst = _broadcastYearManagementRepository.GetBroadcastYear(Year, LoggedOnUser.UserId);
                return Json(new
                {
                    success = true,
                    result = lst
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult SaveBroadcastYear(int Year, string Year1QStartWeek, string Year1QEndWeek, string Year2QStartWeek, string Year2QEndWeek, string Year3QStartWeek, string Year3QEndWeek, string  Year4QStartWeek, string Year4QEndWeek)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                var err = _broadcastYearManagementRepository.SaveBroadcastYear(Year,Year1QStartWeek,Year1QEndWeek,Year2QStartWeek,Year2QEndWeek,Year3QStartWeek, Year3QEndWeek,
                    Year4QStartWeek,Year4QEndWeek, LoggedOnUser.UserId);               

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

    }
}
