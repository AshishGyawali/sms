using Microsoft.AspNetCore.Mvc;

namespace SMSPortal.Controllers
{
    public class SMSController : Controller
    {
        public IActionResult ComposeSMS()
        {
            return View();
        }

        public IActionResult SMSTemplate()
        {
            return View();
        }
    }
}
