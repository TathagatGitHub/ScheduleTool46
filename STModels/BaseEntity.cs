using System;
namespace STModels
{
    public class BaseEntity
    {
        public Int64 Id
        {
            get;
            set;
        }
        public Int64 AddedBy
        {
            get;
            set;
        }
        public DateTime AddedDate
        {
            get;
            set;
        }
        public DateTime ModifiedDate
        {
            get;
            set;
        }
    }
}