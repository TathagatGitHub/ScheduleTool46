using Microsoft.CodeAnalysis.CSharp;
using OM_ScheduleTool.ViewModels;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanBTPageSummaryViewModel
    {
       public int BuyTypeGroupId { get; set; }
        public MediaPlanSummaryHeader mediaPlanSummaryHeader { get; set; }

        public List<MediaPlanBTPageNetworks> lstNetworks { get; set; }
        public List<MediaPlanBTGroupNetworksProperties> lstProperties { get; set; }
        public List<MediaPlanBTGroupsDayPart> lstDayPart { get; set; }  

        public List<QuickPlanBTGSummary> lstQuickPlan { get; set; }




        public MediaPlanBTPageSummaryViewModel()
        {
            mediaPlanSummaryHeader = new MediaPlanSummaryHeader();
            lstNetworks = new List<MediaPlanBTPageNetworks>();
            lstProperties = new List<MediaPlanBTGroupNetworksProperties>();
            lstDayPart = new List<MediaPlanBTGroupsDayPart>();
            lstQuickPlan = new List<QuickPlanBTGSummary>();
        }
    }
}
