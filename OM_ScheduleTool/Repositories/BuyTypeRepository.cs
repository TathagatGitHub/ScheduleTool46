using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using OM_ScheduleTool.Dapper;

namespace OM_ScheduleTool.Models
{

    public class BuyTypeRepository : IBuyTypeRepository
    {
        private AppContext _context;
        private IConfiguration _config;
        private ILogger<PropertyRepository> _logger;

        public BuyTypeRepository(IConfiguration config
            , AppContext context
            , ILogger<PropertyRepository> logger)
        {
            _context = context;
            _config = config;
            _logger = logger;
        }

        public IEnumerable<BuyType> GetBuyTypes(int NetworkId, int LoggedOnUserId, bool Upfront)
        {
            List<BuyType> buytypes = new List<BuyType>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_CreateNewProperty_GetBuyTypes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("Upfront", Upfront, DbType.Boolean);


                buytypes = FactoryServices.dbFactory.SelectCommand_SP(buytypes, spName, dbparams);
                return buytypes;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get buy types. " + exc.Message);

            }
            finally
            {
            }

            return buytypes;
        }

    }
}
