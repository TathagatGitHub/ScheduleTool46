using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class JobTitleTypeRepository : IJobTitleTypeRepository
    {
        private AppContext _context;

        public JobTitleTypeRepository(AppContext context)
        {
            _context = context;
        }

        public IEnumerable<JobTitleType> GetAllJobTitleTypes()
        {
            return _context.JobTitleTypes.ToList();
        }
    }
}
