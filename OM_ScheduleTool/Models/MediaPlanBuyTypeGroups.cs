using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanBuyTypeGroups
    {
        public Int32 BuyTypeGroupId { get; set; }
        public string BuyTypeGroup { get; set; }
        public string Description { get; set; }
        public Int32 DisplayOrder { get; set; }
        public DateTime CreateDt { get; set; }
        public Int32 CreatedByUserId { get; set; }
    }
}
