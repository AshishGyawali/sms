using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Helpers;

namespace SMSData.Models.Groups
{
    public class GroupsViewModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        [NotMapped]
        public string Subgroups { get; set; }
        [NotMapped]
        public List<SubGroupsViewModel> SubgroupsList
        {
            get
            {
                return Subgroups == null ? new List<SubGroupsViewModel>() : JsonConvert.DeserializeObject<List<SubGroupsViewModel>>(Subgroups);
            }
        }

    }
    public class GroupsListModel
    {
        public int Id { get; set; }
        public int ClientId { get; set; }
        public string Name { get; set; }
        public int SubgroupCount { get; set; }
        public DateTime CreatedDate { get; set; }
        public DateTime ModifiedDate { get; set; }
    }
}
