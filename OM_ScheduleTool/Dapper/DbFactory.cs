using Dapper;
using Microsoft.Data.SqlClient;
using System.Data;
using System.Xml.Linq;

namespace OM_ScheduleTool.Dapper
{
    public class DbFactory
    {
        public string constr { get; set; }
        //private IDbConnection con;
        public DbFactory()
        {
            constr = DBConnection.Main();
        }

        public List<T> SelectCommand_SP<T>(List<T> ObjList, string spname, DynamicParameters parameters)
        {
            try
            {
                using (IDbConnection conn = new SqlConnection(constr.ToString()))
                {
                    if (conn.State == ConnectionState.Closed)
                    {
                        conn.Open();
                    }
                   // Open_Con();
                    ObjList = conn.Query<T>(spname.ToString(), parameters, commandType: CommandType.StoredProcedure).ToList();
                    if (conn.State == ConnectionState.Open)
                    {
                        conn.Close();
                    }
                }
                return ObjList;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
                //Close_Con();
            }
        }

        public T SelectCommand_SP<T>(T ObjModel, string sqlQuery)
        {
            try
            {
                using (IDbConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    // Open_Con();
                    ObjModel = SqlCon.Query<T>(sqlQuery, commandType: CommandType.Text).FirstOrDefault();
                   
                    if (SqlCon.State == ConnectionState.Open)
                    {
                        SqlCon.Close();
                    }
                }
                return ObjModel;
            }
            catch (Exception Ex)
            {
                throw;
            }
        }

        public List<T> SelectCommand_SP<T>(List<T> ObjList, string strQ)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();

