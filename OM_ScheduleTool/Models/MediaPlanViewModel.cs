namespace OM_ScheduleTool.Models
{
    public class MediaPlanViewModel
    {
        public MediaPlan objMediaPlan { get; set; }
        public List<MediaPlanNetwork> lstMediaPlanNetworks { get;}
        public List<MediaPlanDemo> lstMediaPlanDemos { get;}
        public List<MediaPlanNote> lstMediaPlanNotes { get;}
        public List<MediaPlanDocument> lstMediaPlanDocuments { get;}

        public MediaPlanViewModel()
        {
            objMediaPlan = new MediaPlan();
            lstMediaPlanDemos = new List<MediaPlanDemo>();
            lstMediaPlanNetworks = new List<MediaPlanNetwork>();
            lstMediaPlanNotes = new List<MediaPlanNote>();
            lstMediaPlanDocuments = new List<MediaPlanDocument>();
        }
    }
}
