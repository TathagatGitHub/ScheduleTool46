using Microsoft.AspNetCore.Mvc.Rendering;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class DropdownViewModel
    {
        public IEnumerable<string> ResultsStr { get; set; }
        public IEnumerable<DateTime> ResultsDt { get; set; }
        public IEnumerable<double> ResultsDbl { get; set; }
        public IEnumerable<int> ResultsInt { get; set; }
        public string Sels { get; set; }
        public IEnumerable<SelectListItem> ResultSelListItems { get; set; }
        public bool IsCurrency { get; set; }
    }

}
