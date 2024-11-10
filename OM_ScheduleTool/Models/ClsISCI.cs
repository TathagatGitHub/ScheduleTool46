using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    [NotMapped]
    public class ClsISCI
    {

        public string ISCI { get; set; }
        public DateTime DateStart { get; set; }
        public DateTime DateEnd { get; set; }
        public int Length { get; set; }
        public string MediaType { get; set; }
    }
}
