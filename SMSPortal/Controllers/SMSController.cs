using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using RestSharp.Authenticators;
using RestSharp;
using SMSData.Models.SMS;
using System;
using System.IO;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.Xml;
using System.Text;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Security.Cryptography.X509Certificates;
using SMSData.Repository.Groups;
using SMSData.Repository.Sms;
using SMSData.DB;
using SMSData.Models.Groups;
using Utility;

namespace SMSPortal.Controllers
{
    public class SMSController : Controller
    {
        private readonly SmsRepository _smsRepo;
        private const string URL = "https://sms.automationnp.com/apiv2";
        //private string urlParameters = "?api_key=123";

        public SMSController(SmsRepository smsRepo)
        {
            _smsRepo = smsRepo;
        }

        [HttpPost]
        public IActionResult GetBalance()
        {
            HttpWebRequest request = (HttpWebRequest)WebRequest.Create("https://sms.automationnp.com/apiv2/getbalance");
            request.ContentType = "application/json";
            request.Method = "POST";
            request.Headers.Add("Token", "42B7323B-6CE1-47DE-A1E5-E5A8D3B9F26E");
            var response = request.GetResponse();
            StreamReader reader = new StreamReader(response.GetResponseStream());
            string text = reader.ReadToEnd();
            SmsBalanceViewModel smsBalance = JsonConvert.DeserializeObject<SmsBalanceViewModel>(text);
            return Ok(smsBalance);
        }

        [HttpPost]
        public IActionResult SendSms(string MobileNumbers, string Body, DateTime? Scheduled)
        {
            var client = new RestClient("https://sms.automationnp.com/apiv2");
            client.AddDefaultHeader("Token", "42B7323B-6CE1-47DE-A1E5-E5A8D3B9F26E");
            var request = new RestRequest("send", Method.Post);
            request.RequestFormat = DataFormat.Json;
            request.AddBody(new
            {
                MobileNumbers = MobileNumbers,
                Body = Body,
                Scheduled = Scheduled
            });
            var res = client.Execute(request);

            return Ok();
        }

        public IActionResult ComposeSMS()
        {
            return View();
        }

        public IActionResult SMSTemplate()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> SaveTemplate(TemplateViewModel model)
        {
            if (ModelState.IsValid)
            {
                var response = await _smsRepo.SaveTemplate(model);
                return Ok(response);
            }
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }

        public async Task<IActionResult> getTemplateName()
        {
            var data = await _smsRepo.GetTemplateName();
            return Ok(data);
        }
        public async Task<IActionResult> getClientContactNum()
        {
            var data = await _smsRepo.GetClientContactNum();
            return Ok(data);
        }

        [HttpPost]
        public async Task<IActionResult> saveSmsLog(SmsDataViewModel model)
        {
            if (ModelState.IsValid)
            {
                var response = await _smsRepo.SaveSmsLog(model);
                return Ok(response);
            }
            return BadRequest(new DbResponse() { HasError = true, Message = ModelState.GetError() });
        }
    }
}
