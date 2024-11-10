using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class ClientCommissionViewModel
    {
        public User LoggedOnUser { get; set; }
        public IEnumerable<Country> Countries { get; set; }
        public IEnumerable<Client> Clients { get; set; }
        public List<SelectListItem> TieredSels { get; set; }
        public List<SelectListItem> CommStructures { get; set; }
        public IEnumerable<SelectListItem> PlanYears { get; set; }
        public IEnumerable<Quarter> Quarters { get; set; }
        public IEnumerable<SelectListItem> StartWeeks { get; set; }
        public IEnumerable<SelectListItem> EndWeeks { get; set; }
        public decimal AvgCommRate { get; set; }
        public List<ClientCommissionRateExport> ListClientCommissionRateExport { get; set; }

        public ErrorMessage ErrMessage { get; set; }

        public int CountryId { get; set; }
        public int ClientId { get; set; }
        public string AnniversaryDate { get; set; }
        public bool Tiered { get; set; }
        public string CommStructure { get; set; }
        public string Rate { get; set; }
        public int PlanYear { get; set; }
        public int QuarterId { get; set; }
        public string StartWeek { get; set; }
        public string EndWeek { get; set; }
        public string CommRate { get; set; } // This is for the hidden drop down list.
        public int ShowRates { get; set; }

        public string Week01Date { get; set; }
        public string Week02Date { get; set; }
        public string Week03Date { get; set; }
        public string Week04Date { get; set; }
        public string Week05Date { get; set; }
        public string Week06Date { get; set; }
        public string Week07Date { get; set; }
        public string Week08Date { get; set; }
        public string Week09Date { get; set; }
        public string Week10Date { get; set; }
        public string Week11Date { get; set; }
        public string Week12Date { get; set; }
        public string Week13Date { get; set; }
        public string Week14Date { get; set; }

        public string Week01Rate { get; set; }
        public string Week02Rate { get; set; }
        public string Week03Rate { get; set; }
        public string Week04Rate { get; set; }
        public string Week05Rate { get; set; }
        public string Week06Rate { get; set; }
        public string Week07Rate { get; set; }
        public string Week08Rate { get; set; }
        public string Week09Rate { get; set; }
        public string Week10Rate { get; set; }
        public string Week11Rate { get; set; }
        public string Week12Rate { get; set; }
        public string Week13Rate { get; set; }
        public string Week14Rate { get; set; }

    }
}
