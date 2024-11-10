using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanDocument
    {
        [Key]
        [Column(Order = 1)]
        public int MediaPlanDocId { get; set; }
        
        [Column(Order = 2)]
        public int MediaPlanId { get; set; }

        [StringLength(200)]
        [Column(Order = 3)]
        public string DocumentName { get; set; }

        [StringLength(500)]
        [Column(Order = 4)]
        public string DocumentPath { get; set; }     

        [Column(Order = 5)]
        public DateTime CreatedDt { get; set; }

        [Column(Order = 6)]
        public int CreateBy { get; set; }

     
    }
}
