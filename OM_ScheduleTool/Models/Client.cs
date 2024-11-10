using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class ClientAlias
    {
        public string Country { get; set; }
        public string ClientName { get; set; }
        public string Alias { get; set; }
    }

    public class Client
    {
        public Client()
        {
            New = false;
        }

        public int ClientId { get; set; }

        public int PlanYr { get; set; }

        [StringLength(255)]
        public string ClientName { get; set; }

        [StringLength(255)]
        public string CommStructure { get; set; }

        [Required]
        public int CountryId { get; set; }
        public virtual Country Country { get; set; }

        public string ClientDisplay {
            get
            {
                try
                {
                    if (Country != null)
                    {
                        return ClientName + " " + (Country.CountryShort == "CA" ? Country.CountryLong : "");
                    }
                    else
                    {
                        return ClientName;
                    }
                }
                catch
                {
                    return ClientName;
                }
            }
        }

        [Required]
        public bool New { get; set; }

        public bool? Tiered { get; set; }

        public DateTime? AnnivDate { get; set; }

        public bool? Active { get; set; }

        public DateTime CreateDt { get; set; }

        public DateTime UpdateDt { get; set; }

        public User UpdatedBy { get; set; }

        public bool? IsTempCommStructure { get; set; }

        public string PaddedClientName
        {
            get {
                try
                {
                    if (Country != null)
                    {
                        return ClientName.PadRight(30, ' ') +
                            Country.CountryShort.PadRight(3) +
                            (New == true ? "NEW  " : "     ");
                    }
                    else
                    {
                        return ClientName;
                    }
                }
                catch
                {
                    return ClientName;
                }
            }
        }
        public int? ContractClientId { get; set; } = null!;
        public bool IsDigital { get; set; }
        public bool IsLocal { get; set; }
        public bool IsPodcast { get; set; }
    }
}
