using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using OM_ScheduleTool.Dapper;

namespace OM_ScheduleTool.Models
{
    public class GeneralRepository : IGeneralRepository
    {
        private AppContext _context;
        private StoredProcsContext _spcontext;
        private IUserRepository _userRepository;
        private ILogger<PropertyRepository> _logger;
        private IConfiguration _config;

        public GeneralRepository(AppContext context
            , StoredProcsContext spContext
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger
            , IConfiguration config
            )
        {
            _context = context;
            _spcontext = spContext;
            _userRepository = userRepository;

            _logger = logger;
            _config = config;
        }

        public IEnumerable<SelectListItem> GetPlanYears()
        {
            List<SelectListItem> Years = new List<SelectListItem>();
            int Year = 2017;
            try
            {
                Year = int.Parse(_config.GetSection("Property:PlanYrBegin").Value);
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message);
                Year = 2017;
            }

            for (int idx = Year; idx <= DateTime.Now.Year + 2; idx++)
            {
                Years.Add(new SelectListItem { Text = idx.ToString(), Value = idx.ToString() });
            }
            return Years.AsEnumerable();

        }

        public IEnumerable<Network> GetAllNetworks()
        {
            return _context.Networks
                .OrderBy(n => n.StdNetName)
                .ToList();
        }

        public IEnumerable<Country> GetAllCountries()
        {
            return _context.Countries
                .Where(c => c.IncludeInNetwork == true)
                .OrderBy(n => n.SortKey)
                .ToList();
        }

        public IEnumerable<DemographicSettings> GetDemoNames(int CountryId)
        {
            return _context
                .DemographicSettings
                .Where (c => c.CountryId == CountryId)
                .ToList();
        }

        public IEnumerable<Quarter> GetQuarters(int Year, int LoggedOnUserId)
        {
            List<Quarter> Quarters = new List<Quarter>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Demo_GetQuartersPerYear";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("BroadcastYr", Year, DbType.Int32);

                Quarters = FactoryServices.dbFactory.SelectCommand_SP(Quarters, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get Demographic Settings. " + exc.Message);

            }

            return Quarters.AsEnumerable();


        }

