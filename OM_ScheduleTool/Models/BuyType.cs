using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class BuyType
    {
        public BuyType()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int BuyTypeId { get; set; }

        [Required]
        public string BuyTypeCode { get; set; }

        [Required]
        public string BuyTypeDescription { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [Required]
        public bool UpfrontType { get; set; }

        [Required]
        public bool RemnantType { get; set; }

        [Required]
        public bool IsLowUnassigned { get; set; }

        [Required]
        public bool IsMidUnassigned { get; set; }

        public bool DRType { get; set; }

        public bool IsAutoApprove { get; set; }

        public bool IsAllowUnapprove { get; set; }

        public bool IsZeroRate { get; set; }

        public bool IsZeroImp { get; set; }

        public bool IsAddADU { get; set; }

        [Required]
        public DateTime? CreateDt { get; set; }

        [Required]
        public DateTime? UpdateDt { get; set; }

        [Required]
        [ForeignKey("UpdatedBy")]
        public int UpdatedByUserId { get; set; }
        public virtual User UpdatedBy { get; set; }

    }

    public class BuyTypesAndDemosByNetworks
    {
        public string BuyType { get; set; }
        public string StdNetName { get; set; }
        public string DemoName { get; set; }

    }
}
