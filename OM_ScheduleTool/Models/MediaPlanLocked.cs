using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanLocked
    {
        public string ImageUrl { get; set; }
        public int MediaPlanId { get; set; }        
        public string MediaPlanName { get; set; }        
        public int LockedByUserId { get; set; }
        public string LockedByUserName { get; set; }
        public DateTime? LockedDt { get; set; }
        public DateTime ModifiedDate { get; set; }        
       
    }
}
