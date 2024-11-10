using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanNote
    {
        [Key]
        [Column(Order = 1)]
        public int MediaPlanNoteId { get; set; }
        
        [Column(Order = 2)]
        public int ParentNoteId { get; set; }
        
        [Column(Order = 3)]
        public int MediaTypeId { get; set; }

        [StringLength(200)]
        [Column(Order = 4)]
        public string Note { get; set; }        

        [Column(Order = 5)]
        public DateTime CreatedDt { get; set; }   

        [Column(Order = 6)]
        public int CreateBy { get; set; }
    }
}