        public List<DateTime> GetEffectiveDates(string QtrName)
        {
            try
            {
                Quarter quarter = _context
                                    .Quarter
                                    .Where(q => q.QuarterName == QtrName)
                                    .FirstOrDefault<Quarter>();
                if (quarter != null)
                {

                    List<DateTime> qtrs = new List<DateTime>();
                    if (quarter.Wk01_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk01_Date));
                    if (quarter.Wk02_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk02_Date));
                    if (quarter.Wk03_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk03_Date));
                    if (quarter.Wk04_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk04_Date));
                    if (quarter.Wk05_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk05_Date));
                    if (quarter.Wk06_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk06_Date));
                    if (quarter.Wk07_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk07_Date));
                    if (quarter.Wk08_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk08_Date));
                    if (quarter.Wk09_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk09_Date));
                    if (quarter.Wk10_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk10_Date));
                    if (quarter.Wk11_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk11_Date));
                    if (quarter.Wk12_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk12_Date));
                    if (quarter.Wk13_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk13_Date));
                    if (quarter.Wk14_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk14_Date));

                    return qtrs; 
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public List<DateTime> GetExpirationDates(string QtrName)
        {
            try
            {
                Quarter quarter = _context
                                    .Quarter
                                    .Where(q => q.QuarterName == QtrName)
                                    .FirstOrDefault<Quarter>();
                if (quarter != null)
                {

                    List<DateTime> qtrs = new List<DateTime>();
                    if (quarter.Wk01_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk01_Date).AddDays(6));
                    if (quarter.Wk02_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk02_Date).AddDays(6));
                    if (quarter.Wk03_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk03_Date).AddDays(6));
                    if (quarter.Wk04_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk04_Date).AddDays(6));
                    if (quarter.Wk05_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk05_Date).AddDays(6));
                    if (quarter.Wk06_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk06_Date).AddDays(6));
                    if (quarter.Wk07_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk07_Date).AddDays(6));
                    if (quarter.Wk08_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk08_Date).AddDays(6));
                    if (quarter.Wk09_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk09_Date).AddDays(6));
                    if (quarter.Wk10_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk10_Date).AddDays(6));
                    if (quarter.Wk11_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk11_Date).AddDays(6));
                    if (quarter.Wk12_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk12_Date).AddDays(6));
                    if (quarter.Wk13_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk13_Date).AddDays(6));
                    if (quarter.Wk14_Date.HasValue == true) qtrs.Add(((DateTime)quarter.Wk14_Date).AddDays(6));

                    return qtrs;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception)
            {
                return null;
            }
        }

        public Quarter GetWeekStartDatesByQuarter(int QuarterId, int LoggedOnUserId)
        {
            try
            {
                return _context.Quarter
                    .Where(q => q.QuarterId == QuarterId)
                    .FirstOrDefault<Quarter>();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get start weeks. " + exc.Message);

            }

            return null;

        }

        public CommRate GetWeekCommRatesByClientQuarter(int ClientId, int QuarterId, int LoggedOnUserId)
        {
            try
            {
                return _context.CommRate
                    .Include(q => q.Quarter)
                    .Include(c => c.Client)
                    .Where(q => q.Quarter.QuarterId == QuarterId)
                    .Where (c => c.Client.ClientId == ClientId)
                    .FirstOrDefault();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get start weeks. " + exc.Message);

            }

            return null;

        }

        public BroadcastDate GetBroadcastDate(int Month, int Year, int LoggedOnUserId)
        {
            try
            {
                return _context.BroadcastDate
                    .Where(d => d.Month == Month && d.Year == Year)
                    .FirstOrDefault();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get broadcast date. " + exc.Message);

            }

            return null;

        }


        public Quarter GetQuarter(int QuarterId, int LoggedOnUserId)
        {
            try
            {
                return _context.Quarter
                    .Where(q => q.QuarterId == QuarterId)
                    .FirstOrDefault();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get quarter. " + exc.Message);

            }

            return null;

        }

        public IEnumerable<DayPart> GetAllDayParts(int LoggedOnUserId)
        {
            try
            {
                return _context
                    .DayPart
                    .OrderBy (so => so.SortOrder)
                    .ToList();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get day parts. " + exc.Message);

            }

            return null;
        }

        public IEnumerable<BuyType> GetAllBuyTypes(int LoggedOnUserId, int UpfrontTypeId)
        {
            try
            {
                if (UpfrontTypeId == 1) 
                {
                    return _context
                        .BuyType
                        .Where(bt => bt.RemnantType == true)
                        .OrderBy (so => so.SortOrder)
                        .ToList();
                }
                else
                {
                    return _context
                        .BuyType
                        .Where(bt => bt.UpfrontType == true)
                        .OrderBy(so => so.SortOrder)
                        .ToList();
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get buy types. " + exc.Message);

            }

            return null;
        }

        public IEnumerable<BuyType> GetBuyTypes()
        {
            return _context
                .BuyType
                .OrderBy(so => so.SortOrder)
                .ToList();
        }

        public IEnumerable<MediaType> GetMediaTypes()
        {
            return _context
                .MediaTypes
                .OrderBy(m => m.MediaTypeCode)
                .ToList();
        }

        public IEnumerable<DoNotBuyType> GetAllDoNotBuyTypes(int LoggedOnUserId)
        {
            try
            {
                return _context
                    .DoNotBuyType
                    .OrderBy(so => so.SortOrder)
                    .ToList();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get day parts. " + exc.Message);

            }

            return null;
        }

        public ErrorMessage ValidateTime(string time)
        {
            /*
            ErrorMessage err = new ErrorMessage(true, 0, "");
            string TempTime = time;
            bool Valid = true;

            try
            {
                // First, let'ss if this is already a valid time.
                DateTime dtTime;
                if (TempTime.Substring(TempTime.Length - 2).ToLower() == " a")
                {
                    TempTime = TempTime.Substring(0, TempTime.Length - 2) + " AM";
                }
                else if (TempTime.Substring(TempTime.Length - 2).ToLower() == " p")
                {
                    TempTime = TempTime.Substring(0, TempTime.Length - 2) + " PM";
                }

                if (DateTime.TryParse(time, out dtTime) == true)
                {
                    TempTime = DateTime.Now.ToShortDateString() + " " + dtTime.ToString("hh:mm:ss tt");
                }
                else
                {
                    // there's an excel shortcut for time where "1:27 a" is similar to "1:27 am" but "1:27a" is invalid.  Let's check for this
                    if (TempTime.Substring(TempTime.Length - 2).ToLower() == " a")
                    {
                        TempTime = TempTime.Substring(0, TempTime.Length-2) + " AM";
                    }
                    else if (TempTime.Substring(TempTime.Length - 2).ToLower() == " p")
                    {
                        TempTime = TempTime.Substring(0, TempTime.Length - 2) + " PM";
                    }
                    else
                    {
                        switch (time.ToLower())
                        {
                            case "1a":
                            case "1 a":
                            case "1am":
                            case "1 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 01:00 AM";
                                break;
                            case "2a":
                            case "2 a":
                            case "2am":
                            case "2 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 02:00 AM";
                                break;
                            case "3a":
                            case "3 a":
                            case "3am":
                            case "3 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 03:00 AM";
                                break;
                            case "4a":
                            case "4 a":
                            case "4am":
                            case "4 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 04:00 AM";
                                break;
                            case "5a":
                            case "5 a":
                            case "5am":
                            case "5 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 05:00 AM";
                                break;
                            case "6a":
                            case "6 a":
                            case "6am":
                            case "6 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 06:00 AM";
                                break;
                            case "7a":
                            case "7 a":
                            case "7am":
                            case "7 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 07:00 AM";
                                break;
                            case "8a":
                            case "8 a":
                            case "8am":
                            case "8 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 08:00 AM";
                                break;
                            case "9a":
                            case "9 a":
                            case "9am":
                            case "9 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 09:00 AM";
                                break;
                            case "10a":
                            case "10 a":
                            case "10am":
                            case "10 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 10:00 AM";
                                break;
                            case "11a":
                            case "11 a":
                            case "11am":
                            case "11 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 11:00 AM";
                                break;
                            case "12a":
                            case "12 a":
                            case "12am":
                            case "12 am":
                                TempTime = DateTime.Now.ToShortDateString() + " 12:00 AM";
                                break;

                            case "1p":
                            case "1 p":
                            case "1pm":
                            case "1 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 01:00 pm";
                                break;
                            case "2p":
                            case "2 p":
                            case "2pm":
                            case "2 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 02:00 pm";
                                break;
                            case "3p":
                            case "3 p":
                            case "3pm":
                            case "3 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 03:00 pm";
                                break;
                            case "4p":
                            case "4 p":
                            case "4pm":
                            case "4 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 04:00 pm";
                                break;
                            case "5p":
                            case "5 p":
                            case "5pm":
                            case "5 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 05:00 pm";
                                break;
                            case "6p":
                            case "6 p":
                            case "6pm":
                            case "6 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 06:00 pm";
                                break;
                            case "7p":
                            case "7 p":
                            case "7pm":
                            case "7 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 07:00 pm";
                                break;
                            case "8p":
                            case "8 p":
                            case "8pm":
                            case "8 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 08:00 pm";
                                break;
                            case "9p":
                            case "9 p":
                            case "9pm":
                            case "9 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 09:00 pm";
                                break;
                            case "10p":
                            case "10 p":
                            case "10pm":
                            case "10 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 10:00 pm";
                                break;
                            case "11p":
                            case "11 p":
                            case "11pm":
                            case "11 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 11:00 pm";
                                break;
                            case "12p":
                            case "12 p":
                            case "12pm":
                            case "12 pm":
                                TempTime = DateTime.Now.ToShortDateString() + " 12:00 pm";
                                break;

                            default:
                                Valid = false;
                                break;
                        }
                    }
                }

                if (Valid == true)
                {
                    err.Success = true;
                    err.ResponseCode = 1;
                    err.ResponseText = TempTime;
                }
                else
                {
                    err.Success = false;
                    err.ResponseCode = -1;
                    err.ResponseText = "Invalid Time Entered";
                }
            }
            catch (Exception exc)
            {
            }

            return err;
            */

            ErrorMessage err = new ErrorMessage(true, 0, "");
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ValidateTime";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("Time", time, DbType.String);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }
            return err;
        }

        public ErrorMessage ValidateSpotDate(string WeekStartDate, string SpotDate)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");

            try
            {
                DateTime dtStart = DateTime.Parse(WeekStartDate);
                int Day;
                // See if they entered day of week
                // Only 1-7 allowed
                if (int.TryParse (SpotDate, out Day) == true)
                {
                    if (Day >= 1 && Day <= 7)
                    {
                        DateTime dtNewDate = dtStart.AddDays(Day-1);
                        err.Success = true;
                        err.ResponseCode = 1;
                        err.ResponseText = dtNewDate.ToString ("MM/dd/yyyy");
                    }
                    else
                    {
                        err.Success = false;
                        err.ResponseCode = -1;
                        err.ResponseText = "Enter 1-7 to get the correct date for this week";
                    }
                }
                else
                {
                    // See if they entered a date
                    // Date has to be within the week or it will not be accepted
                    DateTime dtNewDate;
                    if (DateTime.TryParse(SpotDate, out dtNewDate) == true)
                    {
                        // 0 based so we only test up to 6 days
                        if (dtNewDate >= dtStart && dtNewDate <= dtStart.AddDays(6))
                        {
                            err.Success = true;
                            err.ResponseCode = 1;
                            err.ResponseText = dtNewDate.ToString("MM/dd/yyyy");
                        }
                        else
                        {
                            err.Success = false;
                            err.ResponseCode = -1;
                            err.ResponseText = "Enter 1-7 to get the correct date for this week";
                        }
                    }
                    else
                    {
                        err.Success = false;
                        err.ResponseCode = -1;
                        err.ResponseText = "Enter 1-7 to get the correct date for this week";
                    }

                }
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }

            return err;
        }

        public ErrorMessage ValidateCurrency (string Currency)
        {
            ErrorMessage err = new ErrorMessage(true, 0, "");

            try
            {
                string TempCurrency = Currency.Replace("$", "").Replace(" ", "");
                decimal ParsedCurrency;
                if (decimal.TryParse(TempCurrency, out ParsedCurrency) == true)
                {
                    err.Success = true;
                    err.ResponseCode = 1;
                    err.ResponseText = Currency;
                }
                else
                {
                    err.Success = false;
                    err.ResponseCode = -1;
                    err.ResponseText = "Invalid input.  Expecting (00.00) format.";
                }

            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1;
                err.ResponseText = exc.Message;
            }

            return err;
        }
    }


}
