using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.Contact
{
    public class ContactViewModel
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int SubGroupId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; } 
        public string Contact { get; set; }
        public string Remarks { get; set; }
    }

    public class ContactListModel
    {
        public int Id { get; set; }
        public string GroupName { get; set; }
        public string SubGroupName { get; set; }
        public int ClientId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string FullName  { get; set; }
        public string Contact { get; set; }
        public string Remarks { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
