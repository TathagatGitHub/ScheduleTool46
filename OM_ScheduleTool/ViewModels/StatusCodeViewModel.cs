using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class StatusCodeViewModel
    {
        public User LoggedOnUser { get; set; }

        public int StatusCode { get; set; }

        public string ErrorMessage { get; set; }
    }
}
