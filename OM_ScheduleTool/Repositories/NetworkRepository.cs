using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
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

namespace OM_ScheduleTool.Models
{
    public class NetworkRepository : INetworkRepository
    {
        private AppContext _context;
        private IUserRepository _userRepository;
        private ILogger<ClientRepository> _logger;

        public bool Networks { get; private set; }

        public NetworkRepository(AppContext context
            , IUserRepository userRepository
            , ILogger<ClientRepository> logger)
        {
            _context = context;
            _userRepository = userRepository;
            _logger = logger;
        }

        public Country GetCountry(int CountryId)
        {
            return GetAllCountries().Where(c => c.CountryId == CountryId).FirstOrDefault<Country>();
        }

        public List<Country> GetAllCountries()
        {
            return _context.Countries
                .Where(c => c.IncludeInNetwork == true)
                .OrderBy(n => n.SortKey)
                .ToList();
        }

        public List<Network> GetAllNetworks()
        {
            return _context.Networks
                .Include(c => c.Country)
                .OrderBy(n => n.StdNetName)
                .ToList();
        }

        public IEnumerable<Network> GetAllNetworksByCountry(int CountryId)
        {
            return _context.Networks
                .Include(c => c.Country)
                .Where (c => c.CountryId == CountryId)
                .OrderBy(n => n.StdNetName)
                .ToList();
        }

        public Network GetNetwork(int NetworkId)
        {
            return _context.Networks
                .Include(c => c.Country)
                .Include(m => m.MediaType)
                .Include(f => f.FeedType)
                .Where(n => n.NetworkId == NetworkId)
                .FirstOrDefault<Network>();
        }

        public Network GetNetworkByName(string NetworkName, int CountryId)
        {
            return _context.Networks
                .Include(c => c.Country)
                .Include(m => m.MediaType)
                .Include(f => f.FeedType)
                .Where(n => n.StdNetName == NetworkName && n.CountryId == CountryId)
                .FirstOrDefault<Network>();
        }

        public IEnumerable<NetworkAlias> GetNetworkAliasList(int LoggedOnUserId)
        {
            List<NetworkAlias> na = new List<NetworkAlias>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Networks_GetAllNetworksAndAliases";
                DynamicParameters dbparams = new DynamicParameters();

                na = FactoryServices.dbFactory.SelectCommand_SP(na, spName, dbparams);
                return na;
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, exc.Message);
            }
           
