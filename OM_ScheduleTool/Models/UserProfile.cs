using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class UserProfile
    {
        public UserProfile ()
        {
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int UserProfileId { get; set; }

        [Required]
        public int UserProfileUserId { get; set; }
        public virtual User UserProfileUser { get; set; }

        [Required]
        [StringLength(255)]
        public string ProfileKey { get; set; }

        [Required]
        [StringLength(2000)]
        public string ProfileValue { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }
    }
}
