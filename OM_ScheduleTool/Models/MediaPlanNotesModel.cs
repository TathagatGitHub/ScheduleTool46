namespace OM_ScheduleTool.Models
{
    public class MediaPlanNotesModel
    {
        public int MediaPlanNoteId { get; set; }
        public int MediaPlanId { get; set; }
        public string User { get; set; }
        public string Note { get; set; }
        public string Author { get; set; }
        public string Time { get; set; }
        public int CreatedByUserId { get; set; }       
        public int UpdatedByUserId { get; set; }
        public bool CanModify { get; set; }      
    }
}
