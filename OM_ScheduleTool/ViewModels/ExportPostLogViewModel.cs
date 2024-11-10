using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class ExcelExportPostLogViewModel
    {
        public List<ExportPostLog> ExportPostLogs;
    }

    public class ExportPostLogViewModel
    {
        public User LoggedOnUser { get; set; }

        public IEnumerable<Country> Countries { get; set; }
        public IEnumerable<Client> Clients { get; set; }
        public IEnumerable<Network> Networks { get; set; }
        public List<SelectListItem> PlanYearTypes { get; set; }
        public IEnumerable<SelectListItem> PlanYears { get; set; }
        public List<SelectListItem> Months { get; set; }

        public ErrorMessage ErrMessage { get; set; }

        public int CountryId { get; set; }
        public int ClientId { get; set; }
        public int NetworkId { get; set; }
        public string PlanYearType { get; set; }
        public int PlanYear { get; set; }
        public int Month { get; set; }
        public DateTime DateFrom { get; set; }
        public DateTime DateTo { get; set; }
    }
}
