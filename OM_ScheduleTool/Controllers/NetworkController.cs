using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class NetworkController : Controller
    {
        private IUserRepository _userRepository;
        private INetworkRepository _networkRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private IConfiguration _config;

        public NetworkController(IUserRepository userRepository
            , INetworkRepository networkRepository
            , IAppFeatureRepository appFeatureRepository
            , IConfiguration config)
        {
            _userRepository = userRepository;
            _networkRepository = networkRepository;
            _appFeatureRepository = appFeatureRepository;
            _config = config;
        }

        [SessionExpireFilter]
        public IActionResult Index()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            NetworkViewModel nvw = new NetworkViewModel();
            nvw.LoggedOnUser = LoggedOnUser;
            AppFeature af = _appFeatureRepository.GetAllAppFeatures().Where(a => a.Description == "Client Names").FirstOrDefault<AppFeature>();
            nvw.LoggedOnUser_Permissions_NetworkName = _appFeatureRepository.GetUserPermissions(LoggedOnUser.UserId).Where(f => f.FeatureDescription == "Names" && f.ParentAppFeatureId == af.AppFeatureId).FirstOrDefault<UserPermission>();
            nvw.LoggedOnUser_Permissions_NetworkAlias = _appFeatureRepository.GetUserPermissions(LoggedOnUser.UserId).Where(f => f.FeatureDescription == "Alias" && f.ParentAppFeatureId == af.AppFeatureId).FirstOrDefault<UserPermission>();
            nvw.Countries = _networkRepository.GetAllCountries();
            nvw.MediaTypes = _networkRepository.GetAllMediaTypes();
            nvw.FeedTypes = _networkRepository.GetAllFeedTypes();
            return View(nvw);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetNetworkByCountryId(int countryid)
        {
            List<Network> objNetwork = new List<Network>();
            objNetwork = GetAllNetworks().Where(m => m.Country.CountryId == countryid).ToList();
            SelectList obgNetwork = new SelectList(objNetwork, "NetworkId", "StdNetName", 0);
            return Json(obgNetwork);
        }

        [SessionExpireFilter]
        public List<Network> GetAllNetworks()
        {
            List<Network> objNetworks = new List<Network>();
            objNetworks = _networkRepository.GetAllNetworks().ToList();
            return objNetworks;
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetAliasesByNetworkId(int networkid)
        {
            List<EdiNetworkLookup> objAliases = new List<EdiNetworkLookup>();
            objAliases = _networkRepository.GetAllAliases().Where(a => a.Network.NetworkId == networkid).ToList();
            SelectList obgAliases = new SelectList(objAliases, "EdiNetworkLookupId", "EdiNetName", 0);
            return Json(obgAliases);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetProposalNetworks (int ProposalId)
        {
            List<Network> objNetworks = new List<Network>();
            objNetworks = _networkRepository.GetAllNetworks().ToList();
            return Json(objNetworks);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult SaveNewClient(string ClientName, int CountryId, bool NewClient)
        {
            /*
            if (_networkRepository.GetAllClients().Where(m => m. == NetworkName && m.Country.CountryId == CountryId).FirstOrDefault<Network>() != null)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -1,
                    responseText = "Network name already exists in " + _networkRepository.GetCountry(CountryId).CountryShort
                });
            }

            Client client = new Client ()


            Network network = new Network();
            network.StdNetName = NetworkName;

            network.MediaType = new MediaType();
            network.MediaType = _networkRepository.GetMediaType(MediaTypeId);

            network.FeedType = new FeedType();
            network.FeedType = _networkRepository.GetFeedType(FeedTypeId);

            network.Country = new Country();
            network.Country = _networkRepository.GetCountry(CountryId);


            if (ModelState.IsValid == true)
            {
                try
                {
                    int NewId = _networkRepository.SaveNewNetwork(network);
                    return Json(new
                    {
                        success = true,
                        responseCode = NewId,
                        responseText = "Saved"
                    });

                }
                catch (Exception exc)
                {
                    return Json(new
                    {
                        success = false,
                        responseCode = -2,
                        responseText = exc.Message
                    });
                }
            }
            */

            return Json(new
            {
                success = false,
                responseCode = -3,
                responseText = ""
            });

        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult SaveNewNetwork(string NetworkName,
                int MediaTypeId,
                int FeedTypeId,
                int CountryId)
        {
            try
            {

                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int NewId = _networkRepository.SaveNewNetwork(LoggedOnUser.UserId, NetworkName, MediaTypeId, FeedTypeId, CountryId);
                return Json(new
                {
                    success = true,
                    responseCode = NewId,
                    responseText = "Network Successfully Created."
                });

            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseCode = -2,
                    responseText = "Unable to Create Network.  " + exc.Message
                });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult EditNetwork(int NetworkId, int CountryId, string OldNetworkName, string NewNetworkName)
        {
            try
            { 
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                _networkRepository.EditNetwork(NetworkId, NewNetworkName, LoggedOnUser);

                return Json(new
                {
                    success = true,
                    responseText = "Network name " + OldNetworkName + " was changed to " + NewNetworkName + " on " + DateTime.Now.ToString("MM/dd/yyyy HH:mm tt") +"."
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
        public ActionResult AddAlias(int NetworkId, string AliasName)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                _networkRepository.AddNetworkAlias(NetworkId, AliasName, LoggedOnUser);

                return Json(new
                {
                    success = true,
                    responseText = "Alias successfully added."
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
        public ActionResult DeleteAlias(int AliasId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                _networkRepository.DeleteNetworkAlias(LoggedOnUser.UserId, AliasId);

                return Json(new
                {
                    success = true,
                    responseText = "Alias successfully deleted."
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

        [HttpGet]
        public FileContentResult ExportToExcel()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            NetworkViewModel nvm = new NetworkViewModel();
            nvm.Networks = _networkRepository.GetNetworkAliasList(LoggedOnUser.UserId);

            byte[] filecontent = ExcelExportHelper.ExportExcel(nvm);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "OceanMediaNetworks.xlsx");
        }




    }
}
