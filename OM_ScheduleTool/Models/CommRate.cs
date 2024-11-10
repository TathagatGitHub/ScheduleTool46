using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{

    public class ClientCommissionRateExport
    {
        public string ClientName { get; set;  }
        public int Year { get; set; }
        public string Quarter { get; set; }
        public string Week { get; set; }
        public decimal Rate { get; set; }
        public string Country { get; set; }
    }



    public class CommRate
    {
        public int CommRateId { get; set; }

        public Client Client { get; set; }

        public Quarter Quarter { get; set; }

        public decimal Week01Rate { get; set; }

        public decimal Week02Rate { get; set; }

        public decimal Week03Rate { get; set; }

        public decimal Week04Rate { get; set; }

        public decimal Week05Rate { get; set; }

        public decimal Week06Rate { get; set; }

        public decimal Week07Rate { get; set; }

        public decimal Week08Rate { get; set; }

        public decimal Week09Rate { get; set; }

        public decimal Week10Rate { get; set; }

        public decimal Week11Rate { get; set; }

        public decimal Week12Rate { get; set; }

        public decimal Week13Rate { get; set; }

        public decimal Week14Rate { get; set; }

        public DateTime CreateDt { get; set; }

        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }
    }
}
