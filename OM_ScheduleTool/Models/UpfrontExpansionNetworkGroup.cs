using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;


namespace OM_ScheduleTool.Models
{  
    public class UpfrontExpansionNetworkGroup
    {         
        public int UpfrontExpansionNetworkGroupId { get; set; }
        public int GroupId { get; set; }
        public Network Network { get; set; }
        public int QuarterId { get; set; }
        public int NetworkId { get; set; }
        public int UpdatedByUserId { get; set; }
        public DateTime UpdateDt { get; set; }
        //[Key]
        //public int Id { get; set; }
    }
}
