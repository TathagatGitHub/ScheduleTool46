using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System.Collections.Generic;

namespace OM_ScheduleTool.ViewModels
{
    public class ExchangeRateActualsViewModel
    {
        public User LoggedOnUser { get; set; }

        public IEnumerable<SelectListItem> Weeks { get; set; }
        public IEnumerable<SelectListItem> Years { get; set; }
        public IEnumerable<Quarter> Quarters { get; set; }

        public int Year { get; set; }
        public int QuarterId { get; set; }
        public int WeekNbr { get; set; }

        public ErrorMessage ErrMessage { get; set; }
    }
}
