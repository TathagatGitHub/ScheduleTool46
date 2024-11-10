using Dapper;
using OM_ScheduleTool.Dapper;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Repositories
{
    public interface IClientRepository
    {
        List<Client> GetAllClients();

        IEnumerable<Client> GetAllClientsByCountry(int CountryId);

        List<EdiClientLookup> GetClientAliases(int ClientId);

        List<Country> GetAllCountries();

        List<Job> GetAllJobs();

        Client GetClient(int clientid);

        List<ClientUserJob> GetClientUserJobs(int JobId, int UserId);

        List<Client> GetAllClientsExceptJobId(int JobId, int UserId);

        IEnumerable<ErrorMessage> ChangeClientJob(int[] ClientIds, int UserId, int NewJobId, int UpdatedByUserId);

        ErrorMessage AddClient(string ClientName, int CountryId, bool IsNewClient, int UserId, int ContractClientId, bool IsParentClient, bool IsDigital, bool IsLinear, bool IsLocal, bool IsPodcast);

        ErrorMessage EditClient(int ClientId, string NewClientName, int UserId, bool IsActiveClient, bool IsDigital, bool IsLocal, bool IsPodcast);

        ErrorMessage AddClientAlias(int ClientId, string AliasName, int UserId);

        ErrorMessage DeleteClientAlias(int AliasId, int UserId);

        decimal GetClientRate(int ClientId, int UserId);

        decimal GetAvgClientRate(int UserId);

        IEnumerable<ClientAlias> GetAllClientsandAliasesList(int LoggedOnUserId);
        #region Code for Adding Client details in Utilitydatabase and Datawarehouse//ST-780 Code Start Here
        ErrorMessage AddUtilityClient(int ClientId, string ClientName, int CountryId, bool IsNewClient, int UserId, int ContractClientId, bool IsParentClient, bool IsActive, bool IsAdd, bool IsDigital, bool IsLocal, bool IsPodcast);

        ErrorMessage AddDatawarehouseClient(int ClientId, string ClientName, int CountryId, int UserId, int ContractClientId, bool IsActive, bool IsAdd);
        #endregion

        List<string> GetClientNameandAlias(string ClientName, int LoggedOnUserId);

        bool IsClientExist(string ClientName, int LoggedOnUserId);

    }
}
