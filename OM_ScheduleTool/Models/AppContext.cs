using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using OM_ScheduleTool.Models;
using Microsoft.Extensions.Configuration;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata;

namespace OM_ScheduleTool.Models
{
    public class ScheduleProposalRepositoryContext : DbContext
    {
        private IConfiguration _config;

        public ScheduleProposalRepositoryContext(IConfiguration config, DbContextOptions<StoredProcsContext> options) : base(options)
        {
            _config = config;

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config.GetConnectionString("DefaultConnection"));


        }
    }

    public class StoredProcsContext : DbContext
    {
        private IConfiguration _config;

        public StoredProcsContext(IConfiguration config, DbContextOptions<StoredProcsContext> options) : base(options)
        {
            _config = config;

        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config.GetConnectionString("DefaultConnection"));


        }
    }

    public class AppContext : DbContext
    {
        private IConfiguration _config;

        public AppContext(IConfiguration config, DbContextOptions<AppContext> options) : base(options)
        {
            _config = config;

        }

        public DbSet<User> Users { get; set; }
        public DbSet<UserProfile> UserProfiles { get; set; }
        public DbSet<PermissionLevel> PermissionLevels { get; set; }
        public DbSet<AppFeatureGroup> AppFeatureGroups { get; set; }
        public DbSet<AppFeature> AppFeatures { get; set; }
        //public DbSet<AppFeatureUserPermission> AppFeaturePermissions { get; set; }
        public DbSet<Action> Actions { get; set; }
        public DbSet<AppFeatureDefaultAction> AppFeatureDefaultActions { get; set; }
        public DbSet<AppFeatureUserCustomAction> AppFeatureUserCustomActions { get; set; }
        public DbSet<DeltaList> DeltaListChanges { get; set; }


        public DbSet<Country> Countries { get; set; }
        public DbSet<FeedType> FeedTypes { get; set; }
        public DbSet<MediaType> MediaTypes { get; set; }
        public DbSet<Network> Networks { get; set; }
        public DbSet<EdiNetworkLookup> EdiNetworkLookup { get; set; }

        public DbSet<Client> Clients { get; set; }
        public DbSet<EdiClientLookup> EdiClientLookup { get; set; }
        public DbSet<CanadaActualExchangeRate> CanadaActualExchangeRates { get; set; }
        public DbSet<CanadaClientExchangeRate> CanadaClientExchangeRates { get; set; }
        public DbSet<CommRate> CommRate { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobTitleType> JobTitleTypes { get; set; }
        public DbSet<ClientUserJob> ClientUserJob { get; set; }
        public DbSet<NetworkUserJob> NetworkUserJob { get; set; }
        public DbSet<ApprovalLevel> ApprovalLevel { get; set; }
        public DbSet<DayPart> DayPart { get; set; }
        public DbSet<DoNotBuyType> DoNotBuyType { get; set; }
        public DbSet<BroadcastDate> BroadcastDate { get; set; }
        public DbSet<BuyType> BuyType { get; set; }
        public DbSet<Quarter> Quarter { get; set; }
        public DbSet<DemographicSettings> DemographicSettings { get; set; }
        public DbSet<DemographicSettingsPerQtr> DemographicSettingsPerQtr { get; set; }
        public DbSet<DaysCode> DaysCodes { get; set; }
        public DbSet<POSTLOG_T> POSTLOG_T { get; set; }
        public DbSet<POSTLOG_LINE_T> POSTLOG_LINE_T { get; set; }

        public DbSet<POSTLOG_LINE_T_Merged> POSTLOG_LINE_T_Merged { get; set; }
        public DbSet<Property> Properties { get; set; }
        public DbSet<PropertyHistory> PropertyHistory { get; set; }
        public DbSet<Logs> Logs { get; set; }
        //public DbSet<SpotLen> SpotLens { get; set; }
        public DbSet<Split> Splits { get; set; }
        public DbSet<Rate> Rates { get; set; }
        public DbSet<UpfrontType> UpfrontTypes { get; set; }
        public DbSet<Upfront> Upfronts { get; set; }
        public DbSet<UpfrontLine> UpfrontLines { get; set; }
        public DbSet<UpfrontNote> UpfrontNotes { get; set; }
        public DbSet<Dealpoint> DealPoints { get; set; }
        public DbSet<ScheduleType> ScheduleTypes { get; set; }
        public DbSet<Schedule> Schedule { get; set; }
        public DbSet<ScheduleLine> ScheduleLines { get; set; }
        public DbSet<ProposalNote> ProposalNotes { get; set; }
        public DbSet<UpfrontRemnantLineFlat> UpfrontRemnantLinesFlat { get; set; }
        public DbSet<ScheduleProposalLinesFlat> ScheduleProposalLinesFlat { get; set; }

        public DbSet<UpfrontExpansionTracking> UpfrontExpansionTracking { get; set; }
        public DbSet<UpfrontExpansionTrackingLine> UpfrontExpansionTrackingLines { get; set; }
        public DbSet<UpfrontExpansionNetworkGroup> UpfrontExpansionNetworkGroup { get; set; }
        public DbSet<UpfrontExpansionTrackingLine_Audit> UpfrontExpansionTrackingLines_Audit { get; set; }
        public DbSet<PRELOG_T> PRELOG_T { get; set; }
        public DbSet<SCHED_WEEK_LOCK_T> SCHED_WEEK_LOCK_T { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            foreach (var relationship in modelBuilder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }

            foreach (var property in modelBuilder.Model.GetEntityTypes()
                            .SelectMany(t => t.GetProperties())
                            .Where(p => p.ClrType == typeof(decimal)))
            {
                // Modified the Rational as it is depricated in .NET 6
                //if (property.Relational().ColumnType != "Money")
                //{
                //    property.Relational().ColumnType = "decimal(18, 6)";
                //}
                if (property.GetColumnType() != "Money")
                {
                    property.SetColumnType("decimal(18, 6)");
                }

            }

            // Primary Key and indexes for UpfrontExpansionNetworkGroup table
            modelBuilder.Entity<UpfrontExpansionNetworkGroup>().HasKey(t => new { t.GroupId, t.NetworkId, t.QuarterId });
            modelBuilder.Entity<UpfrontExpansionNetworkGroup>().HasIndex(t => new { t.NetworkId, t.QuarterId }).IsUnique(true);
            modelBuilder.Entity<UpfrontExpansionNetworkGroup>().HasIndex(t => t.UpfrontExpansionNetworkGroupId);

            base.OnModelCreating(modelBuilder);
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config.GetConnectionString("DefaultConnection"));


        }

    }
}
