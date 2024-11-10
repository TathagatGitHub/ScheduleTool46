using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class CanadaClientExchangeRateExport
    {
        public string Client { get; set; }

        public int Year { get; set; }

        public string Quarter { get; set; }

        public decimal Rate { get; set; }
    }

    public class CanadaClientExchangeRate
    {
        [Key]
        public int CanadaClientExchangeRateId { get; set; }

        [Required]
        [ForeignKey("Client")]
        public int ClientId { get; set; }
        public Client Client { get; set; }

        [Required]
        [ForeignKey("Quarter")]
        public int QuarterId { get; set; }
        public Quarter Quarter { get; set; }

        [Required]
        public int WkNbr { get; set; }

        [Required]
        public DateTime WeekDate { get; set; }

        [Column(TypeName = "Money")]
        public decimal Rate { get; set; }

        [Required]
        public bool Actualized { get; set; }

        [Column(TypeName = "Money")]
        public decimal PlanningRate { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [ForeignKey("UpdatedByUser")]
        public int? UpdatedByUserId { get; set; }
        public virtual User UpdatedByUser { get; set; }

    }
}
