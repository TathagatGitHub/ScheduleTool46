using OM_ScheduleTool.ViewModels;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanSummaryViewModel
    {
       
        public MediaPlanSummaryHeader mediaPlanSummaryHeader { get; set; }

        public List<MediaPlanBuyTypeGroups> lstMediaPlanBuyTypeGroups { get; set; }
        public List<MediaPlanNetwork> lstAllMediaPlanNetwork { get; set; }
        public List<MediaPlanNetwork> lstMediaPlanNetwork { get; set; }
        public List<MediaPlanDemo> lstAllMediaPlanDemo { get; set; }
        public List<MediaPlanDemo> lstMediaPlanDemo { get; set; }
        public List<MediaType> lstMediaType { get; set; }
        public List<string> lstBudgetType { get; set;}

        public List<MediaPlanSummary> lstMediaPlanSummary { get; set; }
        public ManageMediaViewModel manageMediaViewModel { get; set; }

        public MediaPlanSummaryViewModel()
        {
            mediaPlanSummaryHeader= new MediaPlanSummaryHeader();
            lstMediaPlanBuyTypeGroups = new List<MediaPlanBuyTypeGroups>();
            lstAllMediaPlanNetwork = new List<MediaPlanNetwork>();
            lstMediaPlanNetwork= new List<MediaPlanNetwork>();
            lstAllMediaPlanDemo = new List<MediaPlanDemo>();
            lstMediaPlanDemo = new List<MediaPlanDemo>();
            lstBudgetType = new List<string>();
            lstMediaPlanSummary = new List<MediaPlanSummary>();
            manageMediaViewModel = new ManageMediaViewModel();
        }
    }
}
