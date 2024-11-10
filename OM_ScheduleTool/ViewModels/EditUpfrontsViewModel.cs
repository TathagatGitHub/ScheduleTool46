using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class EditUpfrontsViewModel
    {
        public User LoggedOnUser { get; set; }
        public Upfront UpfrontInfo { get; set; }
        public Network NetworkInfo { get; set; }
        public int PlanYear { get; set; }
        public bool ViewOnly { get; set; }
        public UserFeaturePermission UserFeaturePermissionInfo { get; set; }
        public List<UpfrontPermissions> UpfrontPermissions { get; set; }
        public List<UpfrontNote> UpfrontNotes { get; set; }

        //public IEnumerable<UpfrontRemnantLineFlat> UpfrontLines { get; set; }
        public UpfrontLine ProgramChangeUpfrontLine { get; set; }
        public IEnumerable<UpfrontRemnantLine> ReviseEstimates { get; set; }

        public IEnumerable<DemoNames> DemoNamesAvailable { get; set; }
        public IEnumerable<Property> PropertyNamesAvailable { get; set; }
        public IEnumerable<DateTime> StartTimesAvailable { get; set; }
        public IEnumerable<DateTime> EndTimesAvailable { get; set; }
        public IEnumerable<DayPart> DPAvailable { get; set; }
        public IEnumerable<string> OMDPAvailable { get; set; }
        public IEnumerable<BuyType> BuyTypeAvailable { get; set; }
        public IEnumerable<string> LenAvailable { get; set; }
        public IEnumerable<DoNotBuyType> DoNotBuyTypesAvailable { get; set; }
        public IEnumerable<Client> ClientsAvailable { get; set; }
        public IEnumerable<string> RevisionsAvailable { get; set; }
        public IEnumerable<DateTime> RevisedDatesAvailable { get; set; }
        public List<DateTime> EffectiveDatesAvailable { get; set; }
        public List<DateTime> ExpirationDatesAvailable { get; set; }
        public IEnumerable<double> RatesAvailable { get; set; }
        public IEnumerable<double> ImpressionsAvailable { get; set; }
        public IEnumerable<double> CPMAvailable { get; set; }

        public CreateNewPropertyViewModel createNewPropertyViewModel { get; set; }
    }
}
