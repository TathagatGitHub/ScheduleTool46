using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class CAtoUS_ExchangeRates
    {
        public CAtoUS_ExchangeRates() {
            Week01Rate = 1.0f;
            Week02Rate = 1.0f;
            Week03Rate = 1.0f;
            Week04Rate = 1.0f;
            Week05Rate = 1.0f;
            Week06Rate = 1.0f;
            Week07Rate = 1.0f;
            Week08Rate = 1.0f;
            Week09Rate = 1.0f;
            Week10Rate = 1.0f;
            Week11Rate = 1.0f;
            Week12Rate = 1.0f;
            Week13Rate = 1.0f;
            Week14Rate = 1.0f;
        }
        public int WkNbr { get; set; }

        public Client Client { get; set; }

        public Quarter Quarter { get; set; }

        public float Week01Rate { get; set; }

        public float Week02Rate { get; set; }

        public float Week03Rate { get; set; }

        public float Week04Rate { get; set; }

        public float Week05Rate { get; set; }

        public float Week06Rate { get; set; }

        public float Week07Rate { get; set; }

        public float Week08Rate { get; set; }

        public float Week09Rate { get; set; }

        public float Week10Rate { get; set; }

        public float Week11Rate { get; set; }

        public float Week12Rate { get; set; }

        public float Week13Rate { get; set; }

        public float Week14Rate { get; set; }
    }
}