            return na;
        }

        public List<Client> GetAllClients()
        {
            return _context.Clients
                .OrderBy(c => c.ClientName)
                .ToList();
        }

        public List<EdiNetworkLookup> GetAllAliases()
        {
            return _context.EdiNetworkLookup
                .Include(n => n.Network)
                .OrderBy(a => a.EdiNetName)
                .ToList();
        }

        public MediaType GetMediaType(int MediaTypeId)
        {
            return GetAllMediaTypes().Where(m => m.MediaTypeId == MediaTypeId).FirstOrDefault<MediaType>();
        }

        public List<MediaType> GetAllMediaTypes()
        {
            return _context.MediaTypes
                .OrderBy(a => a.MediaTypeName)
                .ToList();
        }

        public FeedType GetFeedType(int FeedTypeId)
        {
            return GetAllFeedTypes().Where(f => f.FeedTypeId == FeedTypeId).FirstOrDefault<FeedType>();
        }

        public List<FeedType> GetAllFeedTypes()
        {
            return _context.FeedTypes
                .OrderBy(f => f.Description)
                .ToList();
        }

        /*
         * SaveNetwork returns the id of the new entry
         */
        public int SaveNewNetwork(Network network)
        {
            _context.Networks.Add(network);
            _context.SaveChanges();

            Network NewNetwork = _context.Networks.Where(n => n.StdNetName == network.StdNetName).FirstOrDefault<Network>();

            return NewNetwork.NetworkId;
        }

        public int SaveNewNetwork(int LoggedOnUserId, string NetworkName, int MediaTypeId, int FeedTypeId, int CountryId)
        {
            if (_context.Networks.Where(m => m.StdNetName == NetworkName && m.CountryId == CountryId).FirstOrDefault() != null)
            {
                throw new Exception("Network name already exists.");
            }

            if (CountryId == 0)
            {
                throw new Exception("Invalid Country Selected.");
            }

            if (MediaTypeId == 0)
            {
                throw new Exception("Invalid Media Type.");
            }

            if (FeedTypeId == 0)
            {
                throw new Exception("Invalid Feed Type.");
            }

            try
            {
                this._context.Database.BeginTransaction();
                Network network = new Network();
                network.StdNetName = NetworkName;
                network.MediaType = _context.MediaTypes.Where(m => m.MediaTypeId == MediaTypeId).FirstOrDefault();
                network.FeedType = _context.FeedTypes.Where(f => f.FeedTypeId == FeedTypeId).FirstOrDefault();
                network.Country = _context.Countries.Where(c => c.CountryId == CountryId).FirstOrDefault();
                network.CreateDt = DateTime.Now;
                network.UpdateDt = DateTime.Now;

                _context.Networks.Add(network);
                _context.SaveChanges();

                _logger.LogInformation(LoggedOnUserId, "New network Id created.  (" + network.NetworkId + ") ");
                Network NewNetwork = _context.Networks.Where(n => n.NetworkId == network.NetworkId).FirstOrDefault<Network>();
                _logger.LogInformation(LoggedOnUserId, "New network name created.  (" + NetworkName + ") ");

                EdiNetworkLookup enl = new EdiNetworkLookup() { EdiNetName = NetworkName, CreateDt = DateTime.Now, Network = NewNetwork };
                _context.EdiNetworkLookup.Add(enl);
                _context.SaveChanges();
                this._context.Database.CommitTransaction();
                return NewNetwork.NetworkId;
            }
            catch (Exception exc)
            {
                this._context.Database.RollbackTransaction();
                _logger.LogError(LoggedOnUserId, "Unabled to add Network.  (" + NetworkName + ") " + exc.Message);
                throw new Exception(exc.Message);
            }
        }

        public void EditNetwork(int NetworkId, string NetworkName, User user)
        {
            Network network = _context.Networks.Where(n => n.NetworkId == NetworkId).FirstOrDefault();
            if (network == null)
            {
                throw new Exception("No network selected.");
            }


            if (network.StdNetName == NetworkName)
            {
                throw new Exception("Network name already exists in " + network.CountryId.ToString());
            }


            try
            {
                network.StdNetName = NetworkName;
                network.UpdateDt = DateTime.Now;
                network.UpdatedBy = user;

                _context.Entry(network).State = Microsoft.EntityFrameworkCore.EntityState.Modified;
                _context.SaveChanges();
            }
            catch (Exception exc)
            {
                _logger.LogError(user.UserId, "Unabled to save changes.  (" + NetworkName + ") " + exc.Message);
                throw new Exception(exc.Message);
            }
        }

        public void AddNetworkAlias(int NetworkId, string AliasName, User user)
        {
            Network network = _context.Networks.Where(n => n.NetworkId == NetworkId).Include(a => a.Country).FirstOrDefault();
            AliasName = network.Country.CountryShort == "CA" ? "CANADA_" + AliasName: AliasName;
            EdiNetworkLookup alias = _context.EdiNetworkLookup.Where(a => a.EdiNetName.ToLower() == AliasName.ToLower().Trim() && a.Network.CountryId.Equals(network.CountryId))
                                     .Include(n => n.Network)
                                     .FirstOrDefault<EdiNetworkLookup>();
            if (alias != null)
                throw new Exception($"This alias is already being used by { alias.Network.StdNetName} for the country {network.Country.CountryLong}({network.Country.CountryShort})");
            try
            { 
                EdiNetworkLookup enl = new EdiNetworkLookup();
                enl.EdiNetName = AliasName;
                enl.Network = _context.Networks.Where(n => n.NetworkId == NetworkId).FirstOrDefault<Network>();
                enl.UpdateDt = DateTime.Now;
                enl.UpdatedBy = user;

                _context.EdiNetworkLookup.Add(enl);
                _context.SaveChanges();
            }
            catch (Exception exc)
            {
                _logger.LogError(user.UserId, "Unabled to delete alias.  (" + AliasName + ") " + exc.Message);
                throw new Exception(exc.Message);
            }
        }

        public void DeleteNetworkAlias(int LoggedOnUserId, int AliasId)
        {
            try
            {
                EdiNetworkLookup enl = _context.EdiNetworkLookup.Where(a => a.EdiNetworkLookupId == AliasId).FirstOrDefault<EdiNetworkLookup>();
                _context.Remove(enl);
                _context.Entry(enl).State = Microsoft.EntityFrameworkCore.EntityState.Deleted;
                _context.SaveChanges();
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unabled to delete alias.  (" + AliasId.ToString() + ") " + exc.Message);
                throw new Exception(exc.Message);
            }
        }

        public List<NetworkUserJob> GetNetworkUserJobs(int JobId, int UserId)
        {
            User user = _userRepository.GetUserById(UserId);
            if (JobId == 0)
            {
                if (UserId == 0)
                {
                    return _context
                        .NetworkUserJob
                        .Include(j => j.Job)
                        .Include(n => n.Network)
                        .Include(co => co.Network.Country)
                        .OrderByDescending(co => co.Network.Country)
                        .OrderBy(n => n.Network.StdNetName)
                        .ToList();
                }
                else
                {
                    return _context
                        .NetworkUserJob
                        .Include(j => j.Job)
                        .Include(n => n.Network)
                        .Include(u => u.User)
                        .Include(co => co.Network.Country)
                        .Where(u => u.User.UserId == UserId)
                        .OrderByDescending(co => co.Network.Country)
                        .OrderBy(c => c.Network.StdNetName)
                        .ToList();

                }
            }
            // 1 -- Assistant
            // 2 -- Buyer
            // 3 -- Backup
            // 4 -- None
            else
            {
                if (user.US_User == true && user.CA_User == true)
                {
                    return _context
                    .NetworkUserJob
                    .Include(j => j.Job)
                    .Include(n => n.Network)
                    .Include(u => u.User)
                    .Include(co => co.Network.Country)
                    .Where(j => j.Job.JobId == JobId)
                    .Where(u => u.User.UserId == UserId)
                    .Where(co => co.Network.Country.CountryShort == "US" || co.Network.Country.CountryShort == "CA")
                    .OrderByDescending(co => co.Network.Country)
                    .OrderBy(c => c.Network.StdNetName)
                    .ToList();
                }
                else if (user.US_User == true && user.CA_User == false)
                {
                    return _context
                    .NetworkUserJob
                    .Include(j => j.Job)
                    .Include(n => n.Network)
                    .Include(u => u.User)
                    .Include(co => co.Network.Country)
                    .Where(j => j.Job.JobId == JobId)
                    .Where(u => u.User.UserId == UserId)
                    .Where(co => co.Network.Country.CountryShort == "US")
                    .OrderByDescending(co => co.Network.Country)
                    .OrderBy(c => c.Network.StdNetName)
                    .ToList();

                }
                else if (user.US_User == false && user.CA_User == true)
                {
                    return _context
                     .NetworkUserJob
                     .Include(j => j.Job)
                     .Include(n => n.Network)
                     .Include(u => u.User)
                     .Include(co => co.Network.Country)
                     .Where(j => j.Job.JobId == JobId)
                     .Where(u => u.User.UserId == UserId)
                     .Where(co => co.Network.Country.CountryShort == "CA")
                     .OrderByDescending(co => co.Network.Country)
                     .OrderBy(c => c.Network.StdNetName)
                     .ToList();
                }
                else
                {
                    return new List<NetworkUserJob>();
                }
                
            }
        }

        public List<Network> GetUnassignedNetworkUserJobs(int JobId, int UserId)
        {
            User user = _userRepository.GetUserById(UserId);
            List<Network> networks = new List<Network>();
            networks = GetAllNetworks();

            List<NetworkUserJob> networkuserjobs = GetNetworkUserJobs(JobId, UserId).ToList();
            foreach (NetworkUserJob nuj in networkuserjobs)
            {
                List<Network> searchCli = networks.Where(n => n.NetworkId == nuj.Network.NetworkId).ToList();
                if (searchCli.Count > 0)
                {
                    networks.Remove(searchCli[0]);
                }
            }

            if (user.US_User == true && user.CA_User == true)
            {
                return networks
                    .Where(c => c.Country.CountryShort == "CA" || c.Country.CountryShort == "US")
                    .OrderByDescending(c => c.Country.CountryId)
                    .ThenBy(n => n.StdNetName)
                    .ToList();
            }
            else if (user.US_User == true && user.CA_User == false)
            {
                return networks
                    .Where(c => c.Country.CountryShort == "US")
                    .OrderBy(n => n.StdNetName)
                    .ToList();

            }
            else if (user.US_User == false && user.CA_User == true)
            {
                return networks
                    .Where(c => c.Country.CountryShort == "CA")
                    .OrderBy(n => n.StdNetName)
                    .ToList();

            }
            else
            {
                networks.Clear();
                return networks.ToList();
            }

        }

        public ErrorMessage ChangeNetworkJob(int NetworkId, int UserId, int NewJobId, int UpdatedByUserId)
        {
            ErrorMessage em = new ErrorMessage();

            try
            {
                Network network = GetNetwork(NetworkId);

                // ST-946 Code Implementation with Dapper
                string spName = "sp_Network_ChangeJob";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("NewJobId", NewJobId, DbType.Int32);
                dbparams.Add("NetworkId", NetworkId, DbType.Int32);
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("UpdatedByUserId", UpdatedByUserId, DbType.Int32);
                em = FactoryServices.dbFactory.SelectCommand_SP(em, spName, dbparams);

            }
            catch (Exception exc)
            {
                em.Success = false;
                em.ResponseCode = 0;
                em.ResponseText = exc.Message;

                _logger.LogError(UserId, "Unabled to change network job.  (" + NetworkId.ToString() + ") " + exc.Message);

            }

            return em;
        }

        public List<Network> GetUniqueNetworkByUserID(int UserId, int CountryId)
        {
            List<Network> networks = new List<Network>();
            try
            {
                
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Networks_GetAllUserAssignments";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("UserId", UserId, DbType.Int32);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                //dbparams.Add("GetAll", false, DbType.Boolean);
                networks = FactoryServices.dbFactory.SelectCommand_SP(networks, spName, dbparams);
            }
            catch (Exception exc)
            {
                _logger.LogError(UserId, "Unable to call sp_Networks_GetAllUserAssignments.  (" + UserId.ToString() + " " + CountryId.ToString() + ") " + exc.Message);

            }
            return networks;
        }

        public List<Network> GetNetworksForCreate(int CountryId, string QuarterName, int ClientId, int DemographicSettingsId, int LoggedOnUserId)
        {
            List<Network> networks = new List<Network>();
            List<NetworkResponseModel> networkList = new List<NetworkResponseModel>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetNetworksForCreate";
                DynamicParameters dbparams = new DynamicParameters();
                dbparams.Add("QuarterName", QuarterName, DbType.String);
                dbparams.Add("CountryId", CountryId, DbType.Int32);
                dbparams.Add("ClientID", ClientId, DbType.Int32);
                dbparams.Add("DemographicSettingsId", DemographicSettingsId, DbType.Int32);
                networkList = FactoryServices.dbFactory.SelectCommand_SP(networkList, spName, dbparams);
                foreach (NetworkResponseModel network in networkList)
                {
                    Network curNet = new Network();
                    curNet.CountryId = network.CountryId;
                    curNet.NetworkId = network.NetworkId;
                    curNet.StdNetName = network.StdNetName;
                    curNet.Country= _context.Countries.Where(x=> x.CountryId==network.CountryId).FirstOrDefault();
                    curNet.MediaType=_context.MediaTypes.Where(x=> x.MediaTypeId==Convert.ToInt32(network.MediaTypeId)).FirstOrDefault();
                    curNet.FeedType = _context.FeedTypes.Where(x => x.FeedTypeId == Convert.ToInt32(network.FeedTypeId)).FirstOrDefault();
                    networks.Add(curNet);
                }
            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load demographic settings foir client. | " + exc.Message);
            }
            finally
            {
            }

            return networks;

        }

        public List<Network> GetNetworksForDemoProposal(int DemographicSettingsId, int ProposalId, int LoggedOnUserId)
        {
            List<NetworkResponseModel> networkList = new List<NetworkResponseModel>();
            List<Network> networks = new List<Network>();
            try
            {
                // ST-946 Code Implementation with Dapper
                string spName = "sp_Proposal_GetNetworksForDemoProposal";
                DynamicParameters dbparams = new DynamicParameters();

                dbparams.Add("DemographicSettingsId", DemographicSettingsId, DbType.Int32);
                dbparams.Add("ProposalId", ProposalId, DbType.Int32);
                dbparams.Add("LoggedOnUserId", LoggedOnUserId, DbType.Int32);
                networkList = FactoryServices.dbFactory.SelectCommand_SP(networkList, spName, dbparams);
                foreach (NetworkResponseModel network in networkList)
                {
                    Network curNet = new Network();
                    curNet.CountryId = network.CountryId;
                    curNet.NetworkId = network.NetworkId;
                    curNet.StdNetName = network.StdNetName;
                    curNet.Country = _context.Countries.Where(x => x.CountryId == network.CountryId).FirstOrDefault();
                    curNet.MediaType = _context.MediaTypes.Where(x => x.MediaTypeId == Convert.ToInt32(network.MediaTypeId)).FirstOrDefault();
                    curNet.FeedType = _context.FeedTypes.Where(x => x.FeedTypeId == Convert.ToInt32(network.FeedTypeId)).FirstOrDefault();
                    networks.Add(curNet);
                }

            }
            catch (Exception exc)
            {
                _logger.LogError(LoggedOnUserId, "Unable load demographic settings foir client. | " + exc.Message);
            }
            finally
            {
            }

            return networks;

        }
    }
}
