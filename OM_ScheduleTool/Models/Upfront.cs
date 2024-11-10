using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class UpfrontPermissions : Upfront
    {
        public int CanEditUpfront { get; set; }
        public int CanViewUpfront { get; set; }

        public int CanUpfrontEditUnapprovedProperties { get; set; }
        public int CanUpfrontAddProperty { get; set; }

        public int CanUpfrontUpdateNotes { get; set; }
        public int CanUpfrontViewNotes { get; set; }

        public int CanUpfrontSort { get; set; }

        public int CanUpfrontDeleteSelectedProperties { get; set; }

        public int CanUpfrontApprove { get; set; }
        public int CanUpfrontUnapprove { get; set; }

        public int CanUpfrontProgramChange { get; set; }

        public int CanUpfrontCreateUpfrontExpansion { get; set; }
        public int CanUpfrontManageUpfrontExpansion { get; set; }

        public int CanUpfrontUpdateDealPointData { get; set; }
        public int CanUpfrontExport { get; set; }
        public int CanUpfrontRevisedEstimates { get; set; }
        public int CanUpfrontDRRateRevision { get; set; }
        public int CanUpfrontAutoApprove { get; set; }
        //ST-946
        public string QuarterName { get; set; }
    }

    public class Upfront
    {
        [Key]
        public int UpfrontId { get; set; }

        [Required]
        [ForeignKey("UpfrontType")]
        public int UpfrontTypeId { get; set; }
        public UpfrontType UpfrontType { get; set; }

        [ForeignKey("Network")]
        public int? NetworkId { get; set; }
        public Network Network { get; set; }
        public bool LoggedOnUserInNetwork;

        [ForeignKey("QuarterId")]
        public int? QuarterId { get; set; }
        public Quarter Quarter { get; set; }

        [Required]
        [StringLength(255)]
        public string Name { get; set; }

        [ForeignKey("User")]
        public int? BuyerNameUserId { get; set; }
        public virtual User BuyerName { get; set; }

        /*
        [Required]
        [StringLength(255)]
        public string BuyerAsstName { get; set; }
        */

        [Required]
        [StringLength(1)]
        public string PlanYrType { get; set; }

        [Required]
        public bool Approved { get; set; }

        /*
        [StringLength(255)]
        public string AddedValueLine1 { get; set; }

        [StringLength(255)]
        public string AddedValueLine2 { get; set; }

        public int? AddedValueLine3 { get; set; }

        [StringLength(255)]
        public string AddedValueLine4 { get; set; }

        [StringLength(255)]
        public string AddedValueLine5 { get; set; }
        */

        [StringLength(255)]
        public string Notes { get; set; }

        //[Required]
        //public bool UpfrontLocked { get; set; }

        public DateTime? UpfrontLockedDate { get; set; }

        [ForeignKey("User")]
        public int? UpfrontLockedByUserId { get; set; }
        public virtual User UpfrontLockedBy { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [ForeignKey("UpdatedByUser")]
        public int? UpdatedByUserId { get; set; }
        public virtual User UpdatedByUser { get; set; }

        public string AdminTextNotes { get; set; }

        public string TextNote { get; set; }
        
    }
}
