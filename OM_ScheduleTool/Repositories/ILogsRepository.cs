using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface ILogsRepository
    {
        void WriteLogError(Logs log);

    }
}
