using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Metadata;

namespace OM_ScheduleTool.Migrations
{
    public partial class initialdb : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Actions",
                columns: table => new
                {
                    ActionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    Description = table.Column<string>(maxLength: 100, nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Actions", x => x.ActionId);
                });

            migrationBuilder.CreateTable(
                name: "AppFeatureGroups",
                columns: table => new
                {
                    AppFeatureGroupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    Description = table.Column<string>(maxLength: 100, nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFeatureGroups", x => x.AppFeatureGroupId);
                });

            migrationBuilder.CreateTable(
                name: "BroadcastDate",
                columns: table => new
                {
                    BroadcastDateId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DateFrom = table.Column<DateTime>(nullable: false),
                    DateTo = table.Column<DateTime>(nullable: false),
                    Month = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    Year = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BroadcastDate", x => x.BroadcastDateId);
                });

            migrationBuilder.CreateTable(
                name: "DaysCodes",
                columns: table => new
                {
                    DaysCodeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DayCode = table.Column<string>(maxLength: 7, nullable: false),
                    DaysDesc = table.Column<string>(maxLength: 255, nullable: false),
                    DaysDescCompact = table.Column<string>(maxLength: 8, nullable: true),
                    DaysDescShort = table.Column<string>(maxLength: 15, nullable: true),
                    Friday = table.Column<bool>(nullable: false),
                    Monday = table.Column<bool>(nullable: false),
                    Saturday = table.Column<bool>(nullable: false),
                    Sunday = table.Column<bool>(nullable: false),
                    Thursday = table.Column<bool>(nullable: false),
                    Tuesday = table.Column<bool>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    Wednesday = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DaysCodes", x => x.DaysCodeId);
                });

            migrationBuilder.CreateTable(
                name: "DeltaListChanges",
                columns: table => new
                {
                    DeltaListId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Change = table.Column<string>(maxLength: 5000, nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Version = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DeltaListChanges", x => x.DeltaListId);
                });

            migrationBuilder.CreateTable(
                name: "Jobs",
                columns: table => new
                {
                    JobId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    JobDesc = table.Column<string>(maxLength: 255, nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Jobs", x => x.JobId);
                });

            migrationBuilder.CreateTable(
                name: "JobTitleTypes",
                columns: table => new
                {
                    JobTitleTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(maxLength: 255, nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_JobTitleTypes", x => x.JobTitleTypeId);
                });

            migrationBuilder.CreateTable(
                name: "PermissionLevels",
                columns: table => new
                {
                    PermissionLevelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    Description = table.Column<string>(nullable: true),
                    ThemeBackground = table.Column<string>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PermissionLevels", x => x.PermissionLevelId);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleTypes",
                columns: table => new
                {
                    ScheduleTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Code = table.Column<string>(maxLength: 1, nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleTypes", x => x.ScheduleTypeId);
                });

            migrationBuilder.CreateTable(
                name: "Splits",
                columns: table => new
                {
                    SplitId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    SplitDesc = table.Column<string>(maxLength: 255, nullable: true),
                    SplitNo = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Splits", x => x.SplitId);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontRemnantLinesFlat",
                columns: table => new
                {
                    UpfrontLineId = table.Column<int>(nullable: false),
                    AllUnapproved = table.Column<bool>(nullable: false),
                    ApproveLock = table.Column<bool>(nullable: false),
                    Approved = table.Column<bool>(nullable: false),
                    BuyTypeCode = table.Column<string>(nullable: true),
                    BuyTypeDescription = table.Column<string>(nullable: true),
                    BuyTypeId = table.Column<int>(nullable: false),
                    BuyTypeIdUpdateDt = table.Column<DateTime>(nullable: true),
                    BuyTypeIsZeroImp = table.Column<bool>(nullable: false),
                    BuyTypeIsZeroRate = table.Column<bool>(nullable: false),
                    CPM = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Combo = table.Column<bool>(nullable: false),
                    DayPartCd = table.Column<string>(nullable: true),
                    DayPartUpdateDt = table.Column<DateTime>(nullable: true),
                    DaysUpdateDt = table.Column<DateTime>(nullable: true),
                    DemoName = table.Column<string>(nullable: true),
                    DemographicSettingsId = table.Column<int>(nullable: false),
                    DoNotBuyTypeClientRequired = table.Column<bool>(nullable: false),
                    DoNotBuyTypeDescription = table.Column<string>(nullable: true),
                    DoNotBuyTypeId = table.Column<int>(nullable: false),
                    DoNotBuyTypeUpdateDt = table.Column<DateTime>(nullable: true),
                    EffectiveDate = table.Column<DateTime>(nullable: false),
                    EffectiveDateUpdateDt = table.Column<DateTime>(nullable: true),
                    EndTime = table.Column<DateTime>(nullable: false),
                    EndTimeUpdateDt = table.Column<DateTime>(nullable: true),
                    ExpirationDate = table.Column<DateTime>(nullable: false),
                    ExpirationDateUpdateDt = table.Column<DateTime>(nullable: true),
                    Friday = table.Column<bool>(nullable: false),
                    FullCount = table.Column<int>(nullable: false),
                    Id = table.Column<int>(nullable: false),
                    Impressions = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    ImpressionsUpdateDt = table.Column<DateTime>(nullable: true),
                    LockedByUserId = table.Column<int>(nullable: false),
                    MandateClientId = table.Column<int>(nullable: true),
                    MandateClientName = table.Column<string>(nullable: true),
                    MandateClientUpdateDt = table.Column<DateTime>(nullable: true),
                    Monday = table.Column<bool>(nullable: false),
                    OMDP = table.Column<string>(nullable: true),
                    OMDPUpdateDt = table.Column<DateTime>(nullable: true),
                    PropertyId = table.Column<int>(nullable: false),
                    PropertyName = table.Column<string>(nullable: true),
                    PropertyNameUpdateDt = table.Column<DateTime>(nullable: true),
                    QuarterName = table.Column<string>(nullable: true),
                    RateAmt = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    RateId = table.Column<int>(nullable: false),
                    RateRevisedDate = table.Column<DateTime>(nullable: false),
                    RateUpdateDt = table.Column<DateTime>(nullable: false),
                    Revision = table.Column<string>(nullable: true),
                    Saturday = table.Column<bool>(nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    SplitId = table.Column<int>(nullable: false),
                    SplitNo = table.Column<int>(nullable: false),
                    SpotLen = table.Column<int>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: false),
                    StartTimeUpdateDt = table.Column<DateTime>(nullable: true),
                    Sunday = table.Column<bool>(nullable: false),
                    Thursday = table.Column<bool>(nullable: false),
                    Tuesday = table.Column<bool>(nullable: false),
                    Universe = table.Column<string>(nullable: true),
                    UpfrontId = table.Column<int>(nullable: false),
                    UpfrontLineUpdateDt = table.Column<DateTime>(nullable: false),
                    UserId = table.Column<int>(nullable: false),
                    Wednesday = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontRemnantLinesFlat", x => x.UpfrontLineId);
                });

            migrationBuilder.CreateTable(
                name: "AppFeatures",
                columns: table => new
                {
                    AppFeatureId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AllowSetPermission = table.Column<bool>(nullable: false),
                    AppFeatureGroupId = table.Column<int>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    Description = table.Column<string>(maxLength: 100, nullable: false),
                    Icon = table.Column<string>(nullable: true),
                    Link = table.Column<string>(maxLength: 255, nullable: true),
                    OnlyShowIfExchangeRateAdminRole = table.Column<bool>(nullable: false),
                    OnlyShowIfFinanceRole = table.Column<bool>(nullable: false),
                    ParentAppFeatureId = table.Column<int>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFeatures", x => x.AppFeatureId);
                    table.ForeignKey(
                        name: "FK_AppFeatures_AppFeatureGroups_AppFeatureGroupId",
                        column: x => x.AppFeatureGroupId,
                        principalTable: "AppFeatureGroups",
                        principalColumn: "AppFeatureGroupId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    UserId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AccountName = table.Column<string>(maxLength: 100, nullable: true),
                    CA_User = table.Column<bool>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DisplayName = table.Column<string>(maxLength: 100, nullable: true),
                    EmailAddress = table.Column<string>(maxLength: 100, nullable: true),
                    ExchangeRateAdmin = table.Column<bool>(nullable: false),
                    Finance = table.Column<bool>(nullable: false),
                    FirstName = table.Column<string>(maxLength: 50, nullable: true),
                    ImageUrl = table.Column<string>(maxLength: 255, nullable: true),
                    JobTitleTypeId = table.Column<int>(nullable: false),
                    LastLoginDt = table.Column<DateTime>(nullable: true),
                    LastName = table.Column<string>(maxLength: 50, nullable: true),
                    OtherName = table.Column<string>(nullable: true),
                    Password = table.Column<string>(maxLength: 25, nullable: true),
                    PermissionLevelId = table.Column<int>(nullable: false),
                    US_User = table.Column<bool>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.UserId);
                    table.ForeignKey(
                        name: "FK_Users_JobTitleTypes_JobTitleTypeId",
                        column: x => x.JobTitleTypeId,
                        principalTable: "JobTitleTypes",
                        principalColumn: "JobTitleTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Users_PermissionLevels_PermissionLevelId",
                        column: x => x.PermissionLevelId,
                        principalTable: "PermissionLevels",
                        principalColumn: "PermissionLevelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppFeatureDefaultActions",
                columns: table => new
                {
                    AppFeatureDefaultActionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ActionId = table.Column<int>(nullable: true),
                    AppFeatureId = table.Column<int>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    PermissionLevelId = table.Column<int>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFeatureDefaultActions", x => x.AppFeatureDefaultActionId);
                    table.ForeignKey(
                        name: "FK_AppFeatureDefaultActions_Actions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppFeatureDefaultActions_AppFeatures_AppFeatureId",
                        column: x => x.AppFeatureId,
                        principalTable: "AppFeatures",
                        principalColumn: "AppFeatureId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppFeatureDefaultActions_PermissionLevels_PermissionLevelId",
                        column: x => x.PermissionLevelId,
                        principalTable: "PermissionLevels",
                        principalColumn: "PermissionLevelId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "AppFeatureUserCustomActions",
                columns: table => new
                {
                    AppFeatureUserCustomActionId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ActionId = table.Column<int>(nullable: true),
                    AppFeatureId = table.Column<int>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: true),
                    UserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppFeatureUserCustomActions", x => x.AppFeatureUserCustomActionId);
                    table.ForeignKey(
                        name: "FK_AppFeatureUserCustomActions_Actions_ActionId",
                        column: x => x.ActionId,
                        principalTable: "Actions",
                        principalColumn: "ActionId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppFeatureUserCustomActions_AppFeatures_AppFeatureId",
                        column: x => x.AppFeatureId,
                        principalTable: "AppFeatures",
                        principalColumn: "AppFeatureId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_AppFeatureUserCustomActions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ApprovalLevel",
                columns: table => new
                {
                    ApprovalLevelId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ApprovalName = table.Column<string>(maxLength: 255, nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ApprovalLevel", x => x.ApprovalLevelId);
                    table.ForeignKey(
                        name: "FK_ApprovalLevel_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "BuyType",
                columns: table => new
                {
                    BuyTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BuyTypeCode = table.Column<string>(nullable: false),
                    BuyTypeDescription = table.Column<string>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DRType = table.Column<bool>(nullable: false),
                    IsAddADU = table.Column<bool>(nullable: false),
                    IsAllowUnapprove = table.Column<bool>(nullable: false),
                    IsAutoApprove = table.Column<bool>(nullable: false),
                    IsLowUnassigned = table.Column<bool>(nullable: false),
                    IsMidUnassigned = table.Column<bool>(nullable: false),
                    IsZeroImp = table.Column<bool>(nullable: false),
                    IsZeroRate = table.Column<bool>(nullable: false),
                    RemnantType = table.Column<bool>(nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    UpfrontType = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BuyType", x => x.BuyTypeId);
                    table.ForeignKey(
                        name: "FK_BuyType_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Countries",
                columns: table => new
                {
                    CountryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CountryLong = table.Column<string>(maxLength: 255, nullable: true),
                    CountryShort = table.Column<string>(maxLength: 2, nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    IncludeInNetwork = table.Column<bool>(nullable: false),
                    SortKey = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Countries", x => x.CountryId);
                    table.ForeignKey(
                        name: "FK_Countries_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DayPart",
                columns: table => new
                {
                    DayPartId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DayPartCd = table.Column<string>(maxLength: 2, nullable: false),
                    DayPartDesc = table.Column<string>(maxLength: 255, nullable: false),
                    LongDesc = table.Column<string>(maxLength: 255, nullable: true),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DayPart", x => x.DayPartId);
                    table.ForeignKey(
                        name: "FK_DayPart_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DoNotBuyType",
                columns: table => new
                {
                    DoNotBuyTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CanBeSelectedFromGrid = table.Column<bool>(nullable: false),
                    ClientRequired = table.Column<bool>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: true),
                    Description = table.Column<string>(maxLength: 100, nullable: false),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: true),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DoNotBuyType", x => x.DoNotBuyTypeId);
                    table.ForeignKey(
                        name: "FK_DoNotBuyType_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "FeedTypes",
                columns: table => new
                {
                    FeedTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(maxLength: 255, nullable: true),
                    UpdateByUserId = table.Column<int>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FeedTypes", x => x.FeedTypeId);
                    table.ForeignKey(
                        name: "FK_FeedTypes_Users_UpdateByUserId",
                        column: x => x.UpdateByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Logs",
                columns: table => new
                {
                    LogsId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Application = table.Column<string>(maxLength: 300, nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    LogType = table.Column<int>(nullable: false),
                    Message = table.Column<string>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Logs", x => x.LogsId);
                    table.ForeignKey(
                        name: "FK_Logs_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "MediaTypes",
                columns: table => new
                {
                    MediaTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    MediaCategory = table.Column<string>(maxLength: 1, nullable: true),
                    MediaTypeCode = table.Column<string>(maxLength: 255, nullable: true),
                    MediaTypeName = table.Column<string>(maxLength: 255, nullable: true),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MediaTypes", x => x.MediaTypeId);
                    table.ForeignKey(
                        name: "FK_MediaTypes_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Quarter",
                columns: table => new
                {
                    QuarterId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BroadcastQuarterNbr = table.Column<int>(nullable: false),
                    BroadcastYr = table.Column<int>(nullable: false),
                    CalendarQuarterNbr = table.Column<int>(nullable: false),
                    CalendarYr = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    QtrEndDate = table.Column<DateTime>(nullable: false),
                    QtrStartDate = table.Column<DateTime>(nullable: false),
                    QtrStartWkNbr = table.Column<int>(nullable: false),
                    QuarterName = table.Column<string>(maxLength: 6, nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    Wk01_Date = table.Column<DateTime>(nullable: true),
                    Wk02_Date = table.Column<DateTime>(nullable: true),
                    Wk03_Date = table.Column<DateTime>(nullable: true),
                    Wk04_Date = table.Column<DateTime>(nullable: true),
                    Wk05_Date = table.Column<DateTime>(nullable: true),
                    Wk06_Date = table.Column<DateTime>(nullable: true),
                    Wk07_Date = table.Column<DateTime>(nullable: true),
                    Wk08_Date = table.Column<DateTime>(nullable: true),
                    Wk09_Date = table.Column<DateTime>(nullable: true),
                    Wk10_Date = table.Column<DateTime>(nullable: true),
                    Wk11_Date = table.Column<DateTime>(nullable: true),
                    Wk12_Date = table.Column<DateTime>(nullable: true),
                    Wk13_Date = table.Column<DateTime>(nullable: true),
                    Wk14_Date = table.Column<DateTime>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Quarter", x => x.QuarterId);
                    table.ForeignKey(
                        name: "FK_Quarter_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontTypes",
                columns: table => new
                {
                    UpfrontTypeId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Description = table.Column<string>(maxLength: 255, nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontTypes", x => x.UpfrontTypeId);
                    table.ForeignKey(
                        name: "FK_UpfrontTypes_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UserProfiles",
                columns: table => new
                {
                    UserProfileId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    ProfileKey = table.Column<string>(maxLength: 255, nullable: false),
                    ProfileValue = table.Column<string>(maxLength: 2000, nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UserProfileUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UserProfiles", x => x.UserProfileId);
                    table.ForeignKey(
                        name: "FK_UserProfiles_Users_UserProfileUserId",
                        column: x => x.UserProfileUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Clients",
                columns: table => new
                {
                    ClientId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Active = table.Column<bool>(nullable: true),
                    AnnivDate = table.Column<DateTime>(nullable: true),
                    ClientName = table.Column<string>(maxLength: 255, nullable: true),
                    CommStructure = table.Column<string>(maxLength: 255, nullable: true),
                    CountryId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    New = table.Column<bool>(nullable: false),
                    PlanYr = table.Column<int>(nullable: false),
                    Tiered = table.Column<bool>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clients", x => x.ClientId);
                    table.ForeignKey(
                        name: "FK_Clients_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Clients_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DemographicSettings",
                columns: table => new
                {
                    DemographicSettingsId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AgeMax = table.Column<int>(nullable: true),
                    AgeMin = table.Column<int>(nullable: true),
                    CountryId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DemoName = table.Column<string>(maxLength: 255, nullable: false),
                    Gender = table.Column<string>(maxLength: 255, nullable: true),
                    SortOrder = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DemographicSettings", x => x.DemographicSettingsId);
                    table.ForeignKey(
                        name: "FK_DemographicSettings_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DemographicSettings_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Networks",
                columns: table => new
                {
                    NetworkId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CountryId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    FeedTypeId = table.Column<int>(nullable: false),
                    GuarImp = table.Column<int>(nullable: true),
                    MediaTypeId = table.Column<int>(nullable: false),
                    PlanYr = table.Column<int>(nullable: false),
                    StdNetName = table.Column<string>(maxLength: 255, nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    WGT = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Networks", x => x.NetworkId);
                    table.ForeignKey(
                        name: "FK_Networks_Countries_CountryId",
                        column: x => x.CountryId,
                        principalTable: "Countries",
                        principalColumn: "CountryId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Networks_FeedTypes_FeedTypeId",
                        column: x => x.FeedTypeId,
                        principalTable: "FeedTypes",
                        principalColumn: "FeedTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Networks_MediaTypes_MediaTypeId",
                        column: x => x.MediaTypeId,
                        principalTable: "MediaTypes",
                        principalColumn: "MediaTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Networks_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CanadaActualExchangeRates",
                columns: table => new
                {
                    CanadaActualExchangeRateId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DayDate = table.Column<DateTime>(nullable: false),
                    QuarterId = table.Column<int>(nullable: false),
                    Rate = table.Column<decimal>(type: "Money", nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    WeekDate = table.Column<DateTime>(nullable: false),
                    WkAvgRate = table.Column<decimal>(type: "Money", nullable: false),
                    WkNbr = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CanadaActualExchangeRates", x => x.CanadaActualExchangeRateId);
                    table.ForeignKey(
                        name: "FK_CanadaActualExchangeRates_Quarter_QuarterId",
                        column: x => x.QuarterId,
                        principalTable: "Quarter",
                        principalColumn: "QuarterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CanadaActualExchangeRates_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CanadaClientExchangeRates",
                columns: table => new
                {
                    CanadaClientExchangeRateId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Actualized = table.Column<bool>(nullable: false),
                    ClientId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    PlanningRate = table.Column<decimal>(type: "Money", nullable: false),
                    QuarterId = table.Column<int>(nullable: false),
                    Rate = table.Column<decimal>(type: "Money", nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    WeekDate = table.Column<DateTime>(nullable: false),
                    WkNbr = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CanadaClientExchangeRates", x => x.CanadaClientExchangeRateId);
                    table.ForeignKey(
                        name: "FK_CanadaClientExchangeRates_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CanadaClientExchangeRates_Quarter_QuarterId",
                        column: x => x.QuarterId,
                        principalTable: "Quarter",
                        principalColumn: "QuarterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CanadaClientExchangeRates_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ClientUserJob",
                columns: table => new
                {
                    ClientUserJobId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClientId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    JobId = table.Column<int>(nullable: false),
                    PlanYr = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ClientUserJob", x => x.ClientUserJobId);
                    table.ForeignKey(
                        name: "FK_ClientUserJob_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClientUserJob_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClientUserJob_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ClientUserJob_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CommRate",
                columns: table => new
                {
                    CommRateId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClientId = table.Column<int>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    QuarterId = table.Column<int>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    Week01Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week02Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week03Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week04Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week05Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week06Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week07Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week08Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week09Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week10Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week11Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week12Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week13Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    Week14Rate = table.Column<decimal>(type: "decimal(18, 6)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CommRate", x => x.CommRateId);
                    table.ForeignKey(
                        name: "FK_CommRate_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CommRate_Quarter_QuarterId",
                        column: x => x.QuarterId,
                        principalTable: "Quarter",
                        principalColumn: "QuarterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_CommRate_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EdiClientLookup",
                columns: table => new
                {
                    EdiClientLookupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ClientId = table.Column<int>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    EdiClientName = table.Column<string>(maxLength: 255, nullable: true),
                    IsNew = table.Column<bool>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EdiClientLookup", x => x.EdiClientLookupId);
                    table.ForeignKey(
                        name: "FK_EdiClientLookup_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EdiClientLookup_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Schedule",
                columns: table => new
                {
                    ScheduleId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AddedValue1 = table.Column<string>(maxLength: 255, nullable: true),
                    AddedValue2 = table.Column<string>(maxLength: 255, nullable: true),
                    AddedValue3 = table.Column<string>(maxLength: 255, nullable: true),
                    AddedValue4 = table.Column<string>(maxLength: 255, nullable: true),
                    AddedValue5 = table.Column<string>(maxLength: 255, nullable: true),
                    AdminTextNotes = table.Column<string>(nullable: true),
                    Approved = table.Column<bool>(nullable: false),
                    BuyerAsstUserUserId = table.Column<int>(nullable: true),
                    BuyerUserUserId = table.Column<int>(nullable: false),
                    ClientId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    LockedByUserId = table.Column<int>(nullable: true),
                    LockedDt = table.Column<DateTime>(nullable: true),
                    Notes = table.Column<string>(maxLength: 255, nullable: true),
                    ParentScheduleId = table.Column<int>(nullable: true),
                    PlanYrType = table.Column<string>(maxLength: 1, nullable: false),
                    ProposalVer = table.Column<int>(nullable: false),
                    ScheduleName = table.Column<string>(maxLength: 255, nullable: false),
                    ScheduleTypeId = table.Column<int>(nullable: false),
                    TextNote = table.Column<string>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Schedule", x => x.ScheduleId);
                    table.ForeignKey(
                        name: "FK_Schedule_Users_BuyerAsstUserUserId",
                        column: x => x.BuyerAsstUserUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedule_Users_BuyerUserUserId",
                        column: x => x.BuyerUserUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedule_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedule_Users_LockedByUserId",
                        column: x => x.LockedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedule_ScheduleTypes_ScheduleTypeId",
                        column: x => x.ScheduleTypeId,
                        principalTable: "ScheduleTypes",
                        principalColumn: "ScheduleTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Schedule_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DemographicSettingsPerQtr",
                columns: table => new
                {
                    DemographicSettingsPerQtrId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DemoNbr = table.Column<int>(nullable: true),
                    DemographicSettingsId = table.Column<int>(nullable: true),
                    QuarterId = table.Column<int>(maxLength: 6, nullable: false),
                    Universe = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DemographicSettingsPerQtr", x => x.DemographicSettingsPerQtrId);
                    table.ForeignKey(
                        name: "FK_DemographicSettingsPerQtr_DemographicSettings_DemographicSettingsId",
                        column: x => x.DemographicSettingsId,
                        principalTable: "DemographicSettings",
                        principalColumn: "DemographicSettingsId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DemographicSettingsPerQtr_Quarter_QuarterId",
                        column: x => x.QuarterId,
                        principalTable: "Quarter",
                        principalColumn: "QuarterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "DealPoints",
                columns: table => new
                {
                    DealPointId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BillboardAddedValue = table.Column<string>(maxLength: 250, nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DR = table.Column<string>(nullable: true),
                    NetworkId = table.Column<int>(nullable: false),
                    NetworkSeparationPolicy = table.Column<string>(maxLength: 250, nullable: true),
                    PlanYr = table.Column<int>(nullable: false),
                    ScatterCancellation = table.Column<string>(maxLength: 250, nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    UpfrontCancellation = table.Column<string>(maxLength: 250, nullable: true),
                    UpfrontSponsorship = table.Column<string>(maxLength: 250, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DealPoints", x => x.DealPointId);
                    table.ForeignKey(
                        name: "FK_DealPoints_Networks_NetworkId",
                        column: x => x.NetworkId,
                        principalTable: "Networks",
                        principalColumn: "NetworkId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_DealPoints_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "EdiNetworkLookup",
                columns: table => new
                {
                    EdiNetworkLookupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    EdiNetName = table.Column<string>(nullable: true),
                    NetworkId = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EdiNetworkLookup", x => x.EdiNetworkLookupId);
                    table.ForeignKey(
                        name: "FK_EdiNetworkLookup_Networks_NetworkId",
                        column: x => x.NetworkId,
                        principalTable: "Networks",
                        principalColumn: "NetworkId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_EdiNetworkLookup_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "NetworkUserJob",
                columns: table => new
                {
                    NetworkUserJobId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    JobId = table.Column<int>(nullable: false),
                    NetworkId = table.Column<int>(nullable: false),
                    PlanYr = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    UserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NetworkUserJob", x => x.NetworkUserJobId);
                    table.ForeignKey(
                        name: "FK_NetworkUserJob_Jobs_JobId",
                        column: x => x.JobId,
                        principalTable: "Jobs",
                        principalColumn: "JobId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NetworkUserJob_Networks_NetworkId",
                        column: x => x.NetworkId,
                        principalTable: "Networks",
                        principalColumn: "NetworkId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_NetworkUserJob_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    PropertyId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Combo = table.Column<bool>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DayPartId = table.Column<int>(nullable: false),
                    EndTime = table.Column<DateTime>(nullable: false),
                    Friday = table.Column<bool>(nullable: false),
                    Iteration = table.Column<int>(nullable: true),
                    Monday = table.Column<bool>(nullable: false),
                    NetworkId = table.Column<int>(nullable: false),
                    PropertyName = table.Column<string>(maxLength: 255, nullable: false),
                    QuarterId = table.Column<int>(nullable: false),
                    Saturday = table.Column<bool>(nullable: false),
                    StartTime = table.Column<DateTime>(nullable: false),
                    Sunday = table.Column<bool>(nullable: false),
                    Thursday = table.Column<bool>(nullable: false),
                    Tuesday = table.Column<bool>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    Wednesday = table.Column<bool>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.PropertyId);
                    table.ForeignKey(
                        name: "FK_Properties_DayPart_DayPartId",
                        column: x => x.DayPartId,
                        principalTable: "DayPart",
                        principalColumn: "DayPartId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Properties_Networks_NetworkId",
                        column: x => x.NetworkId,
                        principalTable: "Networks",
                        principalColumn: "NetworkId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Properties_Quarter_QuarterId",
                        column: x => x.QuarterId,
                        principalTable: "Quarter",
                        principalColumn: "QuarterId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Upfronts",
                columns: table => new
                {
                    UpfrontId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AdminTextNotes = table.Column<string>(nullable: true),
                    Approved = table.Column<bool>(nullable: false),
                    BuyerNameUserId = table.Column<int>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Name = table.Column<string>(maxLength: 255, nullable: false),
                    NetworkId = table.Column<int>(nullable: true),
                    Notes = table.Column<string>(maxLength: 255, nullable: true),
                    PlanYrType = table.Column<string>(maxLength: 1, nullable: false),
                    QuarterId = table.Column<int>(nullable: true),
                    TextNote = table.Column<string>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    UpfrontLockedByUserId = table.Column<int>(nullable: true),
                    UpfrontLockedDate = table.Column<DateTime>(nullable: true),
                    UpfrontTypeId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Upfronts", x => x.UpfrontId);
                    table.ForeignKey(
                        name: "FK_Upfronts_Users_BuyerNameUserId",
                        column: x => x.BuyerNameUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Upfronts_Networks_NetworkId",
                        column: x => x.NetworkId,
                        principalTable: "Networks",
                        principalColumn: "NetworkId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Upfronts_Quarter_QuarterId",
                        column: x => x.QuarterId,
                        principalTable: "Quarter",
                        principalColumn: "QuarterId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Upfronts_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Upfronts_Users_UpfrontLockedByUserId",
                        column: x => x.UpfrontLockedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Upfronts_UpfrontTypes_UpfrontTypeId",
                        column: x => x.UpfrontTypeId,
                        principalTable: "UpfrontTypes",
                        principalColumn: "UpfrontTypeId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontExpansionNetworkGroup",
                columns: table => new
                {
                    UpfrontExpansionNetworkGroupId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    GroupId = table.Column<int>(nullable: false),
                    NetworkId = table.Column<int>(nullable: true),
                    Parent = table.Column<bool>(nullable: false),
                    QuarterId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontExpansionNetworkGroup", x => x.UpfrontExpansionNetworkGroupId);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionNetworkGroup_Networks_NetworkId",
                        column: x => x.NetworkId,
                        principalTable: "Networks",
                        principalColumn: "NetworkId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PostLog",
                columns: table => new
                {
                    PostLogId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    AdminTextNote = table.Column<string>(nullable: true),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    PostLogLockedByUserId = table.Column<int>(nullable: true),
                    PostLogLockedDate = table.Column<DateTime>(nullable: true),
                    ScheduleId = table.Column<int>(nullable: false),
                    TextNote = table.Column<string>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    WeekDate = table.Column<DateTime>(nullable: false),
                    WeekNbr = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLog", x => x.PostLogId);
                    table.ForeignKey(
                        name: "FK_PostLog_Users_PostLogLockedByUserId",
                        column: x => x.PostLogLockedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostLog_Schedule_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "Schedule",
                        principalColumn: "ScheduleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostLog_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PropertyHistory",
                columns: table => new
                {
                    PropertyHistoryId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    Message = table.Column<string>(nullable: false),
                    PropertyId = table.Column<int>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyHistory", x => x.PropertyHistoryId);
                    table.ForeignKey(
                        name: "FK_PropertyHistory_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "PropertyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PropertyHistory_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "Rates",
                columns: table => new
                {
                    RateId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Approved = table.Column<bool>(nullable: false),
                    BuyTypeId = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DemographicSettingsPerQtrId = table.Column<int>(nullable: true),
                    DoNotBuyTypeId = table.Column<int>(nullable: false),
                    EffectiveDate = table.Column<DateTime>(nullable: false),
                    ExpirationDate = table.Column<DateTime>(nullable: false),
                    Impressions = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    MandateClientId = table.Column<int>(nullable: true),
                    PropertyId = table.Column<int>(nullable: false),
                    RateAmt = table.Column<decimal>(type: "Money", nullable: false),
                    Revision = table.Column<string>(nullable: false),
                    SplitId = table.Column<int>(nullable: true),
                    SpotLen = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Rates", x => x.RateId);
                    table.ForeignKey(
                        name: "FK_Rates_BuyType_BuyTypeId",
                        column: x => x.BuyTypeId,
                        principalTable: "BuyType",
                        principalColumn: "BuyTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rates_DemographicSettingsPerQtr_DemographicSettingsPerQtrId",
                        column: x => x.DemographicSettingsPerQtrId,
                        principalTable: "DemographicSettingsPerQtr",
                        principalColumn: "DemographicSettingsPerQtrId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rates_DoNotBuyType_DoNotBuyTypeId",
                        column: x => x.DoNotBuyTypeId,
                        principalTable: "DoNotBuyType",
                        principalColumn: "DoNotBuyTypeId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rates_Clients_MandateClientId",
                        column: x => x.MandateClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rates_Properties_PropertyId",
                        column: x => x.PropertyId,
                        principalTable: "Properties",
                        principalColumn: "PropertyId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rates_Splits_SplitId",
                        column: x => x.SplitId,
                        principalTable: "Splits",
                        principalColumn: "SplitId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_Rates_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ProposalNotes",
                columns: table => new
                {
                    ProposalNoteId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    CreatedByUserId = table.Column<int>(nullable: false),
                    Note = table.Column<string>(nullable: false),
                    ParentNoteId = table.Column<int>(nullable: true),
                    ProposalId = table.Column<int>(nullable: false),
                    UpfrontId = table.Column<int>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProposalNotes", x => x.ProposalNoteId);
                    table.ForeignKey(
                        name: "FK_ProposalNotes_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ProposalNotes_Upfronts_UpfrontId",
                        column: x => x.UpfrontId,
                        principalTable: "Upfronts",
                        principalColumn: "UpfrontId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontExpansionTracking",
                columns: table => new
                {
                    UpfrontExpansionTrackingId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    TotalUpfrontDollars = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    UEDollarsAvailable = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    UpfrontId = table.Column<int>(nullable: false),
                    YearlyTotalUpfrontDollars = table.Column<decimal>(nullable: true),
                    YearlyUEDollarsAvailable = table.Column<decimal>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontExpansionTracking", x => x.UpfrontExpansionTrackingId);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionTracking_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionTracking_Upfronts_UpfrontId",
                        column: x => x.UpfrontId,
                        principalTable: "Upfronts",
                        principalColumn: "UpfrontId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontNotes",
                columns: table => new
                {
                    UpfrontNoteId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    CreatedByUserId = table.Column<int>(nullable: false),
                    Note = table.Column<string>(nullable: false),
                    ParentNoteId = table.Column<int>(nullable: true),
                    UpfrontId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontNotes", x => x.UpfrontNoteId);
                    table.ForeignKey(
                        name: "FK_UpfrontNotes_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UpfrontNotes_Upfronts_UpfrontId",
                        column: x => x.UpfrontId,
                        principalTable: "Upfronts",
                        principalColumn: "UpfrontId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "PostLogLines",
                columns: table => new
                {
                    PostLogLineId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Approved = table.Column<bool>(nullable: true),
                    BuyType = table.Column<string>(maxLength: 4, nullable: true),
                    Cleared = table.Column<bool>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DayPartCd = table.Column<string>(maxLength: 2, nullable: true),
                    DoNotBuy = table.Column<string>(maxLength: 255, nullable: true),
                    EndTime = table.Column<DateTime>(nullable: true),
                    Friday = table.Column<bool>(nullable: true),
                    ISCI = table.Column<string>(maxLength: 255, nullable: true),
                    Impressions = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    MediaTypeCode = table.Column<string>(maxLength: 255, nullable: true),
                    Monday = table.Column<bool>(nullable: true),
                    NetworkId = table.Column<int>(nullable: true),
                    NetworkName = table.Column<string>(nullable: true),
                    Placed = table.Column<bool>(nullable: false),
                    PostLogId = table.Column<int>(nullable: false),
                    ProgramTitle = table.Column<string>(maxLength: 255, nullable: true),
                    PropertyId = table.Column<int>(nullable: true),
                    ProperyName = table.Column<string>(nullable: true),
                    Rate = table.Column<decimal>(type: "Money", nullable: false),
                    RateId = table.Column<int>(nullable: false),
                    Saturday = table.Column<bool>(nullable: true),
                    ScheduleLineId = table.Column<int>(nullable: false),
                    Scheduled = table.Column<bool>(nullable: false),
                    Split = table.Column<int>(nullable: true),
                    SpotDate = table.Column<DateTime>(nullable: true),
                    SpotLen = table.Column<int>(nullable: true),
                    StartTime = table.Column<DateTime>(nullable: true),
                    Sunday = table.Column<bool>(nullable: true),
                    Thursday = table.Column<bool>(nullable: true),
                    Tuesday = table.Column<bool>(nullable: true),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: true),
                    Wednesday = table.Column<bool>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PostLogLines", x => x.PostLogLineId);
                    table.ForeignKey(
                        name: "FK_PostLogLines_PostLog_PostLogId",
                        column: x => x.PostLogId,
                        principalTable: "PostLog",
                        principalColumn: "PostLogId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_PostLogLines_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "ScheduleLines",
                columns: table => new
                {
                    ScheduleLineId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    BB = table.Column<int>(nullable: false),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    DNB_Override = table.Column<bool>(nullable: false),
                    RateId = table.Column<int>(nullable: false),
                    ScheduleId = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    Wk01_Spots = table.Column<int>(nullable: false),
                    Wk02_Spots = table.Column<int>(nullable: false),
                    Wk03_Spots = table.Column<int>(nullable: false),
                    Wk04_Spots = table.Column<int>(nullable: false),
                    Wk05_Spots = table.Column<int>(nullable: false),
                    Wk06_Spots = table.Column<int>(nullable: false),
                    Wk07_Spots = table.Column<int>(nullable: false),
                    Wk08_Spots = table.Column<int>(nullable: false),
                    Wk09_Spots = table.Column<int>(nullable: false),
                    Wk10_Spots = table.Column<int>(nullable: false),
                    Wk11_Spots = table.Column<int>(nullable: false),
                    Wk12_Spots = table.Column<int>(nullable: false),
                    Wk13_Spots = table.Column<int>(nullable: false),
                    Wk14_Spots = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ScheduleLines", x => x.ScheduleLineId);
                    table.ForeignKey(
                        name: "FK_ScheduleLines_Rates_RateId",
                        column: x => x.RateId,
                        principalTable: "Rates",
                        principalColumn: "RateId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduleLines_Schedule_ScheduleId",
                        column: x => x.ScheduleId,
                        principalTable: "Schedule",
                        principalColumn: "ScheduleId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_ScheduleLines_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontLines",
                columns: table => new
                {
                    UpfrontLineId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    RateId = table.Column<int>(nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    UpfrontId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontLines", x => x.UpfrontLineId);
                    table.ForeignKey(
                        name: "FK_UpfrontLines_Rates_RateId",
                        column: x => x.RateId,
                        principalTable: "Rates",
                        principalColumn: "RateId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UpfrontLines_Upfronts_UpfrontId",
                        column: x => x.UpfrontId,
                        principalTable: "Upfronts",
                        principalColumn: "UpfrontId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "UpfrontExpansionTrackingLines",
                columns: table => new
                {
                    UpfrontExpansionTrackingLineId = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    CreateDt = table.Column<DateTime>(nullable: false),
                    TradeFromClientId = table.Column<int>(nullable: true),
                    TradeToClientId = table.Column<int>(nullable: true),
                    TradedUEDollars = table.Column<decimal>(type: "decimal(18, 6)", nullable: false),
                    UpdateDt = table.Column<DateTime>(nullable: false),
                    UpdatedByUserId = table.Column<int>(nullable: false),
                    UpfrontExpansionTrackingId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_UpfrontExpansionTrackingLines", x => x.UpfrontExpansionTrackingLineId);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionTrackingLines_Clients_TradeFromClientId",
                        column: x => x.TradeFromClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionTrackingLines_Clients_TradeToClientId",
                        column: x => x.TradeToClientId,
                        principalTable: "Clients",
                        principalColumn: "ClientId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionTrackingLines_Users_UpdatedByUserId",
                        column: x => x.UpdatedByUserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "FK_UpfrontExpansionTrackingLines_UpfrontExpansionTracking_UpfrontExpansionTrackingId",
                        column: x => x.UpfrontExpansionTrackingId,
                        principalTable: "UpfrontExpansionTracking",
                        principalColumn: "UpfrontExpansionTrackingId",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatures_AppFeatureGroupId",
                table: "AppFeatures",
                column: "AppFeatureGroupId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatureDefaultActions_ActionId",
                table: "AppFeatureDefaultActions",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatureDefaultActions_AppFeatureId",
                table: "AppFeatureDefaultActions",
                column: "AppFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatureDefaultActions_PermissionLevelId",
                table: "AppFeatureDefaultActions",
                column: "PermissionLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatureUserCustomActions_ActionId",
                table: "AppFeatureUserCustomActions",
                column: "ActionId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatureUserCustomActions_AppFeatureId",
                table: "AppFeatureUserCustomActions",
                column: "AppFeatureId");

            migrationBuilder.CreateIndex(
                name: "IX_AppFeatureUserCustomActions_UserId",
                table: "AppFeatureUserCustomActions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_ApprovalLevel_UpdatedByUserId",
                table: "ApprovalLevel",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_BuyType_UpdatedByUserId",
                table: "BuyType",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CanadaActualExchangeRates_QuarterId",
                table: "CanadaActualExchangeRates",
                column: "QuarterId");

            migrationBuilder.CreateIndex(
                name: "IX_CanadaActualExchangeRates_UpdatedByUserId",
                table: "CanadaActualExchangeRates",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_CanadaClientExchangeRates_ClientId",
                table: "CanadaClientExchangeRates",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_CanadaClientExchangeRates_QuarterId",
                table: "CanadaClientExchangeRates",
                column: "QuarterId");

            migrationBuilder.CreateIndex(
                name: "IX_CanadaClientExchangeRates_UpdatedByUserId",
                table: "CanadaClientExchangeRates",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_CountryId",
                table: "Clients",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Clients_UpdatedByUserId",
                table: "Clients",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientUserJob_ClientId",
                table: "ClientUserJob",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientUserJob_JobId",
                table: "ClientUserJob",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientUserJob_UpdatedByUserId",
                table: "ClientUserJob",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ClientUserJob_UserId",
                table: "ClientUserJob",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_CommRate_ClientId",
                table: "CommRate",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_CommRate_QuarterId",
                table: "CommRate",
                column: "QuarterId");

            migrationBuilder.CreateIndex(
                name: "IX_CommRate_UpdatedByUserId",
                table: "CommRate",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Countries_UpdatedByUserId",
                table: "Countries",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DayPart_UpdatedByUserId",
                table: "DayPart",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DealPoints_NetworkId",
                table: "DealPoints",
                column: "NetworkId");

            migrationBuilder.CreateIndex(
                name: "IX_DealPoints_UpdatedByUserId",
                table: "DealPoints",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DemographicSettings_CountryId",
                table: "DemographicSettings",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_DemographicSettings_UpdatedByUserId",
                table: "DemographicSettings",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_DemographicSettingsPerQtr_DemographicSettingsId",
                table: "DemographicSettingsPerQtr",
                column: "DemographicSettingsId");

            migrationBuilder.CreateIndex(
                name: "IX_DemographicSettingsPerQtr_QuarterId",
                table: "DemographicSettingsPerQtr",
                column: "QuarterId");

            migrationBuilder.CreateIndex(
                name: "IX_DoNotBuyType_UpdatedByUserId",
                table: "DoNotBuyType",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EdiClientLookup_ClientId",
                table: "EdiClientLookup",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_EdiClientLookup_UpdatedByUserId",
                table: "EdiClientLookup",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_EdiNetworkLookup_NetworkId",
                table: "EdiNetworkLookup",
                column: "NetworkId");

            migrationBuilder.CreateIndex(
                name: "IX_EdiNetworkLookup_UpdatedByUserId",
                table: "EdiNetworkLookup",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_FeedTypes_UpdateByUserId",
                table: "FeedTypes",
                column: "UpdateByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Logs_UpdatedByUserId",
                table: "Logs",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_MediaTypes_UpdatedByUserId",
                table: "MediaTypes",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Networks_CountryId",
                table: "Networks",
                column: "CountryId");

            migrationBuilder.CreateIndex(
                name: "IX_Networks_FeedTypeId",
                table: "Networks",
                column: "FeedTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Networks_MediaTypeId",
                table: "Networks",
                column: "MediaTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Networks_UpdatedByUserId",
                table: "Networks",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_NetworkUserJob_JobId",
                table: "NetworkUserJob",
                column: "JobId");

            migrationBuilder.CreateIndex(
                name: "IX_NetworkUserJob_NetworkId",
                table: "NetworkUserJob",
                column: "NetworkId");

            migrationBuilder.CreateIndex(
                name: "IX_NetworkUserJob_UserId",
                table: "NetworkUserJob",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLog_PostLogLockedByUserId",
                table: "PostLog",
                column: "PostLogLockedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLog_ScheduleId",
                table: "PostLog",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLog_UpdatedByUserId",
                table: "PostLog",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLogLines_PostLogId",
                table: "PostLogLines",
                column: "PostLogId");

            migrationBuilder.CreateIndex(
                name: "IX_PostLogLines_UpdatedByUserId",
                table: "PostLogLines",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_DayPartId",
                table: "Properties",
                column: "DayPartId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_NetworkId",
                table: "Properties",
                column: "NetworkId");

            migrationBuilder.CreateIndex(
                name: "IX_Properties_QuarterId",
                table: "Properties",
                column: "QuarterId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyHistory_PropertyId",
                table: "PropertyHistory",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyHistory_UpdatedByUserId",
                table: "PropertyHistory",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProposalNotes_CreatedByUserId",
                table: "ProposalNotes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ProposalNotes_UpfrontId",
                table: "ProposalNotes",
                column: "UpfrontId");

            migrationBuilder.CreateIndex(
                name: "IX_Quarter_UpdatedByUserId",
                table: "Quarter",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_BuyTypeId",
                table: "Rates",
                column: "BuyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_DemographicSettingsPerQtrId",
                table: "Rates",
                column: "DemographicSettingsPerQtrId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_DoNotBuyTypeId",
                table: "Rates",
                column: "DoNotBuyTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_MandateClientId",
                table: "Rates",
                column: "MandateClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_PropertyId",
                table: "Rates",
                column: "PropertyId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_SplitId",
                table: "Rates",
                column: "SplitId");

            migrationBuilder.CreateIndex(
                name: "IX_Rates_UpdatedByUserId",
                table: "Rates",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_BuyerAsstUserUserId",
                table: "Schedule",
                column: "BuyerAsstUserUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_BuyerUserUserId",
                table: "Schedule",
                column: "BuyerUserUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_ClientId",
                table: "Schedule",
                column: "ClientId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_LockedByUserId",
                table: "Schedule",
                column: "LockedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_ScheduleTypeId",
                table: "Schedule",
                column: "ScheduleTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Schedule_UpdatedByUserId",
                table: "Schedule",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLines_RateId",
                table: "ScheduleLines",
                column: "RateId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLines_ScheduleId",
                table: "ScheduleLines",
                column: "ScheduleId");

            migrationBuilder.CreateIndex(
                name: "IX_ScheduleLines_UpdatedByUserId",
                table: "ScheduleLines",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Upfronts_BuyerNameUserId",
                table: "Upfronts",
                column: "BuyerNameUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Upfronts_NetworkId",
                table: "Upfronts",
                column: "NetworkId");

            migrationBuilder.CreateIndex(
                name: "IX_Upfronts_QuarterId",
                table: "Upfronts",
                column: "QuarterId");

            migrationBuilder.CreateIndex(
                name: "IX_Upfronts_UpdatedByUserId",
                table: "Upfronts",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Upfronts_UpfrontLockedByUserId",
                table: "Upfronts",
                column: "UpfrontLockedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Upfronts_UpfrontTypeId",
                table: "Upfronts",
                column: "UpfrontTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionNetworkGroup_NetworkId",
                table: "UpfrontExpansionNetworkGroup",
                column: "NetworkId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionTracking_UpdatedByUserId",
                table: "UpfrontExpansionTracking",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionTracking_UpfrontId",
                table: "UpfrontExpansionTracking",
                column: "UpfrontId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionTrackingLines_TradeFromClientId",
                table: "UpfrontExpansionTrackingLines",
                column: "TradeFromClientId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionTrackingLines_TradeToClientId",
                table: "UpfrontExpansionTrackingLines",
                column: "TradeToClientId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionTrackingLines_UpdatedByUserId",
                table: "UpfrontExpansionTrackingLines",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontExpansionTrackingLines_UpfrontExpansionTrackingId",
                table: "UpfrontExpansionTrackingLines",
                column: "UpfrontExpansionTrackingId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontLines_RateId",
                table: "UpfrontLines",
                column: "RateId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontLines_UpfrontId",
                table: "UpfrontLines",
                column: "UpfrontId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontNotes_CreatedByUserId",
                table: "UpfrontNotes",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontNotes_UpfrontId",
                table: "UpfrontNotes",
                column: "UpfrontId");

            migrationBuilder.CreateIndex(
                name: "IX_UpfrontTypes_UpdatedByUserId",
                table: "UpfrontTypes",
                column: "UpdatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_JobTitleTypeId",
                table: "Users",
                column: "JobTitleTypeId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_PermissionLevelId",
                table: "Users",
                column: "PermissionLevelId");

            migrationBuilder.CreateIndex(
                name: "IX_UserProfiles_UserProfileUserId",
                table: "UserProfiles",
                column: "UserProfileUserId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppFeatureDefaultActions");

            migrationBuilder.DropTable(
                name: "AppFeatureUserCustomActions");

            migrationBuilder.DropTable(
                name: "ApprovalLevel");

            migrationBuilder.DropTable(
                name: "BroadcastDate");

            migrationBuilder.DropTable(
                name: "CanadaActualExchangeRates");

            migrationBuilder.DropTable(
                name: "CanadaClientExchangeRates");

            migrationBuilder.DropTable(
                name: "ClientUserJob");

            migrationBuilder.DropTable(
                name: "CommRate");

            migrationBuilder.DropTable(
                name: "DaysCodes");

            migrationBuilder.DropTable(
                name: "DealPoints");

            migrationBuilder.DropTable(
                name: "DeltaListChanges");

            migrationBuilder.DropTable(
                name: "EdiClientLookup");

            migrationBuilder.DropTable(
                name: "EdiNetworkLookup");

            migrationBuilder.DropTable(
                name: "Logs");

            migrationBuilder.DropTable(
                name: "NetworkUserJob");

            migrationBuilder.DropTable(
                name: "PostLogLines");

            migrationBuilder.DropTable(
                name: "PropertyHistory");

            migrationBuilder.DropTable(
                name: "ProposalNotes");

            migrationBuilder.DropTable(
                name: "ScheduleLines");

            migrationBuilder.DropTable(
                name: "UpfrontExpansionNetworkGroup");

            migrationBuilder.DropTable(
                name: "UpfrontExpansionTrackingLines");

            migrationBuilder.DropTable(
                name: "UpfrontLines");

            migrationBuilder.DropTable(
                name: "UpfrontNotes");

            migrationBuilder.DropTable(
                name: "UpfrontRemnantLinesFlat");

            migrationBuilder.DropTable(
                name: "UserProfiles");

            migrationBuilder.DropTable(
                name: "Actions");

            migrationBuilder.DropTable(
                name: "AppFeatures");

            migrationBuilder.DropTable(
                name: "Jobs");

            migrationBuilder.DropTable(
                name: "PostLog");

            migrationBuilder.DropTable(
                name: "UpfrontExpansionTracking");

            migrationBuilder.DropTable(
                name: "Rates");

            migrationBuilder.DropTable(
                name: "AppFeatureGroups");

            migrationBuilder.DropTable(
                name: "Schedule");

            migrationBuilder.DropTable(
                name: "Upfronts");

            migrationBuilder.DropTable(
                name: "BuyType");

            migrationBuilder.DropTable(
                name: "DemographicSettingsPerQtr");

            migrationBuilder.DropTable(
                name: "DoNotBuyType");

            migrationBuilder.DropTable(
                name: "Properties");

            migrationBuilder.DropTable(
                name: "Splits");

            migrationBuilder.DropTable(
                name: "Clients");

            migrationBuilder.DropTable(
                name: "ScheduleTypes");

            migrationBuilder.DropTable(
                name: "UpfrontTypes");

            migrationBuilder.DropTable(
                name: "DemographicSettings");

            migrationBuilder.DropTable(
                name: "DayPart");

            migrationBuilder.DropTable(
                name: "Networks");

            migrationBuilder.DropTable(
                name: "Quarter");

            migrationBuilder.DropTable(
                name: "Countries");

            migrationBuilder.DropTable(
                name: "FeedTypes");

            migrationBuilder.DropTable(
                name: "MediaTypes");

            migrationBuilder.DropTable(
                name: "Users");

            migrationBuilder.DropTable(
                name: "JobTitleTypes");

            migrationBuilder.DropTable(
                name: "PermissionLevels");
        }
    }
}
