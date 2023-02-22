using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.Auth
{
    public class PasswordResetLog
    {
        public int UserId { get; set; }
        public string Token { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ExpiryDate { get; set;}
        public string IP { get; set; }
        public string Location { get; set; }
        public string Device { get; set; }
        [NotMapped]
        public bool IsUsed { get; set; }
        [NotMapped]
        public DateTime? UsedDate { get; set; }
    }
}
