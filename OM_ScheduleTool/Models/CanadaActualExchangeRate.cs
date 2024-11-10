using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class CanadaActualExchangeRate
    {
        public CanadaActualExchangeRate()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        [Key]
        public int CanadaActualExchangeRateId { get; set; }

        [Required]
        public DateTime DayDate { get; set; }

        [Required]
        [Column(TypeName = "Money")]
        public decimal Rate { get; set; }

        [Required]
        public Quarter Quarter { get; set; }

        [Required]
        public int WkNbr { get; set; }

        [Required]
        public DateTime WeekDate { get; set; }

        [Column(TypeName = "Money")]
        public decimal WkAvgRate { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public User UpdatedBy { get; set; }
        [NotMapped]
        public int QuarterIdVal { get; set; }

    }
}
