using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class NetworkLogUserAction
    {
        public int NetworkId { get; set; }
        public string NetworkName { get; set; }
        public string LogFile { get; set; }
        public string Action { get; set; }
        public int LogId { get; set; }
    }
}
