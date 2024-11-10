using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OM_ScheduleTool.Models
{
    public class ScheduleType
    {
        public ScheduleType()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int ScheduleTypeId { get; set; }

        [Required]
        [StringLength(1)]
        public string Code { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public DateTime? CreateDt { get; set; }

        [Required]
        public DateTime? UpdateDt { get; set; }

        [Required]
        public int UpdatedByUserId { get; set; }
    }
}
