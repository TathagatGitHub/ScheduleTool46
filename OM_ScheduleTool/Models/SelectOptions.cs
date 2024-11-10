using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class SelectOptions
    {
        public SelectOptions( string id, string Desc)
        {
            Value = id;
            Label = Desc;

        }
        public string Value { get; set; }

        public string Label { get; set; }

        public override bool Equals(object Obj)
        {
            SelectOptions other = (SelectOptions)Obj;
            return (this.Value == other.Value && this.Label == other.Label);
        }

        public static bool operator ==(SelectOptions d1, SelectOptions d2)
        {
            if (object.ReferenceEquals(d1, null))
            {
                return object.ReferenceEquals(d2, null);
            }
            return d1.Equals(d2);
        }

        public static bool operator !=(SelectOptions d1, SelectOptions d2)
        {
            if (object.ReferenceEquals(d1, null))
            {
                return !object.ReferenceEquals(d2, null);
            }
            return !d1.Equals(d2);
        }

        public override int GetHashCode()
        {
            return 0;
        }
    }
}
