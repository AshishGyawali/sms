using Dapper;
using SMSData.DB;
using SMSData.Models.DataModel.Client;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Utility;

namespace SMSData.Repository.Client.Company
{
    public class CompanyRepository
    {
        private readonly Database _db;
        public CompanyRepository(Database database)
        {
            _db = database;
        }

        public async Task<CompanyDataViewModel> GetClientCompanyDetails()
        {
            var pram = new DynamicParameters()
            .AddParam("ClientId", SessionData.CurrentUser.ClientId);
            return await _db.ExecuteObject<CompanyDataViewModel>("sp_getClientCompanyDetails", CommandType.StoredProcedure, pram);
        }

    }
}
