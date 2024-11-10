using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class HomeDeltaListViewModel
    {
        public User LoggedOnUser { get; set; }

        public IEnumerable<DeltaList> DeltaListChanges { get; set; }
    }
}
