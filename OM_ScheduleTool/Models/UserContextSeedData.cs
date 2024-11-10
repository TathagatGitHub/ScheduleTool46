//using System.Data.SqlClient;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Drawing;
using System.Drawing.Imaging;
using System.DirectoryServices;
using IHostingEnvironment = Microsoft.AspNetCore.Hosting.IHostingEnvironment;


namespace OM_ScheduleTool.Models
{
    public class UserContextSeedData
    {
        public AppContext _context;
        private IConfiguration _config;
        private IHostingEnvironment _hostingEnvironment;
         

        public UserContextSeedData(AppContext context
            , IConfiguration config
            , IHostingEnvironment environment)
        {
            _context = context;
            _config = config;
            _hostingEnvironment = environment;
        }


        public async Task EnsureSeedData()
        {
            if (!_context.Users.Any() == true || _config.GetSection("DebugMode: Debug").ToString() == "off")
            {
                try
                {
                    using (DirectoryEntry entry = new DirectoryEntry("LDAP://172.16.1.10/DC=OCEANMEDIAINC,DC=COM", "carmela.pham", "Cfe2209"))
                    {
                        DirectorySearcher search = new DirectorySearcher(entry);
                        string query = "(&(objectCategory=person)(objectClass=user)(memberOf=*))";
                        search.Filter = query;
                        search.PropertiesToLoad.Add("memberOf");
                        search.PropertiesToLoad.Add("name");
                        search.PropertiesToLoad.Add("samaccountname");
                        search.PropertiesToLoad.Add("mail");
                        search.PropertiesToLoad.Add("displayname");
                        search.PropertiesToLoad.Add("givenname");
                        search.PropertiesToLoad.Add("sn");
                        search.PropertiesToLoad.Add("thumbnailPhoto");
                        search.PropertiesToLoad.Add("cn");

                        var userfiles = Path.Combine(_hostingEnvironment.WebRootPath, "users");

                        System.DirectoryServices.SearchResultCollection mySearchResultColl = search.FindAll();
                        foreach (SearchResult result in mySearchResultColl)
                        {
                            foreach (string prop in result.Properties["memberOf"])
                            {
                                if (prop.Contains("Ocean Security Groups"))
                                {
                                    try
                                    {
                                        try
                                        {
                                            byte[] data = result.Properties["thumbnailPhoto"][0] as byte[];

                                            if (data != null)
                                            {
                                                using (MemoryStream s = new MemoryStream(data, 0, data.Length))
                                                {
                                                    s.Position = 0;
                                                    s.Write(data, 0, data.Length);
                                                    Image img = Image.FromStream(s);
                                                    img.Save(Path.Combine(userfiles, (String)result.Properties["samaccountname"][0] + ".jpg"), ImageFormat.Jpeg);

                                                }

                                            }
                                        }
                                        catch (Exception)
                                        {

                                        }

                                        SqlParameter paramAccountName = new SqlParameter("@AccountName", (String)result.Properties["samaccountname"][0]);
                                        SqlParameter paramEmailAddress = new SqlParameter("@EmailAddress", (String)result.Properties["mail"][0]);
                                        SqlParameter paramDisplayName = new SqlParameter("@DisplayName", (String)result.Properties["displayname"][0]);
                                        SqlParameter paramFirstName = new SqlParameter("@FirstName", (String)result.Properties["givenname"][0]);
                                        SqlParameter paramLastName = new SqlParameter("@LastName", (String)result.Properties["sn"][0]);
                                        SqlParameter paramImageUrl = new SqlParameter("@ImageUrl", "/img/avatars/avatar5.jpg");

                                        var file = System.IO.Path.Combine(userfiles, (String)result.Properties["samaccountname"][0] + ".jpg");
                                        if (System.IO.File.Exists(file))
                                        {
                                            paramImageUrl.Value = "/users/" + (String)result.Properties["samaccountname"][0] + ".jpg";
                                        }


                                        ///Commented Shariq 2022-09-05
                                        //_context.Database.CreateExecutionStrategy("sp_User_AddFromActiveDirectory @AccountName, @EmailAddress, @FirstName, @LastName, @DisplayName, @ImageUrl"
                                        //, paramAccountName, paramEmailAddress, paramFirstName, paramLastName, paramDisplayName, paramImageUrl);
                                    }
                                    catch (Exception exc)
                                    {
                                        Console.WriteLine(exc.Message);
                                    }

                                }
                            }
                        }
                    }

                    _context.SaveChanges();
                }
                catch
                {
                }


                await _context.SaveChangesAsync();
            }
        }

    }
}
