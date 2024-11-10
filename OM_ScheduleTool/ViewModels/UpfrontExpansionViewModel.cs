using OM_ScheduleTool.Models;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace OM_ScheduleTool.ViewModels
{
    public class UpfrontExpansionViewModel : IValidatableObject
    {
        public User LoggedOnUser { get; set; }

        // We might not need both but I'm saving them anyway for faster access so we
        // don't always have to search from the UpfrontExpansionTrackingId of the current 
        // quarter
        public int UpfrontId { get; set; }
        public int UpfrontExpansionTrackingId { get; set; }
        public int CurrentQuarterNbr { get; set; }

        //Here is where you can access data about each quarter
        public UpfrontExpansionQuarters Quarter1 { get; set; }
        public UpfrontExpansionQuarters Quarter2 { get; set; }
        public UpfrontExpansionQuarters Quarter3 { get; set; }
        public UpfrontExpansionQuarters Quarter4 { get; set; }
        
        // This is so I can avoid having to look at each other to check if it's the current one.
        public UpfrontExpansionQuarters CurrentQuarter { get; set; }
        public UpfrontExpansionTracking CurrentUpfrontExpansionTracking { get; set; }
        public List<UpfrontExpansionTrackingLine> UpfrontExpansionTrackingLines { get; set; }

        #region Trade
        public int ClientFromId { get; set; }
        public int ClientToId { get; set; }
        public IEnumerable<Client> ClientList { get; set; }              

        [Required(ErrorMessage="Amount is required"), DataType(DataType.Currency)] 
        public decimal ? TradeAmount { get; set; }
        #endregion 
        public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
        {
            if (ClientFromId == ClientToId)
            {
                yield return new ValidationResult("You may not trade between the same client.");
            }
        }
    }
}
