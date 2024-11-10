using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaPlan
    {
        [Key]
        [Column(Order = 1)]
        public int MediaPlanId { get; set; }

        [StringLength(60)]
        [Column(Order = 2)]
        public string MediaPlanName { get; set; }

        [StringLength(10)]
        [Column(Order = 3)]
        public string PlanStatus { get; set; }

        [StringLength(10)]
        [Column(Order = 4)]
        public string BudgetType { get; set; }

        [Column(Order = 5)]
        public decimal CommissionRate { get; set; }

        [StringLength(10)]
        [Column(Order = 6)]
        public string BudgetPeriod { get; set; }

        [Column(Order = 7)]
        public decimal GrossBudget { get; set; }

        [Column(Order = 8)]
        public decimal CurrentSpend { get; set; }

        [Column(Order = 9)]
        public decimal Percentage { get; set; }

        [Column(Order = 10)]
        public int ClientId { get; set; }

        [Column(Order = 11)]
        public int PlanYear { get; set; }

        [Column(Order = 12)]
        public int QuarterId { get; set; }

        [Column(Order = 13)]
        public int ParentPlanId { get; set; }

        [Column(Order = 14)]
        public DateTime CreateDt { get; set; }

        [Column(Order = 15)]
        public int CreateBy { get; set; }

        [Column(Order = 16)]
        public DateTime ModifiedDate { get; set; }

        [Column(Order = 17)]
        public int ModifiedBy { get; set; }
        public string SelectedBTGroups { get; set; }
        public string SelectedNetworks { get; set; }
        public int LockedByUserId { get; set; }
        public string LockedByUserName { get; set; }
        public DateTime? LockedDt { get; set; }
        public bool CanSee { get; set; }

        public bool CanEdit { get; set; }

        public bool CanDelete { get; set; }

        public bool CanPublish { get; set; }

        public bool CanCopy { get; set; }
        public bool CanShowZero { get; set; }
        public string BroadcastQuarterNbr { get; set; }
        public string QuarterName { get; set; }
    }
}
