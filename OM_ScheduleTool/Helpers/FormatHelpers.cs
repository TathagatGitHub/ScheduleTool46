using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Helpers
{
    public class FormatHelpers
    {
    }

    public class DataTableFormKeyParsers : FormatHelpers
    {       
        public int Id { get; set; }
        public string Name { get; set; }

        public bool Valid { get; set; }

        public DataTableFormKeyParsers (string Key)
        {
            // Here is a sample string we are trying to parse.
            // data[81552][propertyName]

            Valid = true;
            Id = 0;
            Name = "";

            string[] KeySplit = Key.Split('[');
            if (KeySplit.Length < 3)
            {
                Valid = false;
            }
            else
            {
                try
                {
                    Id = int.Parse(KeySplit[1].Replace("]", ""));
                }
                catch (Exception)
                {
                    Valid = false;
                }

                try
                {
                    Name = KeySplit[2].Replace("]", "");
                }
                catch (Exception)
                {
                    Valid = false;
                }
            }

        }
    }
}
