using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class ExchangeRateDemoViewModel
    {
        public string StartDate { get; set; }
        public User LoggedOnUser { get; set; }
        public string ReturnedJson { get; set; }

    }
}
