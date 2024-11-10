using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using OM_ScheduleTool.Models;

namespace OM_ScheduleTool.ViewModels
{
    public class UsersListViewModel
    {
        public User LoggedOnUser { get; set; }

        public List<User> Users { get; set; }

        public List<User> ActiveUsers { get; set; }

        public List<User> InactiveUsers { get; set; }

    }
}