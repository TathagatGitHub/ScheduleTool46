namespace OM_ScheduleTool.Dapper
{
    public class DBConnection
    {
        public static string constr { get; set; }
        static public IConfiguration Configuration { get; set; }
        public static string Main(string[] args = null)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");

            Configuration = builder.Build();
            constr = Configuration.GetSection("ConnectionStrings")["DefaultConnection"];
            return constr;
        }
    }
}
