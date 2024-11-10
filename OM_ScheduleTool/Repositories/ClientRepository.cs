using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
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
using System.Runtime.ConstrainedExecution;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using OfficeOpenXml.FormulaParsing.Excel.Functions.Engineering;

namespace OM_ScheduleTool.Repositories
{
    public class ClientRepository : IClientRepository
    {
        private AppContext _context;
        private IUserRepository _userRepository;
        private ILogger<ClientRepository> _logger;
        private IConfiguration _config;


        public ClientRepository(AppContext context
            , IUserRepository userRepository
            , ILogger<ClientRepository> logger,
            IConfiguration config
            )
        {
            _context = context;
            _userRepository = userRepository;

            _logger = logger;
            _config = config;
        }

        public List<Client> GetAllClients()
        {
            return _context.Clients
                .Include (c => c.Country)
                .OrderBy (c => c.ClientName)
                .ToList();

        }

        public IEnumerable<Client> GetAllClientsByCountry(int CountryId)
        {
            return _context.Clients
                .Where (cl => cl.ClientName != "Not A Client")
                .Where (co => co.CountryId == CountryId)
                .Where (co => co.Active == true)
                .OrderBy(c => c.ClientName)
                .AsEnumerable();
        }

        public List<EdiClientLookup> GetClientAliases(int ClientId)
        {
            return _context.EdiClientLookup
                .Where(c => c.Client.ClientId == ClientId)
                .OrderBy(n => n.EdiClientName)
                .ToList();

        }

        public List<Country> GetAllCountries()
        {
            return _context.Countries
                .Where(c => c.IncludeInNetwork == true)
                .OrderBy(n => n.SortKey)
                .ToList();
        }

        public List<Job> GetAllJobs ()
        {
            return _context.Jobs.ToList();
        }

        public Client GetClient (int clientid)
        {
            return _context
                .Clients
                .Include (ct => ct.Country)
                .Where(c => c.ClientId == clientid).FirstOrDefault<Client> ();
        }

        public ErrorMessage AddClient(string ClientName, int CountryId, bool IsNewClient, int UserId, int ContractClientId, bool IsParentClient, bool IsDigital, bool IsLinear, bool IsLocal, bool IsPodcast)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientName", ClientName, DbType.String);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("NewClient", IsNewClient, DbType.Boolean);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("ContractClientId", ContractClientId, DbType.Int32);
                dbparams.Add("IsParentClient", IsParentClient, DbType.Boolean);
                dbparams.Add("IsDigital", IsDigital, DbType.Boolean);
                dbparams.Add("IsLinear", IsLinear, DbType.Boolean);
                dbparams.Add("IsLocal", IsLocal, DbType.Boolean);
                dbparams.Add("IsPodcast", IsPodcast, DbType.Boolean);

                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
                //ST-780 Code to update the Client Details iin Utility and Datawarehouse
                if (em.Success)
                {
                    em.ErrUtility = AddUtilityClient(em.ResponseCode, ClientName, CountryId, IsNewClient, UserId, ContractClientId, IsParentClient, IsLinear, true, IsDigital, IsLocal, IsPodcast);

                    var IsActive = false;
                    if (IsLinear || IsDigital || IsLocal || IsPodcast)
                    {
                        IsActive = true;
                    }
                    em.ErrDatawarehoue = AddDatawarehouseClient(em.ResponseCode, ClientName, CountryId, UserId, ContractClientId, IsActive, true);
                }
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;
            }

