using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class JobTitleType
    {

        public JobTitleType()
        {

        }

        public JobTitleType(JobTitleType CopyJobTitleType)
        {
            this.JobTitleTypeId = CopyJobTitleType.JobTitleTypeId;
            this.Description = CopyJobTitleType.Description;
            this.SortOrder = CopyJobTitleType.SortOrder;
            this.CreateDt = CopyJobTitleType.CreateDt;
            this.UpdateDt = CopyJobTitleType.UpdateDt;

        }

        [Key]
        public int JobTitleTypeId {get; set;}

        [Required]
        [StringLength(255)]
        public string Description { get; set; }

        [Required]
        public int SortOrder { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

    }
}
