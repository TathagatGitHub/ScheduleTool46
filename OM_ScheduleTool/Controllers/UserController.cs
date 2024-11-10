using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.ViewModels;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Http;

using Rijndael256;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Repositories;
using Microsoft.AspNetCore.Hosting;
using System.IO;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;
using System.Text;

namespace OM_ScheduleTool.Controllers
{
    public class UserController : Controller
    {
        public string PageTitle = "Ocean Media - Schedule Tool";

        private IUserRepository _userRepository;
        private IAppFeatureRepository _appFeatureRepository;
        private IConfiguration _config;
        private ILogger<UserController> _logger;
        private IJobTitleTypeRepository _jobtitletypeRepository;
        private IClientRepository _clientRepository;
        private INetworkRepository _networkRepository;
        private IUpfrontRepository _upfrontRepository;
        private IScheduleRepository _scheduleRepository;
        private IProposalRepository _proposalRepository;
        private IHostingEnvironment _environment;

        public UserController(IUserRepository userRepository
            , IAppFeatureRepository appFeatureRepository
            , IJobTitleTypeRepository jobtitletypeRepository
            , IClientRepository clientRepository
            , INetworkRepository networkRepository
            , IUpfrontRepository upfrontRepository
            , IScheduleRepository scheduleRepository
            , IProposalRepository proposalRepository
            , ILogger<UserController> logger
            , IConfiguration config
            , IHostingEnvironment environment)
        {
            _userRepository = userRepository;
            _appFeatureRepository = appFeatureRepository;
            _jobtitletypeRepository = jobtitletypeRepository;
            _clientRepository = clientRepository;
            _networkRepository = networkRepository;
            _upfrontRepository = upfrontRepository;
            _scheduleRepository = scheduleRepository;
            _proposalRepository = proposalRepository;
            _config = config;
            _logger = logger;
            _environment = environment;
        }

