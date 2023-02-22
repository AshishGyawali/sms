using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Models.Groups
{
    public class SubGroupsViewModel
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public string Name { get; set; }
    }

    public class SubGroupsListModel
    {
        public int Id { get; set; }
        public int GroupId { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
