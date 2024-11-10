using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanUserJourney
    {
        [Key]
        [Column(Order = 1)]
        public int MPJourneyId { get; set; }
       
        [Column(Order = 2)]
        public int MediaPlanId { get; set; }

        [Column(Order = 3)]
        public int ClientId { get; set; }
               
        [Column(Order = 4)]
        public int QuarterId { get; set; }     

        [Column(Order = 5)]
        public DateTime CreatedDt { get; set; }     

        [Column(Order = 6)]
        public int CreateBy { get; set; }

        [StringLength(200)]
        [Column(Order = 7)]
        public string ScreenName { get; set; }

        [StringLength(50)]
        [Column(Order = 8)]
        public string ActionTaken { get; set; }
       
        [Column(Order = 9)]
        public string Description { get; set; }
    }
}
