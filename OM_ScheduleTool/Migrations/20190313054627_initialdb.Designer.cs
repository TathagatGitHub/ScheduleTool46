using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using OM_ScheduleTool.Models;
using Microsoft.Extensions.Logging;
using AppContext = OM_ScheduleTool.Models.AppContext;

namespace OM_ScheduleTool.Migrations
{
    [DbContext(typeof(AppContext))]
    [Migration("20190313054627_initialdb")]
    partial class initialdb
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "1.1.6")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("OM_ScheduleTool.Models.Action", b =>
                {
                    b.Property<int>("ActionId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<DateTime?>("UpdateDt");

                    b.HasKey("ActionId");

                    b.ToTable("Actions");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeature", b =>
                {
                    b.Property<int>("AppFeatureId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("AllowSetPermission");

                    b.Property<int?>("AppFeatureGroupId");

                    b.Property<DateTime?>("CreateDt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<string>("Icon");

                    b.Property<string>("Link")
                        .HasMaxLength(255);

                    b.Property<bool>("OnlyShowIfExchangeRateAdminRole");

                    b.Property<bool>("OnlyShowIfFinanceRole");

                    b.Property<int?>("ParentAppFeatureId");

                    b.Property<DateTime?>("UpdateDt");

                    b.HasKey("AppFeatureId");

                    b.HasIndex("AppFeatureGroupId");

                    b.ToTable("AppFeatures");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeatureDefaultAction", b =>
                {
                    b.Property<int>("AppFeatureDefaultActionId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ActionId");

                    b.Property<int?>("AppFeatureId");

                    b.Property<DateTime?>("CreateDt");

                    b.Property<int?>("PermissionLevelId");

                    b.Property<DateTime?>("UpdateDt");

                    b.HasKey("AppFeatureDefaultActionId");

                    b.HasIndex("ActionId");

                    b.HasIndex("AppFeatureId");

                    b.HasIndex("PermissionLevelId");

                    b.ToTable("AppFeatureDefaultActions");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeatureGroup", b =>
                {
                    b.Property<int>("AppFeatureGroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<DateTime?>("UpdateDt");

                    b.HasKey("AppFeatureGroupId");

                    b.ToTable("AppFeatureGroups");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeatureUserCustomAction", b =>
                {
                    b.Property<int>("AppFeatureUserCustomActionId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ActionId");

                    b.Property<int?>("AppFeatureId");

                    b.Property<DateTime?>("CreateDt");

                    b.Property<DateTime?>("UpdateDt");

                    b.Property<int?>("UserId");

                    b.HasKey("AppFeatureUserCustomActionId");

                    b.HasIndex("ActionId");

                    b.HasIndex("AppFeatureId");

                    b.HasIndex("UserId");

                    b.ToTable("AppFeatureUserCustomActions");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ApprovalLevel", b =>
                {
                    b.Property<int>("ApprovalLevelId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("ApprovalName")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("SortOrder");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.HasKey("ApprovalLevelId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("ApprovalLevel");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.BroadcastDate", b =>
                {
                    b.Property<int>("BroadcastDateId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDt")
                        .IsRequired();

                    b.Property<DateTime>("DateFrom");

                    b.Property<DateTime>("DateTo");

                    b.Property<int>("Month");

                    b.Property<DateTime?>("UpdateDt")
                        .IsRequired();

                    b.Property<int>("Year");

                    b.HasKey("BroadcastDateId");

                    b.ToTable("BroadcastDate");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.BuyType", b =>
                {
                    b.Property<int>("BuyTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BuyTypeCode")
                        .IsRequired();

                    b.Property<string>("BuyTypeDescription")
                        .IsRequired();

                    b.Property<DateTime?>("CreateDt")
                        .IsRequired();

                    b.Property<bool>("DRType");

                    b.Property<bool>("IsAddADU");

                    b.Property<bool>("IsAllowUnapprove");

                    b.Property<bool>("IsAutoApprove");

                    b.Property<bool>("IsLowUnassigned");

                    b.Property<bool>("IsMidUnassigned");

                    b.Property<bool>("IsZeroImp");

                    b.Property<bool>("IsZeroRate");

                    b.Property<bool>("RemnantType");

                    b.Property<int>("SortOrder");

                    b.Property<DateTime?>("UpdateDt")
                        .IsRequired();

                    b.Property<int>("UpdatedByUserId");

                    b.Property<bool>("UpfrontType");

                    b.HasKey("BuyTypeId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("BuyType");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.CanadaActualExchangeRate", b =>
                {
                    b.Property<int>("CanadaActualExchangeRateId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<DateTime>("DayDate");

                    b.Property<int>("QuarterId");

                    b.Property<decimal>("Rate")
                        .HasColumnType("Money");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<DateTime>("WeekDate");

                    b.Property<decimal>("WkAvgRate")
                        .HasColumnType("Money");

                    b.Property<int>("WkNbr");

                    b.HasKey("CanadaActualExchangeRateId");

                    b.HasIndex("QuarterId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("CanadaActualExchangeRates");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.CanadaClientExchangeRate", b =>
                {
                    b.Property<int>("CanadaClientExchangeRateId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Actualized");

                    b.Property<int>("ClientId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<decimal>("PlanningRate")
                        .HasColumnType("Money");

                    b.Property<int>("QuarterId");

                    b.Property<decimal>("Rate")
                        .HasColumnType("Money");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<DateTime>("WeekDate");

                    b.Property<int>("WkNbr");

                    b.HasKey("CanadaClientExchangeRateId");

                    b.HasIndex("ClientId");

                    b.HasIndex("QuarterId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("CanadaClientExchangeRates");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Client", b =>
                {
                    b.Property<int>("ClientId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool?>("Active");

                    b.Property<DateTime?>("AnnivDate");

                    b.Property<string>("ClientName")
                        .HasMaxLength(255);

                    b.Property<string>("CommStructure")
                        .HasMaxLength(255);

                    b.Property<int>("CountryId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<bool>("New");

                    b.Property<int>("PlanYr");

                    b.Property<bool?>("Tiered");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("ClientId");

                    b.HasIndex("CountryId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Clients");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ClientUserJob", b =>
                {
                    b.Property<int>("ClientUserJobId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("ClientId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("JobId");

                    b.Property<int>("PlanYr");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<int>("UserId");

                    b.HasKey("ClientUserJobId");

                    b.HasIndex("ClientId");

                    b.HasIndex("JobId");

                    b.HasIndex("UpdatedByUserId");

                    b.HasIndex("UserId");

                    b.ToTable("ClientUserJob");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.CommRate", b =>
                {
                    b.Property<int>("CommRateId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ClientId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<int?>("QuarterId");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<decimal>("Week01Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week02Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week03Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week04Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week05Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week06Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week07Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week08Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week09Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week10Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week11Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week12Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week13Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("Week14Rate")
                        .HasColumnType("decimal(18, 6)");

                    b.HasKey("CommRateId");

                    b.HasIndex("ClientId");

                    b.HasIndex("QuarterId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("CommRate");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Country", b =>
                {
                    b.Property<int>("CountryId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("CountryLong")
                        .HasMaxLength(255);

                    b.Property<string>("CountryShort")
                        .HasMaxLength(2);

                    b.Property<DateTime>("CreateDt");

                    b.Property<bool>("IncludeInNetwork");

                    b.Property<int>("SortKey");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("CountryId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DayPart", b =>
                {
                    b.Property<int>("DayPartId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("DayPartCd")
                        .IsRequired()
                        .HasMaxLength(2);

                    b.Property<string>("DayPartDesc")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<string>("LongDesc")
                        .HasMaxLength(255);

                    b.Property<int>("SortOrder");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("DayPartId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("DayPart");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DaysCode", b =>
                {
                    b.Property<int>("DaysCodeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("DayCode")
                        .IsRequired()
                        .HasMaxLength(7);

                    b.Property<string>("DaysDesc")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<string>("DaysDescCompact")
                        .HasMaxLength(8);

                    b.Property<string>("DaysDescShort")
                        .HasMaxLength(15);

                    b.Property<bool>("Friday");

                    b.Property<bool>("Monday");

                    b.Property<bool>("Saturday");

                    b.Property<bool>("Sunday");

                    b.Property<bool>("Thursday");

                    b.Property<bool>("Tuesday");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<bool>("Wednesday");

                    b.HasKey("DaysCodeId");

                    b.ToTable("DaysCodes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Dealpoint", b =>
                {
                    b.Property<int>("DealPointId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("BillboardAddedValue")
                        .HasMaxLength(250);

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("DR");

                    b.Property<int>("NetworkId");

                    b.Property<string>("NetworkSeparationPolicy")
                        .HasMaxLength(250);

                    b.Property<int>("PlanYr");

                    b.Property<string>("ScatterCancellation")
                        .HasMaxLength(250);

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<string>("UpfrontCancellation")
                        .HasMaxLength(250);

                    b.Property<string>("UpfrontSponsorship")
                        .HasMaxLength(250);

                    b.HasKey("DealPointId");

                    b.HasIndex("NetworkId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("DealPoints");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DeltaList", b =>
                {
                    b.Property<int>("DeltaListId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Change")
                        .HasMaxLength(5000);

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("Version");

                    b.HasKey("DeltaListId");

                    b.ToTable("DeltaListChanges");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DemographicSettings", b =>
                {
                    b.Property<int>("DemographicSettingsId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("AgeMax");

                    b.Property<int?>("AgeMin");

                    b.Property<int>("CountryId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("DemoName")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<string>("Gender")
                        .HasMaxLength(255);

                    b.Property<int>("SortOrder");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("DemographicSettingsId");

                    b.HasIndex("CountryId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("DemographicSettings");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DemographicSettingsPerQtr", b =>
                {
                    b.Property<int>("DemographicSettingsPerQtrId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<int?>("DemoNbr");

                    b.Property<int?>("DemographicSettingsId");

                    b.Property<int>("QuarterId")
                        .HasMaxLength(6);

                    b.Property<int>("Universe");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("DemographicSettingsPerQtrId");

                    b.HasIndex("DemographicSettingsId");

                    b.HasIndex("QuarterId");

                    b.ToTable("DemographicSettingsPerQtr");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DoNotBuyType", b =>
                {
                    b.Property<int>("DoNotBuyTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("CanBeSelectedFromGrid");

                    b.Property<bool>("ClientRequired");

                    b.Property<DateTime?>("CreateDt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(100);

                    b.Property<int>("SortOrder");

                    b.Property<DateTime?>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("DoNotBuyTypeId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("DoNotBuyType");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.EdiClientLookup", b =>
                {
                    b.Property<int>("EdiClientLookupId")
                        .ValueGeneratedOnAdd();

                    b.Property<int?>("ClientId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("EdiClientName")
                        .HasMaxLength(255);

                    b.Property<bool?>("IsNew");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("EdiClientLookupId");

                    b.HasIndex("ClientId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("EdiClientLookup");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.EdiNetworkLookup", b =>
                {
                    b.Property<int>("EdiNetworkLookupId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("EdiNetName");

                    b.Property<int>("NetworkId");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("EdiNetworkLookupId");

                    b.HasIndex("NetworkId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("EdiNetworkLookup");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.FeedType", b =>
                {
                    b.Property<int>("FeedTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("Description")
                        .HasMaxLength(255);

                    b.Property<int?>("UpdateByUserId");

                    b.Property<DateTime>("UpdateDt");

                    b.HasKey("FeedTypeId");

                    b.HasIndex("UpdateByUserId");

                    b.ToTable("FeedTypes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Job", b =>
                {
                    b.Property<int>("JobId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("JobDesc")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<int>("SortOrder");

                    b.Property<DateTime>("UpdateDt");

                    b.HasKey("JobId");

                    b.ToTable("Jobs");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.JobTitleType", b =>
                {
                    b.Property<int>("JobTitleTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<int>("SortOrder");

                    b.Property<DateTime>("UpdateDt");

                    b.HasKey("JobTitleTypeId");

                    b.ToTable("JobTitleTypes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Logs", b =>
                {
                    b.Property<int>("LogsId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Application")
                        .IsRequired()
                        .HasMaxLength(300);

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("LogType");

                    b.Property<string>("Message")
                        .IsRequired();

                    b.Property<int>("UpdatedByUserId");

                    b.HasKey("LogsId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Logs");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.MediaType", b =>
                {
                    b.Property<int>("MediaTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("MediaCategory")
                        .HasMaxLength(1);

                    b.Property<string>("MediaTypeCode")
                        .HasMaxLength(255);

                    b.Property<string>("MediaTypeName")
                        .HasMaxLength(255);

                    b.Property<int>("SortOrder");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("MediaTypeId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("MediaTypes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Network", b =>
                {
                    b.Property<int>("NetworkId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("CountryId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("FeedTypeId");

                    b.Property<int?>("GuarImp");

                    b.Property<int>("MediaTypeId");

                    b.Property<int>("PlanYr");

                    b.Property<string>("StdNetName")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<int>("WGT");

                    b.HasKey("NetworkId");

                    b.HasIndex("CountryId");

                    b.HasIndex("FeedTypeId");

                    b.HasIndex("MediaTypeId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Networks");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.NetworkUserJob", b =>
                {
                    b.Property<int>("NetworkUserJobId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("JobId");

                    b.Property<int>("NetworkId");

                    b.Property<int>("PlanYr");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<int>("UserId");

                    b.HasKey("NetworkUserJobId");

                    b.HasIndex("JobId");

                    b.HasIndex("NetworkId");

                    b.HasIndex("UserId");

                    b.ToTable("NetworkUserJob");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PermissionLevel", b =>
                {
                    b.Property<int>("PermissionLevelId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("CreateDt");

                    b.Property<string>("Description");

                    b.Property<string>("ThemeBackground");

                    b.Property<DateTime?>("UpdateDt");

                    b.HasKey("PermissionLevelId");

                    b.ToTable("PermissionLevels");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PostLog", b =>
                {
                    b.Property<int>("PostLogId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AdminTextNote");

                    b.Property<DateTime?>("CreateDt")
                        .IsRequired();

                    b.Property<int?>("PostLogLockedByUserId");

                    b.Property<DateTime?>("PostLogLockedDate");

                    b.Property<int>("ScheduleId");

                    b.Property<string>("TextNote");

                    b.Property<DateTime?>("UpdateDt")
                        .IsRequired();

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<DateTime>("WeekDate");

                    b.Property<int>("WeekNbr");

                    b.HasKey("PostLogId");

                    b.HasIndex("PostLogLockedByUserId");

                    b.HasIndex("ScheduleId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("PostLog");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PostLogLine", b =>
                {
                    b.Property<int>("PostLogLineId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool?>("Approved");

                    b.Property<string>("BuyType")
                        .HasMaxLength(4);

                    b.Property<bool>("Cleared");

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("DayPartCd")
                        .HasMaxLength(2);

                    b.Property<string>("DoNotBuy")
                        .HasMaxLength(255);

                    b.Property<DateTime?>("EndTime");

                    b.Property<bool?>("Friday");

                    b.Property<string>("ISCI")
                        .HasMaxLength(255);

                    b.Property<decimal>("Impressions")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<string>("MediaTypeCode")
                        .HasMaxLength(255);

                    b.Property<bool?>("Monday");

                    b.Property<int?>("NetworkId");

                    b.Property<string>("NetworkName");

                    b.Property<bool>("Placed");

                    b.Property<int>("PostLogId");

                    b.Property<string>("ProgramTitle")
                        .HasMaxLength(255);

                    b.Property<int?>("PropertyId");

                    b.Property<string>("ProperyName");

                    b.Property<decimal>("Rate")
                        .HasColumnType("Money");

                    b.Property<int>("RateId");

                    b.Property<bool?>("Saturday");

                    b.Property<int?>("ScheduleLineId")
                        .IsRequired();

                    b.Property<bool>("Scheduled");

                    b.Property<int?>("Split");

                    b.Property<DateTime?>("SpotDate");

                    b.Property<int?>("SpotLen");

                    b.Property<DateTime?>("StartTime");

                    b.Property<bool?>("Sunday");

                    b.Property<bool?>("Thursday");

                    b.Property<bool?>("Tuesday");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<bool?>("Wednesday");

                    b.HasKey("PostLogLineId");

                    b.HasIndex("PostLogId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("PostLogLines");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Property", b =>
                {
                    b.Property<int>("PropertyId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Combo");

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("DayPartId");

                    b.Property<DateTime>("EndTime");

                    b.Property<bool>("Friday");

                    b.Property<int?>("Iteration");

                    b.Property<bool>("Monday");

                    b.Property<int>("NetworkId");

                    b.Property<string>("PropertyName")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<int>("QuarterId");

                    b.Property<bool>("Saturday");

                    b.Property<DateTime>("StartTime");

                    b.Property<bool>("Sunday");

                    b.Property<bool>("Thursday");

                    b.Property<bool>("Tuesday");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<bool>("Wednesday");

                    b.HasKey("PropertyId");

                    b.HasIndex("DayPartId");

                    b.HasIndex("NetworkId");

                    b.HasIndex("QuarterId");

                    b.ToTable("Properties");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PropertyHistory", b =>
                {
                    b.Property<int>("PropertyHistoryId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("Message")
                        .IsRequired();

                    b.Property<int>("PropertyId");

                    b.Property<int>("UpdatedByUserId");

                    b.HasKey("PropertyHistoryId");

                    b.HasIndex("PropertyId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("PropertyHistory");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ProposalNote", b =>
                {
                    b.Property<int>("ProposalNoteId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("CreatedByUserId");

                    b.Property<string>("Note")
                        .IsRequired();

                    b.Property<int?>("ParentNoteId");

                    b.Property<int>("ProposalId");

                    b.Property<int?>("UpfrontId");

                    b.HasKey("ProposalNoteId");

                    b.HasIndex("CreatedByUserId");

                    b.HasIndex("UpfrontId");

                    b.ToTable("ProposalNotes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Quarter", b =>
                {
                    b.Property<int>("QuarterId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BroadcastQuarterNbr");

                    b.Property<int>("BroadcastYr");

                    b.Property<int>("CalendarQuarterNbr");

                    b.Property<int>("CalendarYr");

                    b.Property<DateTime>("CreateDt");

                    b.Property<DateTime>("QtrEndDate");

                    b.Property<DateTime>("QtrStartDate");

                    b.Property<int>("QtrStartWkNbr");

                    b.Property<string>("QuarterName")
                        .IsRequired()
                        .HasMaxLength(6);

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<DateTime?>("Wk01_Date");

                    b.Property<DateTime?>("Wk02_Date");

                    b.Property<DateTime?>("Wk03_Date");

                    b.Property<DateTime?>("Wk04_Date");

                    b.Property<DateTime?>("Wk05_Date");

                    b.Property<DateTime?>("Wk06_Date");

                    b.Property<DateTime?>("Wk07_Date");

                    b.Property<DateTime?>("Wk08_Date");

                    b.Property<DateTime?>("Wk09_Date");

                    b.Property<DateTime?>("Wk10_Date");

                    b.Property<DateTime?>("Wk11_Date");

                    b.Property<DateTime?>("Wk12_Date");

                    b.Property<DateTime?>("Wk13_Date");

                    b.Property<DateTime?>("Wk14_Date");

                    b.HasKey("QuarterId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Quarter");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Rate", b =>
                {
                    b.Property<int>("RateId")
                        .ValueGeneratedOnAdd();

                    b.Property<bool>("Approved");

                    b.Property<int>("BuyTypeId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<int?>("DemographicSettingsPerQtrId");

                    b.Property<int>("DoNotBuyTypeId");

                    b.Property<DateTime>("EffectiveDate");

                    b.Property<DateTime>("ExpirationDate");

                    b.Property<decimal>("Impressions")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<int?>("MandateClientId");

                    b.Property<int>("PropertyId");

                    b.Property<decimal>("RateAmt")
                        .HasColumnType("Money");

                    b.Property<string>("Revision")
                        .IsRequired();

                    b.Property<int?>("SplitId");

                    b.Property<int>("SpotLen");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("RateId");

                    b.HasIndex("BuyTypeId");

                    b.HasIndex("DemographicSettingsPerQtrId");

                    b.HasIndex("DoNotBuyTypeId");

                    b.HasIndex("MandateClientId");

                    b.HasIndex("PropertyId");

                    b.HasIndex("SplitId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Rates");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Schedule", b =>
                {
                    b.Property<int>("ScheduleId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AddedValue1")
                        .HasMaxLength(255);

                    b.Property<string>("AddedValue2")
                        .HasMaxLength(255);

                    b.Property<string>("AddedValue3")
                        .HasMaxLength(255);

                    b.Property<string>("AddedValue4")
                        .HasMaxLength(255);

                    b.Property<string>("AddedValue5")
                        .HasMaxLength(255);

                    b.Property<string>("AdminTextNotes");

                    b.Property<bool>("Approved");

                    b.Property<int?>("BuyerAsstUserUserId");

                    b.Property<int>("BuyerUserUserId");

                    b.Property<int>("ClientId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<int?>("LockedByUserId");

                    b.Property<DateTime?>("LockedDt");

                    b.Property<string>("Notes")
                        .HasMaxLength(255);

                    b.Property<int?>("ParentScheduleId");

                    b.Property<string>("PlanYrType")
                        .IsRequired()
                        .HasMaxLength(1);

                    b.Property<int>("ProposalVer");

                    b.Property<string>("ScheduleName")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<int>("ScheduleTypeId");

                    b.Property<string>("TextNote");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.HasKey("ScheduleId");

                    b.HasIndex("BuyerAsstUserUserId");

                    b.HasIndex("BuyerUserUserId");

                    b.HasIndex("ClientId");

                    b.HasIndex("LockedByUserId");

                    b.HasIndex("ScheduleTypeId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("Schedule");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ScheduleLine", b =>
                {
                    b.Property<int>("ScheduleLineId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BB");

                    b.Property<DateTime>("CreateDt");

                    b.Property<bool>("DNB_Override");

                    b.Property<int>("RateId");

                    b.Property<int>("ScheduleId");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<int>("Wk01_Spots");

                    b.Property<int>("Wk02_Spots");

                    b.Property<int>("Wk03_Spots");

                    b.Property<int>("Wk04_Spots");

                    b.Property<int>("Wk05_Spots");

                    b.Property<int>("Wk06_Spots");

                    b.Property<int>("Wk07_Spots");

                    b.Property<int>("Wk08_Spots");

                    b.Property<int>("Wk09_Spots");

                    b.Property<int>("Wk10_Spots");

                    b.Property<int>("Wk11_Spots");

                    b.Property<int>("Wk12_Spots");

                    b.Property<int>("Wk13_Spots");

                    b.Property<int>("Wk14_Spots");

                    b.HasKey("ScheduleLineId");

                    b.HasIndex("RateId");

                    b.HasIndex("ScheduleId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("ScheduleLines");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ScheduleType", b =>
                {
                    b.Property<int>("ScheduleTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Code")
                        .IsRequired()
                        .HasMaxLength(1);

                    b.Property<DateTime?>("CreateDt")
                        .IsRequired();

                    b.Property<string>("Description")
                        .IsRequired();

                    b.Property<DateTime?>("UpdateDt")
                        .IsRequired();

                    b.Property<int>("UpdatedByUserId");

                    b.HasKey("ScheduleTypeId");

                    b.ToTable("ScheduleTypes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Split", b =>
                {
                    b.Property<int>("SplitId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("SplitDesc")
                        .HasMaxLength(255);

                    b.Property<int>("SplitNo");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.HasKey("SplitId");

                    b.ToTable("Splits");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Upfront", b =>
                {
                    b.Property<int>("UpfrontId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AdminTextNotes");

                    b.Property<bool>("Approved");

                    b.Property<int?>("BuyerNameUserId");

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<int?>("NetworkId");

                    b.Property<string>("Notes")
                        .HasMaxLength(255);

                    b.Property<string>("PlanYrType")
                        .IsRequired()
                        .HasMaxLength(1);

                    b.Property<int?>("QuarterId");

                    b.Property<string>("TextNote");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.Property<int?>("UpfrontLockedByUserId");

                    b.Property<DateTime?>("UpfrontLockedDate");

                    b.Property<int>("UpfrontTypeId");

                    b.HasKey("UpfrontId");

                    b.HasIndex("BuyerNameUserId");

                    b.HasIndex("NetworkId");

                    b.HasIndex("QuarterId");

                    b.HasIndex("UpdatedByUserId");

                    b.HasIndex("UpfrontLockedByUserId");

                    b.HasIndex("UpfrontTypeId");

                    b.ToTable("Upfronts");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontExpansionNetworkGroup", b =>
                {
                    b.Property<int>("UpfrontExpansionNetworkGroupId")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("GroupId");

                    b.Property<int?>("NetworkId");

                    b.Property<bool>("Parent");

                    b.Property<int>("QuarterId");

                    b.HasKey("UpfrontExpansionNetworkGroupId");

                    b.HasIndex("NetworkId");

                    b.ToTable("UpfrontExpansionNetworkGroup");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontExpansionTracking", b =>
                {
                    b.Property<int>("UpfrontExpansionTrackingId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<decimal>("TotalUpfrontDollars")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<decimal>("UEDollarsAvailable")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<int>("UpfrontId");

                    b.Property<decimal?>("YearlyTotalUpfrontDollars");

                    b.Property<decimal?>("YearlyUEDollarsAvailable");

                    b.HasKey("UpfrontExpansionTrackingId");

                    b.HasIndex("UpdatedByUserId");

                    b.HasIndex("UpfrontId");

                    b.ToTable("UpfrontExpansionTracking");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontExpansionTrackingLine", b =>
                {
                    b.Property<int>("UpfrontExpansionTrackingLineId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<int?>("TradeFromClientId");

                    b.Property<int?>("TradeToClientId");

                    b.Property<decimal>("TradedUEDollars")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<int>("UpfrontExpansionTrackingId");

                    b.HasKey("UpfrontExpansionTrackingLineId");

                    b.HasIndex("TradeFromClientId");

                    b.HasIndex("TradeToClientId");

                    b.HasIndex("UpdatedByUserId");

                    b.HasIndex("UpfrontExpansionTrackingId");

                    b.ToTable("UpfrontExpansionTrackingLines");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontLine", b =>
                {
                    b.Property<int>("UpfrontLineId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("RateId");

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UpdatedByUserId");

                    b.Property<int>("UpfrontId");

                    b.HasKey("UpfrontLineId");

                    b.HasIndex("RateId");

                    b.HasIndex("UpfrontId");

                    b.ToTable("UpfrontLines");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontNote", b =>
                {
                    b.Property<int>("UpfrontNoteId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<int>("CreatedByUserId");

                    b.Property<string>("Note")
                        .IsRequired();

                    b.Property<int?>("ParentNoteId");

                    b.Property<int>("UpfrontId");

                    b.HasKey("UpfrontNoteId");

                    b.HasIndex("CreatedByUserId");

                    b.HasIndex("UpfrontId");

                    b.ToTable("UpfrontNotes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontRemnantLineFlat", b =>
                {
                    b.Property<int>("UpfrontLineId");

                    b.Property<bool>("AllUnapproved");

                    b.Property<bool>("ApproveLock");

                    b.Property<bool>("Approved");

                    b.Property<string>("BuyTypeCode");

                    b.Property<string>("BuyTypeDescription");

                    b.Property<int>("BuyTypeId");

                    b.Property<DateTime?>("BuyTypeIdUpdateDt");

                    b.Property<bool>("BuyTypeIsZeroImp");

                    b.Property<bool>("BuyTypeIsZeroRate");

                    b.Property<decimal>("CPM")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<bool>("Combo");

                    b.Property<string>("DayPartCd");

                    b.Property<DateTime?>("DayPartUpdateDt");

                    b.Property<DateTime?>("DaysUpdateDt");

                    b.Property<string>("DemoName");

                    b.Property<int>("DemographicSettingsId");

                    b.Property<bool>("DoNotBuyTypeClientRequired");

                    b.Property<string>("DoNotBuyTypeDescription");

                    b.Property<int>("DoNotBuyTypeId");

                    b.Property<DateTime?>("DoNotBuyTypeUpdateDt");

                    b.Property<DateTime>("EffectiveDate");

                    b.Property<DateTime?>("EffectiveDateUpdateDt");

                    b.Property<DateTime>("EndTime");

                    b.Property<DateTime?>("EndTimeUpdateDt");

                    b.Property<DateTime>("ExpirationDate");

                    b.Property<DateTime?>("ExpirationDateUpdateDt");

                    b.Property<bool>("Friday");

                    b.Property<int>("FullCount");

                    b.Property<int>("Id");

                    b.Property<decimal>("Impressions")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<DateTime?>("ImpressionsUpdateDt");

                    b.Property<int>("LockedByUserId");

                    b.Property<int?>("MandateClientId");

                    b.Property<string>("MandateClientName");

                    b.Property<DateTime?>("MandateClientUpdateDt");

                    b.Property<bool>("Monday");

                    b.Property<string>("OMDP");

                    b.Property<DateTime?>("OMDPUpdateDt");

                    b.Property<int>("PropertyId");

                    b.Property<string>("PropertyName");

                    b.Property<DateTime?>("PropertyNameUpdateDt");

                    b.Property<string>("QuarterName");

                    b.Property<decimal>("RateAmt")
                        .HasColumnType("decimal(18, 6)");

                    b.Property<int>("RateId");

                    b.Property<DateTime>("RateRevisedDate");

                    b.Property<DateTime>("RateUpdateDt");

                    b.Property<string>("Revision");

                    b.Property<bool>("Saturday");

                    b.Property<int>("SortOrder");

                    b.Property<int>("SplitId");

                    b.Property<int>("SplitNo");

                    b.Property<int>("SpotLen");

                    b.Property<DateTime>("StartTime");

                    b.Property<DateTime?>("StartTimeUpdateDt");

                    b.Property<bool>("Sunday");

                    b.Property<bool>("Thursday");

                    b.Property<bool>("Tuesday");

                    b.Property<string>("Universe");

                    b.Property<int>("UpfrontId");

                    b.Property<DateTime>("UpfrontLineUpdateDt");

                    b.Property<int>("UserId");

                    b.Property<bool>("Wednesday");

                    b.HasKey("UpfrontLineId");

                    b.ToTable("UpfrontRemnantLinesFlat");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontType", b =>
                {
                    b.Property<int>("UpfrontTypeId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int?>("UpdatedByUserId");

                    b.HasKey("UpfrontTypeId");

                    b.HasIndex("UpdatedByUserId");

                    b.ToTable("UpfrontTypes");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.User", b =>
                {
                    b.Property<int>("UserId")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("AccountName")
                        .HasMaxLength(100);

                    b.Property<bool>("CA_User");

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("DisplayName")
                        .HasMaxLength(100);

                    b.Property<string>("EmailAddress")
                        .HasMaxLength(100);

                    b.Property<bool>("ExchangeRateAdmin");

                    b.Property<bool>("Finance");

                    b.Property<string>("FirstName")
                        .HasMaxLength(50);

                    b.Property<string>("ImageUrl")
                        .HasMaxLength(255);

                    b.Property<int>("JobTitleTypeId");

                    b.Property<DateTime?>("LastLoginDt");

                    b.Property<string>("LastName")
                        .HasMaxLength(50);

                    b.Property<string>("OtherName");

                    b.Property<string>("Password")
                        .HasMaxLength(25);

                    b.Property<int>("PermissionLevelId");

                    b.Property<bool>("US_User");

                    b.Property<DateTime>("UpdateDt");

                    b.HasKey("UserId");

                    b.HasIndex("JobTitleTypeId");

                    b.HasIndex("PermissionLevelId");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UserProfile", b =>
                {
                    b.Property<int>("UserProfileId")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime>("CreateDt");

                    b.Property<string>("ProfileKey")
                        .IsRequired()
                        .HasMaxLength(255);

                    b.Property<string>("ProfileValue")
                        .IsRequired()
                        .HasMaxLength(2000);

                    b.Property<DateTime>("UpdateDt");

                    b.Property<int>("UserProfileUserId");

                    b.HasKey("UserProfileId");

                    b.HasIndex("UserProfileUserId");

                    b.ToTable("UserProfiles");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeature", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.AppFeatureGroup", "AppFeatureGroup")
                        .WithMany()
                        .HasForeignKey("AppFeatureGroupId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeatureDefaultAction", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Action", "Action")
                        .WithMany()
                        .HasForeignKey("ActionId");

                    b.HasOne("OM_ScheduleTool.Models.AppFeature", "AppFeature")
                        .WithMany()
                        .HasForeignKey("AppFeatureId");

                    b.HasOne("OM_ScheduleTool.Models.PermissionLevel", "PermissionLevel")
                        .WithMany()
                        .HasForeignKey("PermissionLevelId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.AppFeatureUserCustomAction", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Action", "Action")
                        .WithMany()
                        .HasForeignKey("ActionId");

                    b.HasOne("OM_ScheduleTool.Models.AppFeature", "AppFeature")
                        .WithMany()
                        .HasForeignKey("AppFeatureId");

                    b.HasOne("OM_ScheduleTool.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ApprovalLevel", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.BuyType", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.CanadaActualExchangeRate", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Quarter", "Quarter")
                        .WithMany()
                        .HasForeignKey("QuarterId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.CanadaClientExchangeRate", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId");

                    b.HasOne("OM_ScheduleTool.Models.Quarter", "Quarter")
                        .WithMany()
                        .HasForeignKey("QuarterId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedByUser")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Client", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ClientUserJob", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId");

                    b.HasOne("OM_ScheduleTool.Models.Job", "Job")
                        .WithMany()
                        .HasForeignKey("JobId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.CommRate", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId");

                    b.HasOne("OM_ScheduleTool.Models.Quarter", "Quarter")
                        .WithMany()
                        .HasForeignKey("QuarterId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Country", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DayPart", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Dealpoint", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Network", "Network")
                        .WithMany()
                        .HasForeignKey("NetworkId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DemographicSettings", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DemographicSettingsPerQtr", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.DemographicSettings", "Demo")
                        .WithMany()
                        .HasForeignKey("DemographicSettingsId");

                    b.HasOne("OM_ScheduleTool.Models.Quarter", "Quarter")
                        .WithMany()
                        .HasForeignKey("QuarterId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.DoNotBuyType", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedByUser")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.EdiClientLookup", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.EdiNetworkLookup", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Network", "Network")
                        .WithMany()
                        .HasForeignKey("NetworkId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.FeedType", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdateBy")
                        .WithMany()
                        .HasForeignKey("UpdateByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Logs", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.MediaType", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Network", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Country", "Country")
                        .WithMany()
                        .HasForeignKey("CountryId");

                    b.HasOne("OM_ScheduleTool.Models.FeedType", "FeedType")
                        .WithMany()
                        .HasForeignKey("FeedTypeId");

                    b.HasOne("OM_ScheduleTool.Models.MediaType", "MediaType")
                        .WithMany()
                        .HasForeignKey("MediaTypeId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.NetworkUserJob", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Job", "Job")
                        .WithMany()
                        .HasForeignKey("JobId");

                    b.HasOne("OM_ScheduleTool.Models.Network", "Network")
                        .WithMany()
                        .HasForeignKey("NetworkId");

                    b.HasOne("OM_ScheduleTool.Models.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PostLog", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "PostLogLockedBy")
                        .WithMany()
                        .HasForeignKey("PostLogLockedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.Schedule", "Schedule")
                        .WithMany()
                        .HasForeignKey("ScheduleId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PostLogLine", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.PostLog", "PostLog")
                        .WithMany()
                        .HasForeignKey("PostLogId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Property", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.DayPart", "DayPart")
                        .WithMany()
                        .HasForeignKey("DayPartId");

                    b.HasOne("OM_ScheduleTool.Models.Network", "Network")
                        .WithMany()
                        .HasForeignKey("NetworkId");

                    b.HasOne("OM_ScheduleTool.Models.Quarter", "Quarter")
                        .WithMany()
                        .HasForeignKey("QuarterId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.PropertyHistory", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Property", "Property")
                        .WithMany()
                        .HasForeignKey("PropertyId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ProposalNote", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.Upfront", "Upfront")
                        .WithMany()
                        .HasForeignKey("UpfrontId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Quarter", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Rate", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.BuyType", "BuyType")
                        .WithMany()
                        .HasForeignKey("BuyTypeId");

                    b.HasOne("OM_ScheduleTool.Models.DemographicSettingsPerQtr", "DemographicSettingsPerQtr")
                        .WithMany()
                        .HasForeignKey("DemographicSettingsPerQtrId");

                    b.HasOne("OM_ScheduleTool.Models.DoNotBuyType", "DoNotBuyType")
                        .WithMany()
                        .HasForeignKey("DoNotBuyTypeId");

                    b.HasOne("OM_ScheduleTool.Models.Client", "MandateClient")
                        .WithMany()
                        .HasForeignKey("MandateClientId");

                    b.HasOne("OM_ScheduleTool.Models.Property", "Property")
                        .WithMany()
                        .HasForeignKey("PropertyId");

                    b.HasOne("OM_ScheduleTool.Models.Split", "Split")
                        .WithMany()
                        .HasForeignKey("SplitId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedByUser")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Schedule", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "BuyerAsstUser")
                        .WithMany()
                        .HasForeignKey("BuyerAsstUserUserId");

                    b.HasOne("OM_ScheduleTool.Models.User", "BuyerUser")
                        .WithMany()
                        .HasForeignKey("BuyerUserUserId");

                    b.HasOne("OM_ScheduleTool.Models.Client", "Client")
                        .WithMany()
                        .HasForeignKey("ClientId");

                    b.HasOne("OM_ScheduleTool.Models.User", "LockedByUser")
                        .WithMany()
                        .HasForeignKey("LockedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.ScheduleType", "ScheduleType")
                        .WithMany()
                        .HasForeignKey("ScheduleTypeId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.ScheduleLine", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Rate", "Rate")
                        .WithMany()
                        .HasForeignKey("RateId");

                    b.HasOne("OM_ScheduleTool.Models.Schedule", "Schedule")
                        .WithMany()
                        .HasForeignKey("ScheduleId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.Upfront", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "BuyerName")
                        .WithMany()
                        .HasForeignKey("BuyerNameUserId");

                    b.HasOne("OM_ScheduleTool.Models.Network", "Network")
                        .WithMany()
                        .HasForeignKey("NetworkId");

                    b.HasOne("OM_ScheduleTool.Models.Quarter", "Quarter")
                        .WithMany()
                        .HasForeignKey("QuarterId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedByUser")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpfrontLockedBy")
                        .WithMany()
                        .HasForeignKey("UpfrontLockedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.UpfrontType", "UpfrontType")
                        .WithMany()
                        .HasForeignKey("UpfrontTypeId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontExpansionNetworkGroup", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Network", "Network")
                        .WithMany()
                        .HasForeignKey("NetworkId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontExpansionTracking", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.Upfront", "Upfront")
                        .WithMany()
                        .HasForeignKey("UpfrontId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontExpansionTrackingLine", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Client", "TradeFrom")
                        .WithMany()
                        .HasForeignKey("TradeFromClientId");

                    b.HasOne("OM_ScheduleTool.Models.Client", "TradeTo")
                        .WithMany()
                        .HasForeignKey("TradeToClientId");

                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedBy")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.UpfrontExpansionTracking")
                        .WithMany("UpfrontExpansionTrackingLines")
                        .HasForeignKey("UpfrontExpansionTrackingId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontLine", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.Rate", "Rate")
                        .WithMany()
                        .HasForeignKey("RateId");

                    b.HasOne("OM_ScheduleTool.Models.Upfront", "Upfront")
                        .WithMany()
                        .HasForeignKey("UpfrontId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontNote", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "CreatedBy")
                        .WithMany()
                        .HasForeignKey("CreatedByUserId");

                    b.HasOne("OM_ScheduleTool.Models.Upfront", "Upfront")
                        .WithMany()
                        .HasForeignKey("UpfrontId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UpfrontType", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UpdatedByUser")
                        .WithMany()
                        .HasForeignKey("UpdatedByUserId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.User", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.JobTitleType", "JobTitleType")
                        .WithMany()
                        .HasForeignKey("JobTitleTypeId");

                    b.HasOne("OM_ScheduleTool.Models.PermissionLevel", "PermissionLevel")
                        .WithMany()
                        .HasForeignKey("PermissionLevelId");
                });

            modelBuilder.Entity("OM_ScheduleTool.Models.UserProfile", b =>
                {
                    b.HasOne("OM_ScheduleTool.Models.User", "UserProfileUser")
                        .WithMany()
                        .HasForeignKey("UserProfileUserId");
                });
        }
    }
}
