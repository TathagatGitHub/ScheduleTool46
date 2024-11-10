using System;
using System.Collections.Generic;
using System.Linq;
//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Session;
using System.Data.Common;
using System.Data;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using AppContext = OM_ScheduleTool.Models.AppContext;
using Dapper;
using OM_ScheduleTool.Dapper;

namespace OM_ScheduleTool.Repositories
{
    public class UserRepository : IUserRepository
    {
        private AppContext _context;
        private StoredProcsContext _spcontext;
        private ILogger<PropertyRepository> _logger;

        public UserRepository(AppContext context
            , StoredProcsContext spcontext
            , ILogger<PropertyRepository> logger
            )
        {
            _context = context;
            _spcontext = spcontext;
            _logger = logger;
        }

        public IEnumerable<User> GetAllUsers(User user)
        {
            int PermissionLevelId = user.PermissionLevelId;
            if (PermissionLevelId == 1) // if admin, you can access all
            {
                return _context.Users
                    .Include(u => u.PermissionLevel)
                    .OrderBy(u => u.DisplayName).ToList();
            }
            else
            {
                return _context.Users
                    .Include(u => u.PermissionLevel)
                    .Where(u => u.AccountName == user.AccountName)
                    .OrderBy(u => u.DisplayName).ToList();
            }
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users
                .Include(u => u.PermissionLevel)
                .OrderBy(u => u.DisplayName).ToList();
        }

        public IEnumerable<User> GetAllActiveUsers(User user)
        {
            int PermissionLevelId = user.PermissionLevelId;
            if (PermissionLevelId == 1) // if admin, you can access all
            {
                return _context.Users
                    .Include(u => u.PermissionLevel)
                    .Where(u => u.LastLoginDt > DateTime.Now.AddMonths(-6))
                    .OrderBy(u => u.DisplayName).ToList();
            }
            else
            {
                return _context.Users
                    .Include(u => u.PermissionLevel)
                    .Where(u => u.LastLoginDt > DateTime.Now.AddMonths(-6) && u.AccountName == user.AccountName)
                    .OrderBy(u => u.DisplayName).ToList();
            }
        }

        public IEnumerable<User> GetAllInactiveUsers(User user)
        {
            int PermissionLevelId = user.PermissionLevelId;
            if (PermissionLevelId == 1) // if admin, you can access all
            {
                return _context.Users
                    .Include(u => u.PermissionLevel)
                    .Where(u => (!u.LastLoginDt.HasValue || u.LastLoginDt < DateTime.Now.AddMonths(-6)))
                    .OrderBy(s => s.DisplayName).ToList();
            }
            else
            {
                return _context.Users
                    .Include(u => u.PermissionLevel)
                    .Where(u => (!u.LastLoginDt.HasValue || u.LastLoginDt < DateTime.Now.AddMonths(-6)) && u.AccountName==user.AccountName)
                    .OrderBy(s => s.DisplayName).ToList();
            }
        }

        public IEnumerable<NetworkUserJob> GetNetworkAssignments(User user)
        {
            return _context.NetworkUserJob
                        .Include(n => n.Network)
                        .Where(u => u.UserId == user.UserId).ToList();
        }

        public IEnumerable<AppFeature> GetAppFeatures()
        {
            return _context.AppFeatures
                .ToList();
        }

        public IEnumerable<AppFeature> GetAllMainAppFeatures()
        {
            return _context.AppFeatures
                .Where(af => af.ParentAppFeatureId.HasValue == false)
                .ToList();
        }

        public IEnumerable<AppFeature> GetSubAppFeatures(int AppFeatureId)
        {
            return _context.AppFeatures
                .Where(af => af.ParentAppFeatureId.HasValue == true && af.ParentAppFeatureId==AppFeatureId)
                .ToList();
        }

        public void SetUserLoginDt(int UserId)
        {
            try
            {
                User user = _context.Users.Where(x=>x.UserId == UserId).Single();

                user.LastLoginDt = DateTime.Now;                
                _context.SaveChanges();                
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Error in SetUserLoginDt | " + exc.Message);
            }

        }

        public IEnumerable<PermissionLevel> GetAllPermissionLevels()
        {
            return _context.PermissionLevels.ToList();
        }

        public User GetUserByAccountName(string AccountName)
        {
            return _context.Users
                .Include(pl => pl.PermissionLevel)
                .Include(jtt => jtt.JobTitleType)
                .FirstOrDefault(u => u.AccountName == AccountName);
        }

        public User GetUserById (int UserId)
        {
            return _context.Users
                .Include(pl => pl.PermissionLevel)
                .Include(jtt => jtt.JobTitleType)
                .FirstOrDefault(u => u.UserId == UserId);
        }

        public int GetLastProposalId (int UserId)
        {
            return int.Parse(GetUserProfile(UserId, "LastProposalId"));
        }

