using System;
using System.ComponentModel;
using System.Data;
using System.Data.Common;

namespace OM_ScheduleTool.Helpers
{
    public static class DBHelper
    {
        public static bool? GetSafeBool(this DbDataReader reader, string field)
        {
            if (reader[field] != DBNull.Value)
            {
                return Convert.ToBoolean(reader[field]);
            }
            return null;

        }

        public static int? GetSafeInt(this DbDataReader reader, string field)
        {
            if (reader[field] != DBNull.Value)
            {
                return Convert.ToInt32(reader[field]);
            }
            return null;

        }

        public static string GetSafeString(this DbDataReader reader, string field)
        {
            if (reader[field] != DBNull.Value)
            {
                return Convert.ToString(reader[field]);
            }
            return null;
        }

        public static decimal? GetSafeDecimal(this DbDataReader reader, string field)
        {
            if (reader[field] != DBNull.Value)
            {
                return Convert.ToDecimal(reader[field]);
            }
            return null;
        }

        public static DateTime? GetSafeDateTime(this DbDataReader reader, string field)
        {
            if (reader[field] != DBNull.Value)
            {
                return Convert.ToDateTime(reader[field]);
            }
            return null;
        }

        public static DataTable ConverListToDataTable<T>(this IList<T> data)
        {
            PropertyDescriptorCollection props =
                TypeDescriptor.GetProperties(typeof(T));
            DataTable table = new DataTable();
            for (int i = 0; i < props.Count; i++)
            {
                PropertyDescriptor prop = props[i];
                table.Columns.Add(prop.Name, prop.PropertyType);
            }
            object[] values = new object[props.Count];
            foreach (T item in data)
            {
                for (int i = 0; i < values.Length; i++)
                {
                    values[i] = props[i].GetValue(item);
                }
                table.Rows.Add(values);
            }
            return table;
        }
    }
}
