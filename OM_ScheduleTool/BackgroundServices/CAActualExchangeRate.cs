using Microsoft.EntityFrameworkCore;
using OM_ScheduleTool.Models;
using Microsoft.Data.SqlClient;
using System.Net;
using static Microsoft.ApplicationInsights.MetricDimensionNames.TelemetryContext;
using AppContext = OM_ScheduleTool.Models.AppContext;

namespace OM_ScheduleTool.BackgroundServices
{
    public class CAActualExchangeRate : BackgroundService
    {
        private IConfiguration _configuration;
        private IServiceProvider _serviceProvider;        

        public CAActualExchangeRate(IConfiguration config, IServiceProvider serviceProvider)
        {
            _configuration = config;
            _serviceProvider = serviceProvider;
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            Log("CAActualExchangeRate background service - ExecuteAsync Started.", LogLevel.Information);
            var runTimeIntervalFlag = false;
            try
            {
                while (!stoppingToken.IsCancellationRequested)
                {
                    Log("CAActualExchangeRate background service - ExecuteAsync IsCancellationRequested:" + stoppingToken.IsCancellationRequested, LogLevel.Information);
                    var runTimeInterval = _configuration.GetValue<int>("runTimeInterval");

                    using (var scope = _serviceProvider.CreateScope())
                    {
                        using (var context = scope.ServiceProvider.GetRequiredService<AppContext>())
                        {

                            var ts = new TimeSpan();
                            var scheduleDay = _configuration.GetValue<string>("CAActualExchangeRateBackgroundServiceScheduleDay");
                            var scheduleTime = _configuration.GetValue<string>("CAActualExchangeRateBackgroundServiceScheduleTime");
                            var scheduleHour = Convert.ToInt32(Convert.ToString(scheduleTime).Split(":")[0]);
                            var scheduleMins = Convert.ToInt32(Convert.ToString(scheduleTime).Split(":")[1]);
                            
                            var prevWkDt = DateTime.Now.AddDays((DateTime.Now.DayOfWeek == DayOfWeek.Sunday ? -7 : -(int)DateTime.Now.DayOfWeek) - 6).Date;
                            int prevWkRowCount = context.CanadaActualExchangeRates.Where(x => x.WeekDate == prevWkDt).ToList().Count();
                            double dayDiff = 0;
                            
                            if (Convert.ToString(DateTime.Now.DayOfWeek) != scheduleDay)
                            {
                                dayDiff = DateTime.Now.Date.Subtract(prevWkDt).TotalDays;
                            }

                            Log("CAActualExchangeRate background service - scheduleDay:" + scheduleDay + ",scheduleTime:" + scheduleTime + ",scheduleHour:" + scheduleHour + ",scheduleMins:" + scheduleMins, LogLevel.Information);
                            
                            if (((Convert.ToString(DateTime.Now.DayOfWeek) == scheduleDay) || dayDiff > 7) && prevWkRowCount == 0)
                            {                                
                                if (((DateTime.Now.Hour >= scheduleHour && DateTime.Now.Minute >= scheduleMins) || dayDiff > 7) && prevWkRowCount == 0)
                                {                                   
                                    try
                                    {
                                        Log("CAActualExchangeRate background service is running.", LogLevel.Information);
                                        context.Database.BeginTransaction();                                        
                                        var user = context.Users.Where(x => x.AccountName == "system.administrator").Single();
                                        using (var client = new HttpClient())
                                            {
                                            var fromDate = DateTime.Now.AddDays((DateTime.Now.DayOfWeek == DayOfWeek.Sunday ? -7 : -(int)DateTime.Now.DayOfWeek) - 6).ToString("yyyy-MM-dd");
                                            var toDate = DateTime.Now.AddDays((DateTime.Now.DayOfWeek == DayOfWeek.Sunday ? -7 : -(int)DateTime.Now.DayOfWeek)).ToString("yyyy-MM-dd");

                                            client.BaseAddress = new Uri(_configuration.GetValue<string>("apiurl"));
                                                client.DefaultRequestHeaders.Accept.Clear();
                                                client.DefaultRequestHeaders.Accept.Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
                                                client.DefaultRequestHeaders.Add("apikey", _configuration.GetValue<string>("apikey"));
                                                HttpResponseMessage response = await client.GetAsync("?base=CAD&symbols=USD&start_date=" + fromDate + "&end_date=" + toDate);
                                                if (response.StatusCode == HttpStatusCode.OK)
                                                {
                                                    var result = await response.Content.ReadFromJsonAsync<CAActualExchRateAPIResult>();
                                                    if (result != null && result.rates != null && result.rates.Count>0)
                                                    {
                                                        foreach (KeyValuePair<DateTime, ExchRate> kv in result.rates)
                                                        {
                                                            CanadaActualExchangeRate obj = new CanadaActualExchangeRate();
                                                            int weekNo = 0;
                                                            decimal weekAvgRate = 0;
                                                            DateTime? weekDt = null;
                                                            var dt = kv.Key;
                                                            var qtr = context.Quarter.Where(x => x.QtrStartDate <= dt && x.QtrEndDate >= dt).FirstOrDefault();
                                                            if (qtr != null)
                                                            {
                                                                weekAvgRate = result.rates.Sum(x => x.Value.USD) / result.rates.Count();

                                                                if (qtr.Wk14_Date != null && qtr.Wk14_Date <= dt) { weekNo = 14; weekDt = qtr.Wk14_Date; }
                                                                else if (qtr.Wk13_Date != null && qtr.Wk13_Date <= dt) { weekNo = 13; weekDt = qtr.Wk13_Date; }
                                                                else if (qtr.Wk12_Date != null && qtr.Wk12_Date <= dt) { weekNo = 12; weekDt = qtr.Wk12_Date; }
                                                                else if (qtr.Wk11_Date != null && qtr.Wk11_Date <= dt) { weekNo = 11; weekDt = qtr.Wk11_Date; }
                                                                else if (qtr.Wk10_Date != null && qtr.Wk10_Date <= dt) { weekNo = 10; weekDt = qtr.Wk10_Date; }
                                                                else if (qtr.Wk09_Date != null && qtr.Wk09_Date <= dt) { weekNo = 9; weekDt = qtr.Wk09_Date; }
                                                                else if (qtr.Wk08_Date != null && qtr.Wk08_Date <= dt) { weekNo = 8; weekDt = qtr.Wk08_Date; }
                                                                else if (qtr.Wk07_Date != null && qtr.Wk07_Date <= dt) { weekNo = 7; weekDt = qtr.Wk07_Date; }
                                                                else if (qtr.Wk06_Date != null && qtr.Wk06_Date <= dt) { weekNo = 6; weekDt = qtr.Wk06_Date; }
                                                                else if (qtr.Wk05_Date != null && qtr.Wk05_Date <= dt) { weekNo = 5; weekDt = qtr.Wk05_Date; }
                                                                else if (qtr.Wk04_Date != null && qtr.Wk04_Date <= dt) { weekNo = 4; weekDt = qtr.Wk04_Date; }
                                                                else if (qtr.Wk03_Date != null && qtr.Wk03_Date <= dt) { weekNo = 3; weekDt = qtr.Wk03_Date; }
                                                                else if (qtr.Wk02_Date != null && qtr.Wk02_Date <= dt) { weekNo = 2; weekDt = qtr.Wk02_Date; }
                                                                else if (qtr.Wk01_Date != null && qtr.Wk01_Date <= dt) { weekNo = 1; weekDt = qtr.Wk01_Date; }
                                                                var count = context.CanadaActualExchangeRates.Where(x => x.DayDate == dt).ToList().Count();
                                                                if (weekAvgRate != 0 && weekNo != 0 && weekDt != null && count == 0)
                                                                {
                                                                    obj.Quarter = qtr;
                                                                    obj.Rate = kv.Value.USD;
                                                                    obj.DayDate = kv.Key;
                                                                    obj.UpdateDt = DateTime.Now;
                                                                    obj.CreateDt = DateTime.Now;
                                                                    obj.UpdatedBy = user;
                                                                    obj.WkAvgRate = weekAvgRate;
                                                                    obj.WkNbr = weekNo;
                                                                    obj.WeekDate = (DateTime)weekDt;
                                                                    context.CanadaActualExchangeRates.Add(obj);
                                                                }
                                                            }
                                                        }

                                                        context.SaveChanges();
                                                        context.Database.CommitTransaction();
                                                        runTimeInterval = 0;
                                                        Log("CAActualExchangeRate background service successfully executed.", LogLevel.Information);
                                                    }
                                                }
                                                else
                                                {
                                                    Log("Error occured. " + response.ReasonPhrase, LogLevel.Error);
                                                    context.Database.RollbackTransaction();
                                                     SendEmailNotification("Failure", "Actual CA Exchange Rates were not updated for the week of " + prevWkDt.ToString("MM/dd/yyyy") + ". Please contact the dev team.\n" +
                                                    "Reason for CAActualExchangeRate background service failure " + response.ReasonPhrase + ".");
                                                }
                                            }                                        
                                    }
                                    catch (Exception ex)
                                    {
                                        Log("Error occured. " + ex.Message, LogLevel.Error);
                                        context.Database.RollbackTransaction();
                                         SendEmailNotification("Failure", "Actual CA Exchange Rates were not updated for the week of " + prevWkDt.ToString("MM/dd/yyyy") + ". Please contact the dev team.\n"+
                                            "Reason for CAActualExchangeRate background service failure " + ex.Message);                                        
                                    }
                                    
                                    var dt1 = DateTime.Now.AddDays((DateTime.Now.DayOfWeek == DayOfWeek.Sunday ? 0 : 7 - (int)DateTime.Now.DayOfWeek) + 1);
                                    var dt2 = new DateTime(dt1.Year, dt1.Month, dt1.Day, scheduleHour, scheduleMins, 0);
                                    ts = dt2.Subtract(DateTime.Now);                                    
                                    if (ts.TotalMilliseconds > 0 && runTimeInterval == 0)
                                    {
                                        Log("CAActualExchangeRate background service - next runtime dealy(TotalMilliseconds):" + (int)ts.TotalMilliseconds + " next run on:" + dt2, LogLevel.Information);
                                        
                                        if (runTimeIntervalFlag)
                                        {
                                             SendEmailNotification("Success", "Actual CA Exchange Rates have been updated for the week of "+ prevWkDt.ToString("MM/dd/yyyy") + ".");                                           
                                        }
                                        runTimeIntervalFlag = false;
                                        await Task.Delay((int)ts.TotalMilliseconds, stoppingToken);
                                    }
                                    else
                                    {
                                        runTimeIntervalFlag = true;
                                        Log("CAActualExchangeRate background service - next runtime dealy(TotalMilliseconds):" + runTimeInterval + " next run on:" + DateTime.Now.AddMilliseconds(runTimeInterval), LogLevel.Information);
                                        await Task.Delay(runTimeInterval, stoppingToken);
                                    }                                    
                                }
                                else
                                {
                                   
                                    var dt1 = (DateTime.Now.Hour > scheduleHour) ? DateTime.Now.AddDays((DateTime.Now.DayOfWeek == DayOfWeek.Sunday ? 0 : 7 - (int)DateTime.Now.DayOfWeek) + 1) : DateTime.Now;
                                    var dt2 = new DateTime(dt1.Year, dt1.Month, dt1.Day, scheduleHour, scheduleMins, 0);
                                    ts = dt2.Subtract(DateTime.Now);                                   
                                    runTimeIntervalFlag = false;
                                    if (ts.TotalMilliseconds > 0)
                                    {
                                        Log("CAActualExchangeRate background service - next runtime dealy(TotalMilliseconds):" + (int)ts.TotalMilliseconds + " next run on:" + dt2, LogLevel.Information);
                                        await Task.Delay((int)ts.TotalMilliseconds, stoppingToken);
                                    }
                                }
                                
                            }
                            else
                            {                                
                                var dt1 = DateTime.Now.AddDays((DateTime.Now.DayOfWeek == DayOfWeek.Sunday ? 0: 7 - (int)DateTime.Now.DayOfWeek )+ 1);
                                var dt2 = new DateTime(dt1.Year, dt1.Month, dt1.Day, scheduleHour, scheduleMins, 0);
                                ts = dt2.Subtract(DateTime.Now);
                                
                                runTimeIntervalFlag = false;                                
                                if (ts.TotalMilliseconds > 0)
                                {
                                    Log("CAActualExchangeRate background service - next runtime dealy(TotalMilliseconds):" + (int)ts.TotalMilliseconds + " next run on:" + dt2, LogLevel.Information);
                                    await Task.Delay((int)ts.TotalMilliseconds, stoppingToken);
                                }
                            }
                        }
                    }
                }

            }
            catch (Exception ex)
            {                
                Log("Error occured. " + ex.Message, LogLevel.Error);
                runTimeIntervalFlag = false;
            }
        }
        private void Log(string message, LogLevel logLevel)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                using (var context = scope.ServiceProvider.GetRequiredService<AppContext>())
                {
                    int userId = context.Users.Where(x => x.AccountName == "system.administrator").Single().UserId;
                    Logs objLog = new Logs();
                    objLog.Application = "OM_ScheduleTool.BackgroundServices.CAActualExchangeRate";
                    objLog.Message = message;
                    objLog.CreateDt = DateTime.Now;
                    objLog.UpdatedByUserId = userId;
                    objLog.LogType = logLevel;
                    context.Logs.Add(objLog);
                    context.SaveChanges();
                }
            }
        }

        private void SendEmailNotification(string mailtype, string body)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                using (var spcontext = scope.ServiceProvider.GetRequiredService<StoredProcsContext>())
                {
                    try
                    {
                        var paramServer = new SqlParameter("@Server", spcontext.Database.GetDbConnection().DataSource);
                        var paramApplication = new SqlParameter("@Application", "ScheduleTool - CAActualExchangeRate Background Service");
                        var paramMailtype = new SqlParameter("@MailType", mailtype);
                        var paramSubject = new SqlParameter("@Subject", mailtype +" - CA Actual Exchange Rate Notification");
                        var paramBody = new SqlParameter("@Body", body);
                       
                        spcontext.Database.ExecuteSqlRaw("exec UtilityDatabase.dbo.SP_SendMail @Server, @Application, @MailType, @Subject, @Body",
                         paramServer, paramApplication, paramMailtype, paramSubject, paramBody);


                    }
                    catch (Exception ex)
                    {
                        Log("Error occured. " + ex.Message, LogLevel.Error);
                    }

                }
            }
        }
    }
}
