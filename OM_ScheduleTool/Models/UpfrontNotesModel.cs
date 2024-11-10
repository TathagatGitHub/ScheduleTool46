namespace OM_ScheduleTool.Models
{
    public class UpfrontNotesModel
    {
        public int UpfrontNoteId { get; set; }
        public DateTime CreateDt { get; set; }
        public int CreatedByUserId { get; set; }
        public string Note { get; set; }
        public int UpfrontId { get; set; }
        public int? ParentNoteId { get; set; }
        public string DisplayName { get; set; }
    }
}
