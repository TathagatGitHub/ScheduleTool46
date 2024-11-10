using OM_ScheduleTool.Models;
using OM_ScheduleTool.Repositories;
using AppContext = OM_ScheduleTool.Models.AppContext;
using Microsoft.EntityFrameworkCore;
using OM_ScheduleTool.Dapper;
using System.Net;

var builder = WebApplication.CreateBuilder(args);

builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<AppContext>
    (options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddDbContext<StoredProcsContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddDbContext<ScheduleProposalRepositoryContext>(options =>
options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
//Register dapper in scope  
builder.Services.AddScoped<IDapper, Dapperr>();
// configure DI for application services
builder.Services.AddTransient<IAppFeatureRepository, AppFeatureRepository>();
builder.Services.AddTransient<IBuyTypeRepository, BuyTypeRepository>();
builder.Services.AddTransient<ICanadianExchangeRateRepository, CanadianExchangeRateRepository>();
builder.Services.AddTransient<IClientCommissionRepository, ClientCommissionRepository>();
builder.Services.AddTransient<IClientRepository, ClientRepository>();
builder.Services.AddTransient<IDealpointRepository, DealpointRepository>();
builder.Services.AddTransient<IDeltaListRepository, DeltaListRepository>();
builder.Services.AddTransient<IDemographicSettingsRepository, DemographicSettingsRepository>();
builder.Services.AddTransient<IGeneralRepository, GeneralRepository>();
builder.Services.AddTransient<IJobTitleTypeRepository, JobTitleTypeRepository>();
builder.Services.AddTransient<INetworkRepository, NetworkRepository>();
builder.Services.AddTransient<IPropertyRepository, PropertyRepository>();
builder.Services.AddTransient<IProposalRepository, ProposalRepository>();
builder.Services.AddTransient<IRemnantRepository, RemnantRepository>();
builder.Services.AddTransient<IScheduleRepository, ScheduleRepository>();
builder.Services.AddTransient<IUpfrontRepository, UpfrontRepository>();
builder.Services.AddTransient<IUserRepository, UserRepository>();
builder.Services.AddTransient<IUpfrontExpansionRepository, UpfrontExpansionRepository>();
builder.Services.AddTransient<IPreLogRepository, PreLogRepository>();
builder.Services.AddTransient<IPostLogRepository, PostLogRepository>();
builder.Services.AddTransient<ILogsRepository, LogsRepository>();
builder.Services.AddScoped<IBroadcastYearManagement, BroadcastYearManagementRepository>();
builder.Services.AddScoped<IMediaPlanRepository, MediaPlanRepository>();
builder.Services.AddTransient<UserContextSeedData>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddSession(options =>
{
    // Set a short timeout for easy testing.
    options.IdleTimeout = TimeSpan.Parse(builder.Configuration.GetSection("SessionOptions:IdleTimeout").Value.ToString());
    options.Cookie.HttpOnly = true;
});
if (!builder.Environment.IsDevelopment())
{
    builder.Services.AddHostedService<OM_ScheduleTool.BackgroundServices.CAActualExchangeRate>();
    //added for redirection -HM ST-875
    builder.Services.AddHttpsRedirection(options =>
    {
        options.RedirectStatusCode = (int)HttpStatusCode.PermanentRedirect;
        options.HttpsPort = Convert.ToInt32(builder.Configuration.GetSection("https_port").Value);
    });
}
// Added for Logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.AddEventLog();
builder.Logging.AddProvider(new MyLoggerProvider()); 
//problem : I cannot provide the dbContext as parameter to MyLoggerProvider

builder.Logging.AddSimpleConsole(options =>
{
    options.IncludeScopes = true;
    options.TimestampFormat = "\n[dd-MMM-yyyy hh:mm:ss]\n";
});
// Added for Logging

var app = builder.Build();
app.MapDefaultEndpoints();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    app.UseHsts(); //added for securing site while redirection -HM ST-875
}
app.UseHttpsRedirection();//added for redirection -HM ST-875
app.UseStaticFiles();
app.UseSession();
app.UseRouting();



app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
