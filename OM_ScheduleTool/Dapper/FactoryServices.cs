namespace OM_ScheduleTool.Dapper
{
    public static class FactoryServices
    {
        #region Private

        private static DbFactory _dbFactory;
        private static IConfiguration _iConfiguration;
        private static string Con;

        #endregion

        #region Public properties
        public static DbFactory dbFactory
        {
            //set { _iConfiguration = IConfiguration(value) }
            get { return _dbFactory ?? (_dbFactory = new DbFactory()); }
        }

        #endregion


    }//==Class Ends Here
}