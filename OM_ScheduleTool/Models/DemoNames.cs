using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DemoNames
    {
        public DemoNames( int id, string Desc)
        {
            DemoNamesId = id;
            Description = Desc;

        }
        public int DemoNamesId { get; set; }

        public string Description { get; set; }

        public override bool Equals(object Obj)
        {
            DemoNames other = (DemoNames)Obj;
            return (this.DemoNamesId == other.DemoNamesId && this.Description == other.Description);
        }

        public static bool operator ==(DemoNames d1, DemoNames d2)
        {
            if (object.ReferenceEquals(d1, null))
            {
                return object.ReferenceEquals(d2, null);
            }
            return d1.Equals(d2);
        }

        public static bool operator !=(DemoNames d1, DemoNames d2)
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
