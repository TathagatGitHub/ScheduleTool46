using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class ProposalNote
    {
        public ProposalNote()
        {
            CreateDt = DateTime.Now;
        }

        [Key]
        public int ProposalNoteId { get; set; }

        [Required]
        public int ProposalId { get; set; }
        public virtual Upfront Upfront { get; set; }

        public int? ParentNoteId { get; set; }

        [Required]
        public string Note { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public int CreatedByUserId { get; set; }
        public virtual User CreatedBy { get; set; }
    }
}
