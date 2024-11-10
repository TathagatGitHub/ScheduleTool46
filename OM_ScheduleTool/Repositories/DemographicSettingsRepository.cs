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
using System.Numerics;

namespace OM_ScheduleTool.Repositories
{
    public class DemographicSettingsRepository : IDemographicSettingsRepository
    {
        private AppContext _context;
        private ILogger<DemographicSettingsRepository> _logger;
        private IUserRepository _userRepository;

        public DemographicSettingsRepository(AppContext context
            , IUserRepository userRepository
            , ILogger<DemographicSettingsRepository> logger)
        {
            _context = context;
            _logger = logger;
            _userRepository = userRepository;
        }

        public IEnumerable<int> GetPlanYears(int CountryId, int LoggedOnUserId)
        {
            List<int> years = new List<int>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Demo_GetPlanYears";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                years = FactoryServices.dbFactory.SelectCommand_SP(years, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get plan years. " + exc.Message);

            }

            return years;
        }

        public List<DemographicSettingsUniverse> GetDemoUniverse(int CountryId, int PlanYr, int LoggedOnUserId, int Sort, int BuyTypeId)
        {
            List<DemographicSettingsUniverse> demounivs = new List<DemographicSettingsUniverse>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Demo_GetDemoUniverse";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("PlanYr", PlanYr, DbType.Int32);
                dbparams.Add("BuyTypeId", BuyTypeId, DbType.Int32);
                dbparams.Add("Sort", Sort, DbType.Int32);
                demounivs = FactoryServices.dbFactory.SelectCommand_SP(demounivs, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to get Demographic Settings. " + exc.Message);

            }

            return demounivs.ToList();
        }

        public DemoRateCalculator CalculateRates(int LoggedOnUserId, int CountryId, bool DRType, double RateAmt, double Impressions)
        {
            DemoRateCalculator democalc = new DemoRateCalculator();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Property_CalculateRates";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("DRType", DRType, DbType.Boolean);
                dbparams.Add("RateAmt", RateAmt, DbType.Decimal);
                dbparams.Add("Impressions", Impressions, DbType.Decimal);
                democalc = FactoryServices.dbFactory.SelectCommand_SP(democalc, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to calculate rates. " + exc.Message);

            }

            return democalc;
        }

        public ErrorMessage SaveDemoUniverse(int DemoSettingsId, int SortOrder, string DemographicName, int Universe, int LoggedOnUserId, int CountryId, int PlanYr)
        {
            ErrorMessage err = new ErrorMessage(false, -1, "");
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Demo_SaveDemoUniverse";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("DemographicSettingsId", DemoSettingsId, DbType.Int32);
                dbparams.Add("SortOrder", SortOrder, DbType.Int32);
                dbparams.Add("DemographicName", DemographicName.Trim(), DbType.String);
                dbparams.Add("Universe", Universe, DbType.Int32);
                dbparams.Add("UserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("PlanYr", PlanYr, DbType.Int32);
                err = FactoryServices.dbFactory.SelectCommand_SP(err, spName, dbparams);

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable to save Demographic Settings. " + exc.Message);
            }
            return err;
        }

        public List<DemographicSettings> GetClientQuarter (int CountryId, string QuarterName, int ClientId, int LoggedOnUserId)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                List<DemographicSettings> demos = new List<DemographicSettings>();
                string spName = "sp_Proposal_GetDemosForCreate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                demos = FactoryServices.dbFactory.SelectCommand_SP(demos, spName, dbparams);


                return demos;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load demographic settings foir client. | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public List<DemographicSettings> GetDemosByProposalId(int ProposalId, int LoggedOnUserId)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                List<DemographicSettings> demos = new List<DemographicSettings>();
                string spName = "sp_Proposals_GetDemosByProposal";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ProposalId", ProposalId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                demos = FactoryServices.dbFactory.SelectCommand_SP(demos, spName, dbparams);

                return demos;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load demographic settings foir client. | " + exc.Message);
            }
            finally
            {
            }

            return null;

        }

        public List<DemographicSettingsExport> GetDemographicSettings(string countryShortCode, int planYr, int loggedOnUserId)
        {
            List<DemographicSettingsExport> lstDemographicSettings = new List<DemographicSettingsExport>();
            try
            {
                // ST-946 Code Implementation with Dapper
                List<DemographicSettings> demos = new List<DemographicSettings>();
                string spName = "GetDemoUniverseByCountryPlanYr_SP";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("Country", countryShortCode, DbType.String);
                dbparams.Add("PlanYr", planYr, DbType.Int32);
                lstDemographicSettings = FactoryServices.dbFactory.SelectCommand_SP(lstDemographicSettings, spName, dbparams);

                return lstDemographicSettings;
            }
            catch (Exception exc)
            {
                _logger.LogError(loggedOnUserId, exc.Message);
            }
            return lstDemographicSettings;
        }

        public List<DemographicSettingsExport> MapListDemographicSettingsUniverseToListDemographicSettingsExport(List<DemographicSettingsUniverse> objListDemographicSettingsUniverse)
        {
            List<DemographicSettingsExport> objListDemographicSettingsExport = new List<DemographicSettingsExport>();
            foreach (DemographicSettingsUniverse objDemographicSettingsUniverse in objListDemographicSettingsUniverse)
            {
                DemographicSettingsExport objDemographicSettingsExport = new DemographicSettingsExport();
                objDemographicSettingsExport.Country = objDemographicSettingsUniverse.CountryShort;
                objDemographicSettingsExport.DemoName = objDemographicSettingsUniverse.DemographicName;
                objDemographicSettingsExport.PlanYear = objDemographicSettingsUniverse.PlanYr;
                objDemographicSettingsExport.Universe = objDemographicSettingsUniverse.Universe;
                // objDemographicSettingsExport.Updated = "";
                objListDemographicSettingsExport.Add(objDemographicSettingsExport);
            }
            return objListDemographicSettingsExport;
        }
    }
}
