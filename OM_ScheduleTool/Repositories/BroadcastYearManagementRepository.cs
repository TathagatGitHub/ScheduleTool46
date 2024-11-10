using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using AppContext = OM_ScheduleTool.Models.AppContext;
using Dapper;
using OM_ScheduleTool.Dapper;

namespace OM_ScheduleTool.Repositories
{
    public class BroadcastYearManagementRepository : IBroadcastYearManagement
    {
        private AppContext _context;
        private IUserRepository _userRepository;
        private ILogger<BroadcastYearManagementRepository> _logger;
        private StoredProcsContext _spcontext;

        public BroadcastYearManagementRepository(StoredProcsContext spcontext, AppContext context
            , IUserRepository userRepository
            , ILogger<BroadcastYearManagementRepository> logger
            )
        {
            _spcontext = spcontext;
            _context = context;
            _userRepository = userRepository;
            _logger = logger;
        }

        public IEnumerable<Quarter> GetBroadcastYear(int Year, int LoggedOnUserId)
        {
            try
            {
                return _context.Quarter
                .Where(x => x.BroadcastYr == Year || x.BroadcastYr == Year + 1).Select(x => new Quarter { QuarterName = x.QuarterName, QtrStartDate = x.QtrStartDate, QtrEndDate = x.QtrEndDate })
                .ToList();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in GetBroadcastYear | Year: " + Year.ToString() + exc.Message);
                return new List<Quarter>();
            }
        }

        public ErrorMessage SaveBroadcastYear(int Year, string Year1QStartWeek, string Year1QEndWeek, string Year2QStartWeek, string Year2QEndWeek, string Year3QStartWeek, string Year3QEndWeek, string Year4QStartWeek, string Year4QEndWeek, int LoggedOnUserId)
        {
            
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                if (string.IsNullOrEmpty(Year1QStartWeek) || string.IsNullOrEmpty(Year2QStartWeek) || string.IsNullOrEmpty(Year3QStartWeek) || string.IsNullOrEmpty(Year4QStartWeek)
                    || string.IsNullOrEmpty(Year1QEndWeek) || string.IsNullOrEmpty(Year2QEndWeek) || string.IsNullOrEmpty(Year3QEndWeek) || string.IsNullOrEmpty(Year4QEndWeek) || Year == 0)
                {
                    err.Success = false;
                    err.ResponseText = "Please select required fields.";
                    return err;
                }

                // ST-946 Code Implementation with Dapper
                string spName = "sp_SaveBroadcastYear";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("Year", Year, DbType.Int32);
                dbparams.Add("Year1QStartWeek", Year1QStartWeek, DbType.Date);
                dbparams.Add("Year1QEndWeek", Year1QEndWeek, DbType.Date);                
                dbparams.Add("Year2QStartWeek", Year2QStartWeek, DbType.Date);
                dbparams.Add("Year2QEndWeek", Year2QEndWeek, DbType.Date);
                dbparams.Add("Year3QStartWeek", Year3QStartWeek, DbType.Date);
                dbparams.Add("Year3QEndWeek", Year3QEndWeek, DbType.Date);
                dbparams.Add("Year4QStartWeek", Year4QStartWeek, DbType.Date);
                dbparams.Add("Year4QEndWeek", Year4QEndWeek, DbType.Date);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32); // HM ST-1280 fixed the db type to int32 from date.
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                return err;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Error in SaveBroadcastYear | Year: " + Year.ToString() + exc.Message);
            }
            return err;

        }
    }
}
