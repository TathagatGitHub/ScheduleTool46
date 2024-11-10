using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface ICanadianExchangeRateRepository 
    {
        ErrorMessage AddExchangeRate(int LoggedOnUserId,
            int ClientId,
            int QuarterId,
            double Rate);

        IEnumerable<CanadaActualExchangeRate> GetActualExchangeRateHistory(int QuarterId, int LoggedOnUserId, DateTime? Week);
        
        List<CanadaClientExchangeRateExport> GetCanadianClientExchangeRate(int planYr, int loggedOnUserId);
    }
}
