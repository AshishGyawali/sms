using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.Groups
{
    public class GroupsViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }

    }
    public class GroupsListModel
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
