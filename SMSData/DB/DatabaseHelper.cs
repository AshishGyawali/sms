using Dapper;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;
using System.Reflection;
using System.Web;

namespace SMSData.DB
{
    public static class DatabaseHelper
    {
        public static DynamicParameters AddParam(this DynamicParameters container, string key, string value)
        {
            container.Add(key, value, DbType.String);
            return container;
        }
        public static DynamicParameters AddParam(this DynamicParameters container, string key, int value)
        {
            container.Add(key, value, DbType.Int32);
            return container;
        }
        public static DynamicParameters AddParam(this DynamicParameters container, string key, bool value)
        {
            container.Add(key, value, DbType.Boolean);
            return container;
        }
        public static DynamicParameters AddParam(this DynamicParameters container, string key, DateTime value)
        {
            container.Add(key, value, DbType.DateTime);
            return container;
        }
        public static List<SqlParameter> AddParam(this List<SqlParameter> container, string key, object value)
        {
            if (value == null)
            {
                container.Add(new SqlParameter(key, DBNull.Value));
            }
            else
            {
                container.Add(new SqlParameter(key, value));
            }
            return container;
        }

        public static DynamicParameters PrepareDynamicParameters<T>(this T item)
        {
            var properties = item.GetType().GetProperties().Where(x => x.DeclaringType == typeof(T));
            var model = new DynamicParameters();
            foreach (PropertyInfo prop in properties)
            {
                if (prop.GetCustomAttribute<NotMappedAttribute>() != null)
                    continue;
                var val = prop.GetValue(item);
                model.Add(prop.Name, val);
            }
            return model;
        }

        public static List<SqlParameter> PrepareSQLParameters<T>(this T item)
        {
            var properties = item.GetType().GetProperties().Where(x => x.DeclaringType == typeof(T));
            var model = new List<SqlParameter>();
            foreach (PropertyInfo prop in properties)
            {
                if (prop.GetCustomAttribute<NotMappedAttribute>() != null)
                    continue;

                var p = new SqlParameter
                {
                    ParameterName = prop.Name
                };
                var val = prop.GetValue(item);

                if (prop.PropertyType == typeof(string) && val != null)
                {
                    val = HttpUtility.UrlDecode(val.ToString()).Trim();
                }

                if (val != null)
                    p.Value = val;
                else
                    p.Value = DBNull.Value;
                model.Add(p);
            }
            return model;
        }
    }
}
