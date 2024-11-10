using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    [NotMapped]
    public class NetworkDeltaSummary
    {
        public string NetWorkName { get; set; }
        public int NetWorkId { get; set; }
        public int CurrentSpots { get; set; }
        public string CurrentDateReceived { get; set; }
        public string CurrentLogFileName { get; set; }
        public int NewSpots { get; set; }
        public string NewDateReceived { get; set; }
        public string NewLogFileName { get; set; }
        public string Action { get; set; }
        
    }
}