            return em;
        }


        public int GetClientActiveStatus(int ClientId, int UserId)
        {
            ErrorMessage em = new ErrorMessage();
            // ST-946 Code Implementation with Dapper
            try
            {

                string spName = "sp_GetClientActiveStatus";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Error GetClientActiveStatus. ClientId:- (" + string.Join(", ", ClientId) + "). Error:- " + exc.Message);
            }


            return em.ResponseCode;

        }

        public ErrorMessage ChangeJobOnSettingClientInActive(int ClientId,int UserId)
        {
            ErrorMessage em = new ErrorMessage();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_ChangeJob_OnSettingClientInActive";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("NewJobId", 4, DbType.Int32);
                dbparams.Add("UpdatedByUserId", UserId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Error ChangeJobOnSettingClientInActive. ClientId:- (" + string.Join(", ", ClientId) + "). Error:- " + exc.Message);
            }
            return em;
        }

        public ErrorMessage EditClient(int ClientId, string NewClientName, int UserId, bool IsActiveClient, bool IsDigital, bool IsLocal, bool IsPodcast)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                int clientActiveStatus = -1;
                clientActiveStatus = GetClientActiveStatus(ClientId, UserId);

                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_Edit";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("NewClientName", (NewClientName == null ? "" : NewClientName), DbType.String);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("IsActiveClient", IsActiveClient, DbType.Boolean);
                dbparams.Add("IsDigital", IsDigital, DbType.Boolean);
                dbparams.Add("IsLocal", IsLocal, DbType.Boolean);
                dbparams.Add("IsPodcast", IsPodcast, DbType.Boolean);

                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);

                //Update Client Job to status = 4 for this clientid if IsActiveClient is false (InActive)
                if (!IsActiveClient && clientActiveStatus == 1)
                {
                    ChangeJobOnSettingClientInActive(ClientId, UserId);
                }
                //ST-780 Code to update the Client Details iin Utility and Datawarehouse
                if (em.Success)
                {
                    em.ErrUtility = AddUtilityClient(ClientId, (NewClientName == null ? "" : NewClientName), 0, false, UserId, 0, false, IsActiveClient, false, IsDigital, IsLocal, IsPodcast);
                    if (IsActiveClient || IsDigital || IsLocal || IsPodcast)
                    {
                        IsActiveClient = true;
                    }
                    em.ErrDatawarehoue = AddDatawarehouseClient(ClientId, (NewClientName == null ? "" : NewClientName), 0, UserId, 0, IsActiveClient, false);
                }
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;
            }
            return em;
        }

        public decimal GetClientRate (int ClientId, int UserId)
        {
            decimal retval = 0;
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_GetCommRate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);

                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message, UserId);
                return (decimal) -1.0;
            }
        }

        public decimal GetAvgClientRate(int UserId)
        {
            decimal retval = 0;
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_GetAvgCommRate";
                DynamicParameters dbparams = new DynamicParameters();

                retval = FactoryServices.dbFactory.SelectCommand_SP(retval, spName, dbparams);
                return retval;
            }
            catch (Exception exc)
            {
                _logger.LogError(exc.Message, UserId);
                return (decimal)-1.0;
            }
        }

        public ErrorMessage AddClientAlias (int ClientId, string AliasName, int UserId)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_AddAlias";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("AliasName", (AliasName == null ? "" : AliasName), DbType.String);
                dbparams.Add("UserId", UserId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;
            }

            return em;
        }

        public ErrorMessage DeleteClientAlias(int AliasId, int UserId)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_DeleteAlias";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("AliasId", AliasId, DbType.Int32);
                dbparams.Add("UserId", UserId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, " Failed to add new client.  " + exc.Message);

                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = "Failed to add new client.  Please contact administrator.";
            }

            return em;
        }

        public List<ClientUserJob> GetClientUserJobs(int JobId, int UserId)
        {
            Models.User user = _userRepository.GetUserById(UserId);
            if (JobId == 0)
            {

                return _context
                    .ClientUserJob
                    .Include (j => j.Job)
                    .Include (c => c.Client)
                    .Include(co => co.Client.Country)
                    //.OrderBy (c => c.Client.ClientName)
                    .ToList();
            }
            // 1 -- Assistant
            // 2 -- Buyer
            // 3 -- Backup
            // 4 -- None
            else
            {
                if (JobId == 4) // None
                {
                    List<ClientUserJob> cuj = new List<ClientUserJob>();
                    cuj = _context
                            .ClientUserJob
                            .Include(j => j.Job)
                            .Include(c => c.Client)
                            .Include(co => co.Client.Country)
                            .Include(u => u.User)
                            .Where(j => j.Job.JobId == JobId)
                            .Where(u => u.User.UserId == UserId)
                            .ToList();

                    List<Client> clients = new List<Client>();
                    clients = GetAllClients();

                    bool Found = false;
                    foreach (Client cli in clients)
                    {
                        Found = false;
                        foreach (ClientUserJob cliusejob in cuj)
                        {
                            if (cliusejob.Client.ClientId == cli.ClientId)
                            {
                                Found = true;
                                break;
                            }
                        }

                        if (Found == false)
                        {
                            ClientUserJob newcuj = new ClientUserJob();
                            newcuj.Client = cli;
                            cuj.Add(newcuj);
                        }
                    }

                    if (user.US_User == true && user.CA_User == true)
                    {
                        return cuj.OrderBy(c => c.Client.ClientName).ToList();
                    }
                    else if (user.US_User == true && user.CA_User == false)
                    {
                        return cuj
                            .Where (c => c.Client.Country.CountryShort == "US")
                            .OrderBy(c => c.Client.ClientName)
                            .ToList();
                    }
                    else if (user.US_User == false && user.CA_User == true)
                    {
                        return cuj
                            .Where(c => c.Client.Country.CountryShort == "CA")
                            .OrderBy(c => c.Client.ClientName)
                            .ToList();
                    }
                    else
                    {
                        cuj.Clear();
                        return cuj.ToList();
                    }
                }
                else
                {
                    if (user.US_User == true && user.CA_User == true)
                    {
                        return _context
                            .ClientUserJob
                            .Include(j => j.Job)
                            .Include(c => c.Client)
                            .Include(co => co.Client.Country)
                            .Include(u => u.User)
                            .Where(j => j.Job.JobId == JobId)
                            .Where(u => u.User.UserId == UserId)
                            .Where(co => co.Client.Country.CountryShort == "US" || co.Client.Country.CountryShort == "CA")
                            .OrderByDescending (c => c.Client.Country.CountryShort)
                            .ThenBy(c => c.Client.ClientName)
                            .ToList();
                    }
                    else if (user.US_User == true && user.CA_User == false)
                    {
                        return _context
                            .ClientUserJob
                            .Include(j => j.Job)
                            .Include(c => c.Client)
                            .Include(co => co.Client.Country)
                            .Include(u => u.User)
                            .Where(j => j.Job.JobId == JobId)
                            .Where(u => u.User.UserId == UserId)
                            .Where(co => co.Client.Country.CountryShort == "US")
                            .OrderBy(c => c.Client.ClientName)
                            .ToList();
                    }
                    else if (user.US_User == false && user.CA_User == true)
                    {
                        return _context
                            .ClientUserJob
                            .Include(j => j.Job)
                            .Include(c => c.Client)
                            .Include(co => co.Client.Country)
                            .Include(u => u.User)
                            .Where(j => j.Job.JobId == JobId)
                            .Where(u => u.User.UserId == UserId)
                            .Where(co => co.Client.Country.CountryShort == "CA")
                            .OrderBy(c => c.Client.ClientName)
                            .ToList();
                    }
                    else
                    {
                        return new List<ClientUserJob>();
                    }
                }
            }
        }

        public List<Client> GetAllClientsExceptJobId(int JobId, int UserId)
        {
            Models.User user = _userRepository.GetUserById(UserId);
            List<Client> clients = new List<Client>();
            clients = GetAllClients ();

            List<ClientUserJob> clientuserjobs = GetClientUserJobs(JobId, UserId).ToList();
            foreach (ClientUserJob cuj in clientuserjobs)
            {
                List<Client> searchCli = clients.Where(c => c.ClientId == cuj.Client.ClientId).ToList();
                if (searchCli.Count > 0)
                {
                    clients.Remove(searchCli[0]);
                }
            }

            if (user.US_User == true && user.CA_User == true)
            {
                return clients
                    .Where(c => c.Country.CountryShort == "CA" || c.Country.CountryShort == "US")
                    .OrderByDescending(c => c.Country.CountryId)
                    .ThenBy (c => c.ClientName)
                    .ToList();
            }
            else if (user.US_User == true && user.CA_User == false)
            {
                return clients
                    .Where(c => c.Country.CountryShort == "US")
                    .OrderBy(c => c.ClientName)
                    .ToList();

            }
            else if (user.US_User == false && user.CA_User == true)
            {
                return clients
                    .Where(c => c.Country.CountryShort == "CA")
                    .OrderBy(c => c.ClientName)
                    .ToList();

            }
            else
            {
                clients.Clear();
                return clients.ToList();
            }

        }

        public IEnumerable<ErrorMessage> ChangeClientJob(int[] ClientIds, int UserId, int NewJobId, int UpdatedByUserId)
        {
            List<ErrorMessage> lstEm = new List<ErrorMessage>();
            ErrorMessage em = null;
            try
            {
                ////Client client = GetClient (ClientId);
                //DataTable table2 = new DataTable();
                //table2.Columns.Add("id", typeof(int));
                //foreach (int clientid in ClientIds)
                //{
                //    table2.Rows.Add(clientid);
                //}
                //_context.Database.GetDbConnection().Open();
                //DbCommand command = _context.Database.GetDbConnection().CreateCommand();
                //command.CommandText = "sp_Client_ChangeJob ";
                //command.CommandType = CommandType.StoredProcedure;

                //SqlParameter paramNewJobId = new SqlParameter("@NewJobId", SqlDbType.Int);
                //SqlParameter paramClientId = new SqlParameter("@ClientIds", SqlDbType.Structured);
                //SqlParameter paramUserId = new SqlParameter("@UserId", SqlDbType.Int);
                //SqlParameter paramUpdatedByUserId = new SqlParameter("@UpdatedByUserId", SqlDbType.Int);

                //paramNewJobId.Value = NewJobId;
                //paramClientId.TypeName = "dbo.SingleColumnId";
                //paramClientId.Value = table2;
                //paramUserId.Value = UserId;
                //paramUpdatedByUserId.Value = UpdatedByUserId;

                //command.Parameters.Add(paramNewJobId);
                //command.Parameters.Add(paramClientId);
                //command.Parameters.Add(paramUserId);
                //command.Parameters.Add(paramUpdatedByUserId);

                //using (DbDataReader reader = command.ExecuteReader())
                //{
                //    while (reader.Read())
                //    {
                //        em = new ErrorMessage();
                //        em.Success = (bool)reader["Success"];
                //        em.ResponseCode = (int)reader["responseCode"];
                //        em.ResponseText = reader["responseText"].ToString();
                //        lstEm.Add(em);
                //    }

                //}

                // ST-946 Code Implementation with Dapper
                DataTable table = new DataTable();
                table.Columns.Add("id", typeof(int));
                foreach (int clientid in ClientIds)
                {
                    table.Rows.Add(clientid);
                }
                string spName = "sp_Client_ChangeJob";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NewJobId", NewJobId, DbType.Int32);
                dbparams.Add("ClientIds", table.AsTableValuedParameter("dbo.SingleColumnId"));

                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("UpdatedByUserId", UpdatedByUserId, DbType.Int32);

                lstEm = FactoryServices.dbFactory.SelectCommand_SP(lstEm, spName, dbparams);
            }
            catch (Exception exc)
            {
                em = new ErrorMessage();
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;

                _logger.LogError(UserId, "Unabled to change client job.  (" + string.Join(", ", ClientIds) + ") " + exc.Message);

            }

            return lstEm;
        }

        public IEnumerable<ClientAlias> GetAllClientsandAliasesList(int LoggedOnUserId)
        {
            List<ClientAlias> lstClientAliases = new List<ClientAlias>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Client_GetAllClientsAndAliases";
                DynamicParameters dbparams = new DynamicParameters();
                lstClientAliases = FactoryServices.dbFactory.SelectCommand_SP(lstClientAliases, spName, dbparams);
                return lstClientAliases;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc.Message);
            }
            return lstClientAliases;
        }
        #region Code for Adding Client details in Utilitydatabase and Datawarehouse//ST-780 Code Start Here
        public ErrorMessage AddUtilityClient(int ClientId,string ClientName, int CountryId, bool IsNewClient, int UserId, int ContractClientId, bool IsParentClient,bool IsActive,bool IsAdd, bool IsDigital, bool IsLocal, bool IsPodcast)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                // Code Implementation with Dapper
                string spName = "sp_UtilityClient_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("ClientName", ClientName, DbType.String);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("NewClient", IsNewClient, DbType.Boolean);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("ContractClientId", ContractClientId, DbType.Int32);
                dbparams.Add("IsParentClient", IsParentClient, DbType.Boolean);
                dbparams.Add("IsActive", IsActive, DbType.Boolean);
                dbparams.Add("IsAdd", IsAdd, DbType.Boolean);
                dbparams.Add("IsDigital", IsDigital, DbType.Boolean);
                dbparams.Add("IsLocal", IsLocal, DbType.Boolean);
                dbparams.Add("IsPodcast", IsPodcast, DbType.Boolean);

                em = FactoryServices.dbFactory.SelectCommand_SP_CustomeConnection(em, spName, dbparams, _config.GetSection("ConnectionStrings:UtilityDBConnection").Value.ToString());
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;
                _logger.LogError(UserId, "Failed to Add Client in Utility Database client table sp_UtilityClient_Add. | " + exc.Message + " | " + exc.StackTrace);
            }

            return em;
        }
        public ErrorMessage AddDatawarehouseClient(int ClientId,string ClientName, int CountryId, int UserId, int ContractClientId, bool IsActive, bool IsAdd)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                // Code Implementation with Dapper
                string spName = "sp_DataWarehouseClient_Add";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("ClientId", ClientId, DbType.Int32);
                dbparams.Add("ClientName", ClientName, DbType.String);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("ContractClientId", ContractClientId, DbType.Int32);
                dbparams.Add("IsActive", IsActive, DbType.Int32);
                dbparams.Add("IsAdd", IsAdd, DbType.Boolean);

                em = FactoryServices.dbFactory.SelectCommand_SP_CustomeConnection(em, spName, dbparams, _config.GetSection("ConnectionStrings:DataWarehouseDBConnection").Value.ToString());
            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;
                _logger.LogError(UserId, "Failed to Add Client/Update in Datawarehouse Database DimClient table sp_DataWarehouseClient_Add. | " + exc.Message + " | " + exc.StackTrace);
            }

            return em;
        }
        #endregion

        public List<string> GetClientNameandAlias(string ClientName, int LoggedOnUserId)
        {
            ClientName = ClientName.Trim().Replace(" ", "");
            List<string> lst = new List<string>();
            try
            {
                lst = (from c in _context.Clients where c.ClientName.Trim().Replace(" ", "").StartsWith(ClientName) select c.ClientName).Union(from e in _context.EdiClientLookup where e.EdiClientName.Trim().Replace(" ", "").StartsWith(ClientName) select e.EdiClientName).ToList();

                return lst;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc.Message);
            }
            return lst;
        }
        public bool IsClientExist(string ClientName, int LoggedOnUserId)
        {
            ClientName = ClientName.Trim().Replace(" ", "");
            List<string> lst = new List<string>();
            try
            {
                lst = (from c in _context.Clients where c.ClientName.Trim().Replace(" ", "") == ClientName select c.ClientName).Union(from e in _context.EdiClientLookup where e.EdiClientName.Trim().Replace(" ", "") == ClientName select e.EdiClientName).ToList();

                return lst.Count > 0 ? true : false;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc.Message);
            }
            return false;

        }

    }
}

