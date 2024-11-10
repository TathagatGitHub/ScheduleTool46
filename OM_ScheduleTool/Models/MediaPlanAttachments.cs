using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;

namespace OM_ScheduleTool.Models
{
    public class MediaPlanAttachment
    {
        public int MediaPlanAttachmentId { get; set; } 
        public int MediaPlanId { get; set; }
        public string FileName { get; set; }
        public string FilePath { get; set; } 
        public long? FileSize { get; set; } 
        public string FileType { get; set; } 
        public int UploadedBy { get; set; } 
        public DateTime UploadedDt { get; set; } 
    }
}