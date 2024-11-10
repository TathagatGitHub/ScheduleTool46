using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Repositories;
using Microsoft.AspNetCore.Http;


namespace OM_ScheduleTool.Controllers
{
   
    public class ErrorController : Controller
    {
        private IUserRepository _userRepository;
        private ILogger<StatusCodeController> _logger;
        public ErrorController(IUserRepository userRepository, ILogger<StatusCodeController> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        [Route("Error")]
        public IActionResult Error()
        {
            var exceptionHandlerPathFeature = HttpContext.Features.Get<IExceptionHandlerPathFeature>();
            var UserId = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName")).UserId;
            _logger.LogError(UserId, "Exception Path: " + exceptionHandlerPathFeature.Path + " | " + "Exception Message: " + exceptionHandlerPathFeature.Error.Message);
            if (HttpContext.Request.Headers["x-requested-with"] == "XMLHttpRequest")
            {              
                return Json("Error occured.");             
            }
            else
            {
                return View("Error");
            }
        }
    }
}
