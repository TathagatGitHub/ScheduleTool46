using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanDemo
    {
        [Key]
        [Column(Order = 1)]
        public int MediaPlanDemoId { get; set; }
      
        [Column(Order = 2)]
        public int MediaPlanId { get; set; }

        [StringLength(20)]
        [Column(Order = 3)]
        public string BuyTypeGroup { get; set; }      

        [Column(Order = 4)]
        public int DemoId { get; set; }
        public string DemoName { get; set; }
       
    }
}
