using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class EditMediaPlanViewModel
    {
        public MediaPlan MediaPlan { get; set; }
       
        public List<MediaPlanDemo> MediaPlanDemos { get; set; }

        public List<MediaPlanNetwork> MediaPlanNetwork { get; set; }

    }
}
