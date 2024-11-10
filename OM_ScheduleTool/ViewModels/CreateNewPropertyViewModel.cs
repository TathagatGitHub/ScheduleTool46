using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class CreateNewPropertyViewModel
    {
        public User LoggedOnUser { get; set; }

        public int CountryDefault;
        public string PlanYearsDefault;
        public string PlanTypeDefault;
        public int UpfrontTypeDefault;
        public Quarter QuarterDefault;
        public Network NetworkDefault;
        public int NoMenu;
        public bool Upfront;

        public IEnumerable<string> PlanYears;
        public IEnumerable<DoNotBuyType> DoNotBuyTypes;
        public IEnumerable<DayPart> DayParts;
        public IEnumerable<Client> Clients;
        public IEnumerable<Country> Countries;
        public IEnumerable<BuyType> BuyTypes;
        public List<DateTime> EffectiveDates { get; set; }
        public List<DateTime> ExpirationDates { get; set; }

    }
}
