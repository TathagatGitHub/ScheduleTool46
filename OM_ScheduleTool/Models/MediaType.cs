using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class MediaType
    {
        [Key]
        [Column(Order = 1)]
        public int MediaTypeId { get; set; }

        [StringLength(255)]
        [Column(Order = 2)]
        public string MediaTypeCode { get; set; }

        [StringLength(255)]
        [Column(Order = 3)]
        public string MediaTypeName { get; set; }

        [StringLength(1)]
        [Column(Order = 4)]
        public string MediaCategory { get; set; }

        [Column(Order = 5)]
        public int SortOrder { get; set; }

        [Column(Order = 6)]
        public DateTime CreateDt { get; set; }

        [Column(Order = 7)]
        public DateTime UpdateDt { get; set; }

        [Column(Order = 8)]
        public User UpdatedBy { get; set; }
    }
}
