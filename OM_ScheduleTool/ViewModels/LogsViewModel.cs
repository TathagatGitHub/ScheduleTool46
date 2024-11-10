using OM_ScheduleTool.Models;
using System.Collections.Generic;


namespace OM_ScheduleTool.ViewModels
{
    public class LogsViewModel
    {
        public ManageMediaViewModel manageMediaViewModel { get; set; } 
        public IEnumerable<PRELOG_T> prelogs { get; set; }
        public IEnumerable<POSTLOG_T> postlogs { get; set; }        
        public int? SchedID { get; set; }
    }
}
