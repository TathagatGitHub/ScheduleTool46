using OM_ScheduleTool.Models;
using System.Collections.Generic;

namespace OM_ScheduleTool.Repositories
{
    public interface IUserRepository
    {
        IEnumerable<User> GetAllUsers(User user);
        IEnumerable<User> GetAllUsers();
        IEnumerable<User> GetAllActiveUsers(User user);
        IEnumerable<User> GetAllInactiveUsers(User user);
        IEnumerable<PermissionLevel> GetAllPermissionLevels();
        IEnumerable<AppFeature> GetAppFeatures();
        IEnumerable<AppFeature> GetAllMainAppFeatures();
        IEnumerable<AppFeature> GetSubAppFeatures(int AppFeatureId);
        IEnumerable<NetworkUserJob> GetNetworkAssignments(User user);

        void SetUserLoginDt(int UserId);

        User GetUserByAccountName(string AccountName);
        User GetUserById(int UserId);

        int GetLastProposalId(int UserId);
        void SetLastProposalId(int UserId, int ProposalId);
        int GetLastScheduleId(int UserId);
        void SetLastScheduleId(int UserId, int ScheduleId);
        string GetUserProfile(int UserId, string Key);
        void SetUserProfile(int UserId, string Key, string Value);
        int SetFinanceUser(int LoggedOnUserId, int UserId, bool Set);
        void SetUserCAExchRate(int LoggedOnUserId, int UserId, bool CAClientExchRate, bool CAActualExchRate);
        void AddNetworkUserJob(int LoggedOnUserId, int UserId);
        Dictionary<string, bool> GetUserCAExchRate(int LoggedOnUserId, int UserId);
        void RemoveNetworkUserJobClientUserJob(int LoggedOnUserId, int UserId);
        void SetUserCountry(int LoggedOnUserId, int UserId, bool USBuyer, bool CABuyer);
        void SetClientManagementUserPermission(int LoggedOnUserId, int UserId, bool Digital, bool Local, bool Podcast);
    }
}