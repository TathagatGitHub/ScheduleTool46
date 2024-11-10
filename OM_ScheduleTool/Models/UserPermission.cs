//using System.Data.SqlClient;

namespace OM_ScheduleTool.Models
{
    public class UserPermission
    {
        public int FeatureId { get; set; }

        public string FeatureDescription { get; set; }

        public int ActionId { get; set; }

        public string ActionDescription { get; set; }

        public int? ParentAppFeatureId { get; set; }

        public bool AllowSetPermission {get; set;}

        public DateTime UpdateDt { get; set; }
    }

    public class DashboardUserPermission : UserPermission
    {
        public string Link { get; set; }

        public string Icon { get; set; }

        public int AppFeatureGroupId { get; set; }
        public string AppFeatureGroupDescription { get; set; }

        public int SortOrder { get; set; }

    }
}
