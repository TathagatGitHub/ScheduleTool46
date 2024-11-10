using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Controllers
{
    public class GlobalController : Controller
    {
        private IConfiguration _config;
        public GlobalController(IConfiguration config)
        {
            _config = config;
        }

        [HttpGet]
        public string GetDatabaseServer()
        {
            string DataConnectionString = _config.GetConnectionString("DefaultConnection");
            string [] DB = DataConnectionString.Split(';');

            foreach (string Buffer1 in DB)
            {
                string[] Buffer2 = Buffer1.Split('=');
                if (Buffer2.Length > 1)
                {
                    if (Buffer2[0] == "Server")
                    {
                        return Buffer2[1];
                    }

                }
            }

            return "";
        }

        [HttpGet]
        public string GetDatabaseName()
        {
            string DataConnectionString = _config.GetConnectionString("DefaultConnection");
            string[] DB = DataConnectionString.Split(';');

            foreach (string Buffer1 in DB)
            {
                string[] Buffer2 = Buffer1.Split('=');
                if (Buffer2.Length > 1)
                {
                    if (Buffer2[0] == "Database")
                    {
                        return Buffer2[1];
                    }

                }
            }

            return "";
        }

        [HttpGet]
        public string GetAppVersion()
        {
            DateTime dt = System.IO.File.GetLastWriteTime(@System.Reflection.Assembly.GetExecutingAssembly().Location);
            return _config.GetSection("StaticText:AppVersion").Value + "." + dt.ToString("yyMMddhhmm");
        }
    }
}
