using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public interface INetworkRepository
    {
        Country GetCountry(int CountryId);
        List<Country> GetAllCountries();

        List<Network> GetAllNetworks();
        IEnumerable<Network> GetAllNetworksByCountry(int CountryId);
        List<Client> GetAllClients();
        Network GetNetwork(int NetworkId);
        Network GetNetworkByName(string NetworkName, int CountryId);
        List<EdiNetworkLookup> GetAllAliases();

        MediaType GetMediaType(int MediaTypeId);
        List<MediaType> GetAllMediaTypes();

        FeedType GetFeedType(int FeedTypeId);
        List<FeedType> GetAllFeedTypes();

        int SaveNewNetwork(Network network);
        int SaveNewNetwork(int LoggedOnUserId, string networkName, int mediaTypeId, int feedTypeId, int countryId);
        void EditNetwork(int NetworkId, string NetworkName, User LoggedOnUser);

        void AddNetworkAlias(int NetworkId, string AliasName, User user);
        void DeleteNetworkAlias(int LoggedOnUserId, int AliasId);

        List<NetworkUserJob> GetNetworkUserJobs(int JobId, int UserId);
        List<Network> GetUnassignedNetworkUserJobs(int JobId, int UserId);
        List<Network> GetUniqueNetworkByUserID(int UserId, int CountryId);
        IEnumerable<NetworkAlias> GetNetworkAliasList(int LoggedOnUserId);

        ErrorMessage ChangeNetworkJob(int NetworkId, int UserId, int NewJobId, int UpdatedByUserId);

        List<Network> GetNetworksForCreate(int CountryId, string QuarterName, int ClientId, int DemographicSettingsId, int LoggedOnUserId);
        List<Network> GetNetworksForDemoProposal(int DemographicSettingsId, int ProposalId, int LoggedOnUserId);

    }
}