        [SessionExpireFilter]
        public IActionResult Index()
        {
            try
            {
                HttpContext.Session.SetString("ConStr", _config.GetSection("ConnectionStrings:DefaultConnection").Value.ToString());
                string Constr = HttpContext.Session.GetString("ConStr");
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                var data = _userRepository.GetAllUsers(LoggedOnUser);

                ViewBag.PageTitle = PageTitle;
                return View(data);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [LogonLayout("_Logon")]
        public IActionResult Logon(string id)
        {
            HttpContext.Session.SetString("ConStr", _config.GetSection("ConnectionStrings:DefaultConnection").Value.ToString());
            string Constr = HttpContext.Session.GetString("ConStr");
            if (string.IsNullOrEmpty(id) == true)
            {
                // Didn't think this should be in the config setting because then if hosted elsewhere then
                // they've figured us out!
                string HashKey = "zachary";

                ViewBag.LogonError = "";
                ViewBag.ErrorVisible = "invisible";
                ViewBag.InfoVisible = "invisible";

                LogonViewModel logonViewModel = new LogonViewModel(_config);
                logonViewModel.FirstName = "";
                logonViewModel.LastName = "";
                try
                {
                    string Username = HttpContext.Request.Cookies["OMP"];
                    string Password = HttpContext.Request.Cookies["OMU"];

                    logonViewModel.AccountName = Rijndael.Decrypt(Username, HashKey, KeySize.Aes256);
                    logonViewModel.Password = Rijndael.Decrypt(Password, HashKey, KeySize.Aes256);
                    logonViewModel.LastLoginDt = DateTime.Now;

                    if (logonViewModel.IsAuthenticated() == true)
                    {
                        User LoggedOnUser = _userRepository.GetUserByAccountName(logonViewModel.AccountName);
                        _userRepository.SetUserLoginDt(LoggedOnUser.UserId);
                        _logger.LogInformation(LoggedOnUser.UserId, logonViewModel.AccountName + " authenticated with cookie.");
                        try
                        {
                            HttpContext.Session.SetString("UserId", LoggedOnUser.UserId.ToString());
                            HttpContext.Session.SetString("AccountName", LoggedOnUser.AccountName);
                            HttpContext.Session.SetString("DisplayName", LoggedOnUser.DisplayName);
                            HttpContext.Session.SetInt32("PermissionLevelId", LoggedOnUser.PermissionLevelId);

                            CookieOptions options = new CookieOptions();
                            options.Expires = DateTime.Now.AddDays(30);

                            HttpContext.Response.Cookies.Append("OMP", Rijndael.Encrypt(logonViewModel.AccountName, HashKey, KeySize.Aes256), options);
                            HttpContext.Response.Cookies.Append("OMU", Rijndael.Encrypt(logonViewModel.Password, HashKey, KeySize.Aes256), options);
                        }
                        catch
                        {
                            return View(logonViewModel);
                        }

                        //return RedirectToAction("EditProposal", "ManageMedia", new { ProposalId = 43 });
                        return RedirectToAction("Index", "Home");

                    }

                    return View(logonViewModel);
                }
                catch (Exception exc)
                {
                    if (String.IsNullOrEmpty(HttpContext.Session.GetString("UserId")))
                    {
                        _logger.LogError("Unable to login using Cookie.  " + exc.Message);
                    }
                    else
                    {
                        _logger.LogError(int.Parse(HttpContext.Session.GetString("UserId")), exc.Message);
                    }

                    return View(logonViewModel);
                }

            }
            else
            {
                ViewBag.LogonError = "";
                ViewBag.ErrorVisible = "invisible";
                ViewBag.InfoVisible = "";

                try
                {
                    User LoggedOnUser = _userRepository.GetUserByAccountName(id == "aaaaa"? HttpContext.Session.GetString("AccountName") : id);
                    if (id != "aaaaa")
                    {
                        _upfrontRepository.UnlockUpfront(LoggedOnUser.UserId);
                        _proposalRepository.UnlockProposal(LoggedOnUser.UserId, -1, true);
                        _scheduleRepository.UnlockSchedule(LoggedOnUser.UserId, -1);
                        _upfrontRepository.UnlockUpfront(LoggedOnUser.UserId);
                    }

                    LogonViewModel logonViewModel = new LogonViewModel(_config);
                    logonViewModel.FirstName = LoggedOnUser.FirstName;
                    logonViewModel.LastName = LoggedOnUser.LastName;

                    HttpContext.Session.Clear();
                    HttpContext.Session.Remove("OMP");
                    HttpContext.Session.Remove("OMU");

                    HttpContext.Response.Cookies.Delete("OMP");
                    HttpContext.Response.Cookies.Delete("OMU");

                    return View(logonViewModel);
                }
                catch (Exception exc)
                {
                    _logger.LogError (1, exc, exc.Message);
                }
                return View();
            }
        }

        [LogonLayout("_Logon")]
        [HttpPost]
        public IActionResult Logon(User user)
        {
            HttpContext.Session.SetString("ConStr", _config.GetSection("ConnectionStrings:DefaultConnection").Value.ToString());
            string Constr = HttpContext.Session.GetString("ConStr");
            ViewBag.LogonError = "";
            ViewBag.ErrorVisible = "invisible";
            ViewBag.InfoVisible = "invisible";

            LogonViewModel logonViewModel = new LogonViewModel(_config);
            logonViewModel.AccountName = user.AccountName;
            logonViewModel.Password = user.Password;
            logonViewModel.FirstName = user.FirstName;
            logonViewModel.LastName = user.LastName;
            logonViewModel.LastLoginDt = DateTime.Now;

            StringBuilder strError = new StringBuilder();
            if (string.IsNullOrEmpty(user.AccountName))
            {
                strError.Append("user name is required");
            }
            if (string.IsNullOrEmpty(user.Password))
            {
                if (!string.IsNullOrEmpty(strError.ToString()))
                {
                    strError.Append("</br>");
                }
                strError.Append("password is required");
            }
            if (!string.IsNullOrEmpty(strError.ToString()))
            {
                ViewBag.LogonError = strError.ToString();
                ViewBag.ErrorVisible = "";
                return View(logonViewModel);
            }
            if (user.AccountName.Contains("@"))
            {
                strError.Append("Invalid user name and password");
                ViewBag.LogonError = strError.ToString();
                ViewBag.ErrorVisible = "";
                return View(logonViewModel);
            }

            if (logonViewModel.IsAuthenticated() == true)
            {

                // When on debug node, we accept debug password but account name should always be valid.
                // If invalid, then we will have an exception.  Jump back to logon page.
                User LoggedOnUser = _userRepository.GetUserByAccountName(user.AccountName);
                _userRepository.SetUserLoginDt(LoggedOnUser.UserId);
                _logger.LogInformation(LoggedOnUser.UserId, "Successfully logged in " + user.AccountName);


                try
                {
                    HttpContext.Session.SetString("UserId", LoggedOnUser.UserId.ToString());
                    HttpContext.Session.SetString("AccountName", LoggedOnUser.AccountName);
                    HttpContext.Session.SetString("DisplayName", LoggedOnUser.DisplayName);
                    HttpContext.Session.SetInt32("PermissionLevelId", LoggedOnUser.PermissionLevelId);

                    HttpContext.Response.Cookies.Append("OMP", Rijndael.Encrypt(user.AccountName, "zachary", KeySize.Aes256));
                    HttpContext.Response.Cookies.Append("OMU", Rijndael.Encrypt(user.Password, "zachary", KeySize.Aes256));
                }
                catch (Exception exc)
                {
                    _logger.LogError(LoggedOnUser.UserId, exc, exc.Message);
                    return View(logonViewModel);
                }

                //return RedirectToAction("EditProposal", "ManageMedia", new { ProposalId = 43 });
                return RedirectToAction("Index", "Home");
            }

            ViewBag.LogonError = logonViewModel.ErrorMessageLabel;
            if (ViewBag.LogonError.ToString().Length <= 0)
            {
                ViewBag.ErrorVisible = "invisible";
            }
            else
            {
                ViewBag.ErrorVisible = "";
            }
            return View(logonViewModel);
        }

        [SessionExpireFilter]
        [HttpPost]
        public IActionResult SaveProfile (UserViewModel uvm)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            User CurrentUser = _userRepository.GetUserById(uvm.SelectedUserId);
            var UserDetailSuccessMessage = _config.GetSection("UserDetailSuccessMessage: UserDetailSuccessMessage");
            string LoggedOnUserPermissionLevel = LoggedOnUser.PermissionLevel.Description.ToLower();
            if (LoggedOnUserPermissionLevel == "admin")
            {
                UserViewModel userVM = new UserViewModel(uvm);

                userVM.PermissionLevels = _userRepository.GetAllPermissionLevels();
                userVM.JobTitleTypes = _jobtitletypeRepository.GetAllJobTitleTypes();

                userVM.LoggedOnUser = LoggedOnUser;
                userVM.SelectedUser = CurrentUser;
                userVM.PermissionLevel = userVM.PermissionLevels.Where(permlev => permlev.PermissionLevelId == userVM.PermissionLevelId).FirstOrDefault<PermissionLevel>();
                userVM.JobTitleType = userVM.JobTitleTypes.Where(jtt => jtt.JobTitleTypeId == userVM.JobTitleTypeId).FirstOrDefault<JobTitleType>();

                userVM.Actions = _appFeatureRepository.GetAllActions();
                userVM.AppFeatureDefaultActions = _appFeatureRepository.GetAppFeatureDefaultActions(userVM.SelectedUser.PermissionLevelId);
                userVM.UserPermissions = _appFeatureRepository.GetUserPermissions(userVM.SelectedUser.UserId);
                //userVM.SelectedUser.PermissionLevelId = userVM.PermissionLevel.PermissionLevelId;
                //userVM.SelectedUser.JobTitleTypeId = userVM.JobTitleType.JobTitleTypeId;

                string PermissionLevel = CurrentUser.PermissionLevel.Description.ToLower();
                string pl = userVM.PermissionLevel.Description.ToLower();
                string Message = "";

                if (pl == "buyer" || pl == "assistant") {
                    userVM.Finance = false;
                }

                if (pl == "client management")
                {
                    if ((uvm.Digital && uvm.Local && uvm.Podcast) || (!uvm.Digital && !uvm.Local && !uvm.Podcast) || (uvm.Digital && (uvm.Local || uvm.Podcast)) || (uvm.Local && (uvm.Digital || uvm.Podcast)) || (uvm.Podcast && (uvm.Digital || uvm.Local)))
                    {
                        return RedirectToAction("Detail", "User", new { id = CurrentUser.AccountName });
                    }
                    userVM.Finance = false;
                    uvm.CAActualExchRate = false;
                    uvm.CAClientExchRate = false;
                    uvm.USBuyer = false;
                    uvm.CABuyer = false;
                    userVM.JobTitleType = userVM.JobTitleTypes.Where(jtt => jtt.JobTitleTypeId == 6).FirstOrDefault<JobTitleType>();
                }
                else
                {
                    uvm.Digital = false;
                    uvm.Local = false;
                    uvm.Podcast = false;
                }
                _userRepository.SetFinanceUser(userVM.LoggedOnUser.UserId, userVM.SelectedUser.UserId, userVM.Finance);
                _userRepository.SetUserCAExchRate(LoggedOnUser.UserId, CurrentUser.UserId, uvm.CAClientExchRate, uvm.CAActualExchRate);

                _appFeatureRepository.SaveJobTitleType(userVM.SelectedUser, userVM.LoggedOnUser, userVM.JobTitleType.JobTitleTypeId);
                _userRepository.SetUserCountry(LoggedOnUser.UserId, CurrentUser.UserId, uvm.USBuyer, uvm.CABuyer);
                _userRepository.SetClientManagementUserPermission(LoggedOnUser.UserId, CurrentUser.UserId, uvm.Digital, uvm.Local, uvm.Podcast);
                if (_appFeatureRepository.SaveUserPermissionLevel(userVM.SelectedUser, userVM.LoggedOnUser, userVM.PermissionLevel.PermissionLevelId) == false)
                {
                    var Items = Request.Form.ToList();
                    for (int idx = 0; idx < Items.Count; idx++)
                    {
                        string Key = Items[idx].Key;
                        string Value = Items[idx].Value;

                        if (Key.Contains("afuca_") == true)
                        {
                            if (_appFeatureRepository.SaveAppFeatureUserCustomAction(int.Parse(Key.Replace("afuca_", "")), userVM.SelectedUser.UserId, int.Parse(Value)) == true)
                            {
                                AppFeature af = _userRepository.GetAppFeatures().Where(a => a.AppFeatureId == int.Parse(Key.Replace("afuca_", ""))).FirstOrDefault<AppFeature>();
                                if (af != null)
                                {
                                    Message += af.Description + " permissions updated.<br />";
                                }
                                else
                                {
                                    Message += "User permissions updated.<br />";
                                }
                            }
                        }
                    }
                    if (Message.Length > 0)
                    {
                        _logger.LogInformation(LoggedOnUser.UserId, Message);
                        HttpContext.Session.SetString(UserDetailSuccessMessage.ToString(), Message);
                    }
                }
                else
                {
                    _logger.LogInformation(LoggedOnUser.UserId, CurrentUser.DisplayName + "'s permission level was updated to " + CurrentUser.PermissionLevel.Description + ".");
                    HttpContext.Session.SetString(UserDetailSuccessMessage.ToString(), CurrentUser.DisplayName + "'s permission level was updated to " + CurrentUser.PermissionLevel.Description + ".");
                    if ((pl == "admin" || pl == "buyer" || pl == "assistant") && PermissionLevel == "general")
                    {
                        _userRepository.AddNetworkUserJob(LoggedOnUser.UserId, CurrentUser.UserId);
                    }
                    else if (pl == "general" && (PermissionLevel == "admin" || PermissionLevel == "buyer" || PermissionLevel == "assistant"))
                    {
                        _userRepository.RemoveNetworkUserJobClientUserJob(LoggedOnUser.UserId, CurrentUser.UserId);
                    }
                }


                return RedirectToAction("Detail", "User", new { id = CurrentUser.AccountName });

            }
            else
            {
                return StatusCode(403);
            }
        }

        [SessionExpireFilter]
        public ViewResult DefaultPermissions()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (LoggedOnUser == null)
            {
                RedirectToAction("Logon", "User");
                return View();
            }
            else
            {
                UsersListViewModel userListViewModel = new UsersListViewModel();
                userListViewModel.LoggedOnUser = LoggedOnUser;
                userListViewModel.Users = _userRepository.GetAllUsers(LoggedOnUser).ToList();
                userListViewModel.ActiveUsers = _userRepository.GetAllActiveUsers(LoggedOnUser).ToList();
                userListViewModel.InactiveUsers = _userRepository.GetAllInactiveUsers(LoggedOnUser).ToList();

                return View(userListViewModel);
            }

        }

