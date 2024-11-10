using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class ClientController : Controller
    {
        private Repositories.IUserRepository _userRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private IClientRepository _clientRepository;
        private IConfiguration _config;

        public ClientController(IUserRepository userRepository
            , IAppFeatureRepository appFeatureRepository
            , IClientRepository clientRepository
            , IConfiguration config)
        {
            _userRepository = userRepository;
            _appFeatureRepository = appFeatureRepository;
            _clientRepository = clientRepository;
            _config = config;
        }

        [SessionExpireFilter]
        public IActionResult Index()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ClientViewModel nvw = new ClientViewModel();
            AppFeature af = _appFeatureRepository.GetAllAppFeatures().Where(a => a.Description == "Client Names").FirstOrDefault<AppFeature>();
            nvw.LoggedOnUser = LoggedOnUser;
            nvw.LoggedOnUser_Permissions_ClientName = _appFeatureRepository.GetUserPermissions(LoggedOnUser.UserId).Where(f => f.FeatureDescription == "Names" && f.ParentAppFeatureId == af.AppFeatureId).FirstOrDefault<UserPermission>();
            nvw.LoggedOnUser_Permissions_ClientAlias = _appFeatureRepository.GetUserPermissions(LoggedOnUser.UserId).Where(f => f.FeatureDescription == "Alias" && f.ParentAppFeatureId == af.AppFeatureId).FirstOrDefault<UserPermission>();
            nvw.Countries = _clientRepository.GetAllCountries();
            return View(nvw);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetClientByCountryId(int countryid)
        {
            List<Client> objClient = new List<Client>();
            objClient = _clientRepository.GetAllClients().Where(m => m.Country.CountryId == countryid && m.Active == true).ToList();
            //objClient = _clientRepository.GetAllClients().Where(m => m.Country.CountryId == countryid).ToList();
            SelectList obgClient = new SelectList(objClient, "ClientId", "ClientDisplay", 0);
            return Json(obgClient);
        }


        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetClientByCountryIdOnClientsPage(int countryid)
        {
            List<Client> objClient = new List<Client>();
            //objClient = _clientRepository.GetAllClients().Where(m => m.Country.CountryId == countryid && m.Active == true).ToList();
            objClient = _clientRepository.GetAllClients().Where(m => m.Country.CountryId == countryid).ToList();
            SelectList obgClient = new SelectList(objClient, "ClientId", "ClientDisplay", 0);
            return Json(obgClient);
        }
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetParentClient(int countryid)
        {
            List<Client> objClient = new List<Client>();
            objClient = _clientRepository.GetAllClients().Where(m => m.Country.CountryId == countryid && (m.ContractClientId == m.ClientId)).ToList();
            SelectList obgClient = new SelectList(objClient, "ClientId", "ClientDisplay", 0);
            return Json(obgClient);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetClientById(int ClientId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            Client client = _clientRepository.GetClient(ClientId);
            decimal rate = _clientRepository.GetClientRate(ClientId, LoggedOnUser.UserId);
            bool isClientActive = false;
            if (client != null)
            {
                isClientActive = (bool)client.Active;
                return Json(new
                {
                    Success = true,
                    ResponseText = "Client retrieved.",
                    AnnivDate = (client.AnnivDate != null ? client.AnnivDate.Value.ToString("MM/dd/yyyy") : ""),
                    Tiered = (client.Tiered != null ? (client.Tiered == true? 1 : 0) : 1),
                    ClientName = client.ClientName,
                    CommStructure = client.CommStructure,
                    Rate = (rate == -1? "VARIES PER QUARTER" : String.Format("{0:n2}", rate*100)),
                    ClientActive = isClientActive,
                    IsTempCommStructure = client.IsTempCommStructure ?? false,
                    Digital = client.IsDigital,
                    Local = client.IsLocal,
                    Podcast = client.IsPodcast
                });
            }
            else
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = "Client not found.",
                    AnnivDate = "",
                    Tiered = 1,
                    ClientName = "",
                    CommStructure = "GROSS",
                    Rate = "",
                    ClientActive = false,
                    IsTempCommStructure = false
                });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetAliasesByClientId(int ClientId)
        {
            List<EdiClientLookup> objAliases = new List<EdiClientLookup>();
            objAliases = _clientRepository.GetClientAliases(ClientId).ToList();
            SelectList obgAliases = new SelectList(objAliases, "EdiClientLookupId", "EdiClientName", 0);
            return Json(obgAliases);
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult SaveNewClient(string ClientName, int CountryId, bool IsNew, int ContractClientId, bool IsParentClient, bool IsDigital, bool IsLinear, bool IsLocal, bool IsPodcast)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                var pl = LoggedOnUser.PermissionLevel.Description.ToLower();
                if (pl != "admin")
                {
                    if (pl == "client management" && LoggedOnUser.IsDigital == true && LoggedOnUser.IsLocal == false && LoggedOnUser.IsPodcast == false)
                    {
                        IsLocal = false;
                        IsPodcast = false;
                        IsLinear = false;
                    }
                    else if (pl == "client management" && LoggedOnUser.IsDigital == false && LoggedOnUser.IsLocal == true && LoggedOnUser.IsPodcast == false)
                    {
                        IsDigital = false;
                        IsLinear = false;
                        IsPodcast = false;
                    }
                    else if (pl == "client management" && LoggedOnUser.IsDigital == false && LoggedOnUser.IsLocal == false && LoggedOnUser.IsPodcast == true)
                    {
                        IsDigital = false;
                        IsLinear = false;
                        IsLocal = false;
                    }
                    else
                    {
                        IsDigital = false;
                        IsLinear = false;
                        IsLocal = false;
                        IsPodcast = false;
                    }
                }

                ErrorMessage err = _clientRepository.AddClient(ClientName, CountryId, IsNew, int.Parse(HttpContext.Session.GetString("UserId")), ContractClientId, IsParentClient, IsDigital, IsLinear, IsLocal, IsPodcast);
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
        public ActionResult EditClient(int ClientId, string NewClientName, bool IsActiveClient, bool IsDigital, bool IsLocal, bool IsPodcast)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                Client client = _clientRepository.GetClient(ClientId);
                var pl = LoggedOnUser.PermissionLevel.Description.ToLower();
                if (pl != "admin")
                {
                    if (pl == "client management" && LoggedOnUser.IsDigital == true && LoggedOnUser.IsLocal == false && LoggedOnUser.IsPodcast == false)
                    {
                        IsLocal = client.IsLocal;
                        IsPodcast = client.IsPodcast;
                        IsActiveClient = (bool)client.Active;
                    }
                    else if (pl == "client management" && LoggedOnUser.IsDigital == false && LoggedOnUser.IsLocal == true && LoggedOnUser.IsPodcast == false)
                    {
                        IsDigital = client.IsDigital;
                        IsActiveClient = (bool)client.Active;
                        IsPodcast = client.IsPodcast;
                    }
                    else if (pl == "client management" && LoggedOnUser.IsDigital == false && LoggedOnUser.IsLocal == false && LoggedOnUser.IsPodcast == true)
                    {
                        IsDigital = client.IsDigital;
                        IsActiveClient = (bool)client.Active;
                        IsLocal = client.IsLocal;
                    }
                    else if (pl == "buyer")
                    {
                        IsDigital = client.IsDigital;
                        IsLocal = client.IsLocal;
                        IsPodcast = client.IsPodcast;

                    }
                    else
                    {
                        IsDigital = client.IsDigital;
                        IsActiveClient = (bool)client.Active;
                        IsLocal = client.IsLocal;
                        IsPodcast = client.IsPodcast;
                    }
                }

                ErrorMessage err = _clientRepository.EditClient(ClientId, NewClientName, int.Parse(HttpContext.Session.GetString("UserId")), IsActiveClient, IsDigital, IsLocal, IsPodcast);
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
        public ActionResult AddAlias(int ClientId, string AliasName)
        {
            try
            {
                ErrorMessage err = _clientRepository.AddClientAlias (ClientId, AliasName, int.Parse(HttpContext.Session.GetString("UserId")));
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
        public ActionResult DeleteAlias(int AliasId)
        {
            try
            {
                _clientRepository.DeleteClientAlias(AliasId, int.Parse(HttpContext.Session.GetString("UserId")));

                return Json(new
                {
                    success = true,
                    responseText = ""
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
        public FileContentResult ExporttoExcel()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ClientViewModel objClientViewModel = new ClientViewModel();
            objClientViewModel.ClientAliases = _clientRepository.GetAllClientsandAliasesList(LoggedOnUser.UserId);

            byte[] filecontent = ExcelExportHelper.ExportExcel(objClientViewModel);
            return File(filecontent, ExcelExportHelper.ExcelContentType, "OceanMediaClients.xlsx");
        }

        /*
        [SessionExpireFilter]
        public List<EdiNetworkLookup> GetAllAliases()
        {
            List<EdiNetworkLookup> objAliases = new List<EdiNetworkLookup>();
            objAliases = _networkRepository.GetAllAliases();
            return objAliases;
        }





 

        */

        [SessionExpireFilter]
        [HttpPost]
        public ActionResult GetClientNameandAlias(string Prefix)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var result = _clientRepository.GetClientNameandAlias(Prefix, LoggedOnUser.UserId).ToList();
            return Json(result);
        }

        [SessionExpireFilter]
        [HttpPost]
        public ActionResult IsClientExist(string ClientName)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var result = _clientRepository.IsClientExist(ClientName, LoggedOnUser.UserId);
            return Json(result);
        }
    }
}
