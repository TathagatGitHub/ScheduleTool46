using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using System.DirectoryServices;
using Microsoft.Extensions.Configuration;

namespace OM_ScheduleTool.ViewModels
{
    public class LogonViewModel
    {
        public string AccountName { get; set; }
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public DateTime LastLoginDt { get; set; }

        public string ErrorMessageHeader = "Error";
        public string ErrorMessageLabel = "";

        private IConfiguration _config;

        public LogonViewModel(IConfiguration config)
        {
            _config = config;

        }

        public bool IsAuthenticated()
        {
            try
            {
                var Address = _config.GetSection("ActiveDirectory:Address");

                using (DirectoryEntry searchRoot = new DirectoryEntry(Address.Value, AccountName, Password))
                {
                    DirectorySearcher search = new DirectorySearcher(searchRoot);
                    search.Filter = "(&(objectClass=user)(objectCategory=person))";
                    SearchResultCollection resultCol = search.FindAll();
                    if (resultCol != null)
                    {
                        return true;
                    }
                }
            }
            catch (Exception exc)
            {
                if (_config.GetSection("DebugMode:Debug").Value == "on")
                {
                    if (Password == _config.GetSection("DebugMode:Password").Value)
                    {
                        ErrorMessageLabel = "";
                        return true;
                    }
                }
                ErrorMessageLabel = exc.Message;
            }
            return false;



        }

    }
}
