using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class UserSettingsController : Controller
    {
        private IClientRepository _clientRepository;


        public UserSettingsController(IClientRepository clientRepository)
        {
            _clientRepository = clientRepository;
        }

        /*
        [SessionExpireFilter]
        public IActionResult Index()
        {
            try
            {
                UserSettingsViewModel usvw = new UserSettingsViewModel();
                usvw.Users = _userRepository.GetAllUsers();
                usvw.JobTitleTypes = _jobtitletypeRepository.GetAllJobTitleTypes();
                usvw.PermissionLevels = _userRepository.GetAllPermissionLevels();

                return View(usvw);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }
        */


    }
}
