using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class NetworkUserJobController : Controller
    {
        private IUserRepository _userRepository;
        private INetworkRepository _networkRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private IConfiguration _config;
        private ILogger<UserController> _logger;

        public NetworkUserJobController(IUserRepository userRepository
            , INetworkRepository networkRepository
            , IAppFeatureRepository appFeatureRepository
            , ILogger<UserController> logger
            , IConfiguration config)
        {
            _userRepository = userRepository;
            _networkRepository = networkRepository;
            _appFeatureRepository = appFeatureRepository;
            _config = config;
            _logger = logger;
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetNetworkUserJob(string id, int jobid)
        {
            try
            {
                User CurrentUser = _userRepository.GetUserByAccountName(id);

                List<NetworkUserJob> nuj = new List<NetworkUserJob>();
                nuj = _networkRepository.GetNetworkUserJobs(jobid, CurrentUser.UserId).ToList();

                List<Network> objNUJ = new List<Network>();
                foreach (var NetUseJob in nuj)
                {
                    Network net = new Network();
                    net.NetworkId = NetUseJob.Network.NetworkId;
                    net.StdNetName = NetUseJob.Network.StdNetName + " (" + NetUseJob.Network.Country.CountryShort + ")";
                    List<Network> searchCli = objNUJ.Where(n => n.NetworkId == NetUseJob.Network.NetworkId).ToList();
                    if (searchCli.Count == 0)
                    {
                        objNUJ.Add(net);
                    }
                }
                SelectList obgNUJ = new SelectList(objNUJ, "NetworkId", "StdNetName", 0);
                return Json(obgNUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult ChangeNetworkJob(int networkid, string id, int jobid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            User CurrentUser = _userRepository.GetUserByAccountName(id);
            try
            {
                Network network = _networkRepository.GetNetwork(networkid);
                ErrorMessage err = _networkRepository.ChangeNetworkJob(networkid, CurrentUser.UserId, jobid, LoggedOnUser.UserId);
                if (err.ResponseCode > 0)
                {
                    _logger.LogInformation(LoggedOnUser.UserId, "Network, " + network.StdNetName + ", job successfully updated to " + jobid.ToString() + ".");
                }

                return Json(new
                {
                    success = err.Success,
                    responseCode = err.ResponseCode,
                    responseText = err.ResponseText
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
        [SessionExpireFilter]
        public ActionResult GetUnassignedNetworkUserJobs(string id, int jobid)
        {
            try
            {
                User CurrentUser = _userRepository.GetUserByAccountName(id);

                List<Network> nuj = new List<Network>();
                nuj = _networkRepository.GetUnassignedNetworkUserJobs(jobid, CurrentUser.UserId).ToList();

                // Rename StdNetName to contain Country Code
                List<Network> objNUJ = new List<Network>();
                foreach (var network in nuj)
                {
                    Network net = new Network();
                    net.NetworkId = network.NetworkId;
                    net.StdNetName = network.StdNetName + " (" + network.Country.CountryShort + ")" ;
                    objNUJ.Add(net);
                }

                SelectList obgNUJ = new SelectList(objNUJ, "NetworkId", "StdNetName", 0);
                return Json(obgNUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

    }
}
