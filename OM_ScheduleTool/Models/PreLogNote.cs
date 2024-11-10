using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    [NotMapped]
    public class PreLogNote
    {      
        public int PreLogNoteId { get; set; }
        public int PreLogId { get; set; }
        public int? ParentNoteId { get; set; }
        public string Note { get; set; }
        public DateTime CreateDt { get; set; }
        public int CreatedByUserId { get; set; }
        public string DisplayName { get; set; }
    }
}
