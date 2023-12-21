using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata.Ecma335;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.SMS
{
    public class SmsContactViewModel
    {
        public string ContactNumber { get; set; }
    }
    public class SmsDataViewModel
    {
        public string MsgForwardedNo { get; set; }
        public string MsgBody { get; set; }
        public int TotalNumber { get; set; }
        public DateTime? ScheduleDate { get; set; }
        public string? Response { get; set; }
        public string? Wallet { get; set; }
    }


}
