using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
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
    public class StatusCodeController:  Controller
    {
        private IUserRepository _userRepository;
        private ILogger<StatusCodeController> _logger;        

        public StatusCodeController(IUserRepository userRepository
            , ILogger<StatusCodeController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;            
        }

        [HttpGet("/StatusCode/{statusCode}/{errormsg}")]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult Index(int statusCode, string errormsg)
        {          
            StatusCodeViewModel evw = new StatusCodeViewModel();
            string userName = HttpContext.Session.GetString("AccountName");
            if (userName == null || userName == "")
            {
                evw.LoggedOnUser = null;
                evw.StatusCode = statusCode;
                evw.ErrorMessage = errormsg;
                return View(evw);
            }
            evw.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            evw.StatusCode = statusCode;
            evw.ErrorMessage = errormsg;

            _logger.LogCritical((evw.LoggedOnUser == null ? 1 : evw.LoggedOnUser.UserId), statusCode.ToString() + " | " + errormsg);

            return View(evw);
        }

        [HttpGet("/StatusCode/{statusCode}")]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult Index(int statusCode)
        {
            return Index(statusCode, "Custom");
        }


        public IActionResult Index()
        {
            StatusCodeViewModel evw = new StatusCodeViewModel();
            evw.LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            return View(evw);
        }
    }
}
