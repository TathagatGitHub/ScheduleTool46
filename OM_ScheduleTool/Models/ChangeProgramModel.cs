namespace OM_ScheduleTool.Models
{
    public class ChangeProgramModel
    {
        public int PropertyId { get; set; }
        public string Message { get; set; }
        public bool CurrentlyApproved { get; set; }
        public bool AutoApprove { get; set; }
    }
}
