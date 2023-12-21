using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.DataModel.Client
{
    public class ClientDataViewModel
    {
        public string FullName { get; set; }
        [EmailAddress]
        public string Email { get; set; }

        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string? CompanySlogan { get; set; }
        public string PanNo { get; set; }
        public string Address { get; set; }
        public string? TypeOfBusiness { get; set; }

    }

    public class CompanyDataViewModel
    {
        public string CompanyName { get; set; }
        public string CompanyLogo { get; set; }
        public string? CompanySlogan { get; set; }
        public string? TypeOfBusiness { get; set; }
    }
}
