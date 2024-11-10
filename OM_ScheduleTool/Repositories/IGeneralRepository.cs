using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface IGeneralRepository 
    {
        IEnumerable<SelectListItem> GetPlanYears();
        IEnumerable<Quarter> GetQuarters(int Year, int LoggedOnUserId);
        IEnumerable<Country> GetAllCountries();
        Quarter GetWeekStartDatesByQuarter(int QuarterId, int LoggedOnUserId);
        CommRate GetWeekCommRatesByClientQuarter(int ClientId, int QuarterId, int LoggedOnUserId);
        BroadcastDate GetBroadcastDate(int Month, int Year, int LoggedOnUserId);
        Quarter GetQuarter(int QuarterId, int LoggedOnUserId);
        List<DateTime> GetEffectiveDates(string QtrName);
        List<DateTime> GetExpirationDates(string QtrName);
        IEnumerable<DayPart> GetAllDayParts(int LoggedOnUserId);
        IEnumerable<BuyType> GetAllBuyTypes(int LoggedOnUserId, int UpfrontTypeId);
        IEnumerable<DoNotBuyType> GetAllDoNotBuyTypes(int LoggedOnUserId);
        IEnumerable<Network> GetAllNetworks();
        IEnumerable<BuyType> GetBuyTypes();
        IEnumerable<MediaType> GetMediaTypes();
        // Uses SQL to validate time
        ErrorMessage ValidateTime(string time);
        ErrorMessage ValidateSpotDate(string weekStartDate, string spotDate);

    }
}
