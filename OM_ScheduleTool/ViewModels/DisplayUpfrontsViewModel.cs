using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class DisplayUpfrontsViewModel
    {
        public User LoggedOnUser { get; set; }
        public IEnumerable<Upfront> Upfronts { get; set; }
    }
}
