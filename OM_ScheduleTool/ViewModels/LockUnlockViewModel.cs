using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class LockUnlockViewModel
    {
        public User LoggedOnUser { get; set; }
        public ErrorMessage ErrMessage { get; set; }

        public List<Upfront> LockedUpfronts { get; set; }
        public List<Upfront> LockedRemnants { get; set; }
        public List<MediaPlanLocked> LockedMediaPlan { get; set; }
        public List<Schedule> LockedSchedules { get; set; }
        public List<Schedule> LockedProposals { get; set; }
        public List<POSTLOG_T> LockedPostLogs { get; set; }
        public List<PRELOG_T> LockedPreLogs { get; set; }
    }
}
