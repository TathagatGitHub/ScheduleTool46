using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace OM_ScheduleTool.Models
{
    public class QuartersProperty : Property
    {
        public QuartersProperty()
        {
            Id = 0;
            Time = "";
            DP = "";
            Days = "";
            SpotLen = 30;
            RateAmt = 0;
            Imp = 0;
            CPM = 0;
            Status = "";
            EffExp = "";
            Revision = "";
            StartTimeFormatted = "";
            EndTimeFormatted = "";
            BuyTypeDescription = "";
            RateId = 0;
            ClientName = "";
            BuyTypeCode = "";
        }

        public int Id;
        public string Approved;
        public string Time;
        public string DP;
        public string Days;
        public int SpotLen;
        public double RateAmt;
        public double Imp;
        public double CPM;
        public string Status;
        public string EffExp;
        public string Revision;
        public string StartTimeFormatted;
        public string EndTimeFormatted;
        public string BuyTypeDescription;
        public int RateId;
        public int SplitId;
        public string ClientName;
        public string BuyTypeCode;
        public int CanCreateQTRProperty;
        public string SPBuy;
        public string DemoName;
        public string TestName2;
        public int ErrorCode;
        public string ReturnMessage;
        public string EffectiveDate;
        public string ExpirationDate;
        //public int ProposedDemoSettingPerQuarterId;
    }



    public class DRQuartersProperty 
    {
        public int Id { get; set; }
        public string DemoName { get; set; }
        public string TestName2 { get; set; }
        public string PropertyName { get; set; }
        public int PropertyId { get; set; }
        public string DP { get; set; }
        public string Days { get; set; }
        public int SpotLen { get; set; }
        public double Imp { get; set; }
        public double CPM { get; set; }
        public double RateAmt { get; set; }
        public string Status { get; set; }
        public string Revision { get; set; }
        public string StartTimeFormatted { get; set; }
        public string EndTimeFormatted { get; set; }
        public string ClientName { get; set; }
        public string BuyTypeCode { get; set; }
        public string EffectiveDate { get; set; }
        public string ExpirationDate { get; set; }
    }

}

