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
using AppContext = OM_ScheduleTool.Models.AppContext;
using Dapper;
using OM_ScheduleTool.Dapper;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using static NuGet.Client.ManagedCodeConventions;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.Xml.Linq;
namespace OM_ScheduleTool.Repositories
{
    public class UpfrontRepository : UpfrontRemnantRepository, IUpfrontRepository
    {
        public UpfrontRepository(AppContext context
            , StoredProcsContext spcontext
            , IUserRepository userRepository
            , IPropertyRepository propertyRepository
            , ILogger<PropertyRepository> logger) : base(context, spcontext, userRepository, propertyRepository, logger)
        {
            _upfrontTypeId = 2;
        }

        public int GetUpfrontLockCount()
        {
            return GetLockCount();
        }

        public IEnumerable<UpfrontPermissions> GetUpfrontByNetwork(int LoggedOnUserId, int NetworkId, int Year)
        {
            return GetUpfrontRemnantByNetwork(LoggedOnUserId, NetworkId, Year);
        }

        public Models.User IsLocked(int LoggedOnUserId, int NetworkId, int QuarterId, int UpfrontTypeId)
        {
            Upfront upfront = GetUpfront(LoggedOnUserId, NetworkId, QuarterId, UpfrontTypeId);
            if (upfront != null)
            {
                return upfront.UpfrontLockedBy;
            }
            else
            {
                return null;
            }
        }

        public Upfront GetUpfrontById(int LoggedOnUserId, int UpfrontId)
        {
            return GetUpfrontRemnantById(LoggedOnUserId, UpfrontId);
        }

        public UpfrontLine GetUpfrontLineById(int LoggedOnUserId, int UpfrontLineId)
        {
            return _context.UpfrontLines
                .Include(r => r.Rate)
                    .ThenInclude(p => p.Property)
                        .ThenInclude(dt => dt.DayPart)
                .Include(rd => rd.Rate)
                    .ThenInclude(dsq => dsq.DemographicSettingsPerQtr)
                        .ThenInclude(d => d.Demo)
                .Include(br => br.Rate)
                    .ThenInclude(b => b.BuyType)
                .Include(dbr => dbr.Rate)
                    .ThenInclude(db => db.DoNotBuyType)
                .Include(cr => cr.Rate)
                   .ThenInclude(c=>c.MandateClient)
                .Where(u => u.UpfrontLineId == UpfrontLineId)
                .FirstOrDefault();
        }

        public IEnumerable<DemoNames> GetDemoNames(int LoggedOnUserId, int UpfrontId)
        {
            List<DemoNames> lds = new List<DemoNames>();
            List<DemosModel> lds2 = new List<DemosModel>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetDemoNames";
                DynamicParameters dbparam = new DynamicParameters();
                dbparam.Add("UpfrontId", UpfrontId, System.Data.DbType.Int32);
                dbparam.Add("LoggedOnUserId", LoggedOnUserId, System.Data.DbType.Int32);
                lds2 = FactoryServices.dbFactory.SelectCommand_SP(lds2, spName, dbparam);
                if (lds2.Any())
                {
                    foreach (DemosModel dm in lds2)
                    {
                        lds.Add(new DemoNames(dm.DemographicSettingsId, dm.DemoName));
                    }
                }

                //DbConnection conn = _spcontext.Database.GetDbConnection();
                //if (conn.State == ConnectionState.Closed)
                //{
                //    conn.Open();
                //}



                //    DbCommand command = conn.CreateCommand();
                //    command.CommandText = "sp_Upfront_GetDemoNames ";
                //    command.CommandType = CommandType.StoredProcedure;

                //    SqlParameter paramUpfrontId = new SqlParameter("@UpfrontId", SqlDbType.Int);
                //    paramUpfrontId.Value = UpfrontId;
                //    command.Parameters.Add(paramUpfrontId);

                //    SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //    paramLoggedOnUserId.Value = LoggedOnUserId;
                //    command.Parameters.Add(paramLoggedOnUserId);

                //    using (DbDataReader reader = command.ExecuteReader())
                //    {
                //        while (reader.Read())
                //        {
                //            DemoNames ds = new DemoNames((int)reader["DemographicSettingsId"], reader["DemoName"].ToString());
                //            /*
                //            DemographicSettings ds = new DemographicSettings();
                //            if (reader["AgeMax"] != DBNull.Value)
                //                ds.AgeMax = (int)reader["AgeMax"];
                //            if (reader["AgeMin"] != DBNull.Value)
                //                ds.AgeMin = (int)reader["AgeMin"]; ;
                //            if (reader["CountryId"] != DBNull.Value)
                //                ds.CountryId = (int)reader["CountryId"];
                //            if (reader["DemographicSettingsId"] != DBNull.Value)
                //                ds.DemographicSettingsId = (int)reader["DemographicSettingsId"];
                //            if (reader["DemoName"] != DBNull.Value)
                //                ds.DemoName = reader["DemoName"].ToString();
                //            if (reader["gender"] != DBNull.Value)
                //                ds.Gender = reader["gender"].ToString();
                //            if (reader["SortOrder"] != DBNull.Value)
                //                ds.SortOrder = (int) reader["SortOrder"];
                //            if (reader["UpdatedByUserId"] != DBNull.Value)
                //                ds.UpdatedByUserId = (int)reader["UpdatedByUserId"];
                //            if (reader["UpdateDt"] != DBNull.Value)
                //                ds.UpdateDt = DateTime.Parse(reader["UpdateDt"].ToString());
                //            if (reader["CreateDt"] != DBNull.Value)
                //                ds.CreateDt = DateTime.Parse(reader["CreateDt"].ToString());
                //            */

                //            if (lds.Exists(x => x.Description == ds.Description) == false)
                //            {
                //                lds.Add(ds);
                //            }

                //        }
                //    };
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository.GetDemoNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
                //conn.Close();
            }

