using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.Contact
{
    public class ImportContactViewModel
    {
        public DataTable Contacts { get; set; }
        public int ?GroupId { get; set; }
        public int ?SubgroupId { get; set; }
    }
}