        public void SetLastProposalId(int UserId, int ProposalId)
        {
            SetUserProfile(UserId, "LastProposalId", ProposalId.ToString());
        }

        public int GetLastScheduleId(int UserId)
        {
            return int.Parse(GetUserProfile(UserId, "LastProposalId"));
        }

        public void SetLastScheduleId(int UserId, int ScheduleId)
        {
            SetUserProfile(UserId, "LastScheduleId", ScheduleId.ToString());
        }


        public string GetUserProfile (int UserId, string Key)
        {
            try
            {
                UserProfile up = _context.UserProfiles
                    .Where(u => u.UserProfileUserId == UserId && u.ProfileKey == Key).FirstOrDefault<UserProfile>();
                 //if (up == null) //'PK'
                  //  return null;
                //    return null;

                return up?.ProfileValue;
            }
            catch (Exception)
            {
                return "";
            }
        }

        public void SetUserProfile (int UserId, string Key, string Value)
        {
            int retval = 0;
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_UserProfile_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("Key", Key, DbType.String);
                dbparams.Add("Value", Value, DbType.String);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to save User Profile. " + exc.Message);

            }
        }


        public int SetFinanceUser(int LoggedOnUserId, int UserId, bool Set)
        {
            int retval = 0;
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_User_SetFinance";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("Set", Set, DbType.Int32);
                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);