            return lds;
        }

        public IEnumerable<string> GetApproved(int LoggedOnUserId, int UpfrontId)
        {
            List<string> lds = new List<string>();
            DbConnection conn = _spcontext.Database.GetDbConnection();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetApproved";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository.GetDemoNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            return lds;
        }
        public List<Models.Property> GetPropertyNames(int LoggedOnUserId, int UpfrontId)
        {
            List<Models.Property> lds = new List<Models.Property>();
            
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetPropertyNames";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetPropertyNames. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
              //  conn.Close();
            }

            return lds;
        }

        public IEnumerable<DateTime> GetStartTimes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetStartTimes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetStartTimes. | " + exc.Message + " | " + exc.StackTrace);
            }
            return lds;
        }

        public IEnumerable<DateTime> GetEndTimes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetEndTimes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetEndTimes. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DayPart> GetDPs(int LoggedOnUserId, int UpfrontId, string PropertyNames)
        {
            List<DayPart> lds = new List<DayPart>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetDP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetDP. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
                //conn.Close();
            }

            return lds;
        }

        public IEnumerable<string> GetOMDPs(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<string> lds = new List<string>();
           
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetOMDP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetOMDP. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<BuyType> GetBuyTypes(int LoggedOnUserId, int UpfrontId, string PropertyNames)
        {
            List<BuyType> lbt = new List<BuyType>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetBuyTypes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lbt = FactoryServices.dbFactory.SelectCommand_SP(lbt, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetBuyTypes. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lbt;
        }

        public IEnumerable<string> GetLens(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetSpotLen";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetSpotLen. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<double> GetRateAmt(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetRateAmt";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetRateAmt. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<double> GetImpressions(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetImpressions";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetImpressions. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
                //conn.Close();
            }

            return lds;
        }

        public IEnumerable<double> GetCPM(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<double> lds = new List<double>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetCPM";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetCPM. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
                //conn.Close();
            }

            return lds;
        }

        public IEnumerable<DoNotBuyType> GetDoNotBuyTypes(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<DoNotBuyType> lds = new List<DoNotBuyType>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetDoNotBuyTypes";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetDoNotBuyTypes. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<Client> GetClients(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<Client> lds = new List<Client>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetClients";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetClients. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DateTime> GetEffectiveDates(int LoggedOnUserId, int UpfrontId, string PropertyNames)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetEffectiveDates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetEffectiveDates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DateTime> GetRateRevisedDates(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetRateRevisedDates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetRateRevisedDates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<string> GetRevNo(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetRevNo";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetRevNo. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public IEnumerable<DateTime> GetExpirationDates(int LoggedOnUserId, int UpfrontId, string PropertyNames)
        {
            List<DateTime> lds = new List<DateTime>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetExpirationDates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetExpirationDates. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
                //conn.Close();
            }

            return lds;
        }

        public IEnumerable<bool> GetWeekDay(int LoggedOnUserId, int UpfrontId, string PropertyNames, int WeekDayId)
        {
            List<bool> lds = new List<bool>();
            try
            {
                // ST-946 Code Implementation with Dappers
                string spName = "sp_Upfront_GetWeekDay";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);                
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("WeekDayId", WeekDayId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetWeekDay. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }
            return lds;
        }
        public IEnumerable<Upfront> GetUpfronts(int LoggedOnUserId)
        {
            return _context
                .Upfronts
                .Include(q => q.Quarter)
                .Include(n => n.Network)
                .Include(c => c.Network.Country)
                .Include(b => b.BuyerName)
                .Include(l => l.UpfrontLockedBy)
                .Include(u => u.UpdatedByUser)
                .Where(uf => uf.UpfrontType.Description == "Upfront")
                .ToList();

        }

        public ErrorMessage SaveProgramChange(int UpfrontId,
            string PropertyName_New,
            DateTime StartTime_New,
            DateTime EndTime_New,
            int DayPartId_New,
            float Rate_New,
            float Impressions_New,
            DateTime EffDt_New,
            DateTime ExpDt_New,
            int LoggedOnUserId)
        {
            ErrorMessage em = new ErrorMessage(false, 0, "");

            List<UpfrontExpansionQuarters> result = new List<UpfrontExpansionQuarters>();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_SaveProgramChange";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                dbparams.Add("PropertyName", PropertyName_New, DbType.String);
                dbparams.Add("StartTime", StartTime_New, DbType.DateTime);
                dbparams.Add("EndTime", EndTime_New, DbType.DateTime);
                dbparams.Add("DayPartId", DayPartId_New, DbType.Int32);
                dbparams.Add("Rate", Rate_New, DbType.Decimal);
                dbparams.Add("Impressions", Impressions_New, DbType.Decimal);
                dbparams.Add("EffectiveDt", EffDt_New, DbType.DateTime);
                dbparams.Add("ExpirationDt", ExpDt_New, DbType.DateTime);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);

            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = -1;
                em.ResponseText = exc.Message;
                _logger.LogError(LoggedOnUserId, "Unable to change program. " + exc.Message);
            }
            finally
            {
            }

            return em;
        }

        public IEnumerable<string> GetSPBuy(int LoggedOnUserId, int UpfrontId, string PropertyNames)
        {
            List<string> lds = new List<string>();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetSPBuy";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                if (PropertyNames != null)
                    dbparams.Add("PropertyNames", PropertyNames, DbType.String);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetSPBuy. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }

        public ErrorMessage CreateUpfront(int NetworkId, string QName, int UserId)
        {
            ErrorMessage em = new ErrorMessage(false, 0, "");
            try
            {

                // ST-946 Code Implementation with Dapper
                string spName = "sp_UpfrontAdd";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("QuarterName", QName, DbType.String);
                dbparams.Add("LoggedOnUserId", UserId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = -1;
                em.ResponseText = exc.Message;
                _logger.LogError(UserId, "Unable to create new Upfront for " + QName + " :-" + exc.Message);
            }
            finally
            {
            }

            return em;

        }


        public IEnumerable<string> GetQuartersForAddProperty(int PlanYear, int BroadcastQtrNumber, int EditedURYear, int LoggedOnUserId)
        {
            List<string> lds = new List<string>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_GetQuartersForAddProperty";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("BroadcastYear", PlanYear, DbType.Int32);
                dbparams.Add("BroadcastQtrNumber", BroadcastQtrNumber, DbType.String);
                dbparams.Add("EditedURYear", EditedURYear, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository GetQuartersForAddProperty. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }



        public IEnumerable<PropModel> GetAvailablePropertiesForQuater(string QuarterName, int CountryId, int NetworkId, int LoggedOnUserId)
        {
            List<PropModel> lds = new List<PropModel>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_UpfrontRemnant_GetAvailablePropertiesForQuarter";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository GetAvailablePropertiesForQuarter. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }


        public IEnumerable<PropModel> CheckQuarterlyPropertyCanCreate(
            string ExistingRateIds, string ProposedDemosIds, string ProposedQuarterName,
            int CopyRateImp, int ProposedBuyTypeId, int UpfrontTypeId, int UpfrontId, bool IsCreatePropertyRates, int LoggedOnUserId)
        {
            List<PropModel> lds = new List<PropModel>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_CheckQuarterlyPropertyCanCreate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ExistingRateIds", ExistingRateIds, DbType.String);
                dbparams.Add("ProposedDemosIds", ProposedDemosIds, DbType.String);
                dbparams.Add("ProposedQuarterName", ProposedQuarterName, DbType.String);
                dbparams.Add("CopyRateImp", CopyRateImp, DbType.Int32);
                dbparams.Add("ProposedBuyTypeId", ProposedBuyTypeId, DbType.Int32);
                dbparams.Add("UpfrontTypeId", UpfrontTypeId, DbType.Int32);
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                dbparams.Add("UserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("IsCreatePropertyRates", IsCreatePropertyRates, DbType.Boolean);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository CheckQuarterlyPropertyCanCreate. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }




        public IEnumerable<DREtimateVerions> GetDRAvailableEstimateVerions(int NetworkId, string QuarterName, int LoggedOnUserId)
        {
            List<DREtimateVerions> lds = new List<DREtimateVerions>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Remnant_GetDRAvailableEstimateVerions";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.String);
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository GetDRAvailableEstimateVerions. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
            }

            return lds;
        }


        public IEnumerable<PropModel> GetDRAvailableProperties(int NetworkId, string QuarterName, int VersionNumber, int LoggedOnUserId)
        {
            List<PropModel> lds = new List<PropModel>();
           try
            {

                //DbCommand command = conn.CreateCommand();
                //command.CommandText = "sp_Remnant_GetDRAvailableProperties ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramNetworkId = new SqlParameter("@NetworkId", SqlDbType.Int);
                //paramNetworkId.Value = NetworkId;
                //command.Parameters.Add(paramNetworkId);

                //SqlParameter paramQuarterName = new SqlParameter("@QuarterName", SqlDbType.VarChar, 20);
                //paramQuarterName.Value = QuarterName;
                //command.Parameters.Add(paramQuarterName);

                //SqlParameter paramVersionNo = new SqlParameter("@VersionNo", SqlDbType.Int);
                //paramVersionNo.Value = VersionNumber;
                //command.Parameters.Add(paramVersionNo);

                //SqlParameter paramForScheduleTool = new SqlParameter("@ForScheduleTool", SqlDbType.Int);
                //paramForScheduleTool.Value = 1;
                //command.Parameters.Add(paramForScheduleTool);


                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        PropModel prop = new PropModel();
                //        //prop.Approved = bool.Parse(reader["Approved"].ToString());
                //        //prop.Approved = reader["Approved"].ToString();
                //        prop.Id = (int)reader["Id"];
                //        prop.PropertyName = reader["PropertyName"].ToString();
                //        //prop.Time = reader["Time"].ToString();
                //        prop.DP = reader["DP"].ToString();
                //        prop.Days = reader["DaysDescCompact"].ToString();
                //        prop.SpotLen = (int)reader["SpotLen"];
                //        prop.RateAmt = double.Parse(reader["FinalRate"].ToString());
                //        prop.Imp = double.Parse(reader["Imps"].ToString());
                //        prop.CPM = double.Parse(reader["FinalCPM"].ToString());
                //        prop.Status = reader["Status"].ToString();
                //        //prop.EffExp = reader["EffExpDate"].ToString();
                //        //prop.Revision = reader["Revision"].ToString();
                //        prop.StartTimeFormatted = DateTime.Parse(reader["StartTime"].ToString()).ToString("hh:mm tt");
                //        prop.EndTimeFormatted = DateTime.Parse(reader["EndTime"].ToString()).ToString("hh:mm tt");
                //        //prop.BuyTypeDescription = reader["BuyType"].ToString();
                //        prop.PropertyId = (int)reader["PropertyID"];
                //        //prop.RateId = (int)reader["RateId"];
                //        //prop.SplitId = (int)reader["SplitId"];
                //        //***prop.ClientName = reader["ClientName"].ToString();
                //        prop.BuyTypeCode = reader["BuyType"].ToString();
                //        //***prop.SPBuy = reader["SPBuy"].ToString();
                //        prop.DemoName = reader["DemoName"].ToString();
                //        prop.EffectiveDate = "";
                //        prop.ExpirationDate = "";
                //        lds.Add(prop);

                //    }
                //};
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Remnant_GetDRAvailableProperties";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                dbparams.Add("VersionNo", VersionNumber, DbType.Int32);
                dbparams.Add("ForScheduleTool", 1, DbType.Int32);
                lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
                //foreach(PropModel p in lds)
                //{
                //    p.StartTimeFormatted=p.StartTimeFormatted.ToString
                //}
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository GetDRAvailableProperties. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
                //conn.Close();
            }

            return lds;
        }



        public IEnumerable<PropModel> DRCheckProperties(int NetworkId,
            string QuarterName, int VersionNumber, int IsCreateDRPropertyRates,
            List<DRQuartersProperty> lstDRSelectedProperties,
            int LoggedOnUserId)
        {
            List<PropModel> lds = new List<PropModel>();
            //DbConnection conn = _context.Database.GetDbConnection();
            //if (conn.State == ConnectionState.Closed)
            //{
            //    conn.Open();
            //}

            try
            {
                //DataTable dtDRProperties = new DataTable();
                //dtDRProperties.Columns.Add("Id", typeof(int));
                //dtDRProperties.Columns.Add("DemoName", typeof(string));
                //dtDRProperties.Columns.Add("PropertyName", typeof(string));
                //dtDRProperties.Columns.Add("PropertyId", typeof(int));
                //dtDRProperties.Columns.Add("DP", typeof(string));
                //dtDRProperties.Columns.Add("Days", typeof(string));
                //dtDRProperties.Columns.Add("NetworkId", typeof(int));
                //dtDRProperties.Columns.Add("RateAmt", typeof(double));
                //dtDRProperties.Columns.Add("Imp", typeof(double));
                //dtDRProperties.Columns.Add("CPM", typeof(double));
                //dtDRProperties.Columns.Add("Status", typeof(string));
                //dtDRProperties.Columns.Add("Revision", typeof(string));
                //dtDRProperties.Columns.Add("StartTime", typeof(DateTime));
                //dtDRProperties.Columns.Add("EndTime", typeof(DateTime));
                //dtDRProperties.Columns.Add("ClientName", typeof(string));
                //dtDRProperties.Columns.Add("BuyTypeCode", typeof(string));
                //dtDRProperties.Columns.Add("EffectiveDate", typeof(DateTime));
                //dtDRProperties.Columns.Add("ExpirationDate", typeof(DateTime));


                //dtDRProperties.AcceptChanges();

                //foreach (DRQuartersProperty drProperty in lstDRSelectedProperties)
                //{
                //    DataRow dr = dtDRProperties.NewRow();
                //    dr[0] = drProperty.Id;
                //    dr[1] = drProperty.DemoName;
                //    dr[2] = drProperty.PropertyName;
                //    dr[3] = drProperty.PropertyId;
                //    dr[4] = drProperty.DP;
                //    dr[5] = drProperty.Days;
                //    dr[6] = NetworkId;
                //    dr[7] = drProperty.RateAmt;
                //    dr[8] = drProperty.Imp;
                //    dr[9] = drProperty.CPM;
                //    dr[10] = drProperty.Status;
                //    dr[11] = drProperty.Revision;
                //    dr[12] = drProperty.StartTimeFormatted;
                //    dr[13] = drProperty.EndTimeFormatted;
                //    dr[14] = drProperty.ClientName;
                //    dr[15] = drProperty.BuyTypeCode;
                //    dr[16] = drProperty.EffectiveDate;
                //    dr[17] = drProperty.ExpirationDate;

                //    dtDRProperties.Rows.Add(dr);

                //}
                //dtDRProperties.AcceptChanges();


                //DbCommand command = conn.CreateCommand();
                //command.CommandText = "sp_Remnant_CheckDRProperties ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramNetworkId = new SqlParameter("@NetworkId", SqlDbType.Int);
                //paramNetworkId.Value = NetworkId;
                //command.Parameters.Add(paramNetworkId);

                //SqlParameter paramQuarterName = new SqlParameter("@QuarterName", SqlDbType.VarChar, 20);
                //paramQuarterName.Value = QuarterName;
                //command.Parameters.Add(paramQuarterName);

                //SqlParameter paramVersionNo = new SqlParameter("@EstimateVersionNo", SqlDbType.Int);
                //paramVersionNo.Value = VersionNumber;
                //command.Parameters.Add(paramVersionNo);

                //SqlParameter paramIsCreateDRPropertyRates = new SqlParameter("@IsCreateDRPropertyRates", SqlDbType.Int);
                //paramIsCreateDRPropertyRates.Value = IsCreateDRPropertyRates;
                //command.Parameters.Add(paramIsCreateDRPropertyRates);

                //SqlParameter paramUserId = new SqlParameter("@UserId", SqlDbType.Int);
                //paramUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramUserId);

                //SqlParameter paramlstDRPropertiesTypeTable = new SqlParameter("@tvpPropertiesTableType", SqlDbType.Structured);
                //paramlstDRPropertiesTypeTable.Value = dtDRProperties;
                //command.Parameters.Add(paramlstDRPropertiesTypeTable);

                //if (IsCreateDRPropertyRates == 1)
                //{
                //    command.ExecuteNonQuery();
                //}
                //else
                //{
                //    using (DbDataReader reader = command.ExecuteReader())
                //    {
                //        while (reader.Read())
                //        {
                //            PropModel prop = new PropModel();
                //            prop.CanCreateQTRProperty = (int)reader["CanCreateQTRProperty"];
                //            //prop.Approved = bool.Parse(reader["Approved"].ToString());
                //            //prop.Approved = reader["Approved"].ToString();
                //            //prop.Id = (int)reader["Id"];
                //            prop.PropertyName = reader["PropertyName"].ToString();
                //            //prop.Time = reader["Time"].ToString();
                //            prop.DP = reader["DayPart"].ToString();
                //            prop.Days = reader["WeekDays"].ToString();
                //            //prop.SpotLen = (int)reader["SpotLen"];
                //            prop.RateAmt = double.Parse(reader["RateAmt"].ToString());
                //            prop.Imp = double.Parse(reader["Imp"].ToString());
                //            prop.CPM = double.Parse(reader["CPM"].ToString());
                //            prop.Status = reader["StatusCol"].ToString();
                //            //prop.EffExp = reader["EffExpDate"].ToString();
                //            prop.Revision = Convert.ToString(reader["Revision"].ToString())=="0"?"": reader["Revision"].ToString();
                //            prop.StartTimeFormatted = DateTime.Parse(reader["StartTime"].ToString()).ToString("hh:mm tt");
                //            prop.EndTimeFormatted = DateTime.Parse(reader["EndTime"].ToString()).ToString("hh:mm tt");
                //            //prop.BuyTypeDescription = reader["BuyType"].ToString();
                //            //prop.PropertyId = (int)reader["PropertyId"];
                //            //prop.RateId = (int)reader["RateId"];
                //            //prop.SplitId = (int)reader["SplitId"];
                //            prop.ClientName = reader["ClientName"].ToString();
                //            prop.BuyTypeCode = reader["BuyTypeCode"].ToString();
                //            //***prop.SPBuy = reader["SPBuy"].ToString();
                //            prop.DemoName = reader["DemoName"].ToString();
                //            prop.EffectiveDate = reader["ProposedEffectiveDate"].ToString();
                //            prop.ExpirationDate = reader["ProposedExpirationDate"].ToString();
                //            lds.Add(prop);

                //        }
                //    };
                //}
                //ST-946 Code Implementation with Dapper
                DataTable dtDRProperties = new DataTable();
                dtDRProperties.Columns.Add("Id", typeof(int));
                dtDRProperties.Columns.Add("DemoName", typeof(string));
                dtDRProperties.Columns.Add("PropertyName", typeof(string));
                dtDRProperties.Columns.Add("PropertyId", typeof(int));
                dtDRProperties.Columns.Add("DP", typeof(string));
                dtDRProperties.Columns.Add("Days", typeof(string));
                dtDRProperties.Columns.Add("NetworkId", typeof(int));
                dtDRProperties.Columns.Add("RateAmt", typeof(double));
                dtDRProperties.Columns.Add("Imp", typeof(double));
                dtDRProperties.Columns.Add("CPM", typeof(double));
                dtDRProperties.Columns.Add("Status", typeof(string));
                dtDRProperties.Columns.Add("Revision", typeof(string));
                dtDRProperties.Columns.Add("StartTime", typeof(DateTime));
                dtDRProperties.Columns.Add("EndTime", typeof(DateTime));
                dtDRProperties.Columns.Add("ClientName", typeof(string));
                dtDRProperties.Columns.Add("BuyTypeCode", typeof(string));
                dtDRProperties.Columns.Add("EffectiveDate", typeof(DateTime));
                dtDRProperties.Columns.Add("ExpirationDate", typeof(DateTime));


                dtDRProperties.AcceptChanges();

                foreach (DRQuartersProperty drProperty in lstDRSelectedProperties)
                {
                    DataRow dr = dtDRProperties.NewRow();
                    dr[0] = drProperty.Id;
                    dr[1] = drProperty.DemoName;
                    dr[2] = drProperty.PropertyName;
                    dr[3] = drProperty.PropertyId;
                    dr[4] = drProperty.DP;
                    dr[5] = drProperty.Days;
                    dr[6] = NetworkId;
                    dr[7] = drProperty.RateAmt;
                    dr[8] = drProperty.Imp;
                    dr[9] = drProperty.CPM;
                    dr[10] = drProperty.Status;
                    dr[11] = drProperty.Revision;
                    dr[12] = drProperty.StartTimeFormatted;
                    dr[13] = drProperty.EndTimeFormatted;
                    dr[14] = drProperty.ClientName;
                    dr[15] = drProperty.BuyTypeCode;
                    dr[16] = drProperty.EffectiveDate;
                    dr[17] = drProperty.ExpirationDate;

                    dtDRProperties.Rows.Add(dr);

                }
                dtDRProperties.AcceptChanges();

               
                string spName = "sp_Remnant_CheckDRProperties";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, DbType.String);
               
                dbparams.Add("EstimateVersionNo", VersionNumber, DbType.Int32);
                dbparams.Add("IsCreateDRPropertyRates", IsCreateDRPropertyRates, DbType.Int32);
                dbparams.Add("UserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("tvpPropertiesTableType", dtDRProperties.AsTableValuedParameter("dbo.DRPropertiesTableType"));
                int retval = 0;
                if (IsCreateDRPropertyRates == 1)
                {
                    retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                }
                else
                {
                    lds = FactoryServices.dbFactory.SelectCommand_SP(lds, spName, dbparams);
                }

                //SqlParameter paramNetworkId = new SqlParameter("@NetworkId", SqlDbType.Int);
                //paramNetworkId.Value = NetworkId;
                //command.Parameters.Add(paramNetworkId);

                //SqlParameter paramQuarterName = new SqlParameter("@QuarterName", SqlDbType.VarChar, 20);
                //paramQuarterName.Value = QuarterName;
                //command.Parameters.Add(paramQuarterName);

                //SqlParameter paramVersionNo = new SqlParameter("@EstimateVersionNo", SqlDbType.Int);
                //paramVersionNo.Value = VersionNumber;
                //command.Parameters.Add(paramVersionNo);

                //SqlParameter paramIsCreateDRPropertyRates = new SqlParameter("@IsCreateDRPropertyRates", SqlDbType.Int);
                //paramIsCreateDRPropertyRates.Value = IsCreateDRPropertyRates;
                //command.Parameters.Add(paramIsCreateDRPropertyRates);

                //SqlParameter paramUserId = new SqlParameter("@UserId", SqlDbType.Int);
                //paramUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramUserId);

                //SqlParameter paramlstDRPropertiesTypeTable = new SqlParameter("@tvpPropertiesTableType", SqlDbType.Structured);
                //paramlstDRPropertiesTypeTable.Value = dtDRProperties;
                //command.Parameters.Add(paramlstDRPropertiesTypeTable);

                //if (IsCreateDRPropertyRates == 1)
                //{
                //    command.ExecuteNonQuery();
                //}
                //else
                //{
                //    using (DbDataReader reader = command.ExecuteReader())
                //    {
                //        while (reader.Read())
                //        {
                            //PropModel prop = new PropModel();
                            //prop.CanCreateQTRProperty = (int)reader["CanCreateQTRProperty"];
                            ////prop.Approved = bool.Parse(reader["Approved"].ToString());
                            ////prop.Approved = reader["Approved"].ToString();
                            ////prop.Id = (int)reader["Id"];
                            //prop.PropertyName = reader["PropertyName"].ToString();
                            ////prop.Time = reader["Time"].ToString();
                            //prop.DP = reader["DayPart"].ToString();
                            //prop.Days = reader["WeekDays"].ToString();
                            ////prop.SpotLen = (int)reader["SpotLen"];
                            //prop.RateAmt = double.Parse(reader["RateAmt"].ToString());
                            //prop.Imp = double.Parse(reader["Imp"].ToString());
                            //prop.CPM = double.Parse(reader["CPM"].ToString());
                            //prop.Status = reader["StatusCol"].ToString();
                            ////prop.EffExp = reader["EffExpDate"].ToString();
                            //prop.Revision = Convert.ToString(reader["Revision"].ToString())=="0"?"": reader["Revision"].ToString();
                            //prop.StartTimeFormatted = DateTime.Parse(reader["StartTime"].ToString()).ToString("hh:mm tt");
                            //prop.EndTimeFormatted = DateTime.Parse(reader["EndTime"].ToString()).ToString("hh:mm tt");
                            ////prop.BuyTypeDescription = reader["BuyType"].ToString();
                            ////prop.PropertyId = (int)reader["PropertyId"];
                            ////prop.RateId = (int)reader["RateId"];
                            ////prop.SplitId = (int)reader["SplitId"];
                            //prop.ClientName = reader["ClientName"].ToString();
                            //prop.BuyTypeCode = reader["BuyTypeCode"].ToString();
                            ////***prop.SPBuy = reader["SPBuy"].ToString();
                            //prop.DemoName = reader["DemoName"].ToString();
                            //prop.EffectiveDate = reader["ProposedEffectiveDate"].ToString();
                            //prop.ExpirationDate = reader["ProposedExpirationDate"].ToString();
                            //lds.Add(prop);

                //        }
                //    };
                //}

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Failed UpfrontRepository GetDRAvailableProperties. | " + exc.Message + " | " + exc.StackTrace);
            }
            finally
            {
              //  conn.Close();
            }

            return lds;
        }
        //ST-946 Multiple resultset, currently not in use
        public UpfrontHeaderViewModel GetUpfrontHeader(int LoggedOnUserId, int UpfrontId, string PropertyNames = null)
        {
            UpfrontHeaderViewModel objheaders = new UpfrontHeaderViewModel();
            //try
            //{
            //    // ST-946 Code Implementation with Dapper
            //    string spName = "sp_UpforntRemnant_GetHeader";
            //    DynamicParameters dbparams = new DynamicParameters();
            //    dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
            //    if (PropertyNames != null)
            //        dbparams.Add("PropertyNames", PropertyNames, DbType.String);
            //    dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
            //    // test = FactoryServices.dbFactory.GetMultipleResultSet(test, spName, dbparams);

            //    using (IDbConnection con = _context.Database.GetDbConnection())
            //    {
            //        if (con.State == ConnectionState.Closed)
            //        {
            //            con.Open();
            //        }
            //        // Example stored procedure that returns multiple result sets
            //        string sqlQuery = spName;

            //        // Execute the stored procedure and get a GridReader
            //        using (SqlMapper.GridReader results = con.QueryMultiple(sqlQuery, dbparams, commandType: CommandType.StoredProcedure))
            //        {
            //            if (results != null)
            //            {


            //                objheaders.lstApproved = results.Read<string>().ToList();
            //                List<DemosModel> demolist = results.Read<DemosModel>().ToList();
            //                if (demolist != null && demolist.Count > 0)
            //                {
            //                    foreach (DemosModel demos in demolist)
            //                    {
            //                        objheaders.lstDemoNames.Add(new DemoNames(demos.DemographicSettingsId, demos.DemoName));
            //                    }
            //                }
            //                objheaders.lstProps = results.Read<Models.Property>().ToList();
            //                objheaders.lstStartTimes = results.Read<DateTime>().ToList();
            //                objheaders.lstEndTimes = results.Read<DateTime>().ToList();
            //                objheaders.lstDayParts = results.Read<DayPart>().ToList();

            //                objheaders.lstOMDPs = results.Read<string>().ToList();
            //                objheaders.lstBuyTypes = results.Read<BuyType>().ToList();
            //                objheaders.lstLens = results.Read<string>().ToList();
            //                objheaders.lstRates = results.Read<double>().ToList();
            //                objheaders.lstImpressions = results.Read<double>().ToList();
            //                objheaders.lstCPM = results.Read<double>().ToList();
            //                objheaders.lstDoNotBuyTypes = results.Read<DoNotBuyType>().ToList();
            //                objheaders.lstClients = results.Read<Client>().ToList();
            //                objheaders.lstRevNos = results.Read<string>().ToList();
            //                objheaders.lstRevisedDates = results.Read<DateTime>().ToList();
            //                objheaders.lstEffectiveDates = results.Read<DateTime>().ToList();
            //                objheaders.lstExpirationDates = results.Read<DateTime>().ToList();
            //                objheaders.SPBuys = results.Read<string>().ToList();
            //                objheaders.lstWeekDay1 = results.Read<bool>().ToList();
            //                objheaders.lstWeekDay2 = results.Read<bool>().ToList();
            //                objheaders.lstWeekDay3 = results.Read<bool>().ToList();
            //                objheaders.lstWeekDay4 = results.Read<bool>().ToList();
            //                objheaders.lstWeekDay5 = results.Read<bool>().ToList();
            //                objheaders.lstWeekDay6 = results.Read<bool>().ToList();
            //                objheaders.lstWeekDay7 = results.Read<bool>().ToList();

            //            }

            //        }
            //        return objheaders;
            //    }
            //}
            //catch (Exception exc)
            //{
            //    _logger.LogError(LoggedOnUserId, "Failed sp_Upfront_GetStartTimes. | " + exc.Message + " | " + exc.StackTrace);
            //}
            return objheaders;
        }
    }

}
