using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;

namespace OM_ScheduleTool.Models
{
    public class LogsRepository : ILogsRepository
    {
        private AppContext _context;

        public LogsRepository()
        {
            
        }
        public LogsRepository(AppContext context)
        {
            _context = context;
        }

        public void WriteLogError(Logs log)
        {
            try
            {
                var user = _context.Users.Where(x => x.UserId == log.UpdatedByUserId).SingleOrDefault();
                if (user != null)
                {
                    _context.Logs.Add(log);
                    _context.SaveChanges();
                }
            }
            catch
            {
            }


        }
    }
}