        //[LogonLayout("_Detail")]
        [SessionExpireFilter]
        public IActionResult Detail(string id)
        {
            var UserDetailSuccessMessage = _config.GetSection("UserDetailSuccessMessage: UserDetailSuccessMessage");

            if (String.IsNullOrEmpty(HttpContext.Session.GetString(UserDetailSuccessMessage.ToString())) == false)
            {
                ViewBag.DetailMessageVisible = "";
                ViewBag.DetailMessage = HttpContext.Session.GetString(UserDetailSuccessMessage.ToString());
                HttpContext.Session.Remove(UserDetailSuccessMessage.ToString());
            }
            else
            {
                ViewBag.DetailMessageVisible = "invisible";
                ViewBag.DetailMessage = "";

            }

            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            User CurrentUser = _userRepository.GetUserByAccountName(id);
            string LoggedOnUserPermissionLevel = LoggedOnUser.PermissionLevel.Description.ToLower();
            if (LoggedOnUserPermissionLevel == "admin")
            {

                UserViewModel userVM = new UserViewModel();

                userVM.SelectedUser = new User(CurrentUser);
                userVM.LoggedOnUser = new User(LoggedOnUser);

                // Setup current user selected
                userVM.JobTitleTypeId = CurrentUser.JobTitleType.JobTitleTypeId;
                userVM.PermissionLevelId = CurrentUser.PermissionLevelId;
                userVM.SelectedUserId = CurrentUser.UserId;
                userVM.LoggedOnUserId = LoggedOnUser.UserId;
                userVM.Finance = CurrentUser.Finance;
                userVM.USBuyer = CurrentUser.US_User;
                userVM.CABuyer = CurrentUser.CA_User;
                userVM.Digital = CurrentUser.IsDigital;
                userVM.Local = CurrentUser.IsLocal;
                userVM.Podcast = CurrentUser.IsPodcast;

                // Setup lists
                userVM.Actions = _appFeatureRepository.GetAllActions();
                userVM.PermissionLevels = _userRepository.GetAllPermissionLevels();
                userVM.JobTitleTypes = _jobtitletypeRepository.GetAllJobTitleTypes();
                userVM.AppFeatureDefaultActions = _appFeatureRepository.GetAppFeatureDefaultActions(userVM.SelectedUser.PermissionLevelId);
                userVM.UserPermissions = _appFeatureRepository.GetUserPermissions(CurrentUser.UserId).Where(x => x.FeatureDescription.ToLower() == "ca actual exc rate" || x.FeatureDescription.ToLower() == "ca client exc rate");
                userVM.CanEditUserSettings = (_appFeatureRepository.GetUserAction(LoggedOnUser.UserId, "User Settings").ActionId == 4? true : false);

                userVM.ClientUserJobs = _clientRepository.GetClientUserJobs(0, CurrentUser.UserId);
                userVM.ClientUserJobs_Buyer = _clientRepository.GetClientUserJobs(2, CurrentUser.UserId);
                userVM.ClientUserJobs_Assistant = _clientRepository.GetClientUserJobs(1, CurrentUser.UserId);
                userVM.ClientUserJobs_Backup = _clientRepository.GetClientUserJobs(3, CurrentUser.UserId);
                userVM.ClientUserJobs_None = _clientRepository.GetClientUserJobs(4, CurrentUser.UserId);

                userVM.ClientUserJobs_NoBuyer = _clientRepository.GetAllClientsExceptJobId(2, CurrentUser.UserId);
                userVM.ClientUserJobs_NoAssistant = _clientRepository.GetAllClientsExceptJobId(1, CurrentUser.UserId);
                userVM.ClientUserJobs_NoBackup = _clientRepository.GetAllClientsExceptJobId(3, CurrentUser.UserId);

                Dictionary<string, bool> dct = _userRepository.GetUserCAExchRate(LoggedOnUser.UserId, CurrentUser.UserId);
                foreach(KeyValuePair<string, bool> ele in dct)
                {
                    if(ele.Key.ToLower()== "caclientexchangerate")
                    {
                        userVM.CAClientExchRate = ele.Value;
                    }
                    else if(ele.Key.ToLower() == "caactualexchangerate")
                    {
                        userVM.CAActualExchRate = ele.Value;
                    }
                }

                return View(userVM);
            }
            else
            {
                return StatusCode(403);
            }

        }


