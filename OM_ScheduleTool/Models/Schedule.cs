using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Schedule
    {
        public Schedule()
        {
            ProposalVer = 0;
            Approved = true;

            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
            //ScheduleType = new ScheduleType();
            //Client= new Client();
            //LockedByUser = new User();
            //UpdatedBy = new User();

        }

        public int ScheduleId { get; set; }

        [Required]
        public int ScheduleTypeId { get; set; }
        public virtual ScheduleType ScheduleType { get; set; }

        public int? ParentScheduleId { get; set; }

        [Required]
        public int ProposalVer { get; set; }

        [Required]
        public int ClientId { get; set; }
        public virtual Client Client { get; set; }

        [Required]
        [StringLength(1)]
        public string PlanYrType { get; set; }

        /*
        [Required]
        public int DemographicSettingsPerQtrId { get; set; }
        public virtual DemographicSettingsPerQtr DemographicSettingsPerQtr { get; set; }
        */

        [Required]
        [StringLength(255)]
        public string ScheduleName { get; set; }

        [Required]
        public User BuyerUser { get; set; }

        public User BuyerAsstUser { get; set; }

        [Required]
        public bool Approved { get; set; }

        [StringLength(255)]
        public string AddedValue1 { get; set; }

        [StringLength(255)]
        public string AddedValue2 { get; set; }

        [StringLength(255)]
        public string AddedValue3 { get; set; }

        [StringLength(255)]
        public string AddedValue4 { get; set; }

        [StringLength(255)]
        public string AddedValue5 { get; set; }

        [StringLength(255)]
        public string Notes { get; set; }

        public DateTime? LockedDt { get; set; }

        public int? LockedByUserId { get; set; }
        public virtual User LockedByUser { get; set; }

        public string AdminTextNotes { get; set; }

        public string TextNote { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public User UpdatedBy { get; set; }
       
        
        public int? UpdatedByUserId { get; set; }
        [NotMapped]
        public int? BuyerAsstUserId { get; set; }
        [NotMapped]
        public int? BuyerUserId { get; set; }
        [NotMapped]
        public string UpdatedByName { get; set; }
    }

    public class ScheduleSummary : Schedule
    {
        public int CalendarYr { get; set; }

        public int BroadcastYr { get; set; }

        public string DemoName { get; set; }

        public int CountryId { get; set; }

        public int NetworkId { get; set; }

        public string NetworkName { get; set; }

        public int BroadcastQuarterNbr { get; set; }

        public string QtrName { get; set; }

        public string CreateDtString
        {
            get {
                return CreateDt.ToString("MM/dd/yyyy hh:mm tt");
            }
        }

        public string UpdateDtString
        {
            get
            {
                return UpdateDt.ToString("MM/dd/yyyy hh:mm tt");
            }
        }

        public int PlanYr
        {
            get
            {
                if (PlanYrType == "B")
                {
                    return BroadcastYr;
                }
                else
                {
                    return CalendarYr;
                }
            }
        }

        public string PlanYearTypeString
        {
            get
            {
                return (PlanYrType == "B"? "Broadcast" : "Calendar");
            }
        }
    }

    public class SchedulePermissions : ScheduleSummary
    {
        public int CanEditSchedule { get; set; }
        public int CanViewSchedule { get; set; }
        public DateTime? ProposalLockedDate { get; set; } //ST-724

        public string ProposalLockedByName { get; set; } //ST-724
        [NotMapped]
        public bool EditButtonHidden { get; set; } //ST-724
        [NotMapped]
        public bool EditDDLButtonHidden { get; set; } //ST-724
        [NotMapped]
        public bool IsFullProposalLocked { get; set; } //ST-724
    }

}
