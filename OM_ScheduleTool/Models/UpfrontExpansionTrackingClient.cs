using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class UpfrontExpansionTrackingClient : IComparable<UpfrontExpansionTrackingClient>
    {
        public int UpfrontExpansionTrackingClientId { get; set; }

        public Client Client { get; set; }

        [DisplayFormat(DataFormatString = "{0:c2}")]
        public decimal ClientUSpend { get; set; }      

        public int CompareTo(UpfrontExpansionTrackingClient obj)
        {
            return String.Compare(this.Client.ClientName, obj.Client.ClientName);

        }

    }

}
