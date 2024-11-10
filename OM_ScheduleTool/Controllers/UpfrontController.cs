using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class UpfrontController : Controller
    {
        private IConfiguration _config;
        private IPropertyRepository _propertyRepository;
        private IUpfrontRepository _upfrontRepository;
        private IUserRepository _userRepository;

        public UpfrontController(IConfiguration config
            , IPropertyRepository propertyRepository
            , IUpfrontRepository upfrontRepository
            , IUserRepository userRepository)
        {
            _config = config;
            _propertyRepository = propertyRepository;
            _upfrontRepository = upfrontRepository;
            _userRepository = userRepository;
        }


        /* COMMENTING THIS FOR NOW.  I DON'T THINK THIS IS ACTIVELY USED */
        /*
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetUpfrontRemnantLines(int LoggedOnUserId, int UpfrontId)
        {
            try
            {
                IEnumerable<UpfrontRemnantLine> urlines = _upfrontRepository.GetUpfrontRemnantLines(LoggedOnUserId, UpfrontId);
                ViewData["lines"] = urlines;

                return View();
            }
            catch
            {
            }

            return Json(true);
        }
        */


        /*
         *  Used in:
         *      ManageMedia/_UpfrontDataTable_Edit.cshtml
         *      
         */
        [HttpPost]
        [SessionExpireFilter]
        public ActionResult GetUpfrontLineId(int UpfrontLineId)
        {
            try
            {
                User LoggedOnUser = _userRepository.GetUserByAccountName(HttpContext.Session.GetString("AccountName"));
                UpfrontLine line = _upfrontRepository.GetUpfrontLineById(LoggedOnUser.UserId, UpfrontLineId);

                return Json(new
                {
                    Success = true,
                    RateApproved = line.Rate.Approved,
                    DemoName = line.Rate.DemographicSettingsPerQtr.Demo.DemoName,
                    Status = line.Rate.DoNotBuyType.Description,
                    PropertyName = line.Rate.Property.PropertyName,
                    StartTime = line.Rate.Property.StartTime,
                    EndTime = line.Rate.Property.EndTime,
                    DayPart = line.Rate.Property.DayPart.DayPartCd + " (" + line.Rate.Property.DayPart.DayPartDesc + ")",
                    DayPartId = line.Rate.Property.DayPart.DayPartId,
                    BuyType = line.Rate.BuyType.BuyTypeCode + " (" + line.Rate.BuyType.BuyTypeDescription + ")",
                    Rate = line.Rate.RateAmt,
                    Impressions = line.Rate.Impressions,
                    CPM = (line.Rate.Impressions != 0 ? line.Rate.RateAmt / line.Rate.Impressions : 0),
                    EffectiveDate = line.Rate.EffectiveDate.ToShortDateString(),
                    ExpirationDate = line.Rate.ExpirationDate.ToShortDateString(),
                    Monday = line.Rate.Property.Monday,
                    Tuesday = line.Rate.Property.Tuesday,
                    Wednesday = line.Rate.Property.Wednesday,
                    Thursday = line.Rate.Property.Thursday,
                    Friday = line.Rate.Property.Friday,
                    Saturday = line.Rate.Property.Saturday,
                    Sunday = line.Rate.Property.Sunday
                });
            }
            catch (Exception exc)
            {
                return Json(new
                {
                    Success = false,
                    ResponseText = exc.Message
                });
            }

        }

    }
}


