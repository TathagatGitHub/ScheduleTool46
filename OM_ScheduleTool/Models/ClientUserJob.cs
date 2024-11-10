using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class ClientUserJob
    {
        public ClientUserJob()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int ClientUserJobId { get; set; }

        [Required]
        public Client Client { get; set; }


        [Required]
        public int UserId { get; set; }

        [Required]
        public User User { get; set; }

        [Required]
        public int JobId { get; set; }

        [Required]
        public Job Job { get; set; }

        [Required]
        public int PlanYr { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        public int UpdatedByUserId { get; set; }

        public User UpdatedBy { get; set; }
        

    }
}
