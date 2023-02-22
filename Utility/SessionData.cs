using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace Utility
{
    public static class SessionData
    {

        private static IHttpContextAccessor httpContextAccessor;
        public static void SetHttpContextAccessor(IHttpContextAccessor accessor)
        {
            httpContextAccessor = accessor;
        }
        public static SessionUser? CurrentUser
        {
            get
            {
                if (!httpContextAccessor.HttpContext.User.Identity.IsAuthenticated)
                {
                    return null;
                }
                var Id = GetValueFromClaim("UserId");
                var UserName = GetValueFromClaim("UserName");
                var Email = GetValueFromClaim(ClaimTypes.Email.ToString());
                var FullName = GetValueFromClaim("FullName");
                var ClientId = GetValueFromClaim("ClientId");
                var IsSystemUser = GetValueFromClaim("IsSystemUser");
                SessionUser user = new SessionUser();
                if (Int32.TryParse(Id, out int _id))
                {
                    user.Id = _id;
                }
                if (Int32.TryParse(ClientId, out int _clientId))
                {
                    user.ClientId = _clientId;
                }
                user.UserName = UserName;
                user.Email = Email;
                user.FullName = FullName;
                
                if (bool.TryParse(IsSystemUser, out bool _isSystemUser))
                {
                    user.IsSystemUser = _isSystemUser;
                }
                return user;


            }
        }

        private static string GetValueFromClaim(string key)
        {
            return httpContextAccessor.HttpContext.User.Claims.Where(x => x.Type == key).Select(x => x.Value).FirstOrDefault();
        }
    }

    public class SessionUser
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string FullName { get; set; }
        public int ClientId { get; set; }
        public bool IsSystemUser { get; set; }

    }
}
