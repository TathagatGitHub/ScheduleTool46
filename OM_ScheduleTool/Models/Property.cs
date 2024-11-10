using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class Property
    {
        public Property()
        {
            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;

            Monday = false;
            Tuesday = false;
            Wednesday = false;
            Thursday = false;
            Friday = false;
            Saturday = false;
            Sunday = false;
        }

        public override bool Equals(object Obj)
        {
            try
            {
                Property other = (Property)Obj;
                if (other == null)
                {
                    return false;
                }
                return (this.PropertyId == other.PropertyId && this.PropertyName == other.PropertyName);
            }
            catch
            {
                return false;
            }
        }

        public static bool operator ==(Property d1, Property d2)
        {
            if (object.ReferenceEquals(d1, null))
            {
                return object.ReferenceEquals(d2, null);
            }
            return d1.Equals(d2);
        }

        public static bool operator !=(Property d1, Property d2)
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

        public int PropertyId { get; set; }

        /* Not sure what this is used for */
        // public int? OrigPropId { get; set; }

        /* Not sure what this is used for */
        public int? Iteration { get; set; }

        [Required]
        public int NetworkId { get; set; }
        public virtual Network Network { get; set; }

        [Required]
        public int QuarterId { get; set; }
        public virtual Quarter Quarter { get; set; }

        [StringLength(255)]
        [Required]
        public string PropertyName { get; set; }

        [Required]
        public bool Combo { get; set; }

        [Required]
        public int DayPartId { get; set; }
        public virtual DayPart DayPart { get; set; }

        [Required]
        public bool Monday { get; set; }

        [Required]
        public bool Tuesday { get; set; }

        [Required]
        public bool Wednesday { get; set; }

        [Required]
        public bool Thursday { get; set; }

        [Required]
        public bool Friday { get; set; }

        [Required]
        public bool Saturday { get; set; }

        [Required]
        public bool Sunday { get; set; }

        [Required]
        public TimeSpan StartTime { get; set; }

        [Required]
        public TimeSpan EndTime { get; set; }

        [Required]
        public DateTime CreateDt { get; set; }

        [Required]
        public DateTime UpdateDt { get; set; }

        [Required]
        public int UpdatedByUserId { get; set; }
    }
}