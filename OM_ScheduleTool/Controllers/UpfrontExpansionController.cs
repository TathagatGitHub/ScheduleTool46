using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;

namespace OM_ScheduleTool.Controllers
{
    public class UpfrontExpansionController : Controller
    {
        private IUserRepository _userRepository;
        private IUpfrontRepository _upfrontRepository;
        private IUpfrontExpansionRepository _expansionRepository;
        private INetworkRepository _networkRepository;
        private IClientRepository _clientRepository;
        private IConfiguration _config;

        public UpfrontExpansionController(IUserRepository userRepository
            , IUpfrontRepository upfrontRepository
            , INetworkRepository networkRepository
            , IUpfrontExpansionRepository expansionRepository
            , IClientRepository clientRepository
            , IConfiguration config)
        {
            _userRepository = userRepository;
            _upfrontRepository = upfrontRepository;
            _expansionRepository = expansionRepository;
            _networkRepository = networkRepository;
            _clientRepository = clientRepository;
            _config = config;
        }


        private void GetHeaderData(UpfrontExpansionViewModel uevm, User user, int UpfrontId, Upfront CurrentUpfront)
        {            
            List<UpfrontExpansionQuarters> UpfrontExpansionQuarters = _expansionRepository.GetUpfrontExpansionQtrsByUpfrontId(user.UserId, UpfrontId, CurrentUpfront.Quarter.BroadcastQuarterNbr);

            // Filling up all quarter information for easier viewing
            for (int idx = 0; idx < UpfrontExpansionQuarters.Count(); idx++)
            {
                if (UpfrontExpansionQuarters[idx].QuarterNbr == 1)
                {
                    uevm.Quarter1 = UpfrontExpansionQuarters[idx];
                }
                else if (UpfrontExpansionQuarters[idx].QuarterNbr == 2)
                {
                    uevm.Quarter2 = UpfrontExpansionQuarters[idx];
                }
                else if (UpfrontExpansionQuarters[idx].QuarterNbr == 3)
                {
                    uevm.Quarter3 = UpfrontExpansionQuarters[idx];
                }
                else if (UpfrontExpansionQuarters[idx].QuarterNbr == 4)
                {
                    uevm.Quarter4 = UpfrontExpansionQuarters[idx];
                }
                if (UpfrontExpansionQuarters[idx].IsCurrent == true)
                {
                    uevm.CurrentQuarter = UpfrontExpansionQuarters[idx];                    
                }

            }
        }

        private void GetDetailData(UpfrontExpansionViewModel uevm, User user, int UpfrontId, Upfront CurrentUpfront) {

            UpfrontExpansionTracking uet = _expansionRepository.GetUpfrontExpansionTrackingByUpfrontId(user.UserId, UpfrontId);
            uevm.UpfrontExpansionTrackingId = uet.UpfrontExpansionTrackingId;
            uevm.CurrentUpfrontExpansionTracking = uet;

            IEnumerable<Client> clientList = _clientRepository.GetAllClientsByCountry(CurrentUpfront.Network.CountryId);
            uevm.ClientList = clientList;            
        }

        [SessionExpireFilter]
        [LogonLayout("_LayoutFullNoMenuMasked")]
        public IActionResult Index(int UpfrontId)
        {            
            UpfrontExpansionViewModel uevm = new UpfrontExpansionViewModel();
            uevm.UpfrontId = UpfrontId;
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            uevm.LoggedOnUser = LoggedOnUser;
            
            Upfront CurrentUpfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);

            GetHeaderData(uevm, LoggedOnUser, UpfrontId, CurrentUpfront);
            GetDetailData(uevm, LoggedOnUser, UpfrontId, CurrentUpfront);

            return View(uevm);
        }        

        [SessionExpireFilter]
        [LogonLayout("_LayoutFullNoMenuMasked")]
        [HttpPost]
        public IActionResult Index(UpfrontExpansionViewModel uevm, string btnSubmit)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            uevm.LoggedOnUser = LoggedOnUser;
            
