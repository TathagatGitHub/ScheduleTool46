using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class LockInfo
    {
        public bool LockedToOtherUser { get; set; }
        public bool IsLocked { get; set; }
        public string LockedBy { get; set; }
        public DateTime? LockTime { get; set; }
    }
}
