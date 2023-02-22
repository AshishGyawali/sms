using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.DB
{
    public class DbResponse
    {
        public bool HasError { get; set; }
        public string Message { get; set; }
        public object Data { get; set; }
    }
}
