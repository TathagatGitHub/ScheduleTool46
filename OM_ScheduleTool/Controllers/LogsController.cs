using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using OM_ScheduleTool.ViewModels;
using System;
using System.Linq;
using System.Collections.Generic;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Threading;
using System.Threading.Tasks;
using System.Web;

namespace OM_ScheduleTool.Controllers
{
    public class LogsController : Controller
    {
        private IUserRepository _userRepository;
        private IPreLogRepository _prelogRepository;
        private IPostLogRepository _postlogRepository;
        private IGeneralRepository _generalRepository;

        public LogsController(IUserRepository userRepository,
            IPreLogRepository prelogRepository,
            IPostLogRepository postlogRepository,
            IGeneralRepository generalRepository)
        {
            _userRepository = userRepository;
            _prelogRepository = prelogRepository;
            _postlogRepository = postlogRepository;
            _generalRepository = generalRepository;
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        //[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ViewPreLog(int prelogid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var header = _prelogRepository.GetPreLogHeader(prelogid, LoggedOnUser.UserId);

            PreLogViewModel viewModel = new PreLogViewModel();
            viewModel.ViewOnly = true;
            viewModel.PreLog = header.PreLog;
            viewModel.ClientName = header.ClientName;
            viewModel.ScheduleName = header.ScheduleName;
            viewModel.EditPrelog = false;

            //Retrieve PreLogLines only to set up filters for the datatable.
            var PreLogLines = _prelogRepository.GetPreLogLines(prelogid, LoggedOnUser.UserId);
            viewModel.NetworksAvailable = PreLogLines.Where(x => x.NetId != null).Select(x => new KeyValuePair<int, string>(x.NetId ?? 0, x.StdNetName)).Distinct().OrderBy(x => x.Value);
            viewModel.PropertiesAvailable = PreLogLines.Select(x => x.PropertyName.Trim()).Distinct().OrderBy(x => x).ToArray();
            viewModel.StartTimesAvailable = PreLogLines.Where(x => x.StartTime != null).Select(x => x.StartTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.EndTimesAvailable = PreLogLines.Where(x => x.EndTime != null).Select(x => x.EndTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.DPsAvailable = PreLogLines.Where(x => x.DayPartCd != null).Select(x => x.DayPartCd).Distinct().OrderBy(x => x).ToArray();
            viewModel.OMDPsAvailable = PreLogLines.Where(x => x.OMDP != null).Select(x => x.OMDP).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotLensAvailable = PreLogLines.Where(x => x.SpotLen != null).Select(x => x.SpotLen).Distinct().OrderBy(x => x).ToArray();
            viewModel.BuyTypesAvailable = PreLogLines.Where(x => x.BuyType != null).Select(x => x.BuyType).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpBuysAvailable = PreLogLines.Select(x => x.SpBuy).Distinct().OrderBy(x => x).ToArray();
            viewModel.FullRatesAvailable = PreLogLines.Where(x => x.FullRate != null).Select(x => x.FullRate).Distinct().OrderBy(x => x).ToArray();
            viewModel.RatesAvailable = PreLogLines.Where(x => x.Rate != null).Select(x => x.Rate).Distinct().OrderBy(x => x).ToArray();
            viewModel.ImpressionsAvailable = PreLogLines.Where(x => x.Imp != null).Select(x => x.Imp).Distinct().OrderBy(x => x).ToArray();
            viewModel.CPMAvailable = PreLogLines.Where(x => x.CPM != null).Select(x => x.CPM).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotDatesAvailable = PreLogLines.Select(x => x.SpotDate).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotTimesAvailable = PreLogLines.Select(x => x.SpotTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.MediaTypeAvailable = PreLogLines.Where(x => x.MediaTypeCode != null).Select(x => x.MediaTypeCode).Distinct().OrderBy(x => x).ToArray();
            viewModel.ISCIAvailable = PreLogLines.Where(x => x.ISCI != null).Select(x => x.ISCI).Distinct().OrderBy(x => x).ToArray();
            viewModel.ProgramAvailable = PreLogLines.Where(x => x.ProgramTitle != null).Select(x => x.ProgramTitle).Distinct().OrderBy(x => x).ToArray();
            viewModel.ClearedAvailable = PreLogLines.Where(x => x.Cleared != null).Select(x => x.Cleared).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotOMDPsAvailable = PreLogLines.Where(x => x.OmdpSpotDateTime != null).Select(x => x.OmdpSpotDateTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.CommRateAvailable = PreLogLines.Where(x => x.CommRate != null).Select(x => x.CommRate ?? 0).Distinct().OrderBy(x => x).ToArray();
            viewModel.USDGrossRateAvailable = PreLogLines.Where(x => x.USDGrossRate != null).Select(x => x.USDGrossRate).Distinct().OrderBy(x => x).ToArray();
            viewModel.CAConvRateAvailable = PreLogLines.Where(x => x.CAConvRate != null).Select(x => x.CAConvRate).Distinct().OrderBy(x => x).ToArray();
            return View(viewModel);
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        //[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult ViewPostLog(int postlogid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var header = _postlogRepository.GetPostLogHeader(postlogid, LoggedOnUser.UserId);

            PostLogViewModel viewModel = new PostLogViewModel();
            viewModel.ViewOnly = true;
            viewModel.PostLog = header.PostLog;

            return View(viewModel);
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        //[ResponseCache(Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult EditPostLog(int postlogid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var header = _postlogRepository.GetPostLogHeader(postlogid, LoggedOnUser.UserId);

            PostLogViewModel viewModel = new PostLogViewModel();
            viewModel.ViewOnly = false;
            viewModel.PostLog = header.PostLog;

            return View(viewModel);
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public IActionResult ValidateTime(string time)
        {
            ErrorMessage err = _generalRepository.ValidateTime(time);

            return Json(new
            {
                success = err.Success,
                responseCode = err.ResponseCode,
                responseText = err.ResponseText
            });
        }

        [HttpGet]
        [SessionExpireChildFilter]
        public IActionResult ValidateSpotDate(string weekStartDate, string spotDate)
        {
            ErrorMessage err = _generalRepository.ValidateSpotDate(weekStartDate, spotDate);

            return Json(new
            {
                success = err.Success,
                responseCode = err.ResponseCode,
                responseText = err.ResponseText
            });
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult EditPostLogNetworkUserAction(int postLogId, int schedId, int weekNbr, int logsSelectedCountryId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var isActualized = _postlogRepository.IsActualized(schedId, weekNbr, loggedOnUser.UserId);

            if (isActualized)
            {
                return RedirectToAction("EditPostLog", new { postlogid = postLogId, selectedCountry = logsSelectedCountryId });
            }
            else
            {
                _postlogRepository.UpdatePostlogFromScheduleAndNetwork(postLogId, schedId, weekNbr, loggedOnUser.UserId);
                var result = _postlogRepository.GetNetworkLogByPostLogSummary(postLogId, loggedOnUser.UserId);
                if (result != null && result.Count > 0)
                {
                    PostLogViewModel vm = new PostLogViewModel();
                    vm.ViewOnly = false;
                    vm.PostlogId = postLogId;
                    vm.PostLogNetworkSummaryList = result;

                    return View(vm);
                }
                else
                {
                    return RedirectToAction("EditPostLog", new { postlogid = postLogId, selectedCountry = logsSelectedCountryId });
                }
            }
        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult EditPreLogNetworkUserAction(int preLogId, int schedId, int weekNbr, int logsSelectedCountryId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var result = _prelogRepository.GetNetworkLogByPreLogSummary(preLogId, loggedOnUser.UserId);
            if (result != null && result.Count > 0)
            {
                PreLogViewModel vm = new PreLogViewModel();
                vm.ViewOnly = false;
                vm.PrelogId = preLogId;
                vm.PreLogNetworkSummaryList = result;

                return View(vm);
            }
            else
            {
                return RedirectToAction("EditPreLog", new { prelogid = preLogId, logsSelectedCountryId = logsSelectedCountryId });
            }

        }

        [SessionExpireChildFilter]
        [LogonLayout("_LayoutFullNoMenuv2")]
        public IActionResult EditPreLog(int prelogid, int logsSelectedCountryId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var header = _prelogRepository.GetPreLogHeader(prelogid, LoggedOnUser.UserId);

            PreLogViewModel viewModel = new PreLogViewModel();
            viewModel.ViewOnly = false;
            viewModel.PrelogId = prelogid;
            viewModel.PreLog = header.PreLog;
            viewModel.ClientName = header.ClientName;
            viewModel.ScheduleName = header.ScheduleName;
            viewModel.EditPrelog = true;
            viewModel.CountryId = logsSelectedCountryId;
            //Retrieve PreLogLines only to set up filters for the datatable.
            var PreLogLines = _prelogRepository.GetPreLogLines(prelogid, LoggedOnUser.UserId);
            viewModel.NetworksAvailable = PreLogLines.Where(x => x.NetId != null).Select(x => new KeyValuePair<int, string>(x.NetId ?? 0, x.StdNetName)).Distinct().OrderBy(x => x.Value);
            viewModel.PropertiesAvailable = PreLogLines.Select(x => x.PropertyName.Trim()).Distinct().OrderBy(x => x).ToArray();
            viewModel.StartTimesAvailable = PreLogLines.Where(x => x.StartTime != null).Select(x => x.StartTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.EndTimesAvailable = PreLogLines.Where(x => x.EndTime != null).Select(x => x.EndTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.DPsAvailable = PreLogLines.Where(x => x.DayPartCd != null).Select(x => x.DayPartCd).Distinct().OrderBy(x => x).ToArray();
            viewModel.OMDPsAvailable = PreLogLines.Where(x => x.OMDP != null).Select(x => x.OMDP).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotLensAvailable = PreLogLines.Where(x => x.SpotLen != null).Select(x => x.SpotLen).Distinct().OrderBy(x => x).ToArray();
            viewModel.BuyTypesAvailable = PreLogLines.Where(x => x.BuyType != null).Select(x => x.BuyType).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpBuysAvailable = PreLogLines.Select(x => x.SpBuy).Distinct().OrderBy(x => x).ToArray();
            viewModel.FullRatesAvailable = PreLogLines.Where(x => x.FullRate != null).Select(x => x.FullRate).Distinct().OrderBy(x => x).ToArray();
            viewModel.RatesAvailable = PreLogLines.Where(x => x.Rate != null).Select(x => x.Rate).Distinct().OrderBy(x => x).ToArray();
            viewModel.ImpressionsAvailable = PreLogLines.Where(x => x.Imp != null).Select(x => x.Imp).Distinct().OrderBy(x => x).ToArray();
            viewModel.CPMAvailable = PreLogLines.Where(x => x.CPM != null).Select(x => x.CPM).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotDatesAvailable = PreLogLines.Select(x => x.SpotDate).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotTimesAvailable = PreLogLines.Select(x => x.SpotTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.MediaTypeAvailable = PreLogLines.Where(x => x.MediaTypeCode != null).Select(x => x.MediaTypeCode).Distinct().OrderBy(x => x).ToArray();
            viewModel.ISCIAvailable = PreLogLines.Where(x => x.ISCI != null).Select(x => x.ISCI).Distinct().OrderBy(x => x).ToArray();
            viewModel.ProgramAvailable = PreLogLines.Where(x => x.ProgramTitle != null).Select(x => x.ProgramTitle).Distinct().OrderBy(x => x).ToArray();
            viewModel.ClearedAvailable = PreLogLines.Where(x => x.Cleared != null).Select(x => x.Cleared).Distinct().OrderBy(x => x).ToArray();
            viewModel.SpotOMDPsAvailable = PreLogLines.Where(x => x.OmdpSpotDateTime != null).Select(x => x.OmdpSpotDateTime).Distinct().OrderBy(x => x).ToArray();
            viewModel.CommRateAvailable = PreLogLines.Where(x => x.CommRate != null).Select(x => x.CommRate ?? 0).Distinct().OrderBy(x => x).ToArray();
            viewModel.USDGrossRateAvailable = PreLogLines.Where(x => x.USDGrossRate != null).Select(x => x.USDGrossRate).Distinct().OrderBy(x => x).ToArray();
            viewModel.CAConvRateAvailable = PreLogLines.Where(x => x.CAConvRate != null).Select(x => x.CAConvRate).Distinct().OrderBy(x => x).ToArray();
            return View(viewModel);
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PrelogNetworkUserAction(List<NetworkLogUserAction> model)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            foreach (var item in model)
            {
                if (item.Action.ToLower() == "replace")
                {
                    _prelogRepository.ReplacePreLogLineTableFromNetworkLogs(item.LogId, item.NetworkId, item.LogFile, loggedOnUser.UserId);
                    _prelogRepository.UpdatePreLogChangeDateUser(item.LogId, loggedOnUser.UserId);
                }
                else if (item.Action.ToLower() == "add")
                {
                    _prelogRepository.AppendPreLogLineTableFromNetworkLogs(item.LogId, item.NetworkId, item.LogFile, loggedOnUser.UserId);
                    _prelogRepository.UpdatePreLogChangeDateUser(item.LogId, loggedOnUser.UserId);
                }
            }

            return Json(true);
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PostlogNetworkUserAction(List<NetworkLogUserAction> model)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            foreach (var item in model)
            {
                if (item.Action.ToLower() == "replace")
                {
                    _postlogRepository.ReplacePostLogLineTableFromNetworkLogs(item.LogId, item.NetworkId, item.LogFile, loggedOnUser.UserId);
                    _postlogRepository.UpdatePostLogChangeDateUser(item.LogId, loggedOnUser.UserId);
                }
                else if (item.Action.ToLower() == "add")
                {
                    _postlogRepository.AppendPostLogLineTableFromNetworkLogs(item.LogId, item.NetworkId, item.LogFile, loggedOnUser.UserId);
                    _postlogRepository.UpdatePostLogChangeDateUser(item.LogId, loggedOnUser.UserId);
                }
            }

            return Json(true);
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PostlogCheckLock(int postLogId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var lockInfo = _postlogRepository.PostlogCheckLock(postLogId, loggedOnUser.UserId);
            return Json(lockInfo);
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult LockPreLog(int preLogId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var lockInfo = _prelogRepository.LockPreLog(preLogId, loggedOnUser.UserId);
            return Json(lockInfo);
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult UnLockPreLog(int preLogId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (preLogId == 0)
            {
                Uri uri = new Uri(Request.GetTypedHeaders().Referer.ToString());
                preLogId = Convert.ToInt32(HttpUtility.ParseQueryString(uri.Query).Get("prelogid"));
            }
            var result = _prelogRepository.UnLockPreLog(preLogId, loggedOnUser.UserId);
            return Json(result);
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetNetworks(int logsSelectedCountryId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<Network> lsNetworks = _generalRepository.GetAllNetworks().Where(x => x.CountryId == logsSelectedCountryId);

                return Json(new
                {
                    success = true,
                    data = lsNetworks
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetDayParts()
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<DayPart> lsDayPart = _generalRepository.GetAllDayParts(LoggedOnUser.UserId);

                return Json(new
                {
                    success = true,
                    data = lsDayPart
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetBuyTypes()
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<BuyType> lsBuyTypes = _generalRepository.GetBuyTypes();

                return Json(new
                {
                    success = true,
                    data = lsBuyTypes
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public ActionResult GetMediaTypes()
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                IEnumerable<MediaType> lsMediaTypes = _generalRepository.GetMediaTypes();

                return Json(new
                {
                    success = true,
                    data = lsMediaTypes
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    errormsg = exc.Message
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult GetPreLogLines(int prelogid, bool EditPreLog)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var PreLogLines = _prelogRepository.GetPreLogLines(prelogid, LoggedOnUser.UserId, EditPreLog);
            var totalCount = PreLogLines.Count;
            //var length = int.Parse(Request.Form["length"]);
            //var start = int.Parse(Request.Form["start"]);            
            int index = 0;
            if (EditPreLog)
            {
                index = 1;
            }
            string search = "";
            //search = Request.Form["columns["+ index + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.StdNetName)).ToList();
                }
            }
            //search = Request.Form["columns["+(index + 1)+"][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.PropertyName)).ToList();
                }
            }
            //search = Request.Form["columns["+(index + 9)+"][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.StartTime)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 10) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.EndTime)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 11) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.DayPartCd)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 12) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.OMDP)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 13) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    int[] convertedItems = Array.ConvertAll(items, s => int.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.SpotLen ?? 0)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 14) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.BuyType)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 15) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',');
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.SpBuy)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 16) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    decimal[] convertedItems = Array.ConvertAll(items, s => decimal.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.FullRate ?? 0)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 17) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    decimal[] convertedItems = Array.ConvertAll(items, s => decimal.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.Rate ?? 0)).ToList();
                }
            }

            //search = Request.Form["columns[" + (index + 18) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    decimal[] convertedItems = Array.ConvertAll(items, s => decimal.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.USDGrossRate ?? 0)).ToList();
                }
            }

            //search = Request.Form["columns[" + (index + 19) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    decimal[] convertedItems = Array.ConvertAll(items, s => decimal.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.Imp ?? 0)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 20) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    decimal[] convertedItems = Array.ConvertAll(items, s => decimal.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.CPM ?? 0)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 21) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    DateTime?[] convertedItems = new DateTime?[items.Length];
                    for (int i = 0; i < items.Length; i++)
                        convertedItems[i] = items[i].Length == 0 ? (DateTime?)null : Convert.ToDateTime(items[i]);
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.SpotDate)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 22) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.SpotTime)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 23) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.MediaTypeCode)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 24) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.ISCI)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 25) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.ProgramTitle)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 26) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.Cleared)).ToList();
                }
            }
            //search = Request.Form["columns[" + (index + 27) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    PreLogLines = PreLogLines.Where(x => items.Contains(x.OmdpSpotDateTime)).ToList();
                }
            }



            //search = Request.Form["columns[" + (index + 28) + "][search][value]"];
            if (search.Length > 0)
            {
                if (search == "Select All Unchecked")
                    PreLogLines.Clear();
                else
                {
                    string[] items = search.Split(',').Where(x => x != "Select All").ToArray();
                    decimal[] convertedItems = Array.ConvertAll(items, s => decimal.Parse(s));
                    PreLogLines = PreLogLines.Where(x => convertedItems.Contains(x.CommRate ?? 0)).ToList();
                }
            }

            /***Code for paging option ****/
            //var result = PreLogLines.Skip(length * (start / length)).Take(length).ToList();
            //return Json(new
            //{
            //    success = true,
            //    recordsTotal = totalCount,
            //    recordsFiltered = PreLogLines.Count,
            //    data = result,
            //    responseText = "",
            //    responseCode = 0
            //});

            return Json(new
            {
                success = true,
                recordsTotal = PreLogLines.Count,
                recordsFiltered = PreLogLines.Count,
                data = PreLogLines,
                responseText = "",
                responseCode = 0
            });
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult GetPostLogLines(int postlogid, bool Lock)
        {

            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

            //var lines = _postlogRepository.GetPostLogLinesNew(postlogid, LoggedOnUser.UserId);
            //return Json(new
            //{
            //    success = true,
            //    recordsTotal = lines.Count,
            //    recordsFiltered = lines.Count,
            //    data = lines,
            //    responseText = "",
            //    responseCode = 0
            //});

            IList<POSTLOG_LINE_T> PostLogLines = _postlogRepository.GetPostLogLinesFromSP(postlogid, LoggedOnUser.UserId, Lock, null);
            return Json(new
            {
                success = true,
                recordsTotal = PostLogLines.Count,
                recordsFiltered = PostLogLines.Count,
                data = PostLogLines,
                responseText = "",
                responseCode = 0
            });




        }


        [HttpPost]
        [SessionExpireChildFilter]
        public IActionResult AddPostLogLine(int postLogId, string weekStartDate)
        {
            try
            {
                int propertyLineCount = Convert.ToInt32(Request.Form["data[0][propertyLineCount]"]);
                string networkId = Request.Form["data[0][network][networkId]"].ToString();
                string propertyName = Request.Form["data[0][property][propertyName]"].ToString();
                string monday = Request.Form["data[0][property][monday]"].ToString();
                string tuesday = Request.Form["data[0][property][tuesday]"].ToString();
                string wednesday = Request.Form["data[0][property][wednesday]"].ToString();
                string thursday = Request.Form["data[0][property][thursday]"].ToString();
                string friday = Request.Form["data[0][property][friday]"].ToString();
                string saturday = Request.Form["data[0][property][saturday]"].ToString();
                string sunday = Request.Form["data[0][property][sunday]"].ToString();
                //string startTime = Request.Form["data[0][property][startTime]"].ToString();
                string startTime = Request.Form["data[0][startTime]"].ToString();
                //string endTime = Request.Form["data[0][property][endTime]"].ToString();
                string endTime = Request.Form["data[0][endTime]"].ToString();
                //string dayPartId = Request.Form["data[0][dayPart][dayPartId]"].ToString();
                string dayPartId = Request.Form["data[0][dayPartId]"].ToString();
                //string spotLength = Request.Form["data[0][rate][spotLen]"].ToString();
                string spotLength = Request.Form["data[0][spotLen]"].ToString();
                //string buyTypeId = Request.Form["data[0][buyType][buyTypeId]"].ToString();
                string buyTypeId = Request.Form["data[0][buyTypeId]"].ToString();
                //string rateAmt = Request.Form["data[0][rate][rateAmt]"].ToString();
                string rateAmt = Request.Form["data[0][rateAmount]"].ToString();
                //string imp = Request.Form["data[0][rate][impressions]"].ToString();
                string imp = Request.Form["data[0][imp]"].ToString();
                string spotDate = Request.Form["data[0][spotDate]"].ToString();
                string spotTime = Request.Form["data[0][spotTime]"].ToString();
                string mediaTypeId = Request.Form["data[0][mediaType][mediaTypeId]"].ToString();
                string programTitle = Request.Form["data[0][programTitle]"].ToString();
                string isci = Request.Form["data[0][isci]"].ToString();
                string sigmaProgram = Request.Form["data[0][sigmaProgramName]"].ToString();
                string spBuy = Request.Form["data[0][sp_Buy]"].ToString();

                if (buyTypeId != "")
                {
                    var buyType = _generalRepository.GetBuyTypes().Where(x => x.BuyTypeId == int.Parse(buyTypeId)).SingleOrDefault();
                    if ((buyType.IsZeroImp && decimal.Parse(imp == "" ? "0" : imp) != 0) || (buyType.IsZeroRate && decimal.Parse(rateAmt == "" ? "0" : rateAmt) != 0))
                    {
                        return Json(new
                        {
                            success = false,
                            responseText = "Buytype selected does not allow rate and/or impression combination. Please select different buytype or edit rate/impression."
                        });
                    }
                }


                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _postlogRepository.AddPostLogLine(
                    propertyLineCount,
                    int.Parse(networkId)
                    , propertyName
                    , (monday == "1" ? true : false)
                    , (tuesday == "1" ? true : false)
                    , (wednesday == "1" ? true : false)
                    , (thursday == "1" ? true : false)
                    , (friday == "1" ? true : false)
                    , (saturday == "1" ? true : false)
                    , (sunday == "1" ? true : false)
                    , startTime, endTime
                    , (dayPartId == "" ? 0 : int.Parse(dayPartId))
                    , (spotLength == "" ? 30 : int.Parse(spotLength))
                    , (buyTypeId == "" ? -1 : int.Parse(buyTypeId))
                    , (rateAmt == "" ? 0 : decimal.Parse(rateAmt))
                    , (imp == "" ? 0 : decimal.Parse(imp))
                    , spotDate, spotTime
                    , (mediaTypeId == "" ? 0 : int.Parse(mediaTypeId))
                    , isci, sigmaProgram
                    , programTitle, LoggedOnUser.UserId, postLogId
                    , (spBuy == "SP" ? "SP" : ""));

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = 0
                });
            }


        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult EditPostLogLines(int postLogLineId, int postLogId, string postLogLineIds)
        {
            try
            {
                string isci = Request.Form["data[" + postLogLineId.ToString() + "][isci]"];
                string spotTime = Request.Form["data[" + postLogLineId.ToString() + "][spotTime]"];
                string spotDate = Request.Form["data[" + postLogLineId.ToString() + "][spotDate]"];
                string programTitle = Request.Form["data[" + postLogLineId.ToString() + "][programTitle]"];
                // string postLogId = Request.Form["data[" + postLogLineId.ToString() + "][postLog][postLogId]"];
                string clearedPlaced = Request.Form["data[" + postLogLineId.ToString() + "][clearedPlaced]"];

                // Editing a NEW line would have the following values
                string networkId = Request.Form["data[" + postLogLineId.ToString() + "][network][networkId]"].ToString();
                string propertyName = Request.Form["data[" + postLogLineId.ToString() + "][property][propertyName]"].ToString();
                string monday = Request.Form["data[" + postLogLineId.ToString() + "][property][monday]"].ToString();
                string tuesday = Request.Form["data[" + postLogLineId.ToString() + "][property][tuesday]"].ToString();
                string wednesday = Request.Form["data[" + postLogLineId.ToString() + "][property][wednesday]"].ToString();
                string thursday = Request.Form["data[" + postLogLineId.ToString() + "][property][thursday]"].ToString();
                string friday = Request.Form["data[" + postLogLineId.ToString() + "][property][friday]"].ToString();
                string saturday = Request.Form["data[" + postLogLineId.ToString() + "][property][saturday]"].ToString();
                string sunday = Request.Form["data[" + postLogLineId.ToString() + "][property][sunday]"].ToString();
                //string startTime = Request.Form["data[" + postLogLineId.ToString() + "][property][startTime]"].ToString();
                string startTime = Request.Form["data[" + postLogLineId.ToString() + "][startTime]"].ToString();
                //string endTime = Request.Form["data[" + postLogLineId.ToString() + "][property][endTime]"].ToString();
                string endTime = Request.Form["data[" + postLogLineId.ToString() + "][endTime]"].ToString();
                //string dayPartId = Request.Form["data[" + postLogLineId.ToString() + "][dayPart][dayPartId]"].ToString();
                string dayPartId = Request.Form["data[" + postLogLineId.ToString() + "][dayPartId]"].ToString();
                //string spotLength = Request.Form["data[" + postLogLineId.ToString() + "][rate][spotLen]"].ToString();
                string spotLength = Request.Form["data[" + postLogLineId.ToString() + "][spotLen]"].ToString();
                //string buyTypeId = Request.Form["data[" + postLogLineId.ToString() + "][buyType][buyTypeId]"].ToString();
                string buyTypeId = Request.Form["data[" + postLogLineId.ToString() + "][buyTypeId]"].ToString();
                //string buyTypeId = Request.Form["data[" + postLogLineId.ToString() + "][buyTypeId]"].ToString();
                //string rateAmt = Request.Form["data[" + postLogLineId.ToString() + "][rate][rateAmt]"].ToString();
                string rateAmt = Request.Form["data[" + postLogLineId.ToString() + "][rateAmount]"].ToString();
                //string impressions = Request.Form["data[" + postLogLineId.ToString() + "][rate][impressions]"].ToString();
                string impressions = Request.Form["data[" + postLogLineId.ToString() + "][imp]"].ToString();
                string mediaTypeId = Request.Form["data[" + postLogLineId.ToString() + "][mediaType][mediaTypeId]"].ToString();
                string sigmaProgram = Request.Form["data[" + postLogLineId.ToString() + "][sigmaProgramName]"];
                string scheduleId = Request.Form["data[" + postLogLineId.ToString() + "][scheduleId]"];
                string spBuy = Request.Form["data[" + postLogLineId.ToString() + "][sp_Buy]"];

                if (buyTypeId != "")
                {
                    var buyType = _generalRepository.GetBuyTypes().Where(x => x.BuyTypeId == int.Parse(buyTypeId)).SingleOrDefault();
                    if ((buyType.IsZeroImp && decimal.Parse(impressions == "" ? "0" : impressions) != 0) || (buyType.IsZeroRate && decimal.Parse(rateAmt == "" ? "0" : rateAmt) != 0))
                    {
                        return Json(new
                        {
                            success = false,
                            responseText = "Buytype selected does not allow rate and/or impression combination. Please select different buytype or edit rate/impression."
                        });
                    }
                }


                if (scheduleId == null)
                {
                    scheduleId = "-1";
                }


                if (monday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][monday]") == true)
                {
                    monday = "0";
                }

                if (tuesday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][tuesday]") == true)
                {
                    tuesday = "0";
                }

                if (wednesday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][wednesday]") == true)
                {
                    wednesday = "0";
                }

                if (thursday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][thursday]") == true)
                {
                    thursday = "0";
                }

                if (friday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][friday]") == true)
                {
                    friday = "0";
                }

                if (saturday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][saturday]") == true)
                {
                    saturday = "0";
                }

                if (sunday == "" && Request.Form.Keys.Contains("data[" + postLogLineId.ToString() + "][property][sunday]") == true)
                {
                    sunday = "0";
                }

                if (spotLength == "")
                {
                    spotLength = "-1";
                }

                if (buyTypeId == "")
                {
                    buyTypeId = "-1";
                }

                if (rateAmt == "")
                {
                    rateAmt = "-1";
                }

                if (impressions == "")
                {
                    impressions = "-1";
                }

                if (mediaTypeId == "")
                {
                    mediaTypeId = "-1";
                }

                if (!string.IsNullOrEmpty(spotTime))
                {
                    ErrorMessage errSpotTime = _generalRepository.ValidateTime(spotTime);
                    if (errSpotTime.Success == true)
                    {
                        spotTime = errSpotTime.ResponseText;
                    }
                }

                //if (scheduleId != "-1" && spotDate != null && spotDate.Trim() != "")
                //{
                //    DateTime spotDateValue = DateTime.Parse(spotDate);
                //    int spotDayOfWeek = (int )spotDateValue.DayOfWeek;
                //    spotDate = spotDayOfWeek.ToString();
                //}


                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                int[] arrayPostLogLineIds = postLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage err = _postlogRepository.EditPostLogLine(arrayPostLogLineIds
                    , (networkId == "" ? 0 : int.Parse(networkId))
                    , propertyName
                    , (monday == "1" ? 1 : (monday == "0" ? 0 : -1))
                    , (tuesday == "1" ? 1 : (tuesday == "0" ? 0 : -1))
                    , (wednesday == "1" ? 1 : (wednesday == "0" ? 0 : -1))
                    , (thursday == "1" ? 1 : (thursday == "0" ? 0 : -1))
                    , (friday == "1" ? 1 : (friday == "0" ? 0 : -1))
                    , (saturday == "1" ? 1 : (saturday == "0" ? 0 : -1))
                    , (sunday == "1" ? 1 : (sunday == "0" ? 0 : -1))
                    , startTime, endTime
                    , (dayPartId == "" ? 0 : int.Parse(dayPartId))
                    , int.Parse(spotLength)
                    , int.Parse(buyTypeId)
                    , decimal.Parse(rateAmt)
                    , decimal.Parse(impressions)
                    , spotDate, spotTime
                    , int.Parse(mediaTypeId)
                    , programTitle, isci, clearedPlaced, sigmaProgram, int.Parse(scheduleId), LoggedOnUser.UserId, (spBuy == "SP" ? spBuy : ""));

                IList<POSTLOG_LINE_T> pl = _postlogRepository
                    .GetPostLogLinesFromSP(postLogId, LoggedOnUser.UserId, true, postLogLineId)
                    .ToList();

                return Json(new
                {
                    success = err.Success,
                    recordsTotal = 1,
                    recordsFiltered = 1,
                    data = pl,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
                });

                //var lines = _postlogRepository.GetPostLogLinesNew(postLogId, LoggedOnUser.UserId);
                //return Json(new
                //{
                //    success = err.Success,
                //    recordsTotal = 1,
                //    recordsFiltered = 1,
                //    data = lines,
                //    responseText = err.ResponseText,
                //    responseCode = err.ResponseCode
                //});
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }
        }

        [HttpPost]
        [SessionExpireChildFilter]
        public IActionResult UnlockPostLog(int PostLogId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (PostLogId == 0)
            {                
                Uri uri = new Uri(Request.GetTypedHeaders().Referer.ToString());
                PostLogId = Convert.ToInt32(HttpUtility.ParseQueryString(uri.Query).Get("postlogid"));
            }
            ErrorMessage err = _postlogRepository.Unlock(PostLogId, LoggedOnUser.UserId);

            return Json(new
            {
                success = err.Success,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });
        }

        [SessionExpireFilter]
        [HttpPost]
        public IActionResult CreatePreLog(int SchedID, int WeekNbr, DateTime WeekDate)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (_prelogRepository.IsPreLogExists(LoggedOnUser.UserId, SchedID, WeekDate))
            {
                return BadRequest("PRE LOG already exists.");
            }
            if (_prelogRepository.CreatePreLog(SchedID, WeekNbr, WeekDate, LoggedOnUser.UserId))
            {
                return Ok();
            }
            else
                return BadRequest("Error creating PRE LOG.");
        }

        [SessionExpireFilter]
        [HttpPost]
        public IActionResult CreatePostLog(int SchedID, int WeekNbr, DateTime WeekDate)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            if (_postlogRepository.IsPostLogExists(LoggedOnUser.UserId, SchedID, WeekDate))
            {
                return BadRequest("POST LOG already exists.");
            }
            if (_postlogRepository.CreatePostLog(SchedID, WeekNbr, WeekDate, LoggedOnUser.UserId))
            {
                return Ok();
            }
            else
                return BadRequest("Error creating POST LOG.");
        }

        [SessionExpireChildFilter]
        public JsonResult GetNotes(int prelogid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            return Json(_prelogRepository.GetNotes(prelogid, LoggedOnUser.UserId));
        }

        //[HttpGet]
        //[SessionExpireChildFilter]
        //public FileContentResult Export(int prelogid, string preloglinesids)
        //{
        //    User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
        //    var PreLogLines = _prelogRepository.GetPreLogLines(prelogid, LoggedOnUser.UserId);

        //    int[] PreLogLinesIds;
        //    if (preloglinesids.Length > 0)
        //    {
        //        string[] ids = preloglinesids.Substring(1).Split(',');
        //        PreLogLinesIds = Array.ConvertAll(ids, int.Parse);
        //        PreLogLines = PreLogLines.Where(x => PreLogLinesIds.Contains(x.PreLogLineId)).ToList();
        //    }

        //    return GenerateExcel(prelogid, LoggedOnUser, PreLogLines);
        //}

        [HttpGet]
        [SessionExpireChildFilter]
        public FileContentResult PrelogExcelExport(int prelogid, int countryID)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var PreLogLines = _prelogRepository.GetPreLogLines(prelogid, LoggedOnUser.UserId);

            if (countryID == 2)
            {
                return GenerateCanadaPreLogExcel(prelogid, LoggedOnUser, PreLogLines);
            }
            else
            {
                return GenerateUSPreLogExcel(prelogid, LoggedOnUser, PreLogLines);
            }
        }


        [HttpGet]
        [SessionExpireChildFilter]
        private FileContentResult GenerateUSPreLogExcel(int prelogid, User LoggedOnUser, IList<PreLogLine> PreLogLines)
        {
            var header = _prelogRepository.GetPreLogHeader(prelogid, LoggedOnUser.UserId);

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(header.ClientName);
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 5;
                workSheet.Cells["A2:A3"].Merge = true;
                workSheet.Cells["A2"].Value = "PRE LOG";
                workSheet.Cells["A2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["A2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                workSheet.Cells["A2:A3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["A2:P2"].Style.Font.Bold = true;
                workSheet.Cells["A3:P3"].Style.Font.Bold = true;
                workSheet.Cells["A2"].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                workSheet.Cells["B2"].Value = "Client:";
                workSheet.Cells["B3"].Value = header.ClientName;
                workSheet.Cells["B2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C2:I2"].Merge = true;
                workSheet.Cells["C3:I3"].Merge = true;
                workSheet.Cells["C2"].Value = "Week:";
                workSheet.Cells["C3"].Value = header.PreLog.WeekDate;
                workSheet.Cells["C3"].Style.Numberformat.Format = "mm/dd/yyyy";
                workSheet.Cells["C2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C2:I2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C3:I3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K2"].Value = "Last Updated On:";
                workSheet.Cells["K3"].Value = "Last Updated By:";
                workSheet.Cells["L2:P2"].Merge = true;
                workSheet.Cells["L3:P3"].Merge = true;
                workSheet.Cells["L2"].Value = header.PreLog.UpdDte;
                workSheet.Cells["L2"].Style.Numberformat.Format = "mm/dd/yyyy hh:mm:ss AM/PM";
                workSheet.Cells["L3"].Value = header.PreLog.UpdUsr;
                workSheet.Cells["K2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L2:P2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L3:P3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);

                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Network";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Property";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "M";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "T";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "W";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Th";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "F";
                workSheet.Cells["H" + DataRowStart.ToString()].Value = "Sa";
                workSheet.Cells["I" + DataRowStart.ToString()].Value = "Su";
                workSheet.Cells["J" + DataRowStart.ToString()].Value = "Start Time";
                workSheet.Cells["K" + DataRowStart.ToString()].Value = "End Time";
                workSheet.Cells["L" + DataRowStart.ToString()].Value = "DayPart";
                workSheet.Cells["M" + DataRowStart.ToString()].Value = "OMPD";
                workSheet.Cells["N" + DataRowStart.ToString()].Value = "Len";
                workSheet.Cells["O" + DataRowStart.ToString()].Value = "Buy Type";
                workSheet.Cells["P" + DataRowStart.ToString()].Value = "SP Buy";
                workSheet.Cells["Q" + DataRowStart.ToString()].Value = "Full Rate";
                workSheet.Cells["R" + DataRowStart.ToString()].Value = "Rate";
                workSheet.Cells["S" + DataRowStart.ToString()].Value = "Imp";
                workSheet.Cells["T" + DataRowStart.ToString()].Value = "CPM";
                workSheet.Cells["U" + DataRowStart.ToString()].Value = "Spot Date";
                workSheet.Cells["V" + DataRowStart.ToString()].Value = "Spot Time";
                workSheet.Cells["W" + DataRowStart.ToString()].Value = "Media Type";
                workSheet.Cells["X" + DataRowStart.ToString()].Value = "ISCI";
                workSheet.Cells["Y" + DataRowStart.ToString()].Value = "Program";
                workSheet.Cells["Z" + DataRowStart.ToString()].Value = "Cleared";
                workSheet.Cells["AA" + DataRowStart.ToString()].Value = "Daypart";
                workSheet.Cells["AB" + DataRowStart.ToString()].Value = "Comm. Rate";
                // format header - bold, yellow on black  
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                {
                    r.Style.Font.Bold = true;
                    r.Style.WrapText = true;
                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#93cddd"));
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }
                //Background color of RateID column header
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));

                for (int i = 0; i < PreLogLines.Count(); i++)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = PreLogLines[i].StdNetName;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = PreLogLines[i].PropertyName;
                    if (PreLogLines[i].Mon)
                        workSheet.Cells["C" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Tue)
                        workSheet.Cells["D" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Wed)
                        workSheet.Cells["E" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Thu)
                        workSheet.Cells["F" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Fri)
                        workSheet.Cells["G" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Sat)
                        workSheet.Cells["H" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Sun)
                        workSheet.Cells["I" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].StartTime.Length > 0)
                        workSheet.Cells["J" + DataRowStart.ToString()].Value = PreLogLines[i].StartTime.Substring(0, 1) == "0" ? PreLogLines[i].StartTime.Substring(1) : PreLogLines[i].StartTime;
                    if (PreLogLines[i].EndTime.Length > 0)
                        workSheet.Cells["K" + DataRowStart.ToString()].Value = PreLogLines[i].EndTime.Substring(0, 1) == "0" ? PreLogLines[i].EndTime.Substring(1) : PreLogLines[i].EndTime;
                    workSheet.Cells["L" + DataRowStart.ToString()].Value = PreLogLines[i].DayPartCd;
                    workSheet.Cells["M" + DataRowStart.ToString()].Value = PreLogLines[i].OMDP;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = PreLogLines[i].SpotLen;
                    if (PreLogLines[i].SpotLen == 15)
                    {
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#FFFF00"));
                    }
                    workSheet.Cells["O" + DataRowStart.ToString()].Value = PreLogLines[i].BuyType;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Value = PreLogLines[i].RateId;
                    workSheet.Cells["P" + DataRowStart.ToString()].Value = PreLogLines[i].SpBuy;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));
                    workSheet.Cells["Q" + DataRowStart.ToString()].Value = PreLogLines[i].FullRate;
                    workSheet.Cells["R" + DataRowStart.ToString()].Value = PreLogLines[i].Rate;
                    workSheet.Cells["S" + DataRowStart.ToString()].Value = PreLogLines[i].Imp;
                    workSheet.Cells["T" + DataRowStart.ToString()].Value = PreLogLines[i].CPM;
                    workSheet.Cells["T" + DataRowStart.ToString()].Style.Numberformat.Format = "$#,##0.00";

                    workSheet.Cells["U" + DataRowStart.ToString()].Value = PreLogLines[i].SpotDate;
                    workSheet.Cells["U" + DataRowStart.ToString()].Style.Numberformat.Format = "mm/dd/yyyy";
                    if (PreLogLines[i].SpotTime.Length > 0)
                        workSheet.Cells["V" + DataRowStart.ToString()].Value = PreLogLines[i].SpotTime.Substring(0, 1) == "0" ? PreLogLines[i].SpotTime.Substring(1) : PreLogLines[i].SpotTime;
                    workSheet.Cells["W" + DataRowStart.ToString()].Value = PreLogLines[i].MediaTypeCode;
                    workSheet.Cells["X" + DataRowStart.ToString()].Value = PreLogLines[i].ISCI;
                    workSheet.Cells["Y" + DataRowStart.ToString()].Value = PreLogLines[i].ProgramTitle;
                    workSheet.Cells["Z" + DataRowStart.ToString()].Value = PreLogLines[i].Cleared;
                    workSheet.Cells["AA" + DataRowStart.ToString()].Value = PreLogLines[i].OmdpSpotDateTime;
                    workSheet.Cells["AB" + DataRowStart.ToString()].Value = PreLogLines[i].CommRate;
                    workSheet.Cells["AB" + DataRowStart.ToString()].Style.Numberformat.Format = "#0\\.00%";

                    if (PreLogLines[i].IsDOWChanged)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 3, DataRowStart, 9])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                    if (PreLogLines[i].IsTimeChanged)
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 10, DataRowStart, 11])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }

                    if (PreLogLines[i].Cleared == "UNPLACED")
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#66FF33"));
                        }
                    }
                    if (i > 0 && PreLogLines[i].StdNetName != PreLogLines[i - 1].StdNetName)
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#CCC0DA"));
                        }
                }

                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Start Time"
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"End Time"
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Sopt Time"
                workSheet.Column(workSheet.Cells["U" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "m/dd/yyyy";
                workSheet.Column(workSheet.Cells["Q" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["R" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["S" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["O" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["U" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["Z" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["AA" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(17).AutoFit();
                workSheet.Column(18).AutoFit();
                workSheet.Column(19).AutoFit();
                workSheet.Column(20).AutoFit();
                workSheet.Column(21).AutoFit();
                workSheet.Column(22).AutoFit();
                workSheet.Column(26).AutoFit();
                workSheet.Column(27).AutoFit();
                workSheet.Column(3).Width = 4;
                workSheet.Column(4).Width = 4;
                workSheet.Column(5).Width = 4;
                workSheet.Column(6).Width = 4;
                workSheet.Column(7).Width = 4;
                workSheet.Column(8).Width = 4;
                workSheet.Column(9).Width = 4;
                workSheet.Column(10).AutoFit();
                workSheet.Column(11).AutoFit();
                workSheet.Column(12).Width = 5;
                workSheet.Column(12).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(13).Width = 4;
                workSheet.Column(13).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(14).Width = 7;         //Len column
                workSheet.Column(14).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(21).AutoFit();         //Spot Date column
                workSheet.Column(22).AutoFit();
                workSheet.Column(24).AutoFit();
                workSheet.Column(25).AutoFit();

                result = package.GetAsByteArray();
            }
            return File(result, ExcelExportHelper.ExcelContentType, "Pre Log - Week of " + header.PreLog.WeekDate.Year + "-" + header.PreLog.WeekDate.Month + "-" + header.PreLog.WeekDate.Day + " - As of " + DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day +
                ".xlsx");

        }


        [HttpGet]
        [SessionExpireChildFilter]
        private FileContentResult GenerateCanadaPreLogExcel(int prelogid, User LoggedOnUser, IList<PreLogLine> PreLogLines)
        {
            var header = _prelogRepository.GetPreLogHeader(prelogid, LoggedOnUser.UserId);

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(header.ClientName);
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 5;
                workSheet.Cells["A2:A3"].Merge = true;
                workSheet.Cells["A2"].Value = "PRE LOG";
                workSheet.Cells["A2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["A2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                workSheet.Cells["A2:A3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["A2:P2"].Style.Font.Bold = true;
                workSheet.Cells["A3:P3"].Style.Font.Bold = true;
                workSheet.Cells["A2"].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                workSheet.Cells["B2"].Value = "Client:";
                workSheet.Cells["B3"].Value = header.ClientName;
                workSheet.Cells["B2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C2:I2"].Merge = true;
                workSheet.Cells["C3:I3"].Merge = true;
                workSheet.Cells["C2"].Value = "Week:";
                workSheet.Cells["C3"].Value = header.PreLog.WeekDate;
                workSheet.Cells["C3"].Style.Numberformat.Format = "mm/dd/yyyy";
                workSheet.Cells["C2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C2:I2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C3:I3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K2"].Value = "Last Updated On:";
                workSheet.Cells["K3"].Value = "Last Updated By:";
                workSheet.Cells["L2:P2"].Merge = true;
                workSheet.Cells["L3:P3"].Merge = true;
                workSheet.Cells["L2"].Value = header.PreLog.UpdDte;
                workSheet.Cells["L2"].Style.Numberformat.Format = "mm/dd/yyyy hh:mm:ss AM/PM";
                workSheet.Cells["L3"].Value = header.PreLog.UpdUsr;
                workSheet.Cells["K2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L2:P2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L3:P3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);

                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Network";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Property";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "M";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "T";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "W";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Th";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "F";
                workSheet.Cells["H" + DataRowStart.ToString()].Value = "Sa";
                workSheet.Cells["I" + DataRowStart.ToString()].Value = "Su";
                workSheet.Cells["J" + DataRowStart.ToString()].Value = "Start Time";
                workSheet.Cells["K" + DataRowStart.ToString()].Value = "End Time";
                workSheet.Cells["L" + DataRowStart.ToString()].Value = "DayPart";
                workSheet.Cells["M" + DataRowStart.ToString()].Value = "OMPD";
                workSheet.Cells["N" + DataRowStart.ToString()].Value = "Len";
                workSheet.Cells["O" + DataRowStart.ToString()].Value = "Buy Type";
                workSheet.Cells["P" + DataRowStart.ToString()].Value = "SP Buy";
                workSheet.Cells["Q" + DataRowStart.ToString()].Value = "Full Rate";
                workSheet.Cells["R" + DataRowStart.ToString()].Value = "Rate";
                workSheet.Cells["S" + DataRowStart.ToString()].Value = "USD Gross Rate";
                workSheet.Cells["T" + DataRowStart.ToString()].Value = "Imp";
                workSheet.Cells["U" + DataRowStart.ToString()].Value = "CPM";
                workSheet.Cells["V" + DataRowStart.ToString()].Value = "Spot Date";
                workSheet.Cells["W" + DataRowStart.ToString()].Value = "Spot Time";
                workSheet.Cells["X" + DataRowStart.ToString()].Value = "Media Type";
                workSheet.Cells["Y" + DataRowStart.ToString()].Value = "ISCI";
                workSheet.Cells["Z" + DataRowStart.ToString()].Value = "Program";
                workSheet.Cells["AA" + DataRowStart.ToString()].Value = "Cleared";
                workSheet.Cells["AB" + DataRowStart.ToString()].Value = "Daypart";
                workSheet.Cells["AC" + DataRowStart.ToString()].Value = "Comm. Rate";
                workSheet.Cells["AD" + DataRowStart.ToString()].Value = "CA Conv Rate";

                // format header - bold, yellow on black  
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                {
                    r.Style.Font.Bold = true;
                    r.Style.WrapText = true;
                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#93cddd"));
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }
                //Background color of RateID column header
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));

                for (int i = 0; i < PreLogLines.Count(); i++)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = PreLogLines[i].StdNetName;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = PreLogLines[i].PropertyName;
                    if (PreLogLines[i].Mon)
                        workSheet.Cells["C" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Tue)
                        workSheet.Cells["D" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Wed)
                        workSheet.Cells["E" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Thu)
                        workSheet.Cells["F" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Fri)
                        workSheet.Cells["G" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Sat)
                        workSheet.Cells["H" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].Sun)
                        workSheet.Cells["I" + DataRowStart.ToString()].Value = "X";
                    if (PreLogLines[i].StartTime.Length > 0)
                        workSheet.Cells["J" + DataRowStart.ToString()].Value = PreLogLines[i].StartTime.Substring(0, 1) == "0" ? PreLogLines[i].StartTime.Substring(1) : PreLogLines[i].StartTime;
                    if (PreLogLines[i].EndTime.Length > 0)
                        workSheet.Cells["K" + DataRowStart.ToString()].Value = PreLogLines[i].EndTime.Substring(0, 1) == "0" ? PreLogLines[i].EndTime.Substring(1) : PreLogLines[i].EndTime;
                    workSheet.Cells["L" + DataRowStart.ToString()].Value = PreLogLines[i].DayPartCd;
                    workSheet.Cells["M" + DataRowStart.ToString()].Value = PreLogLines[i].OMDP;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = PreLogLines[i].SpotLen;
                    if (PreLogLines[i].SpotLen == 15)
                    {
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#FFFF00"));
                    }
                    workSheet.Cells["O" + DataRowStart.ToString()].Value = PreLogLines[i].BuyType;
                    workSheet.Cells["P" + DataRowStart.ToString()].Value = PreLogLines[i].SpBuy;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));
                    workSheet.Cells["Q" + DataRowStart.ToString()].Value = PreLogLines[i].FullRate;
                    workSheet.Cells["R" + DataRowStart.ToString()].Value = PreLogLines[i].Rate;
                    workSheet.Cells["S" + DataRowStart.ToString()].Value = PreLogLines[i].USDGrossRate;
                    workSheet.Cells["T" + DataRowStart.ToString()].Value = PreLogLines[i].Imp;
                    workSheet.Cells["U" + DataRowStart.ToString()].Value = PreLogLines[i].CPM;
                    workSheet.Cells["U" + DataRowStart.ToString()].Style.Numberformat.Format = "$#,##0.00";

                    workSheet.Cells["V" + DataRowStart.ToString()].Value = PreLogLines[i].SpotDate;
                    workSheet.Cells["V" + DataRowStart.ToString()].Style.Numberformat.Format = "mm/dd/yyyy";
                    if (PreLogLines[i].SpotTime.Length > 0)
                        workSheet.Cells["W" + DataRowStart.ToString()].Value = PreLogLines[i].SpotTime.Substring(0, 1) == "0" ? PreLogLines[i].SpotTime.Substring(1) : PreLogLines[i].SpotTime;
                    workSheet.Cells["X" + DataRowStart.ToString()].Value = PreLogLines[i].MediaTypeCode;
                    workSheet.Cells["Y" + DataRowStart.ToString()].Value = PreLogLines[i].ISCI;
                    workSheet.Cells["Z" + DataRowStart.ToString()].Value = PreLogLines[i].ProgramTitle;
                    workSheet.Cells["AA" + DataRowStart.ToString()].Value = PreLogLines[i].Cleared;
                    workSheet.Cells["AB" + DataRowStart.ToString()].Value = PreLogLines[i].OmdpSpotDateTime;
                    workSheet.Cells["AC" + DataRowStart.ToString()].Value = PreLogLines[i].CommRate;
                    workSheet.Cells["AC" + DataRowStart.ToString()].Style.Numberformat.Format = "#0\\.00%";
                    workSheet.Cells["AD" + DataRowStart.ToString()].Value = PreLogLines[i].CAConvRate;
                    workSheet.Cells["AD" + DataRowStart.ToString()].Style.Numberformat.Format = "#0\\.00%";

                    if (PreLogLines[i].Cleared == "UNPLACED")
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#66FF33"));
                        }
                    }
                    if (i > 0 && PreLogLines[i].StdNetName != PreLogLines[i - 1].StdNetName)
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#CCC0DA"));
                        }
                }

                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Start Time"
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"End Time"
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Sopt Time"
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "m/dd/yyyy";
                workSheet.Column(workSheet.Cells["Q" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["R" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["S" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["T" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["O" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["U" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["Z" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["AA" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(17).AutoFit();
                workSheet.Column(18).AutoFit();
                workSheet.Column(19).AutoFit();
                workSheet.Column(20).AutoFit();
                workSheet.Column(21).AutoFit();
                workSheet.Column(22).AutoFit();
                workSheet.Column(26).AutoFit();
                workSheet.Column(27).AutoFit();
                workSheet.Column(3).Width = 4;
                workSheet.Column(4).Width = 4;
                workSheet.Column(5).Width = 4;
                workSheet.Column(6).Width = 4;
                workSheet.Column(7).Width = 4;
                workSheet.Column(8).Width = 4;
                workSheet.Column(9).Width = 4;
                workSheet.Column(10).AutoFit();
                workSheet.Column(11).AutoFit();
                workSheet.Column(12).Width = 5;
                workSheet.Column(12).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(13).Width = 4;
                workSheet.Column(13).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(14).Width = 7;         //Len column
                workSheet.Column(14).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(21).AutoFit();         //Spot Date column
                workSheet.Column(22).AutoFit();
                workSheet.Column(24).AutoFit();
                workSheet.Column(25).AutoFit();

                result = package.GetAsByteArray();
            }
            return File(result, ExcelExportHelper.ExcelContentType, "Pre Log - Week of " + header.PreLog.WeekDate.Year + "-" + header.PreLog.WeekDate.Month + "-" + header.PreLog.WeekDate.Day + " - As of " + DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day +
                ".xlsx");

        }

        [HttpGet]
        [SessionExpireChildFilter]
        public FileContentResult Summary(int prelogid)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var header = _prelogRepository.GetPreLogHeader(prelogid, LoggedOnUser.UserId);
            var items = _prelogRepository.GetPreLogWeeklySummary(prelogid, LoggedOnUser.UserId);

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("FinalReport");
                var programs = items.Select(x => x.ProgramTitle).Distinct().OrderBy(x => x);
                var networks = items.Select(x => x.StdNetName).Distinct().OrderBy(x => x);
                int DataRowStart = 6;
                int DataColStart = 1;

                workSheet.Cells["J2"].Value = "Weekly Summary";
                workSheet.Cells["J2"].Style.Font.Bold = true;
                workSheet.Cells["J2"].Style.Font.Size = 18;
                workSheet.Cells["J2"].Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#305496"));
                workSheet.Cells["J2:O2"].Merge = true;
                workSheet.Cells["A2"].Value = "PRE LOG";
                workSheet.Cells["A2"].Style.Font.Size = 13;
                workSheet.Cells["A2:A3"].Merge = true;
                workSheet.Cells["A2:C3"].Style.Font.Bold = true;
                workSheet.Cells["A2"].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                workSheet.Cells["A2:C3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["A2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                workSheet.Cells["A2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["A3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B2"].Value = "Client:";
                workSheet.Cells["C2"].Value = "Week:";
                workSheet.Cells["B3"].Value = header.ClientName;
                workSheet.Cells["C3"].Value = header.PreLog.WeekDate;
                workSheet.Cells["C3"].Style.Numberformat.Format = "mm/dd/yyyy";

                workSheet.Cells[DataRowStart, DataColStart].Value = "Network";
                workSheet.Cells[DataRowStart - 1, DataColStart, DataRowStart, DataColStart].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart - 1, DataColStart, DataRowStart, DataColStart].Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                workSheet.Cells[DataRowStart - 1, DataColStart, DataRowStart, DataColStart].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart - 1, DataColStart, DataRowStart, DataColStart].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                foreach (var program in programs)
                {
                    workSheet.Cells[DataRowStart, DataColStart + 1].Value = "Rate";
                    workSheet.Cells[DataRowStart, DataColStart + 2].Value = "Clearance";
                    workSheet.Cells[DataRowStart, DataColStart + 1, DataRowStart, DataColStart + 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[DataRowStart, DataColStart + 1, DataRowStart, DataColStart + 3].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1].Value = program.Length == 0 ? "(blank)" : program;
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1].AutoFitColumns();
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 2].Merge = true;
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 3].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 3].Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 3].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 3].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    DataColStart += 3;
                }
                workSheet.Cells[DataRowStart - 1, DataColStart + 1].Value = "Total Rate";
                workSheet.Cells[DataRowStart - 1, DataColStart + 2].Value = "Total Clearance";
                workSheet.Cells[DataRowStart - 1, DataColStart + 2, DataRowStart, DataColStart + 2].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart - 1, DataColStart + 2, DataRowStart, DataColStart + 2].Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 2].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart - 1, DataColStart + 2].Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart, DataColStart + 2].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart - 1, DataColStart + 1, DataRowStart, DataColStart + 2].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);

                DataRowStart++;
                DataColStart = 1;
                decimal network_TotalFullRate = 0;
                int network_TotalClearance = 0;

                foreach (var network in networks)
                {
                    workSheet.Cells[DataRowStart, DataColStart].Value = network;
                    foreach (var program in programs)
                    {
                        workSheet.Cells[DataRowStart, ++DataColStart].Value = items.Where(x => x.StdNetName == network && x.ProgramTitle == program).Select(x => x.FullRateTotal).FirstOrDefault();
                        ++DataColStart;
                        if (items.Where(x => x.StdNetName == network && x.ProgramTitle == program).Select(x => x.Clearance).FirstOrDefault() > 0)
                            workSheet.Cells[DataRowStart, DataColStart].Value = items.Where(x => x.StdNetName == network && x.ProgramTitle == program).Select(x => x.Clearance).FirstOrDefault();

                        if (items.Where(x => x.StdNetName == network && x.ProgramTitle == program).Count() > 0)
                        {
                            network_TotalFullRate += items.Where(x => x.StdNetName == network && x.ProgramTitle == program).Select(x => x.FullRateTotal).FirstOrDefault() ?? 0;
                        }
                        if (items.Where(x => x.StdNetName == network && x.ProgramTitle == program && program.Length > 0).Count() > 0)
                        {
                            network_TotalClearance += items.Where(x => x.StdNetName == network && x.ProgramTitle == program).Select(x => x.Clearance).FirstOrDefault();
                        }
                        DataColStart++;
                    }

                    workSheet.Cells[DataRowStart, ++DataColStart].Value = network_TotalFullRate;
                    if (network_TotalClearance > 0)
                        workSheet.Cells[DataRowStart, ++DataColStart].Value = network_TotalClearance;
                    DataRowStart++;
                    DataColStart = 1;
                    network_TotalFullRate = 0;
                    network_TotalClearance = 0;
                }

                workSheet.Cells[DataRowStart, DataColStart].Value = "Grand Total";
                workSheet.Cells[DataRowStart, DataColStart].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart, DataColStart].Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                workSheet.Cells[DataRowStart, DataColStart].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                workSheet.Cells[DataRowStart, DataColStart].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);

                decimal program_TotalFullRate;
                int program_TotalClearance;
                for (int i = 2; i <= workSheet.Dimension.Columns; i++)
                {
                    program_TotalFullRate = 0;
                    program_TotalClearance = 0;
                    if (workSheet.Cells[6, i].Text == "Rate" || workSheet.Cells[5, i].Text == "Total Rate")
                    {
                        for (int j = 7; j <= workSheet.Dimension.Rows; j++)
                        {
                            if (workSheet.Cells[j, i].Value != null)
                                program_TotalFullRate += Convert.ToDecimal(workSheet.Cells[j, i].Value);
                        }
                        workSheet.Cells[workSheet.Dimension.Rows + 1, i].Value = program_TotalFullRate;
                    }
                    else if (workSheet.Cells[6, i].Text == "Clearance" || workSheet.Cells[5, i].Text == "Total Clearance")
                    {
                        for (int j = 7; j <= workSheet.Dimension.Rows; j++)
                        {
                            if (workSheet.Cells[j, i].Value != null)
                                program_TotalClearance += (int)(workSheet.Cells[j, i].Value);
                        }
                        workSheet.Cells[workSheet.Dimension.Rows + 1, i].Value = program_TotalClearance;
                        if (workSheet.Cells[5, i].Text == "Total Clearance")
                        {
                            workSheet.Cells[workSheet.Dimension.Rows + 1, i].Style.Border.Right.Style = ExcelBorderStyle.Thin;
                            workSheet.Cells[workSheet.Dimension.Rows + 1, i].Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                        }

                    }
                    workSheet.Cells[workSheet.Dimension.Rows + 1, i].Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[workSheet.Dimension.Rows + 1, i].Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    workSheet.Cells[workSheet.Dimension.Rows + 1, i].Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    workSheet.Cells[workSheet.Dimension.Rows + 1, i].Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                }

                workSheet.Column(1).AutoFit();
                workSheet.Column(workSheet.Dimension.Columns).AutoFit();
                workSheet.Column(3).Width = 15;
                workSheet.Protection.IsProtected = false;
                result = package.GetAsByteArray();

                return File(result, ExcelExportHelper.ExcelContentType, "Pre Log - Week of " + header.PreLog.WeekDate.Year + "-" + header.PreLog.WeekDate.Month + "-" + header.PreLog.WeekDate.Day + " Weekly Summary - As of " + DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day +
                ".xlsx");
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult ActualizePostLog(int postlogId, int weekNbr, DateTime weekDate, int clientId)
        //public async Task<IActionResult> ActualizePostLog(int postlogId, int weekNbr, DateTime weekDate, int clientId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _postlogRepository.Actualize(postlogId, weekNbr, clientId, weekDate, loggedOnUser.UserId);
            
            if (err.Success == true)
            {
                err.ResponseText = "PostLog is actualized successfully.";
                //ActualizeGlobalPostLogAccountingReports(postlogId, weekNbr, clientId, weekDate, loggedOnUser.UserId);
                //await ActualizeGlobalPostLogAccountingReports(postlogId, weekNbr, clientId, weekDate, loggedOnUser.UserId);
            }

            return Json(new
            {
                success = err.Success,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });

        }

        //public async void ActualizeGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        //public Task ActualizeGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        //{

        //    ErrorMessage err = _postlogRepository.ActualizeExecuteGlobalPostLogAccountingReports(postLogId, weekNum, clientId, weekDate, LoggedOnUserId);
        //    //ErrorMessage err = await _postlogRepository.ActualizeExecuteGlobalPostLogAccountingReports(postLogId,weekNum,clientId, weekDate, LoggedOnUserId);

        //    return Task.FromResult(1);

        //    //await Task.Delay(60000);
        //    //if (err.Success == true)
        //    //{
        //    //    return Task.FromResult(1);
        //    //}
        //    //return Task.FromResult(-1);
        //}


        public void ActualizeGlobalPostLogAccountingReports(int postLogId, int weekNum, int clientId, DateTime weekDate, int LoggedOnUserId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _postlogRepository.ActualizeExecuteGlobalPostLogAccountingReports(postLogId, weekNum, clientId, weekDate, loggedOnUser.UserId);
        }
        
        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult SetPostLogLines(int networkId, string propertyName, bool monday, bool tuesday, bool wednesday, bool thursday, bool friday, bool saturday, bool sunday,
          string startTime, string endTime, int dayPartId, int spotLength, decimal grossRateAmt, decimal impressions, string spotDate, int mediaTypeId, string isci, string sigmaProgram,
          string program, int postLogId)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _postlogRepository.SetPostLogLines(networkId, propertyName, monday, tuesday, wednesday, thursday, friday, saturday, sunday,
                startTime, endTime, dayPartId, spotLength, grossRateAmt, impressions, spotDate, mediaTypeId, isci, sigmaProgram,
                program, LoggedOnUser.UserId, postLogId);

            return Json(new
            {
                success = err.Success,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PostLogSaveChanges(int postlogId, int weekNbr, DateTime weekDate, int clientId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));            
            ErrorMessage err = _postlogRepository.PostLogSaveChanges(postlogId, weekNbr, clientId, weekDate, loggedOnUser.UserId);

            if (err.Success == true)
            {
                err.ResponseText = "Changes are saved Successfully!!";
            }

            return Json(new
            {
                success = err.Success,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });
        }


        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PostlogAddDuplicateProperty(int postLogId, int selectedDuplicatePropertyId, int propertyDuplicateCount)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _postlogRepository.PostlogAddDuplicateProperty(postLogId, selectedDuplicatePropertyId, propertyDuplicateCount, loggedOnUser.UserId);

            if (err.Success == true)
            {
                err.ResponseText = "Selected Property is successfully duplicated - " + propertyDuplicateCount + " times";
            }

            //IList<POSTLOG_LINE_T> pl = _postlogRepository
            //.GetPostLogLinesFromSP(postLogId, loggedOnUser.UserId, true, null)
            //.ToList();

            return Json(new
            {
                success = err.Success,
                //recordsTotal = 1,
                //recordsFiltered = 1,
                //data = pl,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });


            //return Json(new
            //{
            //    success = err.Success,
            //    responseText = err.ResponseText,
            //    responseCode = err.ResponseCode
            //});


        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult EditPreLogLine(int preLogLineId, int preLogId, string preLogLineIds)
        {
            try
            {

                string networkId = Request.Form["data[" + preLogLineId.ToString() + "][netId]"].ToString();
                string propertyName = Request.Form["data[" + preLogLineId.ToString() + "][propertyName]"].ToString();
                string monday = Request.Form["data[" + preLogLineId.ToString() + "][mon]"].ToString();
                string tuesday = Request.Form["data[" + preLogLineId.ToString() + "][tue]"].ToString();
                string wednesday = Request.Form["data[" + preLogLineId.ToString() + "][wed]"].ToString();
                string thursday = Request.Form["data[" + preLogLineId.ToString() + "][thu]"].ToString();
                string friday = Request.Form["data[" + preLogLineId.ToString() + "][fri]"].ToString();
                string saturday = Request.Form["data[" + preLogLineId.ToString() + "][sat]"].ToString();
                string sunday = Request.Form["data[" + preLogLineId.ToString() + "][sun]"].ToString();
                string startTime = Request.Form["data[" + preLogLineId.ToString() + "][startTime]"].ToString();
                string endTime = Request.Form["data[" + preLogLineId.ToString() + "][endTime]"].ToString();
                string dayPartId = Request.Form["data[" + preLogLineId.ToString() + "][dayPartId]"].ToString();
                string spotLength = Request.Form["data[" + preLogLineId.ToString() + "][spotLen]"].ToString();
                string buyTypeId = Request.Form["data[" + preLogLineId.ToString() + "][buyTypeId]"].ToString();
                string rateAmt = Request.Form["data[" + preLogLineId.ToString() + "][fullRate]"].ToString();
                string imp = Request.Form["data[" + preLogLineId.ToString() + "][imp]"].ToString();
                string isci = Request.Form["data[" + preLogLineId.ToString() + "][isci]"];
                string spotTime = Request.Form["data[" + preLogLineId.ToString() + "][spotTime]"];
                string spotDate = Request.Form["data[" + preLogLineId.ToString() + "][spotDate]"];
                string programTitle = Request.Form["data[" + preLogLineId.ToString() + "][programTitle]"];
                string cleared = Request.Form["data[" + preLogLineId.ToString() + "][cleared]"];
                string spBuy = Request.Form["data[" + preLogLineId.ToString() + "][spBuy]"];

                if (!string.IsNullOrEmpty(spotTime))
                {
                    ErrorMessage errSpotTime = _generalRepository.ValidateTime(spotTime);
                    if (errSpotTime.Success == true)
                    {
                        spotTime = errSpotTime.ResponseText;
                    }
                }
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPreLogLineIds = preLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();

                if (buyTypeId != "")
                {
                    var buyType = _generalRepository.GetBuyTypes().Where(x => x.BuyTypeId == int.Parse(buyTypeId)).SingleOrDefault();
                    if ((buyType.IsZeroImp && decimal.Parse(imp == "" ? "0" : imp) != 0) || (buyType.IsZeroRate && decimal.Parse(rateAmt == "" ? "0" : rateAmt) != 0))
                    {
                        return Json(new
                        {
                            success = false,
                            responseText = "Buytype selected does not allow rate and/or impression combination. Please select different buytype or edit rate/impression."
                        });
                    }
                }


                ErrorMessage err = _prelogRepository.EditPreLogLine(arrayPreLogLineIds, preLogId, int.Parse(networkId), propertyName, (monday == "1" ? true : false), (tuesday == "1" ? true : false)
                   , (wednesday == "1" ? true : false), (thursday == "1" ? true : false), (friday == "1" ? true : false),
                   (saturday == "1" ? true : false), (sunday == "1" ? true : false), startTime, endTime, int.Parse(dayPartId == "" ? "-1" : dayPartId),
                   int.Parse(spotLength), int.Parse(buyTypeId == "" ? "-1" : buyTypeId), decimal.Parse(rateAmt), decimal.Parse(imp == "" ? "-1" : imp),
                    spotDate, spotTime, programTitle, isci, cleared, LoggedOnUser.UserId, (spBuy == "SP" ? spBuy : ""));

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PreLogSaveChanges(int preLogId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage err = _prelogRepository.PreLogSaveChanges(preLogId, LoggedOnUser.UserId);

                if (err.Success == true)
                {
                    err.ResponseText = "Changes are saved Successfully!!";
                }

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }
        }


        [HttpPost]
        [SessionExpireChildFilter]
        public IActionResult AddPreLogLine(int preLogId)
        {
            try
            {
                string propertyLineCount = string.IsNullOrEmpty(Request.Form["data[0][propertyLineCount]"].ToString().Trim()) ? "1" : Request.Form["data[0][propertyLineCount]"].ToString();
                string networkId = Request.Form["data[0][netId]"].ToString();
                string propertyName = Request.Form["data[0][propertyName]"].ToString();
                string monday = Request.Form["data[0][mon]"].ToString();
                string tuesday = Request.Form["data[0][tue]"].ToString();
                string wednesday = Request.Form["data[0][wed]"].ToString();
                string thursday = Request.Form["data[0][thu]"].ToString();
                string friday = Request.Form["data[0][fri]"].ToString();
                string saturday = Request.Form["data[0][sat]"].ToString();
                string sunday = Request.Form["data[0][sun]"].ToString();
                string startTime = Request.Form["data[0][startTime]"].ToString();
                string endTime = Request.Form["data[0][endTime]"].ToString();
                string dayPartId = Request.Form["data[0][dayPartId]"].ToString();
                string spotLength = Request.Form["data[0][spotLen]"].ToString();
                string buyTypeId = Request.Form["data[0][buyTypeId]"].ToString();
                string rateAmt = Request.Form["data[0][fullRate]"].ToString();
                string imp = Request.Form["data[0][imp]"].ToString();
                string spotDate = Request.Form["data[0][spotDate]"].ToString();
                string spotTime = Request.Form["data[0][spotTime]"].ToString();
                string programTitle = Request.Form["data[0][programTitle]"].ToString();
                string isci = Request.Form["data[0][isci]"].ToString();
                string spBuy = Request.Form["data[0][spBuy]"].ToString();

                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                if (buyTypeId != "")
                {
                    var buyType = _generalRepository.GetBuyTypes().Where(x => x.BuyTypeId == int.Parse(buyTypeId)).SingleOrDefault();
                    if ((buyType.IsZeroImp && decimal.Parse(imp == "" ? "0" : imp) != 0) || (buyType.IsZeroRate && decimal.Parse(rateAmt == "" ? "0" : rateAmt) != 0))
                    {
                        return Json(new
                        {
                            success = false,
                            responseText = "Buytype selected does not allow rate and/or impression combination. Please select different buytype or edit rate/impression."
                        });
                    }
                }

                ErrorMessage err = _prelogRepository.AddPreLogLine(
                    int.Parse(propertyLineCount), int.Parse(networkId), propertyName, (monday == "1" ? true : false), (tuesday == "1" ? true : false)
                    , (wednesday == "1" ? true : false), (thursday == "1" ? true : false), (friday == "1" ? true : false),
                    (saturday == "1" ? true : false), (sunday == "1" ? true : false), startTime, endTime, int.Parse(dayPartId),
                    int.Parse(spotLength), int.Parse(buyTypeId), decimal.Parse(rateAmt), decimal.Parse(imp), spotDate, spotTime,
                    isci, programTitle, LoggedOnUser.UserId, preLogId, (spBuy == "SP" ? "SP" : ""));

                return Json(new
                {
                    success = err.Success,
                    responseText = err.ResponseText,
                    responseCode = err.ResponseCode
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    success = false,
                    responseText = exc.Message,
                    responseCode = -1
                });
            }
        }

        [SessionExpireChildFilter]
        [HttpPost]
        public IActionResult PreLogAddDuplicateProperty(int preLogId, int preLogLineId, int propertyDuplicateCount)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _prelogRepository.PreLogAddDuplicateProperty(preLogId, preLogLineId, propertyDuplicateCount, loggedOnUser.UserId);

            if (err.Success == true)
            {
                err.ResponseText = "Selected Property is successfully duplicated - " + propertyDuplicateCount + " times";
            }

            return Json(new
            {
                success = err.Success,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });

        }

        [HttpGet]
        [SessionExpireChildFilter]
        public FileContentResult PostlogViewExcelExport(int postlogid, int countryID)
        {
            User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            var PostLogLines = _postlogRepository.GetPostLogLinesFromSP(postlogid, LoggedOnUser.UserId, false, null);

            if (countryID == 2)
            {
                return GenerateCanadaPostlogExcel(postlogid, LoggedOnUser, PostLogLines);
            }
            else
            {
                return GenerateUSPostlogExcel(postlogid, LoggedOnUser, PostLogLines);
            }
        }


        [HttpGet]
        [SessionExpireChildFilter]
        private FileContentResult GenerateUSPostlogExcel(int postlogid, User LoggedOnUser, IList<POSTLOG_LINE_T> PostLogLines)
        {
            var header = _postlogRepository.GetPostLogHeader(postlogid, LoggedOnUser.UserId);

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(header.ClientName);
                //ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("TestingBSA");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 5;
                workSheet.Cells["A2:A3"].Merge = true;
                workSheet.Cells["A2"].Value = "POST LOG";
                workSheet.Cells["A2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["A2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                workSheet.Cells["A2:A3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["A2:P2"].Style.Font.Bold = true;
                workSheet.Cells["A3:P3"].Style.Font.Bold = true;
                workSheet.Cells["A2"].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                workSheet.Cells["B2"].Value = "Client:";
                workSheet.Cells["B3"].Value = header.ClientName;
                workSheet.Cells["B2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C2:I2"].Merge = true;
                workSheet.Cells["C3:I3"].Merge = true;
                workSheet.Cells["C2"].Value = "Week:";
                workSheet.Cells["C3"].Value = header.PostLog.WeekDate;
                workSheet.Cells["C3"].Style.Numberformat.Format = "mm/dd/yyyy";
                workSheet.Cells["C2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C2:I2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C3:I3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K2"].Value = "Last Updated On:";
                workSheet.Cells["K3"].Value = "Last Updated By:";
                workSheet.Cells["L2:P2"].Merge = true;
                workSheet.Cells["L3:P3"].Merge = true;
                workSheet.Cells["L2"].Value = header.PostLog.UpdateDt;
                workSheet.Cells["L2"].Style.Numberformat.Format = "mm/dd/yyyy hh:mm:ss AM/PM";
                workSheet.Cells["L3"].Value = header.PostLog.UpdatedBy.DisplayName;
                workSheet.Cells["K2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L2:P2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L3:P3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);

                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Network";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Property";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "M";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "T";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "W";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Th";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "F";
                workSheet.Cells["H" + DataRowStart.ToString()].Value = "Sa";
                workSheet.Cells["I" + DataRowStart.ToString()].Value = "Su";
                workSheet.Cells["J" + DataRowStart.ToString()].Value = "Start Time";
                workSheet.Cells["K" + DataRowStart.ToString()].Value = "End Time";
                workSheet.Cells["L" + DataRowStart.ToString()].Value = "DayPart";
                workSheet.Cells["M" + DataRowStart.ToString()].Value = "OMPD";
                workSheet.Cells["N" + DataRowStart.ToString()].Value = "Len";
                workSheet.Cells["O" + DataRowStart.ToString()].Value = "Buy Type";
                workSheet.Cells["P" + DataRowStart.ToString()].Value = "SP Buy";
                //workSheet.Cells["P" + DataRowStart.ToString()].Value = "RateID";
                workSheet.Cells["Q" + DataRowStart.ToString()].Value = "Full Rate";
                workSheet.Cells["R" + DataRowStart.ToString()].Value = "Rate";
                workSheet.Cells["S" + DataRowStart.ToString()].Value = "Imp";
                workSheet.Cells["T" + DataRowStart.ToString()].Value = "CPM";
                workSheet.Cells["U" + DataRowStart.ToString()].Value = "Spot Date";
                workSheet.Cells["V" + DataRowStart.ToString()].Value = "Spot Time";
                workSheet.Cells["W" + DataRowStart.ToString()].Value = "Media Type";
                workSheet.Cells["X" + DataRowStart.ToString()].Value = "ISCI";
                workSheet.Cells["Y" + DataRowStart.ToString()].Value = "Program";
                workSheet.Cells["Z" + DataRowStart.ToString()].Value = "Cleared";
                workSheet.Cells["AA" + DataRowStart.ToString()].Value = "Daypart";
                workSheet.Cells["AB" + DataRowStart.ToString()].Value = "Comm. Rate";


                // format header - bold, yellow on black  
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                {
                    r.Style.Font.Bold = true;
                    r.Style.WrapText = true;
                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#93cddd"));
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }
                //Background color of RateID column header
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));

                for (int i = 0; i < PostLogLines.Count(); i++)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = PostLogLines[i].Network.StdNetName;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = PostLogLines[i].Property.PropertyName;
                    if (PostLogLines[i].Property.Monday)
                        workSheet.Cells["C" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Tuesday)
                        workSheet.Cells["D" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Wednesday)
                        workSheet.Cells["E" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Thursday)
                        workSheet.Cells["F" + DataRowStart.ToString()].Value = "X";

                    if (PostLogLines[i].Property.Friday)
                        workSheet.Cells["G" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Saturday)
                        workSheet.Cells["H" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Sunday)
                        workSheet.Cells["I" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].StartTime.ToString().Length > 0)
                        workSheet.Cells["J" + DataRowStart.ToString()].Value = PostLogLines[i].StartTime.ToString().Substring(0, 1) == "0" ? DateTime.Parse(PostLogLines[i].StartTime.ToString().Substring(1)).ToShortTimeString() : DateTime.Parse(PostLogLines[i].StartTime.ToString()).ToShortTimeString();
                    if (PostLogLines[i].EndTime.ToString().Length > 0)
                        workSheet.Cells["K" + DataRowStart.ToString()].Value = PostLogLines[i].EndTime.ToString().Substring(0, 1) == "0" ? DateTime.Parse(PostLogLines[i].EndTime.ToString().Substring(1)).ToShortTimeString() : DateTime.Parse(PostLogLines[i].EndTime.ToString()).ToShortTimeString();
                    workSheet.Cells["L" + DataRowStart.ToString()].Value = PostLogLines[i].DayPartCd;
                    workSheet.Cells["M" + DataRowStart.ToString()].Value = PostLogLines[i].OMDP;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = PostLogLines[i].SpotLen;
                    if (PostLogLines[i].SpotLen == 15)
                    {
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#FFFF00"));
                    }
                    workSheet.Cells["O" + DataRowStart.ToString()].Value = PostLogLines[i].BuyTypeCode;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Value = PostLogLines[i].RateId;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));
                    workSheet.Cells["P" + DataRowStart.ToString()].Value = PostLogLines[i].Sp_Buy;
                    workSheet.Cells["Q" + DataRowStart.ToString()].Value = PostLogLines[i].RateAmount;
                    workSheet.Column(workSheet.Cells["Q" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["R" + DataRowStart.ToString()].Value = PostLogLines[i].ClientRate;
                    workSheet.Column(workSheet.Cells["R" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["S" + DataRowStart.ToString()].Value = PostLogLines[i].Imp;
                    workSheet.Cells["T" + DataRowStart.ToString()].Value = PostLogLines[i].CPM;
                    workSheet.Cells["T" + DataRowStart.ToString()].Style.Numberformat.Format = "$#,##0.00";

                    workSheet.Cells["U" + DataRowStart.ToString()].Value = PostLogLines[i].SpotDate;
                    workSheet.Cells["U" + DataRowStart.ToString()].Style.Numberformat.Format = "mm/dd/yyyy";
                    if (PostLogLines[i].SpotTime.ToString().Length > 0)
                        workSheet.Cells["V" + DataRowStart.ToString()].Value = PostLogLines[i].SpotTime.ToString().Substring(0, 1) == "0" ? DateTime.Parse(PostLogLines[i].SpotTime.ToString().Substring(1)).ToLongTimeString() : DateTime.Parse(PostLogLines[i].SpotTime.ToString()).ToLongTimeString();
                    workSheet.Cells["W" + DataRowStart.ToString()].Value = PostLogLines[i].MediaType.MediaTypeCode;
                    workSheet.Cells["X" + DataRowStart.ToString()].Value = PostLogLines[i].ISCI;
                    workSheet.Cells["Y" + DataRowStart.ToString()].Value = PostLogLines[i].ProgramTitle;
                    workSheet.Cells["Z" + DataRowStart.ToString()].Value = PostLogLines[i].ClearedPlaced;
                    workSheet.Cells["AA" + DataRowStart.ToString()].Value = PostLogLines[i].DayPart.DayPartDesc;//OmdpSpotDateTime;
                    workSheet.Cells["AB" + DataRowStart.ToString()].Value = PostLogLines[i].CommRate;
                    workSheet.Cells["AB" + DataRowStart.ToString()].Style.Numberformat.Format = "#0\\.00%";

                    //ST-1117 Export to excel
                    if (Convert.ToBoolean(PostLogLines[i].IsDOWChanged))
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 3, DataRowStart, 9])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                    if (Convert.ToBoolean(PostLogLines[i].IsTimeChanged))
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 10, DataRowStart, 11])
                        {
                            r.Style.Font.Color.SetColor(System.Drawing.ColorTranslator.FromHtml("#2971B9"));
                        }
                    }
                    //if (PostLogLines[i].Cleared == false)
                    if (PostLogLines[i].ClearedPlaced.ToUpper() == "UNPLACED")
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#66FF33"));
                        }
                    }
                    if (i > 0 && PostLogLines[i].Network.StdNetName != PostLogLines[i - 1].Network.StdNetName)
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#CCC0DA"));
                        }
                }


                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Start Time"
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"End Time"
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Sopt Time"
                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["O" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["U" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["Z" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["AA" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(17).AutoFit();
                workSheet.Column(18).AutoFit();
                workSheet.Column(19).AutoFit();
                workSheet.Column(20).AutoFit();
                workSheet.Column(21).AutoFit();
                workSheet.Column(22).AutoFit();
                workSheet.Column(26).AutoFit();
                workSheet.Column(27).AutoFit();
                workSheet.Column(3).Width = 4;
                workSheet.Column(4).Width = 4;
                workSheet.Column(5).Width = 4;
                workSheet.Column(6).Width = 4;
                workSheet.Column(7).Width = 4;
                workSheet.Column(8).Width = 4;
                workSheet.Column(9).Width = 4;
                workSheet.Column(10).AutoFit();
                workSheet.Column(11).AutoFit();
                workSheet.Column(12).Width = 5;
                workSheet.Column(12).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(13).Width = 4;
                workSheet.Column(13).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(14).Width = 7;         //Len column
                workSheet.Column(14).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(21).AutoFit();         //Spot Date column
                workSheet.Column(22).AutoFit();
                workSheet.Column(24).AutoFit();
                workSheet.Column(25).AutoFit();

                result = package.GetAsByteArray();
            }
            return File(result, ExcelExportHelper.ExcelContentType, "Post Log - Week of " + header.PostLog.WeekDate.Year + "-" + header.PostLog.WeekDate.Month + "-" + header.PostLog.WeekDate.Day + " - As of " + DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day +
                ".xlsx");

        }

        [HttpGet]
        [SessionExpireChildFilter]
        private FileContentResult GenerateCanadaPostlogExcel(int postlogid, User LoggedOnUser, IList<POSTLOG_LINE_T> PostLogLines)
        {
            var header = _postlogRepository.GetPostLogHeader(postlogid, LoggedOnUser.UserId);

            byte[] result = null;
            ExcelPackage.LicenseContext = OfficeOpenXml.LicenseContext.NonCommercial;// Added By Shariq H Khan
            using (ExcelPackage package = new ExcelPackage())
            {
                ExcelWorksheet workSheet = package.Workbook.Worksheets.Add(header.ClientName);
                //ExcelWorksheet workSheet = package.Workbook.Worksheets.Add("TestingBSA");
                workSheet.View.ShowGridLines = true;

                int DataRowStart = 5;
                workSheet.Cells["A2:A3"].Merge = true;
                workSheet.Cells["A2"].Value = "POST LOG";
                workSheet.Cells["A2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["A2"].Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                workSheet.Cells["A2:A3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["A2:P2"].Style.Font.Bold = true;
                workSheet.Cells["A3:P3"].Style.Font.Bold = true;
                workSheet.Cells["A2"].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                workSheet.Cells["B2"].Value = "Client:";
                workSheet.Cells["B3"].Value = header.ClientName;
                workSheet.Cells["B2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["B2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["B3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C2:I2"].Merge = true;
                workSheet.Cells["C3:I3"].Merge = true;
                workSheet.Cells["C2"].Value = "Week:";
                workSheet.Cells["C3"].Value = header.PostLog.WeekDate;
                workSheet.Cells["C3"].Style.Numberformat.Format = "mm/dd/yyyy";
                workSheet.Cells["C2"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C3"].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Cells["C2:I2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["C3:I3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K2"].Value = "Last Updated On:";
                workSheet.Cells["K3"].Value = "Last Updated By:";
                workSheet.Cells["L2:P2"].Merge = true;
                workSheet.Cells["L3:P3"].Merge = true;
                workSheet.Cells["L2"].Value = header.PostLog.UpdateDt;
                workSheet.Cells["L2"].Style.Numberformat.Format = "mm/dd/yyyy hh:mm:ss AM/PM";
                workSheet.Cells["L3"].Value = header.PostLog.UpdatedBy.DisplayName;
                workSheet.Cells["K2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["K3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L2:P2"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);
                workSheet.Cells["L3:P3"].Style.Border.BorderAround(ExcelBorderStyle.Thin, System.Drawing.Color.Black);

                workSheet.Cells["A" + DataRowStart.ToString()].Value = "Network";
                workSheet.Cells["B" + DataRowStart.ToString()].Value = "Property";
                workSheet.Cells["C" + DataRowStart.ToString()].Value = "M";
                workSheet.Cells["D" + DataRowStart.ToString()].Value = "T";
                workSheet.Cells["E" + DataRowStart.ToString()].Value = "W";
                workSheet.Cells["F" + DataRowStart.ToString()].Value = "Th";
                workSheet.Cells["G" + DataRowStart.ToString()].Value = "F";
                workSheet.Cells["H" + DataRowStart.ToString()].Value = "Sa";
                workSheet.Cells["I" + DataRowStart.ToString()].Value = "Su";
                workSheet.Cells["J" + DataRowStart.ToString()].Value = "Start Time";
                workSheet.Cells["K" + DataRowStart.ToString()].Value = "End Time";
                workSheet.Cells["L" + DataRowStart.ToString()].Value = "DayPart";
                workSheet.Cells["M" + DataRowStart.ToString()].Value = "OMPD";
                workSheet.Cells["N" + DataRowStart.ToString()].Value = "Len";
                workSheet.Cells["O" + DataRowStart.ToString()].Value = "Buy Type";
                workSheet.Cells["P" + DataRowStart.ToString()].Value = "SP Buy";
                //workSheet.Cells["P" + DataRowStart.ToString()].Value = "RateID";
                workSheet.Cells["Q" + DataRowStart.ToString()].Value = "Full Rate";
                workSheet.Cells["R" + DataRowStart.ToString()].Value = "Rate";
                workSheet.Cells["S" + DataRowStart.ToString()].Value = "USD Net Rate";
                workSheet.Cells["T" + DataRowStart.ToString()].Value = "Imp";
                workSheet.Cells["U" + DataRowStart.ToString()].Value = "CPM";
                workSheet.Cells["V" + DataRowStart.ToString()].Value = "Spot Date";
                workSheet.Cells["W" + DataRowStart.ToString()].Value = "Spot Time";
                workSheet.Cells["X" + DataRowStart.ToString()].Value = "Media Type";
                workSheet.Cells["Y" + DataRowStart.ToString()].Value = "ISCI";
                workSheet.Cells["Z" + DataRowStart.ToString()].Value = "Program";
                workSheet.Cells["AA" + DataRowStart.ToString()].Value = "Cleared";
                workSheet.Cells["AB" + DataRowStart.ToString()].Value = "Daypart";
                workSheet.Cells["AC" + DataRowStart.ToString()].Value = "Comm. Rate";
                workSheet.Cells["AD" + DataRowStart.ToString()].Value = "CA Conv. Rate";

                // format header - bold, yellow on black  
                using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                {
                    r.Style.Font.Bold = true;
                    r.Style.WrapText = true;
                    r.Style.VerticalAlignment = ExcelVerticalAlignment.Center;
                    r.Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                    r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#93cddd"));
                    r.Style.Border.Top.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Left.Style = ExcelBorderStyle.Thin;
                    r.Style.Border.Right.Style = ExcelBorderStyle.Thin;

                    r.Style.Border.Top.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Bottom.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Left.Color.SetColor(System.Drawing.Color.Black);
                    r.Style.Border.Right.Color.SetColor(System.Drawing.Color.Black);
                }
                //Background color of RateID column header
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));

                for (int i = 0; i < PostLogLines.Count(); i++)
                {
                    DataRowStart++;
                    workSheet.Cells["A" + DataRowStart.ToString()].Value = PostLogLines[i].Network.StdNetName;
                    workSheet.Cells["B" + DataRowStart.ToString()].Value = PostLogLines[i].Property.PropertyName;
                    if (PostLogLines[i].Property.Monday)
                        workSheet.Cells["C" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Tuesday)
                        workSheet.Cells["D" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Wednesday)
                        workSheet.Cells["E" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Thursday)
                        workSheet.Cells["F" + DataRowStart.ToString()].Value = "X";

                    if (PostLogLines[i].Property.Friday)
                        workSheet.Cells["G" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Saturday)
                        workSheet.Cells["H" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].Property.Sunday)
                        workSheet.Cells["I" + DataRowStart.ToString()].Value = "X";
                    if (PostLogLines[i].StartTime.ToString().Length > 0)
                    {
                        if (PostLogLines[i].StartTime.ToString().Substring(0, 1) == "0")
                            workSheet.Cells["J" + DataRowStart.ToString()].Value = DateTime.Parse(PostLogLines[i].StartTime.ToString().Substring(1)).ToShortTimeString();
                        else
                            workSheet.Cells["J" + DataRowStart.ToString()].Value = DateTime.Parse(PostLogLines[i].StartTime.ToString()).ToShortTimeString();
                    }

                    if (PostLogLines[i].EndTime.ToString().Length > 0)
                        workSheet.Cells["K" + DataRowStart.ToString()].Value = PostLogLines[i].EndTime.ToString().Substring(0, 1) == "0" ? DateTime.Parse(PostLogLines[i].EndTime.ToString().Substring(1)).ToShortTimeString() : DateTime.Parse(PostLogLines[i].EndTime.ToString()).ToShortTimeString();
                    workSheet.Cells["L" + DataRowStart.ToString()].Value = PostLogLines[i].DayPartCd;
                    workSheet.Cells["M" + DataRowStart.ToString()].Value = PostLogLines[i].OMDP;
                    workSheet.Cells["N" + DataRowStart.ToString()].Value = PostLogLines[i].SpotLen;
                    if (PostLogLines[i].SpotLen == 15)
                    {
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                        workSheet.Cells["N" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#FFFF00"));
                    }
                    workSheet.Cells["O" + DataRowStart.ToString()].Value = PostLogLines[i].BuyTypeCode;
                    workSheet.Cells["P" + DataRowStart.ToString()].Value = PostLogLines[i].Sp_Buy;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Value = PostLogLines[i].RateId;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                    //workSheet.Cells["P" + DataRowStart.ToString()].Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#E7E6E6"));
                    workSheet.Cells["Q" + DataRowStart.ToString()].Value = PostLogLines[i].RateAmount;
                    workSheet.Column(workSheet.Cells["Q" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["R" + DataRowStart.ToString()].Value = PostLogLines[i].ClientRate;
                    workSheet.Column(workSheet.Cells["R" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["S" + DataRowStart.ToString()].Value = PostLogLines[i].USDGrossRate;
                    workSheet.Cells["S" + DataRowStart.ToString()].Style.Numberformat.Format = "#,##0.00";
                    workSheet.Cells["T" + DataRowStart.ToString()].Value = PostLogLines[i].Imp;
                    workSheet.Cells["U" + DataRowStart.ToString()].Value = PostLogLines[i].CPM;
                    workSheet.Cells["U" + DataRowStart.ToString()].Style.Numberformat.Format = "$#,##0.00";

                    workSheet.Cells["V" + DataRowStart.ToString()].Value = PostLogLines[i].SpotDate;
                    workSheet.Cells["V" + DataRowStart.ToString()].Style.Numberformat.Format = "mm/dd/yyyy";
                    if (PostLogLines[i].SpotTime.ToString().Length > 0)
                    {
                        workSheet.Cells["W" + DataRowStart.ToString()].Value = PostLogLines[i].SpotTime.ToString().Substring(0, 1) == "0" ? DateTime.Parse(PostLogLines[i].SpotTime.ToString().Substring(1)).ToLongTimeString() : DateTime.Parse(PostLogLines[i].SpotTime.ToString()).ToLongTimeString();
                    }
                    workSheet.Cells["X" + DataRowStart.ToString()].Value = PostLogLines[i].MediaType.MediaTypeCode;
                    workSheet.Cells["Y" + DataRowStart.ToString()].Value = PostLogLines[i].ISCI;
                    workSheet.Cells["Z" + DataRowStart.ToString()].Value = PostLogLines[i].ProgramTitle;
                    workSheet.Cells["AA" + DataRowStart.ToString()].Value = PostLogLines[i].ClearedPlaced;
                    workSheet.Cells["AB" + DataRowStart.ToString()].Value = PostLogLines[i].DayPart.DayPartDesc;//OmdpSpotDateTime;
                    workSheet.Cells["AC" + DataRowStart.ToString()].Value = PostLogLines[i].CommRate;
                    workSheet.Cells["AC" + DataRowStart.ToString()].Style.Numberformat.Format = "#0\\.00%";
                    workSheet.Cells["AD" + DataRowStart.ToString()].Value = PostLogLines[i].CAConvRate;
                    workSheet.Cells["AD" + DataRowStart.ToString()].Style.Numberformat.Format = "#0\\.00%";


                    //if (PostLogLines[i].Cleared == false)
                    if (PostLogLines[i].ClearedPlaced.ToUpper() == "UNPLACED")
                    {
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#66FF33"));
                        }
                    }
                    if (i > 0 && PostLogLines[i].Network.StdNetName != PostLogLines[i - 1].Network.StdNetName)
                        using (ExcelRange r = workSheet.Cells[DataRowStart, 1, DataRowStart, workSheet.Dimension.End.Column])
                        {
                            r.Style.Fill.PatternType = OfficeOpenXml.Style.ExcelFillStyle.Solid;
                            r.Style.Fill.BackgroundColor.SetColor(System.Drawing.ColorTranslator.FromHtml("#CCC0DA"));
                        }
                }

                //workSheet.Column(workSheet.Cells["U" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "m/dd/yyyy";

                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Start Time"
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"End Time"
                workSheet.Column(workSheet.Cells["W" + DataRowStart.ToString()].End.Column).Style.Numberformat.Format = "h:mm:ss AM/PM"; //"Sopt Time"
                workSheet.Column(workSheet.Cells["J" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["K" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["O" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["U" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["V" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["Z" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(workSheet.Cells["AA" + DataRowStart.ToString()].End.Column).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(1).AutoFit();
                workSheet.Column(2).AutoFit();
                workSheet.Column(17).AutoFit();
                workSheet.Column(18).AutoFit();
                workSheet.Column(19).AutoFit();
                workSheet.Column(20).AutoFit();
                workSheet.Column(21).AutoFit();
                workSheet.Column(22).AutoFit();
                workSheet.Column(26).AutoFit();
                workSheet.Column(27).AutoFit();
                workSheet.Column(3).Width = 4;
                workSheet.Column(4).Width = 4;
                workSheet.Column(5).Width = 4;
                workSheet.Column(6).Width = 4;
                workSheet.Column(7).Width = 4;
                workSheet.Column(8).Width = 4;
                workSheet.Column(9).Width = 4;
                workSheet.Column(10).AutoFit();
                workSheet.Column(11).AutoFit();
                workSheet.Column(12).Width = 5;
                workSheet.Column(12).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(13).Width = 4;
                workSheet.Column(13).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(14).Width = 7;         //Len column
                workSheet.Column(14).Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                workSheet.Column(21).AutoFit();         //Spot Date column
                workSheet.Column(22).AutoFit();
                workSheet.Column(24).AutoFit();
                workSheet.Column(25).AutoFit();

                result = package.GetAsByteArray();
            }
            return File(result, ExcelExportHelper.ExcelContentType, "Post Log - Week of " + header.PostLog.WeekDate.Year + "-" + header.PostLog.WeekDate.Month + "-" + header.PostLog.WeekDate.Day + " - As of " + DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day +
                ".xlsx");

        }


        [HttpPost]
        [SessionExpireFilter]
        public JsonResult AddPreLogNote(int PreLogId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage result = _prelogRepository.AddPreLogNote(LoggedOnUser.UserId, PreLogId, Note);
                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult AddPreLogSubNote(int PreLogNoteId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage result = _prelogRepository.AddPreLogSubNote(LoggedOnUser.UserId, PreLogNoteId, Note);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }


        [SessionExpireChildFilter]
        public JsonResult GetValidISCIs(int PreLogId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                return Json(_prelogRepository.GetValidISCIs(LoggedOnUser.UserId, PreLogId));
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }

        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult AddPostLogNote(int PostLogId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage result = _postlogRepository.AddPostLogNote(PostLogId, Note, LoggedOnUser.UserId);
                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult AddPostLogSubNote(int PostLogNoteId, string Note)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage result = _postlogRepository.AddPostLogSubNote(PostLogNoteId, Note, LoggedOnUser.UserId);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [SessionExpireChildFilter]
        public JsonResult GetPostLogNotes(int PostLogId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                return Json(_postlogRepository.GetPostLogNotes(PostLogId, LoggedOnUser.UserId));
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [SessionExpireChildFilter]
        public JsonResult PostLogGetValidISCIs(int PostLogId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                return Json(_postlogRepository.PostLogGetValidISCIs(PostLogId, LoggedOnUser.UserId));
            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }

        }


        [HttpPost]
        public IActionResult AddNetworkLine(int nwSelectNetwork, int nwClientId,
                string nwSelectCountry, string nwProduct, string nwSpotDate, string nwSpotTime, int nwSpotLen,
                string nwISCICode, int nwSpotRate, string nwProgram, string hdnNwWeekOf)
        {
            int preLog = 0;
            int postLog = 1;
            //string nwSelectNetwork = Request.Form["nwSelectNetwork"];
            //string nwClientId = Request.Form["nwClientId"];
            //string nwSelectCountry = Request.Form["nwSelectCountry"];
            //string nwProduct = Request.Form["nwProduct"];
            //string nwSpotDate = Request.Form["nwSpotDate"];
            //string nwSpotTime = Request.Form["nwSpotTime"];
            //string nwSpotLen = Request.Form["nwSpotLen"];
            //string nwISCICode = Request.Form["nwISCICode"];
            //string nwSpotRate = Request.Form["nwSpotRate"];
            //string nwProgram = Request.Form["nwProgram"];
            //string nwWeekOf = Request.Form["hdnNwWeekOf"];

            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            ErrorMessage err = _postlogRepository.PostLogAddNetworkLine(preLog, postLog, Convert.ToInt32(nwSelectNetwork), Convert.ToInt32(nwClientId),
                nwSelectCountry, nwProduct, nwSpotDate, nwSpotTime, Convert.ToInt32(nwSpotLen), nwISCICode, Convert.ToInt32(nwSpotRate),
                nwProgram, DateTime.Now.ToString(), hdnNwWeekOf,
                "ManualNwInsert - " + DateTime.Now, loggedOnUser.UserId);

            if (err.Success == true)
            {
                err.ResponseText = "Changes are saved Successfully!!";
            }

            return Json(new
            {
                success = err.Success,
                responseText = err.ResponseText,
                responseCode = err.ResponseCode
            });
        }


        [HttpPost]
        [SessionExpireFilter]
        public JsonResult DeletePreLog(int PreLogId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                ErrorMessage result = _prelogRepository.DeletePreLog(LoggedOnUser.UserId, PreLogId);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult DeletePostLog(int PostLogId, int SchedId, int WeekNbr)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                var isActualized = _postlogRepository.IsActualized(SchedId, WeekNbr, LoggedOnUser.UserId);
                ErrorMessage result = new ErrorMessage();

                if (isActualized)
                {
                    result.ResponseText = "This POST LOG is actualized and cannot be delete.";
                    result.Success = false;
                }
                else
                {
                    result = _postlogRepository.DeletePostLog(LoggedOnUser.UserId, PostLogId);
                }

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [SessionExpireChildFilter]
        public JsonResult PreLogGetPropertyDetails(int PreLogId, string PreLogLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                int[] arrayPreLogLineIds = PreLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                var prelogLines = _prelogRepository.GetPreLogLines(PreLogId, LoggedOnUser.UserId, true);

                var lstPL = prelogLines.Where(x => arrayPreLogLineIds.Contains(x.PreLogLineId)).ToList();
                var schedLineIdCount = lstPL.Where(x => x.SchedLineId > 0).ToList().Count();
                var count = lstPL.Select(x => new { x.NetId, x.SpotLen, x.FullRate }).Distinct().Count();

                if (schedLineIdCount > 0)
                {
                    return Json(new { success = false, responseText = "Copy Property Details is not applicable for Scheduled Line." });
                }
                else if (count > 1)
                {
                    return Json(new { success = false, responseText = "Please select same Network/Rate/Spot Length." });
                }
                else
                {
                    var lstResult = prelogLines.Where(x => x.NetId == lstPL[0].NetId && x.FullRate == lstPL[0].FullRate && x.SpotLen == lstPL[0].SpotLen && !arrayPreLogLineIds.Contains(x.PreLogLineId)
                    && (x.PropertyName ?? "") != "" && (x.Mon == true || x.Tue == true || x.Wed == true || x.Thu == true || x.Fri == true || x.Sat == true || x.Sun == true) &&
                    (x.StartTime ?? "") != "" && (x.EndTime ?? "") != "" && (x.DayPartCd ?? "") != "" && (x.OMDP ?? "") != "" && (x.BuyType ?? "") != "" && (x.FullRate ?? 0) != 0 && (x.Imp ?? 0) != 0
                   ).GroupBy(x => new { x.PreLogId, x.PropertyName, x.Mon, x.Tue, x.Wed, x.Thu, x.Fri, x.Sat, x.Sun, x.StartTime, x.EndTime, x.DayPartCd, x.OMDP, x.BuyType, x.FullRate, x.Imp })
                        .Select(x => new {
                            x.First().PreLogId,
                            x.First().PreLogLineId,
                            x.First().PropertyName,
                            x.First().Mon,
                            x.First().Tue,
                            x.First().Wed,
                            x.First().Thu,
                            x.First().Fri,
                            x.First().Sat,
                            x.First().Sun,
                            x.First().StartTime,
                            x.First().EndTime,
                            x.First().DayPartCd,
                            x.First().OMDP,
                            x.First().BuyType,
                            x.First().FullRate,
                            x.First().Imp
                        }).ToList();
                    if (lstResult.Count == 0)
                    {
                        return Json(new { success = false, responseText = "There are no properties for this network and week match your rate and length criteria for the network log line selected." });
                    }
                    else
                    {
                        return Json(new { success = true, result = lstResult });
                    }

                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult PreLogCopyPropertyDetails(int PreLogId, int PreLogLineId, string PreLogLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPreLogLineIds = PreLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage result = _prelogRepository.PreLogCopyPropertyDetails(LoggedOnUser.UserId, PreLogId, PreLogLineId, arrayPreLogLineIds);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [SessionExpireChildFilter]
        public JsonResult PostLogGetPropertyDetails(int PostLogId, string PostLogLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));

                int[] arrayPostLogLineIds = PostLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                var postLogLines = _postlogRepository.GetPostLogLinesFromSP(PostLogId, LoggedOnUser.UserId, true, null);

                //var lstPL = postLogLines.Where(x => arrayPostLogLineIds.Contains(x.PostLogLineId)).ToList();
                var lstPL = postLogLines.Where(x => arrayPostLogLineIds.Contains(x.PLineID)).ToList();
                var schedLineIdCount = lstPL.Where(x => x.ScheduleLine != null && x.ScheduleLine.ScheduleLineId > 0).ToList().Count();
                var count = lstPL.Select(x => new { x.Network.NetworkId, x.SpotLen, x.RateAmount }).Distinct().Count();

                if (schedLineIdCount > 0)
                {
                    return Json(new { success = false, responseText = "Copy Property Details is not applicable for Scheduled Line." });
                }
                else if (count > 1)
                {
                    return Json(new { success = false, responseText = "Please select same Network/Rate/Spot Length." });
                }
                else
                {
                    var lstResult = postLogLines.Where(x => x.Network.NetworkId == lstPL[0].Network.NetworkId && x.RateAmount == lstPL[0].RateAmount && x.SpotLen == lstPL[0].SpotLen && !arrayPostLogLineIds.Contains(x.PLineID)
                   && (x.Property.PropertyName ?? "") != "" && (x.Property.Monday == true || x.Property.Tuesday == true || x.Property.Wednesday == true || x.Property.Thursday == true || x.Property.Friday == true || x.Property.Saturday == true || x.Property.Sunday == true) &&
                   (x.StartTime ?? (DateTime?)null) != (DateTime?)null && (x.EndTime ?? (DateTime?)null) != (DateTime?)null && (x.DayPartCd ?? "") != "" && (x.OMDP ?? "") != "" && (x.BuyTypeCode ?? "") != "" && (x.RateAmount ?? 0) != 0 && (x.Imp ?? 0) != 0
                         )
                        .GroupBy(x => new { x.PostLog.PostLogId, x.Property.PropertyName, x.Property.Monday, x.Property.Tuesday, x.Property.Wednesday, x.Property.Thursday, x.Property.Friday, x.Property.Saturday, x.Property.Sunday, x.StartTime, x.EndTime, x.DayPartCd, x.OMDP, x.BuyTypeCode, x.RateAmount, x.Imp })
                        .Select(x => new
                        {
                            x.First().PostLog.PostLogId,
                            //x.First().PostLogLineId,
                            x.First().PLineID,
                            x.First().Property.PropertyName,
                            x.First().Property.Monday,
                            x.First().Property.Tuesday,
                            x.First().Property.Wednesday,
                            x.First().Property.Thursday,
                            x.First().Property.Friday,
                            x.First().Property.Saturday,
                            x.First().Property.Sunday,
                            x.First().StartTime,
                            x.First().EndTime,
                            x.First().DayPartCd,
                            x.First().OMDP,
                            x.First().BuyTypeCode,
                            x.First().RateAmount,
                            x.First().Imp
                        }).ToList();
                    if (lstResult.Count == 0)
                    {
                        return Json(new { success = false, responseText = "There are no properties for this network and week match your rate and length criteria for the network log line selected." });
                    }
                    else
                    {
                        return Json(new { success = true, result = lstResult });
                    }

                }

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult PostLogCopyPropertyDetails(int PostLogId, int PostLogLineId, string PostLogLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPostLogLineIds = PostLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage result = _postlogRepository.PostLogCopyPropertyDetails(LoggedOnUser.UserId, PostLogId, PostLogLineId, arrayPostLogLineIds);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });


            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult PreLogClearSpotData(int PreLogId, string PreLogLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPreLogLineIds = PreLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage result = _prelogRepository.PreLogClearSpotData(LoggedOnUser.UserId, PreLogId, arrayPreLogLineIds);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult PostLogClearSpotData(int PostLogId, string PostLogLineIds)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPostLogLineIds = PostLogLineIds.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage result = _postlogRepository.PostLogClearSpotData(LoggedOnUser.UserId, PostLogId, arrayPostLogLineIds);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });

            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        
        [HttpPost]
        [SessionExpireFilter]
        public JsonResult PostLogMoveSpotData(int PostLogId, string PostLogLineIdsFrom, string PostLogLineIdsTo)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPostLogLineIdsFrom = PostLogLineIdsFrom.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                int[] arrayPostLogLineIdsTo = PostLogLineIdsTo.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage result = _postlogRepository.PostLogMoveSpotData(LoggedOnUser.UserId, PostLogId, arrayPostLogLineIdsFrom, arrayPostLogLineIdsTo);

                return Json(new
                {
                    success =result.Success,
                    responseText =result.ResponseText
                });


            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public JsonResult PreLogMoveSpotData(int PreLogId, string PreLogLineIdsFrom, string PreLogLineIdsTo)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                int[] arrayPreLogLineIdsFrom = PreLogLineIdsFrom.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                int[] arrayPreLogLineIdsTo = PreLogLineIdsTo.Split(new[] { "," }, StringSplitOptions.RemoveEmptyEntries).Select(Int32.Parse).ToArray();
                ErrorMessage result = _prelogRepository.PreLogMoveSpotData(LoggedOnUser.UserId, PreLogId, arrayPreLogLineIdsFrom, arrayPreLogLineIdsTo);

                return Json(new
                {
                    success = result.Success,
                    responseText = result.ResponseText
                });


            }
            catch (Exception exc)
            {
                return Json(new { success = false, responseText = exc.Message });
            }
        }

        [HttpPost]
        [SessionExpireFilter]
        public void PostLogRealTimeReport(int ClientId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _postlogRepository.PostLogRealTimeReport(ClientId, loggedOnUser.UserId);
        }


        [HttpPost]
        [SessionExpireFilter]
        public void AssignMirrorBuyType(int ClientId)
        {
            User loggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
            _postlogRepository.AssignMirrorBuyType(ClientId, loggedOnUser.UserId);
        }

    }

}