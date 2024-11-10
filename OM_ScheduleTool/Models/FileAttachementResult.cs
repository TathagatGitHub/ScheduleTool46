using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace OM_ScheduleTool.Models
{
    public class FileAttachementResult
    {
        public string FilePath { get; set; }
        public string FileName { get; set; }
        public int MediaPlanId { get; set; }
        public List<MediaPlanAttachment> MediaPlanAttachments { get; set; }
        public int ErrorCode { get; set; }
    }
}