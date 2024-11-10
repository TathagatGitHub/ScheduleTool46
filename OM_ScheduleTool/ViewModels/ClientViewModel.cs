using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class ClientViewModel
    {
        public User LoggedOnUser { get; set; }
        public UserPermission LoggedOnUser_Permissions_ClientName { get; set; }
        public UserPermission LoggedOnUser_Permissions_ClientAlias { get; set; }

        // Collections to fill out controls
        public IEnumerable<Country> Countries { get; set; }

        public IEnumerable<ClientAlias> ClientAliases { get; set; }

    }
}
