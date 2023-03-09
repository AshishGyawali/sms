using Dapper;
using SMSData.DB;
using SMSData.Models.Groups;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;
using SMSData.Models.Contact;

namespace SMSData.Repository.Contact
{
    public class ContactRepository
    {
        private readonly Database _db;
        public ContactRepository(Database database)
        {
            _db = database;
        }

        public async Task<IEnumerable<ContactListModel>> GetContactList()
        {
            var pram = new DynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteListAsync<ContactListModel>("spGetContacts", CommandType.StoredProcedure, pram);
        }

        public async Task<IEnumerable<ContactListModel>> GetContactByGroupId(int groupId)
        {
            var query = "SELECT c.Id,c.ClientId,c.FirstName,c.LastName,c.FullName,c.Contact,s.[Name] AS SubGroupName,c.Remarks,c.CreatedDate,c.ModifiedDate FROM dbo.Contacts c LEFT JOIN dbo.Subgroup s ON s.Id = c.SubGroupId WHERE c.ClientId = @ClientId AND c.GroupId = @groupId;";
            var pram = new DynamicParameters()
            .AddParam("groupId",groupId)
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteListAsync<ContactListModel>(query, CommandType.Text, pram);
        }

        public async Task<IEnumerable<ContactListModel>> GetContactBySubGroupId(int groupId, int subgroupId)
        {
            var query = "SELECT c.Id,c.ClientId,c.FirstName,c.LastName,c.FullName,c.Contact,c.Remarks,c.CreatedDate,c.ModifiedDate FROM dbo.Contacts c WHERE c.ClientId = @ClientId AND c.GroupId = @groupId AND c.SubGroupId = @subgroupId ;";
            var pram = new DynamicParameters()
            .AddParam("groupId", groupId)
            .AddParam("subgroupId", subgroupId)
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteListAsync<ContactListModel>(query, CommandType.Text, pram);
        }

        public async Task<DbResponse> SaveContact(ContactViewModel value)
        {
            var pram = value.PrepareDynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteNonQueryAsync("spSaveContacts", CommandType.StoredProcedure, pram);
        }

        public async Task<bool> validateContact(string contact, int id)
        {
            var query = "SELECT 1 FROM dbo.Contacts WHERE [Contact] = @Contact AND ClientId = @ClientId AND Id <> @Id;";
            var pram = new List<SqlParameter>()
            .AddParam("Contact", contact)
            .AddParam("Id", id)
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            var res = await _db.ExecuteDataTableAsync(query, CommandType.Text, pram);
            return res.Rows.Count == 0;
        }

        public async Task<DbResponse> SaveBulkContact(string value)
        {
            var pram = new DynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId)
            .AddParam("contactJsonString", value); // json data of imported contacts
            return await _db.ExecuteNonQueryAsync("saveBulkContacts_sp", CommandType.StoredProcedure, pram);
        }
    }
}
