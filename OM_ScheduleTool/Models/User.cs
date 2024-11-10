using Microsoft.AspNetCore.Mvc.ModelBinding;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.DirectoryServices;
using System.Linq;

namespace OM_ScheduleTool.Models
{
    public class User : IEquatable<User> , IComparable<User>
    {
        public User()
        {
            US_User = true;
            CA_User = false;

            CreateDt = DateTime.Now;
            UpdateDt = DateTime.Now;
        }

        public User(User CopyUser)
        {
            this.UserId = CopyUser.UserId;
            this.EmailAddress = CopyUser.EmailAddress;
            this.AccountName = CopyUser.AccountName;
            this.Password = CopyUser.Password;
            this.DisplayName = CopyUser.DisplayName;
            this.FirstName = CopyUser.FirstName;
            this.LastName = CopyUser.LastName;
            this.LastLoginDt = CopyUser.LastLoginDt;
            this.US_User = CopyUser.US_User;
            this.CA_User = CopyUser.CA_User;
            this.JobTitleTypeId = CopyUser.JobTitleTypeId;
            this.JobTitleType = new JobTitleType(CopyUser.JobTitleType);
            this.PermissionLevelId = CopyUser.PermissionLevelId;
            this.PermissionLevel = new PermissionLevel(CopyUser.PermissionLevel);
            this.CreateDt = CopyUser.CreateDt;
            this.UpdateDt = CopyUser.UpdateDt;

            this.ImageUrl = CopyUser.ImageUrl;
            this.Finance = CopyUser.Finance;
            this.ExchangeRateAdmin = CopyUser.ExchangeRateAdmin;
        }

        [Key]
        public int UserId { get; set;  }

        [StringLength(100)]
        public string EmailAddress { get; set; }

        [StringLength(100)]
        public string AccountName { get; set; }

        [StringLength(25)]
        public string Password { get; set; }

        [StringLength(100)]
        public string DisplayName { get; set; }

        [StringLength(50)]
        public string FirstName { get; set; }

        [StringLength(50)]
        public string LastName { get; set; }

        [Required]
        public bool US_User { get; set; }

        [Required]
        public bool CA_User { get; set; }

        public string OtherName { get; set; }

        //[StringLength(100)]
        //public string JobTitle { get; set; }

        [ForeignKey("JobTitleType")]
        public int JobTitleTypeId { get; set; }
        public JobTitleType JobTitleType { get; set; }

        public DateTime? LastLoginDt { get; set; }

        public DateTime? LastActiveDt { get; set; }

        [ForeignKey("PermissionLevel")]
        public int PermissionLevelId { get; set; }
        public PermissionLevel PermissionLevel { get; set; }

        [Required]
        [DefaultValue(0)]
        public bool Finance { get; set; }

        [Required]
        [DefaultValue(0)]
        public bool ExchangeRateAdmin { get; set; }

        [StringLength(255)]
        public string ImageUrl { get; set; }

        [Required]
        public DateTime CreateDt { get; set; } 

        [Required]
        public DateTime UpdateDt { get; set; }
        public bool IsDigital { get; set; }
        public bool IsLocal { get; set; }
        public bool IsPodcast { get; set; }

        /* 1 -- Currently Active
         * 0 -- Inactive for over 8 hours
         * -1 -- Inactive for over 4 hours
         */
        public int GetActiveStatus () {
            if (LastActiveDt > DateTime.Now.AddHours(-4))
            {
                return 1;
            }
            else if (LastActiveDt > DateTime.Now.AddHours(-8))
            {
                return -1;
            }
            else
            {
                return 0;
            }
        }

        public override bool Equals(object obj)
        {
            if (obj == null) return false;
            User objAsUser = obj as User;
            if (objAsUser == null) return false;
            else return Equals(objAsUser);
        }

        public int CompareTo(User compareUser)
        {
            // A null value means that this object is greater.
            if (compareUser == null)
                return 1;
            else
                return this.DisplayName.CompareTo(compareUser.DisplayName);
        }

        public override int GetHashCode()
        {
            return UserId;
        }

        public bool Equals(User other)
        {
            if (other == null) return false;
            return (this.DisplayName.Equals(other.DisplayName));
        }

    }
}
