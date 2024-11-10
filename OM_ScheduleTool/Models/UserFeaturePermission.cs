namespace OM_ScheduleTool.Models
{
    public class UserFeaturePermission
    {
        // Manage Media
        public int CanEditUnapprovedProperties { get; set; }
        public int CanViewUnapprovedProperties { get; set; }

        public int EditNotesAction { get; set; }
        public int EditNotesActionCustom { get; set; }

        // User Settings
        public int CanEditUserSettings { get; set; }
    }
}