                    ObjList = SqlCon.Query<T>(strQ, commandType: CommandType.Text).ToList();
                }
                return ObjList;
            }
            catch (Exception Ex)
            {
                throw;
            }
        }
        public T SelectCommand_Single_SP<T>(T ObjList, string strQ)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    ObjList = SqlCon.Query<T>(strQ, commandType: CommandType.Text).FirstOrDefault();
                }
                return ObjList;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
               // Close_Con();
            }
        }
        public List<T> SelectCommand<T>(List<T> ObjList, string Query)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    ObjList = SqlCon.Query<T>(Query.ToString()).ToList();
                }
                return ObjList;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
              //  Close_Con();
            }

        }

        public T SelectCommand_SP<T>(T ObjModel, string spname, DynamicParameters parameters)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    ObjModel = SqlCon.Query<T>(spname.ToString(), parameters, commandType: CommandType.StoredProcedure).FirstOrDefault();
                }
               
                return ObjModel;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
              //  Close_Con();
            }
        }

        public T SelectCommand_SP_CustomeConnection<T>(T ObjModel, string spname, DynamicParameters parameters,string ConStr)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(ConStr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    ObjModel = SqlCon.Query<T>(spname.ToString(), parameters, commandType: CommandType.StoredProcedure).FirstOrDefault();
                }

                return ObjModel;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
                //  Close_Con();
            }
        }


        public IList<T> SelectCommand_SP<T>(IList<T> ObjList, string spname, DynamicParameters parameters)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    ObjList = SqlCon.Query<T>(spname.ToString(), parameters, commandType: CommandType.StoredProcedure).ToList();
                }
                return ObjList;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
               // Close_Con();
            }
        }

        //public void Open_Con()
        //{
        //    con = new SqlConnection(constr.ToString());
        //    if (con.State == ConnectionState.Closed)
        //    {
        //        con.Open();
        //    }
        //}

        //public void Close_Con()
        //{
        //    if (con.State == ConnectionState.Open)
        //    {
        //        con.Close();
        //    }
        //}

        public int InsertCommand_SP(string spname, DynamicParameters parameters)
        {
            int rowAffected = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    rowAffected = SqlCon.Execute(spname.ToString(), parameters, commandType: CommandType.StoredProcedure);
                }
                return rowAffected;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
               // Close_Con();
            }
        }

        public int UpdateCommand_SP(string spname, DynamicParameters parameters)
        {
            int rowAffected = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    rowAffected = SqlCon.Execute(spname.ToString(), parameters, commandType: CommandType.StoredProcedure);
                }
                return rowAffected;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
                //Close_Con();
            }
        }

        //EXECUTE SCALAR
        public int ExecuteSP_ExecuteScalar(string sp_Name, SqlParameter[] parameter)
        {
            try
            {
                int retval = 0;
                using (SqlConnection SqlConn = new SqlConnection(constr))
                {
                    if (SqlConn.State == ConnectionState.Closed)
                    {
                        SqlConn.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand())
                    {
                        sqlComd.Connection = SqlConn;
                        sqlComd.CommandType = CommandType.StoredProcedure;
                        sqlComd.CommandText = sp_Name;
                        foreach (SqlParameter para in parameter)
                        {
                            sqlComd.Parameters.Add(para);
                        }
                        retval = Convert.ToInt32(sqlComd.ExecuteScalar());
                    }
                }
                return retval;
            }
            catch (Exception exception)
            {
                throw new Exception(exception.Message);
            }
        }
        //EXECUTE SCALAR
        public int ExecuteSP_ExecuteScalar(string sp_Name, List<SqlParameter> parameter)
        {
            try
            {
                int retval = 0;
                using (SqlConnection SqlConn = new SqlConnection(constr))
                {
                    if (SqlConn.State == ConnectionState.Closed)
                    {
                        SqlConn.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand())
                    {
                        sqlComd.Connection = SqlConn;
                        sqlComd.CommandType = CommandType.StoredProcedure;
                        sqlComd.CommandText = sp_Name;
                        foreach (SqlParameter para in parameter)
                        {
                            sqlComd.Parameters.Add(para);
                        }
                        //retval = Convert.ToInt32(sqlComd.ExecuteScalar());
                        retval = Convert.ToInt32(sqlComd.ExecuteNonQuery());
                    }
                }
                return retval;
            }
            catch (Exception exception)
            {
                throw new Exception(exception.Message);
            }
        }

        //EXECUTE SCALAR
        public int ExecuteSP_InsertCommandReturnIdentity(string sp_Name, List<SqlParameter> parameter)
        {
            try
            {
                int retval = 0;
                using (SqlConnection SqlConn = new SqlConnection(constr))
                {
                    if (SqlConn.State == ConnectionState.Closed)
                    {
                        SqlConn.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand())
                    {
                        sqlComd.Connection = SqlConn;
                        sqlComd.CommandType = CommandType.StoredProcedure;
                        sqlComd.CommandText = sp_Name;
                        foreach (SqlParameter para in parameter)
                        {
                            sqlComd.Parameters.Add(para);
                        }
                        //retval = Convert.ToInt32(sqlComd.ExecuteScalar());
                        retval = Convert.ToInt32(sqlComd.ExecuteNonQuery());
                        if (retval == 1)
                        {
                            using (SqlCommand cmdid = new SqlCommand("Select @@IDENTITY as value", SqlConn))
                            {
                                var objIdentity = cmdid.ExecuteScalar();
                                retval = Convert.ToInt32(objIdentity);
                            }
                        }
                    }
                }
                return retval;
            }
            catch (Exception exception)
            {
                throw new Exception(exception.Message);
            }
        }
        public int UpdateCommand_SP(string strQ)
        {
            int rowAffected = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    rowAffected = SqlCon.Execute(strQ, commandType: CommandType.Text);
                }
             
                return rowAffected;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
                //Close_Con();
            }
        }

        public object SelectScalarValue_SP(string spname, DynamicParameters parameters)
        {
            object retval = null;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    retval = SqlCon.ExecuteScalar<object>(spname, param: parameters, commandType: CommandType.StoredProcedure);
                }
               
                return retval;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
               // Close_Con();
            }
        }
        public object SelectScalarValue_SP(string strQ)
        {
            object retval = null;
            try
            {
                // Open_Con();
                using (SqlConnection SqlCon = new SqlConnection(constr.ToString()))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                        SqlCon.Open();
                    retval = SqlCon.ExecuteScalar<object>(strQ, commandType: CommandType.Text);
                }
                
                return retval;
            }
            catch (Exception Ex)
            {
                throw;
            }
            finally
            {
                //Close_Con();
            }
        }

        public System.Data.DataSet SelectCommand(string strQ)
        {
            var ds = new DataSet();
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        using (SqlDataAdapter sqlAdpt = new SqlDataAdapter { SelectCommand = sqlComd })
                        {
                            ds = new DataSet();
                            sqlAdpt.Fill(ds);

                        }
                    }
                }
                return ds;
            }
            catch (Exception)
            {
                ds = null;
                return ds;
            }
        }
        public System.Data.DataTable SelectDataTable(string strQ)
        {
            var dt = new DataTable();
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        using (SqlDataAdapter sqlAdpt = new SqlDataAdapter { SelectCommand = sqlComd })
                        {
                            dt = new DataTable();
                            sqlAdpt.Fill(dt);

                        }
                    }
                }
                return dt;
            }
            catch (Exception)
            {
                dt = null;
                return dt;
            }
        }

        public System.Data.DataSet SelectDataSet(string strQ)
        {
            var ds = new DataSet();
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        using (SqlDataAdapter sqlAdpt = new SqlDataAdapter { SelectCommand = sqlComd })
                        {
                            ds = new DataSet();
                            sqlAdpt.Fill(ds);

                        }
                    }
                }
                return ds;
            }
            catch (Exception)
            {
                ds = null;
                return ds;
            }
        }
        public string SelectCountString(string strQ)
        {
            string retval = "";
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        retval = Convert.ToString(sqlComd.ExecuteScalar());
                        SqlCon.Close();
                    }
                }
                return retval;
            }
            catch (Exception ex)
            {
                return retval;
            }
        }
        public string SelectString(string strQ)
        {

            string retval = "";
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        retval = Convert.ToString(sqlComd.ExecuteScalar());
                    }
                }
                return retval;
            }
            catch (Exception)
            {
                return retval;
            }
        }
        public int SelectCount(string strQ)
        {
            int retval = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        retval = Convert.ToInt32(sqlComd.ExecuteScalar());
                        SqlCon.Close();
                    }
                }
                return retval;
            }
            catch (Exception ex)
            {
                return retval;
            }
        }
        public decimal SelectTotal(string strQ)
        {
            decimal retval = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        retval = Convert.ToDecimal(sqlComd.ExecuteScalar());

                    }
                }
                return retval;
            }
            catch (Exception)
            {
                return retval;
            }
        }
        public Int32 InsertCommand(string strQ)
        {
            Int32 retval = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    SqlCon.Open();
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        retval = sqlComd.ExecuteNonQuery();
                        SqlCon.Close();
                    }
                }
                return retval;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public void InsertCommand_(string strQ)
        {

            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        sqlComd.ExecuteNonQuery();
                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Int32 InsertCommandReturnIdentity(string strQ)
        {
            Int32 retval = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {


                        retval = sqlComd.ExecuteNonQuery();
                        if (retval == 1)
                        {
                            using (SqlCommand cmdid = new SqlCommand("Select @@IDENTITY as value", SqlCon))
                            {
                                var objIdentity = cmdid.ExecuteScalar();
                                retval = Convert.ToInt32(objIdentity);
                            }
                        }

                    }
                }
                return retval;
            }
            catch (Exception exe)
            {
                throw exe;
            }
        }
        public Int32 UpdateCommand(string strQ)
        {

            Int32 retval = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        var objIdentity = sqlComd.ExecuteNonQuery();
                        retval = Convert.ToInt32(objIdentity);
                        //retval = sqlComd.ExecuteNonQuery();

                    }
                }
                return retval;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public Int32 DeleteCommand(string strQ)
        {

            Int32 retval = 0;
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        var objIdentity = sqlComd.ExecuteNonQuery();
                        retval = Convert.ToInt32(objIdentity);

                        //retval = sqlComd.ExecuteNonQuery();
                    }
                }
                return retval;
            }
            catch (Exception exe)
            {
                throw exe;
            }
        }
        public void ExecuteCommand(string strQ)
        {
            try
            {
                using (SqlConnection SqlCon = new SqlConnection(constr))
                {
                    if (SqlCon.State == ConnectionState.Closed)
                    {
                        SqlCon.Open();
                    }
                    using (SqlCommand sqlComd = new SqlCommand(strQ.ToString(), SqlCon))
                    {
                        sqlComd.ExecuteNonQuery();

                    }
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }

        }
        public System.Data.DataSet SelectCommandWithThrowError(string strQ)
        {
            var ds = new DataSet();
            try
            {

                using (SqlConnection SqlCon = new SqlConnection(constr))
                {

                    var sqlComd = new SqlCommand(strQ.ToString(), SqlCon);
                    var sqlAdpt = new SqlDataAdapter { SelectCommand = sqlComd };
                    ds = new DataSet();
                    sqlAdpt.Fill(ds);

                    return ds;
                }

            }
            catch (Exception ex)
            {
                ds = null;
                throw ex;
            }

        }

        public string Execute_Multiple_Query(List<string> lstquery)
        {
            SqlTransaction transExecute = null;
            SqlCommand cmdExecute = new SqlCommand();
            SqlConnection SqlCon = new SqlConnection(constr);
            try
            {
                SqlCon.Open();
                transExecute = SqlCon.BeginTransaction();
                for (int intLoopVariable = 0; intLoopVariable < lstquery.Count; intLoopVariable++)
                {
                    cmdExecute = new SqlCommand(lstquery[intLoopVariable], SqlCon);
                    cmdExecute.Transaction = transExecute;
                    cmdExecute.ExecuteNonQuery();
                }
                transExecute.Commit();
            }
            catch (SqlException sqlex)
            {
                if (transExecute != null)
                {
                    transExecute.Rollback();
                    return sqlex.Message.Replace("'", "");
                }
            }
            catch (Exception ex)
            {
                if (transExecute != null)
                {
                    transExecute.Rollback();
                    return ex.Message.Replace("'", "");
                }
            }
            finally
            {
                cmdExecute.Dispose();
                SqlCon.Close();
            }
            return "";

        }
        
    }//=== Class Ends Here
}




