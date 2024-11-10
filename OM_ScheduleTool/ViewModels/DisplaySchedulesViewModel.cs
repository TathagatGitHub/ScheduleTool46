using OM_ScheduleTool.Models;
using System.Collections.Generic;

namespace OM_ScheduleTool.ViewModels
{
    public class DisplaySchedulesViewModel
    {
        public User LoggedOnUser { get; set; }
        public IEnumerable<Schedule> Schedules { get; set; }
    }
}
