using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DREtimateVerions
    {
        //public DREtimateVerions()
        //{
        //    NetworkId = 0;
        //    NetworkName = "";
        //    QuarterName = "";
        //    EstimateVersion = 0;
        //    VersionDate = "";
        //}

        public int NetworkId { get; set; }
        public string NetworkName { get; set; }
        public string QuarterName { get; set; }
        public int EstimateVersion { get; set; }
        public string VersionDate { get; set; }
    }
}

