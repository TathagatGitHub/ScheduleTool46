using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{

    public class DataTableParameters
    {
        public List<DataTableColumn> columns { get; set; }
        public int draw { get; set; }
        public int length { get; set; }
        public List<DataOrder> order { get; set; }
        public Search search { get; set; }
        public int start { get; set; }
    }

    public class Search
    {
        public bool Regex { get; set; }
        public string Value { get; set; }
    }

    public class DataTableColumn
    {
        public int Data { get; set; }
        public string Name { get; set; }
        public bool Orderable { get; set; }
        public bool Searchable { get; set; }
        public Search Search { get; set; }
    }

    public class DataOrder
    {
        public int Column { get; set; }
        public string Dir { get; set; }
    }
}
