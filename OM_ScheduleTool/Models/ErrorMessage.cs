using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    [MetadataType(typeof(ErrorMessage))]
    public class ErrorMessage
    {
        public ErrorMessage()
        {
            Success = false;
            ResponseCode = -1000;
            ResponseText = "Unknown Errror";
            ResponseCodeStr = "";
            ErrDatawarehoue = new ErrorMessage(false, -1, "Blank");
            ErrUtility = new ErrorMessage(false, -1, "Blank");
        }

        public ErrorMessage(bool success, int responsecode, string responsetext)
        {
            Success = success;
            ResponseCode = responsecode;
            ResponseText = responsetext;
        }

        public bool Success { get; set; }

        public int ResponseCode { get; set; }

        public string ResponseText { get; set; }
        public string ResponseCodeStr { get; set; } 
        public string Color { get; set; } 
        public int Value { get; set; } 
       public ErrorMessage ErrUtility { get; set; }
        public ErrorMessage ErrDatawarehoue { get; set; }

    }
}
