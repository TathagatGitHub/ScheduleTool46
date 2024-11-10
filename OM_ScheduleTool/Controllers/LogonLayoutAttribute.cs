using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using System;

namespace OM_ScheduleTool.Controllers
{
    internal class LogonLayoutAttribute : ResultFilterAttribute
    {
        private string layout;
        public LogonLayoutAttribute(string layout)
        {
            this.layout = layout;
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            var viewResult = context.Result as ViewResult;
            if (viewResult != null)
            {
                viewResult.ViewData["Layout"] = this.layout;
            }
        }
    }
}