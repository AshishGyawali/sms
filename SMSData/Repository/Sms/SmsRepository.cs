using Dapper;
using SMSData.DB;
using SMSData.Models.Groups;
using SMSData.Models.SMS;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace SMSData.Repository.Sms
{
    public class SmsRepository
    {
        private readonly Database _db;
        public SmsRepository(Database database)
        {
            _db = database;
        }
        public async Task<DbResponse> SaveTemplate(TemplateViewModel value)
        {
            var pram = value.PrepareDynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteNonQueryAsync("spSaveTemplate", CommandType.StoredProcedure, pram);
        }
        public async Task<IEnumerable<TemplateNameViewModel>> GetTemplateName()
        {
            var pram = new DynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteListAsync<TemplateNameViewModel>("spGetTemplatesName", CommandType.StoredProcedure, pram);
        }
    }
}
