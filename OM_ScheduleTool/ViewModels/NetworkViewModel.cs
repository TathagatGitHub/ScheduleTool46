using Microsoft.AspNetCore.Mvc.Rendering;
using OM_ScheduleTool.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.ViewModels
{
    public class NetworkViewModel
    {
        public User LoggedOnUser { get; set; }
        public UserPermission LoggedOnUser_Permissions_NetworkName { get; set; }
        public UserPermission LoggedOnUser_Permissions_NetworkAlias { get; set; }

        // Collections to fill out controls
        public IEnumerable<Country> Countries { get; set; }
        public IEnumerable<MediaType> MediaTypes { get; set; }
        public IEnumerable<FeedType> FeedTypes { get; set; }
        public IEnumerable<NetworkAlias> Networks { get; set; }

    }
}
