namespace OM_ScheduleTool.Models
{
    public class UnAllocatedProposals
    {
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public int NetworkId { get; set; }
        public string NetworkName { get; set; }
        public int QuarterId { get; set; }
        public string QuarterName { get; set; }
        public string ReceivedDate { get; set; }
        public int Spots { get; set; }
        public decimal TotalDollars { get; set; }
        public int Imps { get; set; }
        public decimal CPM { get; set; }
        public int TotalProposals { get; set; }
        public int TotalArchived { get; set; }
        public string SourceFile { get; set; }
        public bool Archived { get; set; }
        public bool Ignored { get; set; }
        public int Deal { get; set; }
        public string SelectionType { get; set; }
        public string SelectionColor { get; set; }
        public string Mode { get; set; }
        public int Revision { get; set; }
        public int isDealProcessed { get; set; }

        public DateTime ProcessedDate { get; set; }

    }
}
