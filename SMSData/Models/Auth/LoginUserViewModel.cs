using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.Auth
{
    public class LoginUserViewModel
    {
        public int Id { get; set; }
        public string UserName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Salt { get; set; }
        public string FullName { get; set; }
        public int ClientId { get; set; }
        public bool IsSystemUser { get; set; }

    }
}
