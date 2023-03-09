using Dapper;
using Newtonsoft.Json.Linq;
using SMSData.DB;
using SMSData.Models.Auth;
using SMSData.Models.Groups;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace SMSData.Repository.Groups
{

    public class GroupsRepository
    {
        private readonly Database _db;
        public GroupsRepository(Database database)
        {
            _db = database;
        }
        public async Task<IEnumerable<GroupsListModel>> GetGroupsList()
        {
            var pram = new DynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteListAsync<GroupsListModel>("spGetGroups", CommandType.StoredProcedure,pram);
        }
        public async Task<DbResponse> SaveGroup(GroupsViewModel value)
        {
            var pram = value.PrepareDynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteNonQueryAsync("spSaveGroups", CommandType.StoredProcedure, pram);
        }

        public async Task<bool> ValidateGroup(string groupName, int id)
        {
            var query = "SELECT 1 FROM dbo.Gropus WHERE [Name] = @Name AND ClientId = @ClientId AND Id <> @Id;";
            var pram = new List<SqlParameter>()
            .AddParam("Name", groupName)
            .AddParam("Id", id)
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            var res = await _db.ExecuteDataTableAsync(query, CommandType.Text, pram);
            return res.Rows.Count == 0;
        }
        public async Task<DataTable> GetSubGroupsList()
        {
            var pram = new List<SqlParameter>()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteDataTableAsync("spGetSubGroups", CommandType.StoredProcedure, pram);
        }
        public async Task<DbResponse> SaveSubGroup(SubGroupsViewModel value)
        {
            var pram = value.PrepareDynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteNonQueryAsync("spSaveSubGroup", CommandType.StoredProcedure, pram);
        }

        public async Task<bool> ValidateSubGroup(string subGroupName, int id)
        {
            var query = "SELECT 1 FROM dbo.Subgroup WHERE [Name] = @Name AND ClientId = @ClientId AND Id <> @Id;";
            var pram = new List<SqlParameter>()
            .AddParam("Name", subGroupName)
            .AddParam("Id", id)
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            var res = await _db.ExecuteDataTableAsync(query, CommandType.Text, pram);
            return res.Rows.Count == 0;
        }

        public async Task<IEnumerable<GroupsViewModel>> GetMyGroups()
        {
            var pram = new DynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteListAsync<GroupsViewModel>("spGetGroupsAndSubgroupsName", CommandType.StoredProcedure, pram);
        }
    }
}
