using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.AuthHelper
{
    public  static class CheckGuild
    {
        public static bool IsGuid(this string value)
        {
            return Guid.TryParse(value, out Guid x);
        }
        public static Guid? GetGuid(this string value)
        {
            if (Guid.TryParse(value, out Guid x))
            {
                return x;
            }
            else
                return null;
        }
    }
}
