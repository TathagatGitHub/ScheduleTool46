using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IBroadcastYearManagement
    {
        IEnumerable<Quarter> GetBroadcastYear(int Year, int LoggedOnUserId);
        ErrorMessage SaveBroadcastYear(int Year, string Year1QStartWeek, string Year1QEndWeek, string Year2QStartWeek, string Year2QEndWeek, string Year3QStartWeek, string Year3QEndWeek, string Year4QStartWeek, string Year4QEndWeek, int LoggedOnUserId);
    }
}
