using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SMSData.Repository.Client.Company;
using SMSData.Repository.Sms;
using SMSPortal.Models;
using System.Diagnostics;

namespace SMSPortal.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly CompanyRepository _companyRepo;

        public HomeController(ILogger<HomeController> logger, CompanyRepository companyRepo)
        {
            _logger = logger;
            _companyRepo = companyRepo;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult CK()
        {
            return View();
        }

        public IActionResult Privacy()
        {
            return View();
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        public async Task<IActionResult> getClientCompanyDetails()
        {
            var data = await _companyRepo.GetClientCompanyDetails();
            return Ok(data);
        }
    }
}