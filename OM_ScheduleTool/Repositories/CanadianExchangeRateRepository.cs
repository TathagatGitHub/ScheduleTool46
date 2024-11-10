using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Repositories;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using OM_ScheduleTool.Dapper;
using System.Runtime.ConstrainedExecution;
using System.Numerics;

namespace OM_ScheduleTool.Models
{
    public class CanadianExchangeRateRepository : ICanadianExchangeRateRepository
    {
        private AppContext _context;
        private StoredProcsContext _spcontext;
        private IGeneralRepository _generalRepository;
        private IUserRepository _userRepository;
        private ILogger<PropertyRepository> _logger;
        private IConfiguration _config;

        public CanadianExchangeRateRepository(StoredProcsContext spcontext
            , AppContext context
            , IGeneralRepository generalRepository
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger
            , IConfiguration config
            )
        {
            _spcontext = spcontext;
            _context = context;
            _generalRepository = generalRepository;
            _userRepository = userRepository;

            _logger = logger;
            _config = config;
        }

        public IEnumerable<CanadaActualExchangeRate> GetActualExchangeRateHistory (int QuarterId, int LoggedOnUserId, DateTime? Week)
        {
            // Return Value setup
            ErrorMessage em = new ErrorMessage();

            List<CanadaActualExchangeRate> caer = new List<CanadaActualExchangeRate>();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_CanadianExchangeRate_GetHistory";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                if (Week != null)
                {
                    dbparams.Add("Week", Week, DbType.DateTime);
                }
                caer = FactoryServices.dbFactory.SelectCommand_SP(caer, spName, dbparams);
                if(caer!=null && caer.Count > 0)
                {
                    foreach (var c in caer)
                    {
                        c.Quarter = _generalRepository.GetQuarter(c.QuarterIdVal, LoggedOnUserId);
                    }
                }
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;

                _logger.LogError(LoggedOnUserId, exc.Message);
            }

            return caer;
        }

        public ErrorMessage AddExchangeRate(int LoggedOnUserId, int ClientId, int QuarterId, double Rate)
        {
            // Return Value setup
            ErrorMessage em = new ErrorMessage();

            try
            {
                string MsgSuccess = "Successfully added new exchange rate.";

               
                // ST-946 Code Implementation with Dapper
                string spName = "sp_CanadianExchangeRate_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                dbparams.Add("Rate", Rate, DbType.Decimal);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                // Log Activity 
                _logger.LogInformation(LoggedOnUserId, MsgSuccess);
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;

                _logger.LogError(LoggedOnUserId, exc.Message);
            }
            return em;
        }

        public List<CanadaClientExchangeRateExport> GetCanadianClientExchangeRate(int planYr, int loggedOnUserId)
        {
            List<CanadaClientExchangeRateExport> lstCanadaClientExchangeRateExport = new List<CanadaClientExchangeRateExport>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_CanadianExchangeRate_Export";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("PlanYr", planYr, DbType.Int32);
                lstCanadaClientExchangeRateExport = FactoryServices.dbFactory.SelectCommand_SP(lstCanadaClientExchangeRateExport, spName, dbparams);
                return lstCanadaClientExchangeRateExport;
            }
            catch (Exception exc)
            {
                _logger.LogError(loggedOnUserId, exc.Message);
            }
            return lstCanadaClientExchangeRateExport;
        }
    }


}
