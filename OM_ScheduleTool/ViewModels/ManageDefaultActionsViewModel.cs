using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class ManageDefaultActionsViewModel
    {
        public User LoggedOnUser { get; set; }

        public IEnumerable<OM_ScheduleTool.Models.Action> Actions { get; set; }

        public IEnumerable<AppFeatureDefaultAction> AppFeatureDefaultActions_Admin { get; set; }

        public IEnumerable<AppFeatureDefaultAction> AppFeatureDefaultActions_Mid { get; set; }

        public IEnumerable<AppFeatureDefaultAction> AppFeatureDefaultActions_Low { get; set; }

        public IEnumerable<AppFeatureDefaultAction> AppFeatureDefaultActions_General { get; set; }
    }

}
