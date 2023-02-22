using Dapper;
using SMSData.Context;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.DB
{
    public class Database
    {
        private readonly DapperContext _context;
        public Database(DapperContext _context)
        {
            this._context = _context;
        }

        public async Task<IEnumerable<T>> ExecuteListAsync<T>(string query, CommandType cType = CommandType.StoredProcedure, DynamicParameters? parameters = null) where T : class
        {
            using var connection = _context.CreateConnection();
            return await connection.QueryAsync<T>(query, parameters, commandType: cType);
        }

        public async Task<DataTable> ExecuteDataTableAsync(string query, CommandType cType = CommandType.StoredProcedure, List<SqlParameter>? parameters = null)
        {

            try
            {
                using var cn = _context.CreateSqlConnection();

                SqlCommand cmd = new();
                using SqlDataAdapter da = new(cmd);
                using DataSet ds = new();

                cmd.CommandType = cType;
                cmd.CommandText = query;
                if (parameters != null)
                {
                    cmd.Parameters.AddRange(parameters.ToArray());
                }
                cmd.Connection = cn;
                await Task.Run(() => da.Fill(ds));
                return ds != null && ds.Tables.Count > 0 ? ds?.Tables[0] : new DataTable();
            }
            catch (Exception ex)
            {
                throw;
            }
            //using SqlCommand cmd = new SqlCommand(query, connection);
        }

        public async Task<T?> ExecuteObject<T>(string query, CommandType cType = CommandType.StoredProcedure, DynamicParameters? parameters = null) where T : class
        {
            var data = await ExecuteListAsync<T>(query, cType, parameters);
            return data?.FirstOrDefault();
        }

        public async Task<DbResponse> ExecuteNonQueryAsync(string query, CommandType cType = CommandType.StoredProcedure, DynamicParameters? parameters = null)
        {
            DbResponse response = new DbResponse();
            try
            {
                using var connection = _context.CreateConnection();
                await connection.ExecuteAsync(query, parameters, commandType: cType);
            }
            catch (Exception ex)
            {
                response.HasError = true;
                response.Message = ex.Message;
            }
            return (response);
        }

        public async Task<Object> ExecuteScalarAsync(string query, CommandType cType = CommandType.StoredProcedure, DynamicParameters? parameters = null)
        {
            using var connection = _context.CreateConnection();
            return await connection.ExecuteScalarAsync(query, parameters, commandType: cType);
        }


    }
}