        [HttpPost]
        [SessionExpireFilter]
        public ActionResult ChangeClientJob(int[] clientids, string id, int jobid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            User CurrentUser = _userRepository.GetUserByAccountName(id);
            try
            {
                if (jobid == 4)
                {
                    Client client = _clientRepository.GetClient (clientids[0]);
                    ErrorMessage err = _clientRepository.ChangeClientJob(clientids, CurrentUser.UserId, jobid, LoggedOnUser.UserId).FirstOrDefault();
                    if (err.ResponseCode > 0)
                    {
                        _logger.LogInformation(LoggedOnUser.UserId, "Client, " + client.ClientName + ", job successfully updated to " + jobid.ToString() + ".");
                    }
                }
                else if (jobid == 1 || jobid == 2 || jobid == 3)
                {
                    IEnumerable<ErrorMessage> errs = _clientRepository.ChangeClientJob(clientids, CurrentUser.UserId, jobid, LoggedOnUser.UserId);

                    string ClientNames = "";
                    foreach (ErrorMessage err in errs)
                    {
                        if (err.ResponseCode > 0)
                        {
                            string cn = _clientRepository.GetClient(err.ResponseCode).ClientName;
                            if (string.IsNullOrEmpty(ClientNames))
                            {
                                ClientNames += cn;
                            }
                            else
                            {
                                ClientNames += ", " + cn;
                            }
                        }
                    }
                    if (!string.IsNullOrEmpty(ClientNames))
                    {
                        _logger.LogInformation(LoggedOnUser.UserId, (ClientNames.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Count() > 1 ?"Clients, ": "Client, ") + ClientNames + ",  job successfully updated to " + jobid.ToString() + ".");
                    }
                }

                return Json(new
                {
                    success = true,
                    responseCode = 1,
                    responseText = "Success"
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
        public ActionResult GetClients(string id, int jobid)
        {
            try
            {
                User CurrentUser = _userRepository.GetUserByAccountName(id);

                List<ClientUserJob> cuj = new List<ClientUserJob>();
                cuj = _clientRepository.GetClientUserJobs(jobid, CurrentUser.UserId).ToList();

                List<Client> objCUJ = new List<Client>();
                foreach (var CliUseJob in cuj)
                {
                    Client cli = new Client();
                    // If client is new then this is negative
                    cli.ClientId = CliUseJob.Client.ClientId * (CliUseJob.Client.New == true? -1 : 1);
                    cli.ClientName = CliUseJob.Client.ClientName + " (" + CliUseJob.Client.Country.CountryShort + ")";
                    objCUJ.Add(cli);
                }
                SelectList obgCUJ = new SelectList(objCUJ, "ClientId", "ClientName", 0);
                return Json(obgCUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetClientsExceptJobId (string id, int jobid)
        {
            try
            {
                User CurrentUser = _userRepository.GetUserByAccountName(id);

                List<Client> cuj = new List<Client>();
                cuj = _clientRepository.GetAllClientsExceptJobId (jobid, CurrentUser.UserId).ToList();

                List<Client> objCUJ = new List<Client>();
                foreach (var client in cuj)
                {
                    if ((bool)client.Active)
                    {
                        Client cli = new Client();
                        // If client is new then this is negative
                        cli.ClientId = client.ClientId * (client.New == true ? -1 : 1);
                        cli.ClientName = client.ClientName + " (" + client.Country.CountryShort + ")";
                        objCUJ.Add(cli);
                    }
                }

                SelectList obgCUJ = new SelectList(objCUJ, "ClientId", "ClientName", 0);
                return Json(obgCUJ);
            }
            catch (Exception exc)
            {
                return RedirectToAction("500" + @"/" + exc.Message, "StatusCode");
            }
        }

        [SessionExpireFilter]
        public ViewResult List()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (LoggedOnUser == null)
            {
                RedirectToAction("Logon", "User");
                return View();
            }
            else
            {
                UsersListViewModel userListViewModel = new UsersListViewModel();
                userListViewModel.LoggedOnUser = LoggedOnUser;
                userListViewModel.Users = _userRepository.GetAllUsers(LoggedOnUser).ToList();
                userListViewModel.ActiveUsers = _userRepository.GetAllActiveUsers(LoggedOnUser).ToList();
                userListViewModel.InactiveUsers = _userRepository.GetAllInactiveUsers(LoggedOnUser).ToList();


                /*
                var userfiles = Path.Combine(_environment.WebRootPath, "users");
                for (int idx = 0; idx < userListViewModel.Users.Count(); idx++)
                {
                    var file = System.IO.Path.Combine(userfiles, userListViewModel.Users[idx].AccountName + ".jpg");
                    if (System.IO.File.Exists(file))
                    {
                        userListViewModel.Users[idx].ImageUrl = "/users/" + userListViewModel.Users[idx].AccountName + ".jpg";
                    }
                    else
                    {
                        userListViewModel.Users[idx].ImageUrl = "/img/avatars/avatar5.jpg";
                    }
                }
                */



                return View(userListViewModel);
            }
        }

        [SessionExpireFilter]
        public ViewResult ManageDefaultActions()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ManageDefaultActionsViewModel mdavw = new ManageDefaultActionsViewModel();
            mdavw.LoggedOnUser = LoggedOnUser;
            mdavw.Actions = _appFeatureRepository.GetAllActions();
            mdavw.AppFeatureDefaultActions_Admin = _appFeatureRepository.GetAppFeatureDefaultActions(1);
            mdavw.AppFeatureDefaultActions_Mid = _appFeatureRepository.GetAppFeatureDefaultActions(2);
            mdavw.AppFeatureDefaultActions_Low = _appFeatureRepository.GetAppFeatureDefaultActions(3);
            mdavw.AppFeatureDefaultActions_General = _appFeatureRepository.GetAppFeatureDefaultActions(4);

            ViewBag.DetailMessageVisible = "invisible";

            return View(mdavw);

        }

        [SessionExpireFilter]
        public IActionResult SaveDefaultActions()
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var Items = Request.Form.ToList();
            for (int idx = 0; idx < Items.Count; idx++)
            {
                string Key = Items[idx].Key;
                string Value = Items[idx].Value;

                if (Key.Contains("afda_") == true)
                {
                    _appFeatureRepository.SaveAppFeatureDefaultAction(int.Parse(Key.Replace("afda_", "")), int.Parse(Value));
                    _logger.LogInformation(LoggedOnUser.UserId, "Default Actions Updated.  " + Key + " " + Value);
                }
            }

            ViewBag.DetailMessageVisible = "";

            return RedirectToAction ("ManageDefaultActions", "User");

        }

        [HttpPost]
        [SessionExpireFilter]
        public ActionResult SetUserProfile(string ProfileKey, string ProfileValue)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                _userRepository.SetUserProfile(LoggedOnUser.UserId, ProfileKey, ProfileValue);
            }
            catch
            {
            }

            return Json(true);
        }
        // Added by shariq ST- 631
        public IActionResult CheckSession()
        {
            if (string.IsNullOrEmpty(HttpContext.Session.GetString("AccountName")))
            {
                return Json(new
                {
                    retval = "0",
                    responseCode = "408",
                    responseText = "Session has been expried"
                });
            }

            else
            {
                return Json(new
                {
                    retval = "1",
                    responseCode = "200",
                    responseText = "Success"
                });
            }


        }


    }
}