                return retval;

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
                return 0;
            }
        }

        public void AddNetworkUserJob(int LoggedOnUserId, int UserId)
        {
            try
            {
                _context.Database.BeginTransaction();
                User user = GetUserById(UserId);
                _context.Entry(user).Reload();
                var lstNetworkUserJob = _context.NetworkUserJob.Where(x => x.UserId == UserId).ToList();

                if ((user.PermissionLevel.Description.ToLower() == "admin" || user.PermissionLevel.Description.ToLower() == "buyer" || user.PermissionLevel.Description.ToLower() == "assistant"))
                {
                    List<Network> networks = new List<Network>();
                    networks = _context.Networks
                    .Include(c => c.Country)
                    .OrderBy(n => n.StdNetName)
                    .ToList();

                    if (user.US_User == true && user.CA_User == true)
                    {
                        networks = networks
                            .Where(c => c.Country.CountryShort.ToLower() == "ca" || c.Country.CountryShort.ToLower() == "us")
                            .OrderByDescending(c => c.Country.CountryId)
                            .ThenBy(n => n.StdNetName)
                            .ToList();
                    }
                    else if (user.US_User == true && user.CA_User == false)
                    {
                        networks = networks
                            .Where(c => c.Country.CountryShort.ToLower() == "us")
                            .OrderBy(n => n.StdNetName)
                            .ToList();

                    }
                    else if (user.US_User == false && user.CA_User == true)
                    {
                        networks = networks
                            .Where(c => c.Country.CountryShort.ToLower() == "ca")
                            .OrderBy(n => n.StdNetName)
                            .ToList();

                    }
                    else
                    {
                        networks.Clear();
                    }
                    if (networks.Count() > 0 && lstNetworkUserJob.Count() == 0)
                    {
                        foreach (Network n in networks)
                        {
                            NetworkUserJob obj = new NetworkUserJob();
                            obj.CreateDt = DateTime.Now;
                            obj.JobId = 2;
                            obj.NetworkId = n.NetworkId;
                            obj.PlanYr = n.PlanYr;
                            obj.UserId = UserId;
                            obj.UpdatedByUserId = LoggedOnUserId;
                            obj.UpdateDt = DateTime.Now;
                            _context.NetworkUserJob.Add(obj);

                        }
                        _context.SaveChanges();                        
                        if (user.US_User == true && user.CA_User == true)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Assigned all Networks to " + user.DisplayName);
                        }
                        else if (user.US_User == true && user.CA_User == false)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Assigned all US Networks to " + user.DisplayName);
                        }
                        else if (user.US_User == false && user.CA_User == true)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Assigned all CA Networks to " + user.DisplayName);
                        }
                    }
                    else if(networks.Count() > 0 && lstNetworkUserJob.Count() > 0)
                    {
                        var lstNUJ = _context.NetworkUserJob.Where(x => x.UserId == UserId && networks.Select(y => y.NetworkId).Contains(x.NetworkId) && x.JobId != 2).ToList();                            
                        var lstNetworks = networks.Where(x=>!lstNetworkUserJob.Select(y => y.NetworkId).Contains(x.NetworkId)).ToList();
                        if (lstNUJ.Count() > 0 || lstNetworks.Count() > 0)
                        {
                            if (lstNUJ.Count() > 0)
                            {
                                lstNUJ.ForEach(x => { x.JobId = 2; x.UpdatedByUserId = LoggedOnUserId; x.UpdateDt = DateTime.Now; });
                            }
                            if (lstNetworks.Count() > 0)
                            {
                                foreach (Network n in lstNetworks)
                                {
                                    NetworkUserJob obj = new NetworkUserJob();
                                    obj.CreateDt = DateTime.Now;
                                    obj.JobId = 2;
                                    obj.NetworkId = n.NetworkId;
                                    obj.PlanYr = n.PlanYr;
                                    obj.UserId = UserId;
                                    obj.UpdatedByUserId = LoggedOnUserId;
                                    obj.UpdateDt = DateTime.Now;
                                    _context.NetworkUserJob.Add(obj);
                                }
                            }
                            _context.SaveChanges();
                            if (user.US_User == true && user.CA_User == true)
                            {
                                _logger.LogInformation(LoggedOnUserId, "Assigned all Networks to " + user.DisplayName);
                            }
                            else if (user.US_User == true && user.CA_User == false)
                            {
                                _logger.LogInformation(LoggedOnUserId, "Assigned all US Networks to " + user.DisplayName);
                            }
                            else if (user.US_User == false && user.CA_User == true)
                            {
                                _logger.LogInformation(LoggedOnUserId, "Assigned all CA Networks to " + user.DisplayName);
                            }
                        }
                    }
                }
                _context.Database.CommitTransaction();
            }
            catch (Exception exc)
            {
                _context.Database.RollbackTransaction();
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
            }
        }

        public void RemoveNetworkUserJobClientUserJob(int LoggedOnUserId, int UserId)
        {
            try
            {
                _context.Database.BeginTransaction();
                User user = GetUserById(UserId);
                _context.Entry(user).Reload();
                var lstNetworkUserJob = _context.NetworkUserJob.Where(x => x.UserId == UserId && x.JobId != 4).ToList();
                var successNUJ = false;
                var successCUJ = false;
                if (user.PermissionLevel.Description.ToLower() == "general" && lstNetworkUserJob.Count() > 0)
                {                    
                    _context.NetworkUserJob.Where(x => x.UserId == UserId && x.JobId != 4).ToList().ForEach(x => { x.JobId = 4; x.UpdatedByUserId = LoggedOnUserId; x.UpdateDt = DateTime.Now; });
                    _context.SaveChanges();
                    successNUJ = true;
                }
                var lstClientkUserJob = _context.ClientUserJob.Where(x => x.UserId == UserId && x.JobId != 4).ToList();

                if (user.PermissionLevel.Description.ToLower() == "general" && lstClientkUserJob.Count() > 0)
                {  
                    _context.ClientUserJob.Where(x => x.UserId == UserId && x.JobId != 4).ToList().ForEach(x => { x.JobId = 4; x.UpdatedByUserId = LoggedOnUserId; x.UpdateDt = DateTime.Now; });
                    _context.SaveChanges();
                    successCUJ = true;                    
                }
                if (successNUJ)
                {
                    _logger.LogInformation(LoggedOnUserId, "Removed all Networks assigned to " + user.DisplayName);
                }
                if (successCUJ)
                {
                    _logger.LogInformation(LoggedOnUserId, "Removed all Clients assigned to " + user.DisplayName);
                }
                _context.Database.CommitTransaction();
                
            }
            catch (Exception exc)
            {
                _context.Database.RollbackTransaction();
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
            }
        }
        public void SetUserCAExchRate(int LoggedOnUserId, int UserId, bool CAClientExchRate, bool CAActualExchRate)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                User user = GetUserById(UserId);
                // ST-946 Code Implementation with Dapper
                CAExchangeRateModel caExchangeRate = new CAExchangeRateModel();
                string spName = "sp_User_SetCAExchRate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("CAClientExchRate", CAClientExchRate, DbType.Boolean);
                dbparams.Add("CAActualExchRate", CAActualExchRate, DbType.Boolean);
                //dbparams.Add("GetAll", false, DbType.Boolean);
                caExchangeRate = FactoryServices.dbFactory.SelectCommand_SP(caExchangeRate, spName, dbparams);

                if (caExchangeRate.CAClientExchRateSuccess)
                {
                    if (CAClientExchRate)
                    {
                        _logger.LogInformation(LoggedOnUserId, "Assigned CA Client Exchange Rate permission to "+ user.DisplayName);
                    }
                    else
                    {
                        _logger.LogInformation(LoggedOnUserId, "Removed CA Client Exchange Rate permission assigned to " + user.DisplayName);
                    }

                }
                if (caExchangeRate.CAActualExchRateSuccess)
                {
                    if (CAActualExchRate)
                    {
                        _logger.LogInformation(LoggedOnUserId, "Assigned CA Actual Exchange Rate permission to " + user.DisplayName);
                    }
                    else
                    {
                        _logger.LogInformation(LoggedOnUserId, "Removed CA Actual Exchange Rate permission assigned to " + user.DisplayName);
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
            }
            finally
            {
                //_spcontext.Database.GetDbConnection().Close();
            }
        }

        public Dictionary<string,bool> GetUserCAExchRate(int LoggedOnUserId, int UserId)
        {

            Dictionary<string,bool> dct = new Dictionary<string,bool>();
            try
            {
                // ST-946 Code Implementation with Dapper
                CAExchangeRateModel caExchangeRate = new CAExchangeRateModel();
                string spName = "sp_User_GetCAExchRate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UserId", UserId, DbType.Int32);
                //dbparams.Add("GetAll", false, DbType.Boolean);
                caExchangeRate = FactoryServices.dbFactory.SelectCommand_SP(caExchangeRate, spName, dbparams);
                if (caExchangeRate != null)
                {
                    dct.Add("CAClientExchangeRate", caExchangeRate.CAClientExchangeRate);
                    dct.Add("CAActualExchangeRate", caExchangeRate.CAActualExchangeRate);
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
            }
            finally
            {
                _spcontext.Database.GetDbConnection().Close();
            }
            return dct;
        }

        public void SetUserCountry(int LoggedOnUserId, int UserId, bool USBuyer, bool CABuyer)
        {
            try
            {
                // ST-946 Code Implementation with Dapper
                User user = GetUserById(UserId);
                UserCountryModel userCountryModel = new UserCountryModel();
                string spName = "sp_User_SetCountry";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("USBuyer", USBuyer, DbType.Boolean);
                dbparams.Add("CABuyer", CABuyer, DbType.Boolean);

                userCountryModel = FactoryServices.dbFactory.SelectCommand_SP(userCountryModel, spName, dbparams);
               
                if (userCountryModel.USBuyerSuccess)
                {
                    if (USBuyer)
                    {
                        _logger.LogInformation(LoggedOnUserId, "Assigned US Buyer permission to " + user.DisplayName);
                    }
                    else
                    {
                        _logger.LogInformation(LoggedOnUserId, "Removed US Buyer permission assigned to " + user.DisplayName);

                        if (userCountryModel.USClientCnt > 0)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed US "+ (userCountryModel.USClientCnt > 1 ? "Clients":"Client") + " assigned to " + user.DisplayName);
                        }
                        if (userCountryModel.USNetworkCnt > 0)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed US " + (userCountryModel.USNetworkCnt > 1 ? "Networks" : "Network") + " assigned to " + user.DisplayName);
                        }
                        
                    }

                }
                if (userCountryModel.CABuyerSuccess)
                {
                    if (CABuyer)
                    {
                         _logger.LogInformation(LoggedOnUserId, "Assigned CA Buyer permission to " + user.DisplayName);
                    }
                    else
                    {
                        _logger.LogInformation(LoggedOnUserId, "Removed CA Buyer permission assigned to " + user.DisplayName);

                        if (userCountryModel.CAClientCnt > 0)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed CA " + (userCountryModel.CAClientCnt > 1 ? "Clients" : "Client") + " assigned to " + user.DisplayName);
                        }
                        if (userCountryModel.CANetworkCnt > 0)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed CA " + (userCountryModel.CANetworkCnt > 1 ? "Networks" : "Network") + " assigned to " + user.DisplayName);
                        }                       
                        
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
            }
        }
        public void SetClientManagementUserPermission(int LoggedOnUserId, int UserId, bool Digital, bool Local, bool Podcast)
        {
            try
            {
                var user = _context.Users.Where(x => x.UserId == UserId).Single();

                if (user.IsDigital != Digital)
                {
                    user.IsDigital = Digital;
                    int result = _context.SaveChanges();
                    if (result > 0)
                    {
                        if (Digital)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Assigned Client Management - Digital permission to " + user.DisplayName);
                        }
                        else
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed Client Management - Digital permission assigned to " + user.DisplayName);

                        }
                    }
                }
                if (user.IsLocal != Local)
                {
                    user.IsLocal = Local;
                    int result = _context.SaveChanges();
                    if (result > 0)
                    {
                        if (Local)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Assigned Client Management - Local permission to " + user.DisplayName);
                        }
                        else
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed Client Management - Local permission assigned to " + user.DisplayName);

                        }
                    }
                }
                if (user.IsPodcast != Podcast)
                {
                    user.IsPodcast = Podcast;
                    int result = _context.SaveChanges();
                    if (result > 0)
                    {
                        if (Podcast)
                        {
                            _logger.LogInformation(LoggedOnUserId, "Assigned Client Management - Podcast permission to " + user.DisplayName);
                        }
                        else
                        {
                            _logger.LogInformation(LoggedOnUserId, "Removed Client Management - Podcast permission assigned to " + user.DisplayName);

                        }
                    }
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc, exc.Message);
            }
        }
    }
}
