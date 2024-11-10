using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class CanadianExchangeViewModel
    {
        public User LoggedOnUser { get; set; }
        public IEnumerable<Client> Clients { get; set; }
        public IEnumerable<SelectListItem> PlanYears  { get; set; }
        public IEnumerable<Quarter> Quarters { get; set; }
        public List<CanadaActualExchangeRate> History { get; set; }
        public List<CanadaClientExchangeRateExport> ListCanadaClientExchangeRateExport { get; set; }

        public int CanadianExchange_SelectedPlanYear { get; set; }
        public int CanadianExchange_SelectedQuarter { get; set; }
        public int CanadianExchange_SelectedClient { get; set; }
        public double CanadianExchange_Rate { get; set; }

        public ErrorMessage ErrMessage { get; set; }

    }
}
