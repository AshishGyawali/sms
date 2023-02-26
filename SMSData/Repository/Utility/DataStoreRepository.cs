using SMSData.DB;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace SMSData.Repository.Utility
{
    public class DataStoreRepository
    {
        private readonly Database _db;
        public DataStoreRepository(Database database)
        {
            _db = database;
        }

        public async Task<DataTable> GetData(string name, string searchKey, int take, int skip, int? id, int? parentId)
        {
            var pram = new List<SqlParameter>()
             .AddParam("Name", name)
             .AddParam("searchKey", searchKey)
             .AddParam("take", take)
             .AddParam("id", id)
             .AddParam("parentId", parentId)
             .AddParam("ClientId", SessionData.CurrentUser.ClientId)
             .AddParam("skip", skip);
            return await _db.ExecuteDataTableAsync("masterData_get_sp",CommandType.StoredProcedure,pram);
        }
    }
}
