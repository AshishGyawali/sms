using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SMSData.DB;
using SMSData.Models.Contact;
using SMSData.Models.Groups;
using SMSData.Repository.Auth;
using SMSData.Repository.Contact;
using SMSData.Repository.Groups;
using System.Data;
using Utility;

namespace SMSPortal.Controllers
{
    [Authorize]
    public class ContactController : Controller
    {
        private readonly AuthenticationRepository _authenticationRepo;
        private readonly ContactRepository _contactRepo;
        private readonly GroupsRepository _groupsRepository;

        public ContactController(AuthenticationRepository authenticationRepo, ContactRepository contactRepo, GroupsRepository groupsRepository)
        {
            _authenticationRepo = authenticationRepo;
            _contactRepo = contactRepo;
            _groupsRepository = groupsRepository;
        }

        public async Task<IActionResult> MyContacts()
        {
            var groups = await _groupsRepository.GetMyGroups();
            return View(groups);
        }

        [HttpPost]
        public async Task<IActionResult> SaveContact(ContactViewModel model)
        {

            if (ModelState.IsValid)
            {
                var data = await _contactRepo.validateContact(model.Contact, model.Id);
                if (data)
                {
                    var response = await _contactRepo.SaveContact(model);
                    return Ok(response);
                }
                else
                {
                    return BadRequest(new DbResponse() { HasError = true, Message = "Contact already exists." });
                }
            }
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }

        public async Task<IActionResult> getContacts()
        {
            var data = await _contactRepo.GetContactList();
            return Ok(data);
        }

        public async Task<IActionResult> getContactByGroupId(int groupId)
        {
            var data = await _contactRepo.GetContactByGroupId(groupId);
            return Ok(data);
        }

        public async Task<IActionResult> getContactBySubGroupId(int groupId, int subgroupId)
        {
            var data = await _contactRepo.GetContactBySubGroupId(groupId, subgroupId);
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> ImportContact(IFormFile ContactFile, int ?groupId, int ?subgroupId) //import contact from file
        {
            string path = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot/files/contactfiles");

            //create folder if not exist
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
            string fileName = Guid.NewGuid().ToString() + "_" + ContactFile.FileName;
            string fileNameWithPath = Path.Combine(path, fileName);
            using (var stream = new FileStream(fileNameWithPath, FileMode.Create))
            {
                ContactFile.CopyTo(stream);
            }
            var data = new ImportContactViewModel
            {
                Contacts = (ExcelToDatatable.BeforeAllTests(fileNameWithPath)).Tables[0],
                GroupId = groupId,
                SubgroupId = subgroupId
            };
            //DataSet contacts = ExcelToDatatable.BeforeAllTests(fileNameWithPath);
            if (data.Contacts != null)
            {
                return Ok(data);
            }
            return Ok(null);


        }

        [HttpPost]
        public async Task<IActionResult> SaveBulkContact(List<BulkContact> model, int ?groupId, int ?subgroupId)  //Save imported contacts
        {

            if (ModelState.IsValid)
            {
                foreach (var contact in model)
                {
                    if (contact != null)
                    {
                        var firstSpaceIndex = contact.Name.IndexOf(" ");
                        contact.FirstName = contact.Name.Substring(0, firstSpaceIndex);
                        contact.LastName = contact.Name.Substring(firstSpaceIndex + 1);
                        contact.FullName = contact.Name;
                        contact.Contact = contact.Number;
                        contact.GroupId = groupId;
                        contact.SubGroupId = subgroupId;
                    }
                }
                var json = JsonConvert.SerializeObject(model);
                var response = await _contactRepo.SaveBulkContact(json);
                return Ok(response);

            }
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }
    }
}
