using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IDealpointRepository
    {
        Dealpoint GetDealpoint(int NetworkId, int PlanYr, string DR);
        bool SetDealpoint(int LoggedOnUserId, int NetworkId, int PlanYr, string DR, string CancelLine1, string CancelLine2, string CancelLine3, string CancelLine4, string CancelLine5);
    }
}
