using Dapper;
using SMSData.DB;
using SMSData.Models.Auth;
using SMSData.Models.DataModel.User;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Repository.Auth
{
    public class AuthenticationRepository
    {
        private readonly Database _db;
        public AuthenticationRepository(Database database) {
            _db = database;
        }

        public async Task<LoginUserViewModel> GetCredentials(LoginViewModel credentials)
        {
            var query = @"SELECT TOP(1) [Id],[UserName],[Email],[Password],[Salt],[FullName],[ClientId],[IsSystemUser] FROM dbo.[User] WHERE [UserName] = @Username OR [Email] = @Username;";
            var pram = new DynamicParameters();
            pram.Add("Username", credentials.UserName, DbType.String);
            return await _db.ExecuteObject<LoginUserViewModel>(query, CommandType.Text, pram);
        }
        public async Task<UserDataModel> GetUserByEmail(string email)
        {
            var query = @"SELECT TOP(1) [Id],[UserName],[Email],[FullName],[ClientId],[IsSystemUser] FROM dbo.[User] WHERE [UserName] = @Email OR [Email] = @Email;";
            var pram = new DynamicParameters();
            pram.Add("Email", email, DbType.String);
            return await _db.ExecuteObject<UserDataModel>(query, CommandType.Text, pram);
        }

        public async Task<DbResponse> SavePasswordLog(PasswordResetLog log)
        {
            var pram = log.PrepareDynamicParameters();
            return await _db.ExecuteNonQueryAsync("spSaveResetPasswordLog",CommandType.StoredProcedure,pram);
        }
        public async Task<PasswordResetLog> GetPasswordLog(string token)
        {
            var pram = new DynamicParameters()
            .AddParam("Token", token);
            return await _db.ExecuteObject<PasswordResetLog>("spGetResetPasswordLog", CommandType.StoredProcedure, pram);
        }
        public async Task<DbResponse> UpdatePasswordAfterReset(ResetPasswordViewModel model, string salt)
        {
            var pram = model.PrepareDynamicParameters()
                .AddParam("Salt", salt);
            return await _db.ExecuteNonQueryAsync("spUpdateResetPassword", CommandType.StoredProcedure, pram);
        }
    }
}
