using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class DeltaListRepository : IDeltaListRepository
    {
        private AppContext _context;
        private IConfiguration _config;

        public DeltaListRepository(AppContext context, IConfiguration config)
        {
            _context = context;
            _config = config;
        }

        public IEnumerable<DeltaList> GetAllDeltaListChanges()
        {
            return _context.DeltaListChanges.ToList();
        }

    }
}
