using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Logs
    {
        public Logs()
        {
            Application = "";
            CreateDt = DateTime.Now;
        }

        [Key]
        public int LogsId {get; set;}

        [Required]
        [StringLength(300)]
        public string Application { get; set; }

        [Required]
        public LogLevel LogType { get; set; }

        [Required]
        public string Message { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        public int UpdatedByUserId { get; set; }
        public virtual User UpdatedBy { get; set; }
    }
}
