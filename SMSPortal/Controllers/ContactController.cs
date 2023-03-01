using Microsoft.AspNetCore.Mvc;
using SMSData.DB;
using SMSData.Models.Contact;
using SMSData.Models.Groups;
using SMSData.Repository.Auth;
using SMSData.Repository.Contact;
using System.Data;
using Utility;

namespace SMSPortal.Controllers
{
    public class ContactController : Controller
    {
        private readonly AuthenticationRepository _authenticationRepo;
        private readonly ContactRepository _contactRepo;

        public ContactController(AuthenticationRepository authenticationRepo, ContactRepository contactRepo)
        {
            _authenticationRepo = authenticationRepo;
            _contactRepo = contactRepo;
        }

        public IActionResult MyContacts()
        {
            return View();
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

        [HttpPost]
        public async Task<IActionResult> ImportContact(IFormFile ContactFile)
        {

            if (ModelState.IsValid)
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
                DataSet contacts = ExcelToDatatable.BeforeAllTests(fileNameWithPath);
                if (contacts != null && contacts.Tables.Count > 0)
                {
                    return Ok(contacts.Tables[0]);
                }
                return Ok(null);


            }
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }
    }
}
