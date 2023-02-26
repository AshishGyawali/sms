using Microsoft.AspNetCore.Mvc;
using SMSData.DB;
using SMSData.Models.Contact;
using SMSData.Models.Groups;
using SMSData.Repository.Auth;
using SMSData.Repository.Contact;
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
    }
}
