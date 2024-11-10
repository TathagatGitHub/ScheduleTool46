namespace OM_ScheduleTool.Models
{
    public class ProposalNetworkModel
    {
        public int ScheduleId { get; set; }
        public int NetworkId {get;set;}
        public string NetworkName { get;set;}  
        public int LockedByUserId { get; set; }
        public string LockedByUserName { get; set; }
        public DateTime? LockedDt { get; set; }
        public string SelectionDisabled { get; set; }
        public string CheckedVal { get; set; }
        public string[] ScheduleIdList { get; set; }
        public string[] NetworkIdList { get; set; }
        public string TotalNetworks { get; set; }
        public bool IsFullProposalLocked { get; set; }
        public bool Success { get; set; }
        public int ResponseCode { get; set; }
        public string ResponseText { get; set; }
    }
}
