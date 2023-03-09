using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using SMSData.DB;
using SMSData.Models.Auth;
using SMSData.Models.Groups;
using SMSData.Repository.Auth;
using SMSData.Repository.Groups;
using Utility;

namespace SMSPortal.Controllers
{
    [Authorize]
    public class GroupController : Controller
    {
        private readonly AuthenticationRepository _authenticationRepo;
        private readonly GroupsRepository _gropusRepo;

        public GroupController(AuthenticationRepository authenticationRepo, GroupsRepository groupsRepo)
        {
            _authenticationRepo= authenticationRepo;
            _gropusRepo= groupsRepo;
        }
        public IActionResult MyGroups()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SaveGroup(GroupsViewModel model)
        {

            if (ModelState.IsValid)
            {
                var data = await _gropusRepo.ValidateGroup(model.Name, model.Id);
                if(data)
                {
                    var response = await _gropusRepo.SaveGroup(model);
                    return Ok(response);
                }
                else
                {
                    return BadRequest(new DbResponse() { HasError = true, Message = "Group Name already exists." });
                }
            }
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }

        public async Task<IActionResult> getGroups()
        {
            var data = await _gropusRepo.GetGroupsList();
            return Ok(data);
        }

        public async Task<IActionResult> validateGroup(string groupName, int Id)
        {
            var data = await _gropusRepo.ValidateGroup(groupName, Id);
            return Ok(data);
        }

        public IActionResult MySubGroups()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SaveSubGroup(SubGroupsViewModel model)
        {

            if (ModelState.IsValid)
            {
                var data = await _gropusRepo.ValidateSubGroup(model.Name, model.Id);
                if (data)
                {
                    var response = await _gropusRepo.SaveSubGroup(model);
                    return Ok(response);
                }
                else
                {
                    return BadRequest(new DbResponse() { HasError = true, Message = "Sub Group Name already exists." });
                }
            }
            IEnumerable<ModelError> allErrors = ModelState.Values.SelectMany(v => v.Errors);
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }

        public async Task<IActionResult> getSubGroups()
        {
            var data = await _gropusRepo.GetSubGroupsList();
            return Ok(data);
        }

        public async Task<IActionResult> validateSubGroup(string subGroupName, int Id)
        {
            var data = await _gropusRepo.ValidateSubGroup(subGroupName, Id);
            return Ok(data);
        }

    }

}
