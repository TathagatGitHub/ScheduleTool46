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
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace OM_ScheduleTool.Models
{
    public class ClientCommissionRepository : IClientCommissionRepository
    {
        private StoredProcsContext _spcontext;
        private IUserRepository _userRepository;
        private ILogger<PropertyRepository> _logger;
        private IConfiguration _config;

        public ClientCommissionRepository(StoredProcsContext spcontext
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger
            , IConfiguration config
            )
        {
            _spcontext = spcontext;
            _userRepository = userRepository;

            _logger = logger;
            _config = config;
        }

        public List<ExportPostLog> GenerateExportPostLog(int ClientId, int NetworkId, DateTime DateFrom, DateTime DateTo, int LoggedOnUserId)
        {
            List<ExportPostLog> na = new List<ExportPostLog>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ClientCommission_GetPostLogExport";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("DateFrom", DateFrom, DbType.DateTime);
                dbparams.Add("DateTo", DateTo, DbType.DateTime);

                na = FactoryServices.dbFactory.SelectCommand_SP(na, spName, dbparams);
                return na;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc.Message);
                throw exc;
            }
        }

       // ST-946 Code Implementation with Dapper
        public ErrorMessage SaveClientCommission(int LoggedOnUserId,
         int ClientId,
         int QuarterId,
         string Anniversary,
         bool Tiered,
         string CommStructure,
         string Rate,
         string StartWeekNo,
         string EndWeekNo,
         string Week01Rate,
         string Week02Rate,
         string Week03Rate,
         string Week04Rate,
         string Week05Rate,
         string Week06Rate,
         string Week07Rate,
         string Week08Rate,
         string Week09Rate,
         string Week10Rate,
         string Week11Rate,
         string Week12Rate,
         string Week13Rate,
         string Week14Rate
         )
        {
            // Return Value setup
            ErrorMessage em = new ErrorMessage();
            int StartWeekNum = 1;
            int EndWeekNum = 14;

            try
            {
                StartWeekNum = int.Parse(StartWeekNo);
            }
            catch
            {
                StartWeekNum = 1;
            }
            try
            {
                EndWeekNum = int.Parse(EndWeekNo);
            }
            catch
            {
                EndWeekNum = 14;
            }
            try
            {
                string MsgSuccess = "Successfully saved new client commission rates.";

                // This is where the new exchange rate is added to the database.  If it already exists, it will be updated instead.

                string spName = "sp_ClientCommission_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                DateTime dtAnniversary;
                if (DateTime.TryParse(Anniversary, out dtAnniversary) == true)
                {
                    dbparams.Add("Anniversary", Anniversary, DbType.DateTime);
                }
                dbparams.Add("Tiered", Tiered, DbType.Boolean);
                dbparams.Add("CommStructure", CommStructure, DbType.String);

                if (!string.IsNullOrEmpty(Rate) && Convert.ToDecimal(Rate) > 0)
                    dbparams.Add("Rate", decimal.Parse(Rate) / ((decimal)100), DbType.Decimal);

                if (StartWeekNum <= 1 && EndWeekNum >= 1)
                    if (!string.IsNullOrEmpty(Week01Rate) && Convert.ToDecimal(Week01Rate) > 0)
                        dbparams.Add("Week01Rate", decimal.Parse(Week01Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 2 && EndWeekNum >= 2)
                    if (!string.IsNullOrEmpty(Week02Rate) && Convert.ToDecimal(Week02Rate) > 0)
                        dbparams.Add("Week02Rate", decimal.Parse(Week02Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 3 && EndWeekNum >= 3)
                    if (!string.IsNullOrEmpty(Week03Rate) && Convert.ToDecimal(Week03Rate) > 0)
                        dbparams.Add("Week03Rate", decimal.Parse(Week03Rate) / ((decimal)100), DbType.Decimal);

                if (StartWeekNum <= 4 && EndWeekNum >= 4)
                    if (!string.IsNullOrEmpty(Week04Rate) && Convert.ToDecimal(Week04Rate) > 0)
                        dbparams.Add("Week04Rate", decimal.Parse(Week04Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 5 && EndWeekNum >= 5)
                    if (!string.IsNullOrEmpty(Week05Rate) && Convert.ToDecimal(Week05Rate) > 0)
                        dbparams.Add("Week05Rate", decimal.Parse(Week05Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 6 && EndWeekNum >= 6)
                    if (!string.IsNullOrEmpty(Week06Rate) && Convert.ToDecimal(Week06Rate) > 0)
                        dbparams.Add("Week06Rate", decimal.Parse(Week06Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 7 && EndWeekNum >= 7)
                    if (!string.IsNullOrEmpty(Week07Rate) && Convert.ToDecimal(Week07Rate) > 0)
                        dbparams.Add("Week07Rate", decimal.Parse(Week07Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 8 && EndWeekNum >= 8)
                    if (!string.IsNullOrEmpty(Week08Rate) && Convert.ToDecimal(Week08Rate) > 0)
                        dbparams.Add("Week08Rate", decimal.Parse(Week08Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 9 && EndWeekNum >= 9)
                    if (!string.IsNullOrEmpty(Week09Rate) && Convert.ToDecimal(Week09Rate) > 0)
                        dbparams.Add("Week09Rate", decimal.Parse(Week09Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 10 && EndWeekNum >= 10)
                    if (!string.IsNullOrEmpty(Week10Rate) && Convert.ToDecimal(Week10Rate) > 0)
                        dbparams.Add("Week10Rate", decimal.Parse(Week10Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 11 && EndWeekNum >= 11)
                    if (!string.IsNullOrEmpty(Week11Rate) && Convert.ToDecimal(Week11Rate) > 0)
                        dbparams.Add("Week11Rate", decimal.Parse(Week11Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 12 && EndWeekNum >= 12)
                    if (!string.IsNullOrEmpty(Week12Rate) && Convert.ToDecimal(Week12Rate) > 0)
                        dbparams.Add("Week12Rate", decimal.Parse(Week12Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 13 && EndWeekNum >= 13)
                    if (!string.IsNullOrEmpty(Week13Rate) && Convert.ToDecimal(Week13Rate) > 0)
                        dbparams.Add("Week13Rate", decimal.Parse(Week13Rate) / ((decimal)100), DbType.Decimal);
                if (StartWeekNum <= 14 && EndWeekNum >= 14)
                    if (!string.IsNullOrEmpty(Week14Rate) && Convert.ToDecimal(Week14Rate) > 0)
                        dbparams.Add("Week14Rate", decimal.Parse(Week14Rate) / ((decimal)100), DbType.Decimal);

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

        public List<ClientCommissionRateExport> GetClientCommissionRateExport(int CountryId, string ClientId, int QuarterId, int loggedOnUserId)
        {
            List<ClientCommissionRateExport> objListClientCommissionRateExport = new List<ClientCommissionRateExport>();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ClientCommissionRate_Export";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);

                objListClientCommissionRateExport = FactoryServices.dbFactory.SelectCommand_SP(objListClientCommissionRateExport, spName, dbparams);

                return objListClientCommissionRateExport;
            }
            catch (Exception exc)
            {
                _logger.LogError(loggedOnUserId, exc.Message);
            }
            return objListClientCommissionRateExport;


        }
    }

}
