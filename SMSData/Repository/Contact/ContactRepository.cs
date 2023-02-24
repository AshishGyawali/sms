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
        public async Task<DbResponse> SaveContact(ContactViewModel value)
        {
            var pram = value.PrepareDynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteNonQueryAsync("spSaveContacts", CommandType.StoredProcedure, pram);
        }

        public async Task<bool> validateContact(string contactName, int id)
        {
            var query = "SELECT 1 FROM dbo.Gropus WHERE [Name] = @Name AND ClientId = @ClientId AND Id <> @Id;";
            var pram = new List<SqlParameter>()
            .AddParam("Name", contactName)
            .AddParam("Id", id)
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            var res = await _db.ExecuteDataTableAsync(query, CommandType.Text, pram);
            return res.Rows.Count == 0;
        }
    }
}
