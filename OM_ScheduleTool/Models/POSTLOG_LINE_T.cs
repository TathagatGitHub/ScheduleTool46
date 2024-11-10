using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace OM_ScheduleTool.Models
{
    public class ExportPostLog
    {
        public string Country { get; set; }
        public string Client { get; set; }
        public string Network { get; set; }
        public decimal FullRate { get; set; }
        public DateTime SpotDate { get; set; }
        public string ISCI { get; set; }
        public DateTime SpotTime { get; set; }

    }


    /* Extremely buggy database design but my task here is to merely import.  There is too muchy data redundancy here. */
    public class POSTLOG_LINE_T_Merged
    {
        [Key]
        public int PostLogLineId { get; set; }

        public int? PostLogID { get; set; }

        public int? ScheduleLineID { get; set; }

        public string PropName { get; set; }

        public int? PropertyID { get; set; }

        public int NetworkId { get; set; }

        public POSTLOG_T PostLog { get; set; }

        public ScheduleLine ScheduleLine { get; set; }

        public bool? Approved { get; set; }

        [StringLength(255)]
        public string DoNotBuy { get; set; }

        public Network Network { get; set; }
        public Property Property { get; set; }

        public DayPart DayPart { get; set; }

        //public BuyType BuyType { get; set; }

        //public Rate Rate { get; set; }

        public string BuyType { get; set; }
        public decimal? Rate { get; set; }


        //[Column(TypeName = "Money")]
        //public decimal FullRate
        //{
        //    get
        //    {
        //        try
        //        {
        //            return Rate.RateAmt * (decimal)0.85;
        //        }
        //        catch
        //        {
        //            return 0;
        //        }
        //    }
        //}

        //[Column(TypeName = "Money")]
        //public decimal CPM
        //{
        //    get
        //    {
        //        try
        //        {
        //            if (Rate.Impressions != 0)
        //            {
        //                return FullRate / Rate.Impressions;
        //            }
        //            else
        //            {
        //                return 0;
        //            }
        //        }
        //        catch
        //        {
        //            return 0;
        //        }
        //    }
        //}

        public string OMDP
        {
            get
            {
                return "";
            }
        }

        public DateTime? SpotDate { get; set; }

        //public DateTime? SpotTime { get; set; }
        public TimeSpan? SpotTime { get; set; }
        public MediaType MediaType { get; set; }

        [StringLength(255)]
        public string ISCI { get; set; }

        [StringLength(255)]
        public string ProgramTitle { get; set; }

        public bool? Cleared { get; set; }

        public bool? Scheduled { get; set; }

        public bool? Placed { get; set; }

        public DateTime UpdDte { get; set; }

        public int? UpdUserID { get; set; }

        [NotMapped]
        public bool PoorSeparation { get; set; }

        [NotMapped]
        public bool OutOfDayPart { get; set; }

        [StringLength(255)]
        public string SigmaProgramName { get; set; }
        public int? SigmaSchedLineID { get; set; }
        public decimal? SigmaND1_Imp { get; set; }
        public decimal? SigmaND2_Imp { get; set; }
        public decimal? SigmaND3_Imp { get; set; }
        public decimal? ND1_AvgQtrHourImp { get; set; }
        public decimal? ND2_AvgQtrHourImp { get; set; }
        public decimal? ND3_AvgQtrHourImp { get; set; }
        public string SigmaDemo1 { get; set; }
        public string SigmaDemo2 { get; set; }
        public string SigmaDemo3 { get; set; }
        public string AvgQtrDemo1 { get; set; }
        public string AvgQtrDemo2 { get; set; }
        public string AvgQtrDemo3 { get; set; }

        public int? DemoId { get; set; }

        public string Mon { get; set; }
        public string Tue { get; set; }
        public string Wed { get; set; }
        public string Thu { get; set; }
        public string Fri { get; set; }
        public string Sat { get; set; }
        public string Sun { get; set; }
        public TimeSpan? StartTime { get; set; }
        public TimeSpan? EndTime { get; set; }
        public string DayPartCd { get; set; }

        [NotMapped]
        public string ClearedPlaced
        {
            get
            {
                if (Scheduled == false && Cleared == false)
                {
                    return "UNPLACED";
                }
                else if (Scheduled == false && Cleared == true)
                {
                    return "CLEARED";
                }
                else if (Scheduled == true && Cleared == false)
                {
                    return "UNCLEARED";
                }
                else if (Scheduled == true && Cleared == true)
                {
                    return "CLEARED";
                }
                else
                {
                    return "CLEARED";
                }
            }
        }

        [NotMapped]
        public DateTime? OrigSpotDate { get; set; }

        [NotMapped]
        public DateTime? OrigSpotTime { get; set; }

        [NotMapped]
        [StringLength(255)]
        public string OrigISCI { get; set; }

        [NotMapped]
        [StringLength(255)]
        public string OrigProgramTitle { get; set; }

        public int? SpotLen { get; set; }
        public int? Split { get; set; }

        public int? RateId { get; set; }

        public decimal? Imp { get; set; }
        public string NetworkName { get; set; }

    }

    public class POSTLOG_LINE_T
    {
        [Key]
        public int PLineID { get; set; }
        //public Guid PostLogLineId { get; set; }

        public int? PostLogID { get; set; }

        public POSTLOG_T PostLog { get; set; }

        public ScheduleLine ScheduleLine { get; set; }

        public bool? Approved { get; set; }

        [StringLength(255)]
        public string DoNotBuy { get; set; }

        public Network Network { get; set; }
        public Property Property { get; set; }

        public DayPart DayPart { get; set; }

        public string DayPartCd { get; set; }
        public int? DayPartId { get; set; }

        //public BuyType BuyType { get; set; }

        public string BuyTypeCode { get; set; }

        public int? BuyTypeId { get; set; }

        //public Rate Rate { get; set; }
        

        [Column(TypeName = "Money")]
        public decimal FullRate
        {
            get
            {
                try
                {
                    return 0;// Rate * (decimal)0.85;
                }
                catch
                {
                    return 0;
                }
            }
        }

        [Column(TypeName = "Money")]
        public decimal CPM
        {
            get
            {
                try
                {
                    if (Imp != 0)
                    {
                        return (decimal)ClientRate / (decimal)Imp;
                    }
                    else
                    {
                        return 0;
                    }
                }
                catch
                {
                    return 0;
                }
            }
        }

        public string OMDP { get; set; }

        public DateTime? SpotDate { get; set; }

        public DateTime? SpotTime { get; set; }
        public MediaType MediaType { get; set; }

        [StringLength(255)]
        public string ISCI { get; set; }

        [StringLength(255)]
        public string ProgramTitle { get; set; }

        public bool? Cleared { get; set; }

        public bool? Scheduled { get; set; }

        public bool? Placed { get; set; }

        public DateTime UpdDte { get; set; }

        public int? UpdUserID { get; set; }

        [StringLength(255)]
        public string SigmaProgramName { get; set; }
        public int? SigmaSchedLineID { get; set; }
        public decimal? SigmaND1_Imp { get; set; }
        public decimal? SigmaND2_Imp { get; set; }
        public decimal? SigmaND3_Imp { get; set; }
        public decimal? ND1_AvgQtrHourImp { get; set; }
        public decimal? ND2_AvgQtrHourImp { get; set; }
        public decimal? ND3_AvgQtrHourImp { get; set; }
        public string SigmaDemo1 { get; set; }
        public string SigmaDemo2 { get; set; }
        public string SigmaDemo3 { get; set; }
        public string AvgQtrDemo1 { get; set; }
        public string AvgQtrDemo2 { get; set; }
        public string AvgQtrDemo3 { get; set; }

        public int? DemoId { get; set; }

        // Maybe I'll just create a child class... I'll wait until I get the final copy of POSTLOG_LINE_T
        [NotMapped]
        public bool PoorSeparation { get; set; }

        [NotMapped]
        public bool OutOfDayPart { get; set; }

        [NotMapped]
        public string ClearedPlaced
        {
            get
            {
                if (Scheduled == false && Cleared == false)
                {
                    if (NetworkLogId>0 && !string.IsNullOrEmpty(Network?.StdNetName) && SpotLen.HasValue && RateAmount.HasValue && SpotDate.HasValue && SpotTime.HasValue && !string.IsNullOrEmpty(ISCI)
                                && (string.IsNullOrEmpty(Property?.PropertyName) || (Property?.Monday == false && Property?.Tuesday == false && Property?.Wednesday == false && Property?.Thursday == false
                                && Property?.Friday == false && Property?.Saturday == false && Property?.Sunday == false) || !StartTime.HasValue || !EndTime.HasValue || string.IsNullOrEmpty(DayPartCd)
                                || string.IsNullOrEmpty(OMDP) || string.IsNullOrEmpty(BuyTypeCode) || !Imp.HasValue))
                    {
                        return "UNPLACED";
                    }
                    else
                    {
                        return "UNCLEARED";
                    }
                }
                else if (Scheduled == false && Cleared == true)
                {
                    return "CLEARED";
                }
                else if (Scheduled == true && Cleared == false)
                {
                    return "UNCLEARED";
                }
                else if (Scheduled == true && Cleared == true)
                {
                    return "CLEARED";
                }
                else
                {
                    return "CLEARED";
                }
            }
        }

        [NotMapped]
        public DateTime? OrigSpotDate { get; set; }

        [NotMapped]
        public DateTime? OrigSpotTime { get; set; }

        [NotMapped]
        [StringLength(255)]
        public string OrigISCI { get; set; }

        [NotMapped]
        [StringLength(255)]
        public string OrigProgramTitle { get; set; }

        public int? ScheduleId { get; set; }

        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }

        public int? SpotLen { get; set; }
        public int? RateId { get; set; }

        public decimal? Imp { get; set; }

        public decimal? RateAmount { get; set; }

        public decimal? ClientRate { get; set; }

        public string Sp_Buy { get; set; }

        public string CommRate { get; set; }

        public int? NetworkLogId { get; set; }

        public decimal? USDGrossRate { get; set; }

        public decimal? CAConvRate { get; set; }

        [NotMapped]
        public bool IsValidISCI { get; set; }

        public int? ScheduleLineID { get; set; }

        public int NetworkId { get; set; }

        public string PropName { get; set; }

        public string Mon { get; set; }
        public string Tue { get; set; }
        public string Wed { get; set; }
        public string Thu { get; set; }
        public string Fri { get; set; }
        public string Sat { get; set; }
        public string Sun { get; set; }
        public string NetworkName { get; set; }
        public decimal? Rate { get; set; }
        public string BuyType { get; set; }
        public int? PropertyID { get; set; }
        [NotMapped]
        public string OmdpSpotDateTime { get; set; }
        public int? ChildPropertyId { get; set; }
        [NotMapped]
        public bool? IsChildPropertyId { get; set; }
        [NotMapped]
        public bool? IsDOWChanged { get; set; }
        [NotMapped]
        public bool? IsTimeChanged { get; set; }
        public string ParentBuytype { get; set; }
        public string BuyTypeGroup { get; set; }
    }
}