            Upfront CurrentUpfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, uevm.UpfrontId);
            GetHeaderData(uevm, LoggedOnUser, uevm.UpfrontId, CurrentUpfront);
            GetDetailData(uevm, LoggedOnUser, uevm.UpfrontId, CurrentUpfront);

            if (!ModelState.IsValid)
                return View(uevm);

            else if (uevm.CurrentQuarter.UEDollarsAvailable == 0)
                ModelState.AddModelError("TradeError", "Please input UE Dollars Available for this Upfront before doing any trade.");

            else if (Convert.ToDecimal(uevm.TradeAmount) > Decimal.Round(uevm.CurrentUpfrontExpansionTracking.UpfrontExpansionTradeDetails.Where(x => x.ClientId == uevm.ClientFromId).OrderByDescending(x => x.RowNo).First().UERemaining ?? 0, 2, MidpointRounding.AwayFromZero))
                ModelState.AddModelError("TradeError", "Error - You cannot trade more than your UE Remaining.");

            else if (_expansionRepository.Trade(uevm.UpfrontExpansionTrackingId, uevm.ClientFromId, uevm.ClientToId, Convert.ToDecimal(uevm.TradeAmount), LoggedOnUser) == 0)
                ModelState.AddModelError("TradeError", "Error - Trade not executed.");
            else
            {
                if (uevm.CurrentUpfrontExpansionTracking.Yearly ?? false)
                    return RedirectToAction("Index", new { UpfrontId = uevm.UpfrontId});
                else
                    return RedirectToAction("Index", new { UpfrontId = uevm.UpfrontId});
            }
            //return PartialView("_Detail", uevm);                
            
            return View(uevm);
        }

        [SessionExpireFilter]
        [LogonLayout("_LayoutFullNoMenuMasked")]
        [HttpPost]
        public IActionResult SaveHeader(int UpfrontId, int UpfrontExpansionTrackingId, int UEDollarsAvailable, int TotalUpfrontDollars)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            
            if (_expansionRepository.Save_UpfrontExpansionTracking(UpfrontId, UpfrontExpansionTrackingId, UEDollarsAvailable, TotalUpfrontDollars, LoggedOnUser) == 0)
                return BadRequest("Error saving Total Upfront and UE Dollars Available.");
            else
            {
                return Ok();
            }         
        }

        [SessionExpireFilter]
        [LogonLayout("_LayoutFullNoMenuMasked")]
        [HttpPost]
        public IActionResult SaveHeaderYearly(int UpfrontExpansionTrackingId, int UEDollarsAvailable, int TotalUpfrontDollars, int YearUEDollarsAvailable, int YearTotalUpfrontDollars)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (_expansionRepository.Save_UpfrontExpansionTracking(UpfrontExpansionTrackingId, UEDollarsAvailable, TotalUpfrontDollars, YearUEDollarsAvailable, YearTotalUpfrontDollars, LoggedOnUser))
                return Ok();
            else
            {
                return BadRequest("Error - Your changes are not saved."); 
            }

        }

        [SessionExpireFilter]
        [LogonLayout("_LayoutFullNoMenuMasked")]
        [HttpPost]
        public IActionResult DeleteTrade(int UpfrontId, int UpfrontExpansionTrackingLineId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            if (!_expansionRepository.DeleteTrade(UpfrontExpansionTrackingLineId, LoggedOnUser))
            {
                ModelState.AddModelError("DeleteTradeError", "Error - Trade not deleted.");
                return BadRequest("Error - Trade not deleted.");
            }
            else
                return RedirectToAction("Index", new { UpfrontId = UpfrontId });
        }


        [SessionExpireFilter]
        [LogonLayout("_LayoutFullNoMenu")]
        public IActionResult Create(int UpfrontId) {

            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            Upfront CurrentUpfront = _upfrontRepository.GetUpfrontById(LoggedOnUser.UserId, UpfrontId);
            ViewData["Network"] = CurrentUpfront.Network.StdNetName;
            ViewData["Quarter"] = CurrentUpfront.Quarter.QuarterName;
            ViewData["UpfrontId"] = UpfrontId;
            ViewData["LoggedOnUserId"] = LoggedOnUser.UserId;

            ViewData["DemoList"] = _expansionRepository.GetUpfrontExpansion_DemoNames(UpfrontId);

            return PartialView("_CreateExpansionModal");
        }

        [SessionExpireFilter]        
        public IActionResult Save(int UpfrontId, int DemographicSettingsId, int LoggedOnUserId)
        {
            int RemnantId = -1;
            try
            {
                RemnantId = _expansionRepository.CreateUpfrontExpansion(UpfrontId, DemographicSettingsId, LoggedOnUserId);

            }
            catch (Exception ex)
            {
                if (ex.Message.IndexOf("UE already created for all properties- See Remnant") != -1)
                    return BadRequest(ex.Message);
            }

            return Ok(RemnantId);
        }
        
        public IActionResult Yearly_Or_Quarterly(int UpfrontId, int LoggedOnUserId, int LastWindowHeight)
        {
            Upfront CurrentUpfront = _upfrontRepository.GetUpfrontById(LoggedOnUserId, UpfrontId);
            var networkGroup = _expansionRepository.GetNetworkGroup(CurrentUpfront.NetworkId, CurrentUpfront.QuarterId, LoggedOnUserId);
            ViewData["Network"] = networkGroup.Count() == 0 ? CurrentUpfront.Network.StdNetName: networkGroup.Aggregate((ng1, ng2) => ng1 + ", " + ng2);
            ViewData["Quarter"] = CurrentUpfront.Quarter.QuarterName;
            ViewData["UpfrontId"] = UpfrontId;
            ViewData["LoggedOnUserId"] = LoggedOnUserId;
            ViewData["LastWindowHeight"] = LastWindowHeight;

            return PartialView("_YearlyQuarterlyExpansionModal");
        }
           
        public JsonResult GetYearlyFlag(int UpfrontId, int LoggedOnUserId)
        {
            bool? yearly = null;
            bool CanChangeYearly;
            int id;
            _expansionRepository.GetYearlyFlag(UpfrontId, LoggedOnUserId, out yearly, out id, out CanChangeYearly);
            return Json(new { yearly = yearly, id = id, CanChangeYearly = CanChangeYearly });
        }

        [SessionExpireFilter]        
        public IActionResult SaveYearlyOrQuarterly(int UpfrontId, string YearlyQuarterly, int LoggedOnUserId)
        {
            var success = _expansionRepository.SaveYearlyOrQuarterlyUpfrontExpansion(UpfrontId, YearlyQuarterly == "year" ? true : false, LoggedOnUserId);
            if (success)
                return Ok();
            else
                return BadRequest();
            
        }

        [SessionExpireFilter]        
        [HttpPost]
        public JsonResult GetYearUsageTracker(int UpfrontId)
        {
            int FundsUsed, FundsRemaining;
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _expansionRepository.GetYearUsageTracker(UpfrontId, LoggedOnUser.UserId, out FundsUsed, out FundsRemaining);
            return Json(new { FundsUsed = FundsUsed, FundsRemaining = FundsRemaining });
        }

        [SessionExpireFilter]        
        public IActionResult ManageGroup(int Year, string Country, int UpfrontExpansionNetworkGroupId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            UpfrontExpansionGroupingViewModel viewModel = new UpfrontExpansionGroupingViewModel();
            viewModel.LoggedOnUser = LoggedOnUser;

            int currentYear = DateTime.Now.Year;
            viewModel.Year = new int[5] { currentYear - 2, currentYear - 1, currentYear, currentYear + 1, currentYear+2 };
            if (Year == 0)
                viewModel.selectedYear = currentYear;
            else
                viewModel.selectedYear = Year;

            viewModel.Countries = _networkRepository.GetAllCountries();
            if (Country != null && Country.Length > 0)
                viewModel.CountryId = viewModel.Countries.Where(x => x.CountryShort == Country).Select(x => x.CountryId).Single();
            else
                viewModel.CountryId = viewModel.Countries.First().CountryId;
            
            viewModel.Networks = _networkRepository.GetAllNetworksByCountry(viewModel.CountryId);
            viewModel.NetworkGroups = _expansionRepository.GetNetworkGroups(viewModel.selectedYear, viewModel.CountryId, LoggedOnUser.UserId);
            if (viewModel.NetworkGroups != null && viewModel.NetworkGroups.ToList().Count() > 0) {
                if (UpfrontExpansionNetworkGroupId != 0 && viewModel.NetworkGroups.Select(x => x.Key).ToArray().Contains(UpfrontExpansionNetworkGroupId))
                    viewModel.selectedNetworkGroup = UpfrontExpansionNetworkGroupId;
                else
                    viewModel.selectedNetworkGroup = viewModel.NetworkGroups.Select(x => x.Key).First();

                viewModel.NetworksInSelectedNetworkGroup = _expansionRepository.GetNetworksForGroup(viewModel.selectedNetworkGroup, LoggedOnUser.UserId);
                //Filter Network List not to include any existing network in all groups.
                List<int> excludedNetworks = new List<int>();
                foreach (var group in viewModel.NetworkGroups)
                {
                    excludedNetworks.AddRange(_expansionRepository.GetNetworksForGroup(group.Key, LoggedOnUser.UserId).Select(x => x.NetworkId).ToArray());
                }
                viewModel.Networks = viewModel.Networks.Where(x => !(excludedNetworks.Contains(x.NetworkId)));
            }

            return View(viewModel);
        }

        [SessionExpireFilter]        
        [HttpPost]
        public IActionResult DeleteNetwork(int NetworkId, int UpfrontExpansionNetworkGroupId)
        {
            string errorMsg;
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            //if (!_expansionRepository.AddNetworkToGroup(uevm.selectedNetworkGroup, ddlNetwork, LoggedOnUser.UserId))
            //{

            //}

            //uevm.NetworksInSelectedNetworkGroup = _expansionRepository.GetNetworks(uevm.selectedNetworkGroup, LoggedOnUser.UserId);
            //uevm.Networks = _networkRepository.GetAllNetworksByCountry(uevm.NetworksInSelectedNetworkGroup.First().CountryId);
            //uevm.Networks = uevm.Networks.Where(x => !(uevm.NetworksInSelectedNetworkGroup.Select(y => y.NetworkId).Contains(x.NetworkId)));
            //uevm.NetworkGroups = _expansionRepository.GetNetworkGroups(uevm.selectedYear, uevm.NetworksInSelectedNetworkGroup.First().CountryId, LoggedOnUser.UserId);

            //return PartialView("_NetworkGroup", uevm);
            if (_expansionRepository.DeleteNetworkInGroup(NetworkId, UpfrontExpansionNetworkGroupId, LoggedOnUser.UserId, out errorMsg))
                return Ok();
            else
            {
                if (errorMsg != string.Empty)
                    return BadRequest(errorMsg);
                else
                    return BadRequest("Error deleting Network from Group.");                
            }

        }

        [SessionExpireFilter]
        [HttpPost]
        public IActionResult AddNetwork(int[] Networks, int UpfrontExpansionNetworkGroupId, int Year, string Country)
        {
            string errorMsg;
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (_expansionRepository.AddNetworkToGroup(UpfrontExpansionNetworkGroupId, Networks, Year, Country, LoggedOnUser.UserId, out errorMsg))
                return Ok();
            else
            {
                if (errorMsg != string.Empty)
                    return BadRequest(errorMsg);
                else
                    return BadRequest("Error adding Network to Group.");
            }
        }

        [SessionExpireFilter]        
        public IActionResult NetworkGroupSelected(int UpfrontExpansionNetworkGroupId, int Year)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            UpfrontExpansionGroupingViewModel viewModel = new UpfrontExpansionGroupingViewModel();
            viewModel.NetworksInSelectedNetworkGroup = _expansionRepository.GetNetworksForGroup(UpfrontExpansionNetworkGroupId, LoggedOnUser.UserId);

            viewModel.Networks = _networkRepository.GetAllNetworksByCountry(viewModel.NetworksInSelectedNetworkGroup.First().CountryId);

            //viewModel.Networks = viewModel.Networks.Where(x => !(viewModel.NetworksInSelectedNetworkGroup.Select(y => y.NetworkId).Contains(x.NetworkId)));
            //Filter Network List not to include any existing network in all groups.
            List<int> excludedNetworks = new List<int>();
            viewModel.NetworkGroups = _expansionRepository.GetNetworkGroups(Year, viewModel.NetworksInSelectedNetworkGroup.First().CountryId, LoggedOnUser.UserId);
            foreach (var group in viewModel.NetworkGroups)
            {
                excludedNetworks.AddRange(_expansionRepository.GetNetworksForGroup(group.Key, LoggedOnUser.UserId).Select(x => x.NetworkId).ToArray());
            }
            viewModel.Networks = viewModel.Networks.Where(x => !(excludedNetworks.Contains(x.NetworkId)));

            return PartialView("_NetworkGroupSelected", viewModel);
        }

        [SessionExpireFilter]  
        public IActionResult GetNetworkGroups(int Year, int CountryId, string Country)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));            
            UpfrontExpansionGroupingViewModel viewModel = new UpfrontExpansionGroupingViewModel();
            viewModel.Networks = _networkRepository.GetAllNetworksByCountry(CountryId);
            viewModel.NetworkGroups = _expansionRepository.GetNetworkGroups(Year, CountryId, LoggedOnUser.UserId);
            if (viewModel.NetworkGroups != null && viewModel.NetworkGroups.Count() > 0 && Year >= DateTime.Now.Year)
            {
                viewModel.selectedNetworkGroup = viewModel.NetworkGroups.Select(x => x.Key).First();
                viewModel.NetworksInSelectedNetworkGroup = _expansionRepository.GetNetworksForGroup(viewModel.selectedNetworkGroup, LoggedOnUser.UserId);
                viewModel.Networks = viewModel.Networks.Where(x => !(viewModel.NetworksInSelectedNetworkGroup.Select(y => y.NetworkId).Contains(x.NetworkId)));
            }
            
            return PartialView("_NetworkGroup", viewModel);
        }

        [SessionExpireFilter]
        [HttpPost]
        public IActionResult AddNewNetworkGroup(int Year, string Country, int[] Networks)
        {
            string errorMsg;
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (_expansionRepository.AddNewNetworkGroup(Year, Country, Networks, out errorMsg, LoggedOnUser.UserId))
                return Ok();
            else
            {
                if (errorMsg != string.Empty)
                    return BadRequest(errorMsg);
                else
                    return BadRequest("Error adding new Network Group.");
            }
        }
    }
}
