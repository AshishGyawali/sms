using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.SMS
{
    public class SmsBalanceViewModel
    {
        [JsonProperty(PropertyName = "credits_consumed")]
        public string CreditsConsumed { get; set; }

        [JsonProperty(PropertyName = "last_balance_added")]
        public string LastBalanceAdded { get; set; }

        [JsonProperty(PropertyName = "credits_available")]
        public string CreditsAvailable { get; set; }

        [JsonProperty(PropertyName = "minimum_credit")]
        public string MinimumCredit { get; set; }
    }

}
