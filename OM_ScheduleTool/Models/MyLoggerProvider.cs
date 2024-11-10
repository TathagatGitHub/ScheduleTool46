using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Storage;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using System.Data;

namespace OM_ScheduleTool.Models
{
    public class MyLoggerProvider : ILoggerProvider
    {
        public ILogsRepository _logRepository;
        public MyLoggerProvider()
        {
        }

        public MyLoggerProvider(ILogsRepository logRepository)
        {
            _logRepository = logRepository;
        }

        public ILogger CreateLogger(string categoryName)
        {
            // NOTE: This sample uses EF Core 1.1. If using EF Core 1.0, then use 
            //       Microsoft.EntityFrameworkCore.Storage.Internal.RelationalCommandBuilderFactory
            //       rather than IRelationalCommandBuilderFactory

            if (categoryName == typeof(IRelationalCommandBuilderFactory).FullName)
            {
                return new MyLogger(categoryName, _logRepository);
            }
            else if (categoryName.Substring(0, 15) == "OM_ScheduleTool")
            {
                return new OM_ScheduleTool_Logger(categoryName, _logRepository);
            }

            return new NullLogger(categoryName, _logRepository);
        }

        public void Dispose()
        { }

        private class MyLogger : ILogger
        {

            private readonly string _categoryName;
            private readonly ILogsRepository _logRepository;

            public MyLogger(string categoryName
                , ILogsRepository repo)
            {
                _logRepository = repo;
                _categoryName = categoryName;
            }

            public bool IsEnabled(LogLevel logLevel)
            {
                return true;
            }

            public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
            {
                Console.WriteLine(formatter(state, exception));

                /*

                Logs log = new Logs();
                log.LogType = logLevel;
                log.Message = formatter(state, exception);

                _logRepository.WriteLogError(log);
                */
            }

            public IDisposable BeginScope<TState>(TState state)
            {
                return null;
            }
        }

        private class NullLogger : ILogger
        {

            private readonly string _categoryName;
            private readonly ILogsRepository _logRepository;

            public NullLogger(string categoryName
                , ILogsRepository repo
           )
            {
                _logRepository = repo;
                _categoryName = categoryName;
            }

            public bool IsEnabled(LogLevel logLevel)
            {
                return false;
            }

            public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
            {

            }

            public IDisposable BeginScope<TState>(TState state)
            {
                return null;
            }
        }

        private class OM_ScheduleTool_Logger : ILogger
        {

            private readonly string _categoryName;
            private readonly ILogsRepository _logRepository;

            public OM_ScheduleTool_Logger(string categoryName
                , ILogsRepository repo)
            {
                _logRepository = repo;
                _categoryName = categoryName;
            }

            public bool IsEnabled(LogLevel logLevel)
            {
                return false;
            }

            public void Log<TState>(LogLevel logLevel, EventId eventId, TState state, Exception exception, Func<TState, Exception, string> formatter)
            {
                try
                {
                    HttpContextAccessor httpContext = new HttpContextAccessor();
                    var constr = httpContext?.HttpContext?.Session.GetString("ConStr");

                    //ST-1357
                    if (string.IsNullOrEmpty(constr))
                    {
                        using (SqlConnection con = new SqlConnection(constr))
                        {
                            IConfiguration _configuration = new ConfigurationBuilder()
                                .SetBasePath(Directory.GetCurrentDirectory())
                                .AddJsonFile("appsettings.json")
                                .Build();

                            constr = _configuration.GetSection("ConnectionStrings:DefaultConnection").Value;
                        }
                    }

                    Logs log = new Logs();
                    log.UpdatedByUserId = int.Parse(eventId.ToString());
                    log.LogType = logLevel;
                    log.Message = exception == null ? formatter(state, exception) : exception.Message + " | " + exception.StackTrace;
                    log.Application = _categoryName;

                    using (SqlConnection con = new SqlConnection(constr))
                    {
                        SqlCommand insertCommand = new SqlCommand("sp_Logs_AddLogs", con);
                        if (con.State == ConnectionState.Closed)
                            con.Open();
                        insertCommand.CommandType = CommandType.StoredProcedure;
                        SqlParameter AppParam = insertCommand.Parameters.AddWithValue("@Application", log.Application);
                        AppParam.SqlDbType = SqlDbType.VarChar;
                        SqlParameter MessageParam = insertCommand.Parameters.AddWithValue("@Message", log.Message);
                        MessageParam.SqlDbType = SqlDbType.VarChar;
                        SqlParameter LogTypeParam = insertCommand.Parameters.AddWithValue("@LogType", log.LogType);
                        LogTypeParam.SqlDbType = SqlDbType.Int;
                        SqlParameter LoggedOnUserIdParam = insertCommand.Parameters.AddWithValue("@LoggedOnUserId", log.UpdatedByUserId == 0 ? 1 : log.UpdatedByUserId);
                        LoggedOnUserIdParam.SqlDbType = SqlDbType.Int;
                        insertCommand.ExecuteNonQuery();
                    }
                }
                catch (Exception)
                {
                    throw;
                }
            }

            public IDisposable BeginScope<TState>(TState state)
            {
                return null;
            }
        }
    }
}
