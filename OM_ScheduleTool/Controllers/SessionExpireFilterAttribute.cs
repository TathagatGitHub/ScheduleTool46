using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web;

namespace OM_ScheduleTool.Controllers
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class SessionExpireFilterAttribute : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ISession session = filterContext.HttpContext.Session;
            string user = session.GetString("AccountName");

            if (user == null || user == "")
            {
                session.Remove("AccountName");
                session.Clear();

                filterContext.Result = new RedirectResult("~/User/Logon");
                return;
            }
        }
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = true)]
    public class SessionExpireChildFilterAttribute : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ISession session = filterContext.HttpContext.Session;
            string user = session.GetString("AccountName");

            if (user == null || user == "")
            {
                session.Remove("AccountName");
                session.Clear();

                filterContext.Result = new RedirectResult("~/StatusCode/408");
                return;
            }
        }
    }

    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, Inherited = true, AllowMultiple = false)]
    public class SessionExpireRawFileDownloadFilter : ActionFilterAttribute
    {

        public override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            ISession session = filterContext.HttpContext.Session;
            string user = session.GetString("AccountName");

            if (user == null || user == "")
            {
                session.Remove("AccountName");
                session.Clear();

                filterContext.Result = new RedirectResult("~/StatusCode/408");
                return;
            }
            
        }
    }
}
