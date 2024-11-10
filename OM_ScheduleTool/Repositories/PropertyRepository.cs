using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Helpers;
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
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using System.Runtime.ConstrainedExecution;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;
using System.Globalization;

namespace OM_ScheduleTool.Models
{
    public class PropertyRepository : IPropertyRepository
    {
        private AppContext _context;
        private IUserRepository _userRepository;
        private ILogger<PropertyRepository> _logger;
        private IConfiguration _config;

        public PropertyRepository(AppContext context
            , IUserRepository userRepository
            , ILogger<PropertyRepository> logger
            , IConfiguration config
            )
        {
            _context = context;
            _userRepository = userRepository;

            _logger = logger;
            _config = config;
        }



        public IEnumerable<NetworkUserJob> GetNetworks(int UserId, string CountryShort)
        {
            return _context
                .NetworkUserJob
                .Include(n => n.Network)
                .Where (u => u.User.UserId == UserId)
                .Where(n => n.Network.Country.CountryShort == CountryShort)
                .AsEnumerable();
        }

        public IEnumerable<DoNotBuyType> GetDoNotBuyTypes()
        {
            return _context.DoNotBuyType
                .Where(c => c.Description != "REVISED EST." && c.Description != "LOG ACTUAL")
                .OrderBy(n => n.SortOrder)
                .ToList();
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

        public Quarter GetQuarter (string QtrName)
        {
            return _context
                .Quarter
                .Where(q => q.QuarterName == QtrName)
                .FirstOrDefault<Quarter>();
        }

        public List<DemographicSettings> GetDemoNames(int CountryId)
        {
            return _context.DemographicSettings.Where(c => c.CountryId == CountryId).ToList();
        }

        public IEnumerable<DayPart> GetDayParts()
        {
            return _context
                .DayPart
                .OrderBy(d => d.SortOrder)
                .ToList();
        }

        public List<Network> GetNetworks(int CountryId)
        {
            return _context.Networks
                .Include(c => c.Country)
                .Where (c => c.Country.CountryId == CountryId)
                .OrderBy(n => n.StdNetName)
                .ToList();
        }

        public ChangeProgramModel ChangeProgram(int LoggedOnUserId
            , int UpfrontLineId
            , string PropertyName
            , decimal Rate
            , decimal Imp
            , int DayPartId
            , bool Monday
            , bool Tuesday
            , bool Wednesday
            , bool Thursday
            , bool Friday
            , bool Saturday
            , bool Sunday
            , string StartTime
            , string EndTime
            , string EffectiveDate
            , string ExpirationDate)
        {
            ChangeProgramModel model = new ChangeProgramModel();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_ChangeProgram";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("PropertyName", PropertyName, DbType.String);
                dbparams.Add("DayPartId", DayPartId, DbType.Int32);
                dbparams.Add("Monday", Monday, DbType.Boolean);
                dbparams.Add("Tuesday", Tuesday, DbType.Boolean);
                dbparams.Add("Wednesday", Wednesday, DbType.Boolean);
                dbparams.Add("Thursday", Thursday, DbType.Boolean);
                dbparams.Add("Friday", Friday, DbType.Boolean);
                dbparams.Add("Saturday", Saturday, DbType.Boolean);
                dbparams.Add("Sunday", Sunday, DbType.Boolean);
                dbparams.Add("Rate", Rate, DbType.Decimal);
                dbparams.Add("Impressions", Imp, DbType.Decimal);
                dbparams.Add("StartTime", StartTime, DbType.String);
                dbparams.Add("EndTime", EndTime, DbType.String);

                DateTime Effdt;
                if (DateTime.TryParse(EffectiveDate, out Effdt) == true)
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, DbType.DateTime);
                }
                DateTime Expdt;
                if (DateTime.TryParse(ExpirationDate, out Expdt) == true)
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, DbType.DateTime);
                }

                model = FactoryServices.dbFactory.SelectCommand_SP(model, spName, dbparams);
                return model;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to change program. " + exc.Message);
                model = new ChangeProgramModel();
                model.Message= exc.Message;

            }

            return model;
        }

        public string AddNewProperty (int LoggedOnUserId
            , int NetworkId
            , int QuarterId
            , string PropertyName
            , int DayPartId
            , bool Monday
            , bool Tuesday
            , bool Wednesday
            , bool Thursday
            , bool Friday
            , bool Saturday
            , bool Sunday
            , string StartTime
            , string EndTime
            , int BuyTypeId
            , int DoNotBuyTypeId
            , int MandateClientId
            , bool Upfront
            , bool SPBuy)
        {
            AddPropertyResponseModel model = new AddPropertyResponseModel();
            try
            {
                //_context.Database.GetDbConnection().Open();

                //DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Property_Add ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramNetworkId = new SqlParameter("@NetworkId", SqlDbType.Int);
                //paramNetworkId.Value = NetworkId;
                //command.Parameters.Add(paramNetworkId);

                //SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //paramLoggedOnUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramLoggedOnUserId);

                //SqlParameter paramQuarterId = new SqlParameter("@QuarterId", SqlDbType.Int);
                //paramQuarterId.Value = QuarterId;
                //command.Parameters.Add(paramQuarterId);

                //SqlParameter paramPropertyName = new SqlParameter("@PropertyName", SqlDbType.VarChar, 255);
                //paramPropertyName.Value = PropertyName;
                //command.Parameters.Add(paramPropertyName);

                //SqlParameter paramDayPartId = new SqlParameter("@DayPartId", SqlDbType.Int);
                //paramDayPartId.Value = DayPartId;
                //command.Parameters.Add(paramDayPartId);

                //SqlParameter paramMonday = new SqlParameter("@Monday", SqlDbType.Bit);
                //paramMonday.Value = Monday;
                //command.Parameters.Add(paramMonday);

                //SqlParameter paramTuesday = new SqlParameter("@Tuesday", SqlDbType.Bit);
                //paramTuesday.Value = Tuesday;
                //command.Parameters.Add(paramTuesday);

                //SqlParameter paramWednesday = new SqlParameter("@Wednesday", SqlDbType.Bit);
                //paramWednesday.Value = Wednesday;
                //command.Parameters.Add(paramWednesday);

                //SqlParameter paramThursday = new SqlParameter("@Thursday", SqlDbType.Bit);
                //paramThursday.Value = Thursday;
                //command.Parameters.Add(paramThursday);

                //SqlParameter paramFriday = new SqlParameter("@Friday", SqlDbType.Bit);
                //paramFriday.Value = Friday;
                //command.Parameters.Add(paramFriday);

                //SqlParameter paramSaturday = new SqlParameter("@Saturday", SqlDbType.Bit);
                //paramSaturday.Value = Saturday;
                //command.Parameters.Add(paramSaturday);

                //SqlParameter paramSunday = new SqlParameter("@Sunday", SqlDbType.Bit);
                //paramSunday.Value = Sunday;
                //command.Parameters.Add(paramSunday);

                //SqlParameter paramStartTime = new SqlParameter("@StartTime", SqlDbType.VarChar);
                //paramStartTime.Value = StartTime;
                //command.Parameters.Add(paramStartTime);

                //SqlParameter paramEndTime = new SqlParameter("@EndTime", SqlDbType.VarChar);
                //paramEndTime.Value = EndTime;
                //command.Parameters.Add(paramEndTime);

                //SqlParameter paramBuyTypeId = new SqlParameter("@BuyTypeId", SqlDbType.Int);
                //paramBuyTypeId.Value = BuyTypeId;
                //command.Parameters.Add(paramBuyTypeId);

                //SqlParameter paramDoNotBuyTypeId = new SqlParameter("@DoNotBuyTypeId", SqlDbType.Int);
                //paramDoNotBuyTypeId.Value = DoNotBuyTypeId;
                //command.Parameters.Add(paramDoNotBuyTypeId);

                //SqlParameter paramMandateClientId = new SqlParameter("@MandateClientId", SqlDbType.Int);
                //paramMandateClientId.Value = MandateClientId;
                //command.Parameters.Add(paramMandateClientId);

                //SqlParameter paramUpfrontTypeId = new SqlParameter("@IsUpfront", SqlDbType.Bit);
                //paramUpfrontTypeId.Value = Upfront;
                //command.Parameters.Add(paramUpfrontTypeId);

                //SqlParameter paramSPBuy = new SqlParameter("@SPBuy", SqlDbType.Bit);
                //paramSPBuy.Value = SPBuy;
                //command.Parameters.Add(paramSPBuy);

                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        if (int.Parse(reader[0].ToString()) < 0)
                //        {
                //            // Return the error message
                //            return reader[1].ToString();
                //        }
                //        else
                //        {
                //            // Return the propertyid
                //            return reader[0].ToString();
                //        }

                //    }
                //}
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                dbparams.Add("PropertyName", PropertyName, DbType.String);
                dbparams.Add("DayPartId", DayPartId, DbType.Int32);
                dbparams.Add("Monday", Monday, DbType.Boolean);
                dbparams.Add("Tuesday", Tuesday, DbType.Boolean);
                dbparams.Add("Wednesday", Wednesday, DbType.Boolean);
                dbparams.Add("Thursday", Thursday, DbType.Boolean);
                dbparams.Add("Friday", Friday, DbType.Boolean);
                dbparams.Add("Saturday", Saturday, DbType.Boolean);
                dbparams.Add("Sunday", Sunday, DbType.Boolean);
                dbparams.Add("StartTime", StartTime, DbType.String);
                dbparams.Add("EndTime", EndTime, DbType.String);
                dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                dbparams.Add("DoNotBuyTypeId", DoNotBuyTypeId, DbType.Int32);
                dbparams.Add("MandateClientId", MandateClientId, DbType.Int32);
                dbparams.Add("IsUpfront", Upfront, DbType.Boolean);
                dbparams.Add("SPBuy", SPBuy, DbType.Boolean);

                model = FactoryServices.dbFactory.SelectCommand_SP(model, spName, dbparams);
                return model.PropertyId.ToString();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to add new property. " + exc.Message);
                return exc.Message;

            }

            return "Property not found.";
        }

        public ErrorMessage AddNewPropertyRates(int LoggedOnUserId
            , int PropertyId
            , int QuarterId
            , int DemographicSettingsId
            , int BuyTypeId
            , decimal Rate
            , decimal Impressions
            , int DoNotBuyTypeId
            , string EffectiveDate
            , string ExpirationDate
            , int MandateClientId
            , bool IsUpfront
            )
        {
            ErrorMessage em = new ErrorMessage();
            AddPropertyResponseModel model = new AddPropertyResponseModel();

            try
            {
                //_context.Database.GetDbConnection().Open();

                //DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Property_AddRate ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramLoggedOnUserId = new SqlParameter("@LoggedOnUserId", SqlDbType.Int);
                //paramLoggedOnUserId.Value = LoggedOnUserId;
                //command.Parameters.Add(paramLoggedOnUserId);

                //SqlParameter paramPropertyId = new SqlParameter("@PropertyId", SqlDbType.Int);
                //paramPropertyId.Value = PropertyId;
                //command.Parameters.Add(paramPropertyId);

                //SqlParameter paramQuarterId = new SqlParameter("@QuarterId", SqlDbType.Int);
                //paramQuarterId.Value = QuarterId;
                //command.Parameters.Add(paramQuarterId);

                //SqlParameter paramDemographicSettingsId = new SqlParameter("@DemographicSettingsId", SqlDbType.Int);
                //paramDemographicSettingsId.Value = DemographicSettingsId;
                //command.Parameters.Add(paramDemographicSettingsId);

                //SqlParameter paramBuyTypeId = new SqlParameter("@BuyTypeId", SqlDbType.Int);
                //paramBuyTypeId.Value = BuyTypeId;
                //command.Parameters.Add(paramBuyTypeId);

                //SqlParameter paramRate = new SqlParameter("@RateAmt", SqlDbType.Money);
                //paramRate.Value = Rate;
                //command.Parameters.Add(paramRate);

                //SqlParameter paramImpressions = new SqlParameter("@Impressions", SqlDbType.Decimal);
                //paramImpressions.Value = Impressions;
                //command.Parameters.Add(paramImpressions);

                //SqlParameter paramDoNotBuyTypeId = new SqlParameter("@DoNotBuyTypeId", SqlDbType.Int);
                //paramDoNotBuyTypeId.Value = DoNotBuyTypeId;
                //command.Parameters.Add(paramDoNotBuyTypeId);

                //SqlParameter paramExpirationDate = new SqlParameter("@ExpirationDate", SqlDbType.DateTime);
                //paramExpirationDate.Value = ExpirationDate;
                //command.Parameters.Add(paramExpirationDate);

                //SqlParameter paramEffectiveDate = new SqlParameter("@EffectiveDate", SqlDbType.DateTime);
                //paramEffectiveDate.Value = EffectiveDate;
                //command.Parameters.Add(paramEffectiveDate);

                //SqlParameter paramMandateClientId = new SqlParameter("@MandateClientId", SqlDbType.Int);
                //paramMandateClientId.Value = MandateClientId;
                //command.Parameters.Add(paramMandateClientId);

                //SqlParameter paramIsUpfront = new SqlParameter("@IsUpfront", SqlDbType.Bit);
                //paramIsUpfront.Value = IsUpfront;
                //command.Parameters.Add(paramIsUpfront);

                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        em.Success = (int.Parse(reader["ErrorCode"].ToString()) < 0 ? false : true);
                //        em.ResponseCode = int.Parse(reader["errorcode"].ToString());
                //        em.ResponseText = reader["Message"].ToString();
                //        return em;

                //    }
                //}
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_AddRate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("PropertyId", PropertyId, DbType.Int32);
                dbparams.Add("QuarterId", QuarterId, DbType.Int32);
                dbparams.Add("DemographicSettingsId", DemographicSettingsId, DbType.Int32);
                dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                dbparams.Add("RateAmt", Rate, DbType.Decimal);
                dbparams.Add("Impressions", Impressions, DbType.Decimal);
                dbparams.Add("DoNotBuyTypeId", DoNotBuyTypeId, DbType.Int32);
                dbparams.Add("ExpirationDate", ExpirationDate, DbType.DateTime);
                dbparams.Add("EffectiveDate", EffectiveDate, DbType.DateTime);
                dbparams.Add("MandateClientId", MandateClientId, DbType.Int32);
                dbparams.Add("IsUpfront", IsUpfront, DbType.Boolean);

                model = FactoryServices.dbFactory.SelectCommand_SP(model, spName, dbparams);
                em = new ErrorMessage
                {
                    Success = model.ErrorCode <0 ? false : true,
                    ResponseCode = model.ErrorCode,
                    ResponseText = model.Message
                };
                return em;
            }
            catch (Exception exc)
            {
                string ErrorMessage = "Unable to add new rate.  " + exc.Message;
                _logger.LogError(LoggedOnUserId, ErrorMessage);
                em.Success = false;
                em.ResponseCode = -101;
                em.ResponseText = ErrorMessage;
                return em;
            }

            em.Success = false;
            em.ResponseCode = -100;
            em.ResponseText = "Property not found.";
            return em;
        }

        public Property GetPropertyById(int LoggedOnUserId, int PropertyId)
        {
            return _context
                .Properties
                .Include(n => n.Network)
                .Where(p => p.PropertyId == PropertyId).FirstOrDefault<Property>();
        }

        public ErrorMessage UpdateProperty (int LoggedOnUserId, Microsoft.AspNetCore.Http.HttpRequest request)
        {
            ErrorMessage em = new ErrorMessage(true, 0, "Property successfully updated.");
            try
            {
                int _UpfrontLineId = 0;
                string _propertyName = "";
                int _buyTypeId=-1;  // Never from form as it takes the first selected item in the dropdown
                string _rate = "";
                string _impressions = "";
                int _monday = -1;
                int _tuesday = -1;
                int _wednesday = -1;
                int _thursday = -1;
                int _friday = -1;
                int _saturday = -1;
                int _sunday = -1;
                string _startTime = "1/1/2000 00:00";
                string _endTime = "1/1/2000 00:00";
                int _dayPartId = 0;
                string _effectiveDate = "1/1/2000 00:00";
                string _expirationDate = "1/1/2000 0:00";
                int _doNotBuyTypeId = 0;
                int _mandateClientId = 0;
                foreach (string Key in request.Form.Keys)
                {
                    DataTableFormKeyParsers dt = new DataTableFormKeyParsers(Key);
                    if (dt.Valid == true)
                    {
                        _UpfrontLineId = dt.Id;
                        if (dt.Name == "propertyName")
                        {
                            _propertyName = request.Form[Key];
                        }
                        else if (dt.Name == "rateAmt")
                        {
                            _rate = request.Form[Key];
                        }
                        else if (dt.Name == "impressions")
                        {
                            _impressions = request.Form[Key];
                        }
                        if (dt.Name == "buyTypeCode")
                        {
                            _buyTypeId = int.Parse(request.Form[Key]);
                        }

                        if (dt.Name == "monday")
                        {
                            _monday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "tuesday")
                        {
                            _tuesday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "wednesday")
                        {
                            _wednesday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "thursday")
                        {
                            _thursday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "friday")
                        {
                            _friday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "saturday")
                        {
                            _saturday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "sunday")
                        {
                            _sunday = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "startTime")
                        {
                            _startTime = request.Form[Key];
                        }
                        if (dt.Name == "endTime")
                        {
                            _endTime = request.Form[Key];
                        }
                        if (dt.Name == "dayPartCd")
                        {
                            _dayPartId = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "effectiveDate")
                        {
                            _effectiveDate = request.Form[Key];
                        }
                        if (dt.Name == "expirationDate")
                        {
                            _expirationDate = request.Form[Key];
                        }
                        if (dt.Name == "expirationDate")
                        {
                            _expirationDate = request.Form[Key];
                        }
                        if (dt.Name == "doNotBuyTypeDescription")
                        {
                            _doNotBuyTypeId = int.Parse(request.Form[Key]);
                        }
                        if (dt.Name == "mandateClientName")
                        {
                            _mandateClientId = int.Parse(request.Form[Key]);
                        }
                    }
                }
                
                em = UpdateProperty(LoggedOnUserId, _UpfrontLineId, true,
                    _propertyName, _monday, _tuesday, _wednesday, _thursday, _friday, _saturday, _sunday, _startTime, _endTime,
                    _dayPartId, _buyTypeId, _rate, _impressions, 0, _doNotBuyTypeId, _mandateClientId, _effectiveDate, _expirationDate);
            }
            catch (Exception exc)
            {
                string ErrorMessage = exc.Message;
                _logger.LogError(LoggedOnUserId, ErrorMessage);
                em.Success = false;
                em.ResponseCode = -101;
                em.ResponseText = ErrorMessage;
                return em;
            }

            return em;

        }

        public ErrorMessage SavePropertyName(int LoggedOnUserId, int UpfrontLineId, string PropertyName)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("PropertyName", PropertyName, DbType.String);
                
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update property name. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveDay(int LoggedOnUserId, int UpfrontLineId, bool Checked, int Day /* Monday=1,...*/)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
               
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                
                if (Day == 1)
                {
                    dbparams.Add("Monday", Checked, DbType.String);
                }

                if (Day == 2)
                {
                    dbparams.Add("Tuesday", Checked, DbType.String);
                }

                if (Day == 3)
                {
                    dbparams.Add("Wednesday", Checked, DbType.String);
                }

                if (Day == 4)
                {
                    dbparams.Add("Thursday", Checked, DbType.String);
                }

                if (Day == 5)
                {
                    dbparams.Add("Friday", Checked, DbType.String);
                }

                if (Day == 6)
                {
                    dbparams.Add("Saturday", Checked, DbType.String);
                }

                if (Day == 7)
                {
                    dbparams.Add("Sunday", Checked, DbType.String);
                }
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update days. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveStartTime(int LoggedOnUserId, int UpfrontLineId, string StartTime)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("StartTime", StartTime, DbType.String);

                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update start time. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveEndTime (int LoggedOnUserId, int UpfrontLineId, string EndTime)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("EndTime", EndTime, DbType.String);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update end time. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveRateAmt(int LoggedOnUserId, int UpfrontLineId, decimal RateAmt)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("Rate", RateAmt, DbType.Decimal);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode == -1)
                {
                    em.Success = false;
                }
                else
                {
                    em.Success = true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update rate amt. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }


        public ErrorMessage SaveImpressions(int LoggedOnUserId, int UpfrontLineId, decimal Impressions)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("Impressions", Impressions, DbType.Decimal);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode == -1)
                {
                    em.Success = false;
                }
                else
                {
                    em.Success = true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update impressions. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveBuyTypeId(int LoggedOnUserId, int UpfrontLineId, int BuyTypeId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update buy type id. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveDayPartId(int LoggedOnUserId, int UpfrontLineId, int DayPartId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("DayPartId", DayPartId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update buy type id. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveDoNotBuyTypeId(int LoggedOnUserId, int UpfrontLineId, int DoNotBuyTypeId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("DoNotBuyTypeId", DoNotBuyTypeId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode == -1)
                {
                    em.Success = false;
                }
                else
                {
                    em.Success = true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update donotbuytypeid. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }


        public ErrorMessage SaveMandateClientId(int LoggedOnUserId, int UpfrontLineId, int MandateClientId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("MandateClientId", MandateClientId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode == -1)
                {
                    em.Success = false;
                }
                else
                {
                    em.Success = true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update MandateClientid. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage SaveEffectiveDate(int LoggedOnUserId, int UpfrontLineId, string EffectiveDate)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("EffectiveDate", DateTime.Parse(EffectiveDate), DbType.DateTime);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode == -1)
                {
                    em.Success = false;
                }
                else
                {
                    em.Success = true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update EffectiveDate. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }


        public ErrorMessage SaveExpirationDate(int LoggedOnUserId, int UpfrontLineId, string ExpirationDate)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("ExpirationDate", DateTime.Parse(ExpirationDate), DbType.DateTime);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                if (em.ResponseCode == -1)
                {
                    em.Success = false;
                }
                else
                {
                    em.Success = true;
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update ExpirationDate. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        public ErrorMessage AutoApprove(int LoggedOnUserId, int UpfrontId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_AutoApprove";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to auto approve. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }

        // To Start over from here
        public ErrorMessage UpdateProperty(int LoggedOnUserId
            , int UpfrontLineId
            , bool Approved
            , string PropertyName
            , int Monday
            , int Tuesday
            , int Wednesday
            , int Thursday
            , int Friday
            , int Saturday
            , int Sunday
            , string StartTime
            , string EndTime
            , int DayPartId
            , int BuyTypeId
            , string Rate
            , string Impressions
            , int Status
            , int DoNotBuyTypeId
            , int MandateClientId
            , string EffectiveDate
            , string ExpirationDate)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);

                if (PropertyName.Length > 0)
                {
                    dbparams.Add("PropertyName", PropertyName, DbType.String);
                }

                if (Monday != -1)
                {
                    dbparams.Add("Monday", Monday, DbType.Boolean);
                }

                if (Tuesday != -1)
                {
                    dbparams.Add("Tuesday", Tuesday, DbType.Boolean);
                }

                if (Wednesday != -1)
                {
                    dbparams.Add("Wednesday", Wednesday, DbType.Boolean);
                }

                if (Thursday != -1)
                {
                    dbparams.Add("Thursday", Thursday, DbType.Boolean);
                }

                if (Friday != -1)
                {
                    dbparams.Add("Friday", Friday, DbType.Boolean);
                }

                if (Saturday != -1)
                {
                    dbparams.Add("Saturday", Saturday, DbType.Boolean);
                }

                if (Sunday != -1)
                {
                    dbparams.Add("Sunday", Sunday, DbType.Boolean);
                }

                if (StartTime.Length > 0)
                {
                    dbparams.Add("StartTime", StartTime, DbType.String);
                }

                if (EndTime.Length > 0)
                {
                    dbparams.Add("EndTime", EndTime, DbType.String);
                }

                if (DayPartId > 0)
                {
                    dbparams.Add("DayPartId", DayPartId, DbType.Int32);
                }

                if (BuyTypeId > 0)
                {
                    dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                }

                try
                {
                    double myRate;
                    if (double.TryParse(Rate.Replace("$", ""), out myRate) == true)
                    {
                        dbparams.Add("Rate", myRate, DbType.Decimal);
                    }
                }
                catch { }

                try
                {
                    double myImpressions;
                    if (double.TryParse(Impressions, out myImpressions) == true)
                    {
                        dbparams.Add("Impressions", myImpressions, DbType.Decimal);
                    }
                }
                catch { }
                if (DoNotBuyTypeId > 0)
                {
                    dbparams.Add("DoNotBuyTypeId", DoNotBuyTypeId, DbType.Decimal);
                }

                if (MandateClientId > 0)
                {
                    dbparams.Add("MandateClientId", MandateClientId, DbType.Decimal);
                }

                if (EffectiveDate != "-1")
                {
                    dbparams.Add("EffectiveDate", EffectiveDate, DbType.DateTime);
                }

                if (ExpirationDate != "-1")
                {
                    dbparams.Add("ExpirationDate", ExpirationDate, DbType.DateTime);
                }

                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update property. " + exc.Message);
                 em = new ErrorMessage(
                        false,
                        -1,
                        exc.Message);

                return em;
            }
            return em;
        }

        public string DeleteProperty(int LoggedOnUserId, params int[] UpfrontLineIds)
        {
            try
            {
                //_context.Database.GetDbConnection().Open();

                //DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "DeletePropertiesByRateID_SP ";
                //command.CommandType = CommandType.StoredProcedure;

                foreach (int uLineId in UpfrontLineIds)
                {
                    // ST-946 Code Implementation with Dapper
                    ErrorMessage em = new ErrorMessage();
                    string spName = "DeletePropertiesByRateID_SP";
                    DynamicParameters dbparams = new DynamicParameters();
                    dbparams.Add("UpfrontRemnantLinesFlatLineId", uLineId, DbType.Int32);
                    em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                    if (Convert.ToString(em.ResponseCodeStr) != "1")
                    {
                        _logger.LogError(LoggedOnUserId, em.ResponseText);
                        throw new Exception(em.ResponseText);
                    }
                }
            }
            catch (Exception exc)
            {
                string ErrorMessage = exc.Message;
                _logger.LogError(LoggedOnUserId, ErrorMessage);
                throw new Exception(ErrorMessage);

            }

            return "Successfully deleted property.";
        }

        public ErrorMessage GetPropertyChangedCount (int LoggedOnUserId, int UpfrontId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Upfront_ChangeCount";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
                if (err.ResponseCode > 0 || !string.IsNullOrEmpty(err.ResponseText))
                {
                    err.Success = true;
                }
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }

            return err;

        }

        public ErrorMessage SaveUpfrontChanges(int LoggedOnUserId, int UpfrontId)
        {
            ErrorMessage err = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_UpdatePerm";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontId", UpfrontId, DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);
            }
            catch (Exception exc)
            {
                err.Success = false;
                err.ResponseCode = -1000;
                err.ResponseText = exc.Message;

            }

            return err;

        }

        public ErrorMessage SaveSPBuy(int LoggedOnUserId, int UpfrontLineId, string SPBuy)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_Update";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UpfrontLineId", UpfrontLineId, DbType.Int32);
                dbparams.Add("SPBuy", (SPBuy.ToLower() == "true") ? true : false, DbType.Boolean);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to update SPBuy. " + exc.Message);
                em.Success = false;
                em.ResponseCode = -1000;
                em.ResponseText = exc.Message;

            }
            return em;
        }
    }

}
