using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Mvc;
using SMSData.AuthHelper;
using SMSData.Models.Auth;
using SMSData.Repository.Auth;
using System.Security.Claims;
using UAParser;
using SMSData.MailHelper;
using MailKit;
using Org.BouncyCastle.Asn1.Ocsp;
using SMSData.Models.Mail;
using NuGet.Common;
using System.Reflection;
using SMSData.Interface;

namespace SMSPortal.Controllers
{
    public class AuthController : Controller
    {
        private readonly AuthenticationRepository _authenticationRepo;
        private readonly CryptoMD5 _cryptoMD5;
        private readonly IMailHelper _mailHelper;
        public AuthController(AuthenticationRepository authenticationRepo, CryptoMD5 cryptoMD5, IMailHelper mailHelper)
        {
            _authenticationRepo = authenticationRepo;
            _cryptoMD5 = cryptoMD5;
            _mailHelper = mailHelper;
        }

        public IActionResult Login()
        {
            return PartialView();
        }
        [HttpPost]
        public async Task<IActionResult> Login([Bind("UserName,Password,RememberMe")] LoginViewModel details)
        {
            if (ModelState.IsValid)
            {
                var user = await _authenticationRepo.GetCredentials(details);
                if (user != null && user.Password == _cryptoMD5.MD5Hash(details.Password + user.Salt))
                {
                    var claims = new List<Claim>
                        {
                            new Claim("UserId",user.Id.ToString()),
                            new Claim("FullName", user.FullName),
                            new Claim("UserName", user.UserName),
                            new Claim(ClaimTypes.Email, user.Email),
                            new Claim("ClientId", user.ClientId.ToString()),
                            new Claim("IsSystemUser", user.IsSystemUser.ToString())
                        };
                    var claimsIdentity = new ClaimsIdentity(
                        claims, CookieAuthenticationDefaults.AuthenticationScheme);

                    var authProperties = new AuthenticationProperties
                    {

                    };
                    await HttpContext.SignInAsync(
                        CookieAuthenticationDefaults.AuthenticationScheme,
                        new ClaimsPrincipal(claimsIdentity),
                        authProperties);
                    TempData["success"] = "Successfully logged in";
                    return Redirect("/Home/Index");
                }
            }
            TempData["error"] = "Username or password incorrect";
            return PartialView(details);
        }

        public async Task<IActionResult> Logout()
        {
            await HttpContext.SignOutAsync();
            return RedirectToAction("Login");
        }

        public IActionResult ForgotPassword()
        {
            return PartialView(new ForgotPasswordViewModel());
        }

        [HttpPost]
        public async Task<IActionResult> ForgotPassword(ForgotPasswordViewModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Email))
            {
                ModelState.AddModelError("Email", "Email is required.");
                return PartialView(model);
            }
            var user = await _authenticationRepo.GetUserByEmail(model.Email);
            if (user != null)
            {
                var remoteIpAddress = Request.HttpContext.Connection.RemoteIpAddress?.ToString();
                var userAgent = HttpContext.Request.Headers["User-Agent"];
                var uaParser = Parser.GetDefault();
                ClientInfo c = uaParser.Parse(userAgent);
                var log = new PasswordResetLog()
                {
                    CreatedDate = DateTime.Now,
                    Device = $"{c.Device.Brand},{c.Device.Model}, {c.OS}, {c.UA}",
                    ExpiryDate = DateTime.Now.AddDays(1),
                    IP = remoteIpAddress,
                    IsUsed = false,
                    Location = $"27.34.22.43".getLocationFromIp(),
                    Token = Guid.NewGuid().ToString(),
                    UsedDate = null,
                    UserId = user.Id
                };
                var result = await _authenticationRepo.SavePasswordLog(log);
                string domainName = $"{HttpContext.Request.Scheme}://{HttpContext.Request.Host.Value}"; //HttpContext.Request.Scheme + HttpContext.Request.Host.Value;
                string path = domainName + "/resetpassword/" + log.Token;
                 var mail = new Mail()
                {
                    ToEmail = user.Email,
                    Subject = "Reset your password.",
                    Body = "This is test mail. Please click the link to reset your password. " + path
                };
                try
                {
                    await _mailHelper.SendEmailAsync(mail);
                }
                catch (Exception ex)
                {
                    throw ex;
                }
            }
            TempData["success"] = "Please check your email for further process.";
            return PartialView(model);
        }
        public async Task<IActionResult> ResetPassword(string id)
        {
            if (string.IsNullOrWhiteSpace(id) || !id.IsGuid())
            {
               
                return PartialView("_InvalidRequest");
            }
            var resetPasswordLog = await _authenticationRepo.GetPasswordLog(id);
            if(resetPasswordLog== null || resetPasswordLog.IsUsed)
            {
                return PartialView("_InvalidRequest");
            }
            var model = new ResetPasswordViewModel()
            {
                Token = id
            };
            return PartialView(model);
        }

        [HttpPost]
        public async Task<IActionResult> ResetPassword(ResetPasswordViewModel model)
        {
            if (ModelState.IsValid)
            {
                if (string.IsNullOrWhiteSpace(model.Token) || !model.Token.IsGuid())
                {

                    return PartialView("_InvalidRequest");
                }
                var resetPasswordLog = await _authenticationRepo.GetPasswordLog(model.Token);
                if (resetPasswordLog == null || resetPasswordLog.IsUsed)
                {
                    return PartialView("_InvalidRequest");
                }
                var salt = RandomStringGenerator.Generate(6);
                model.Password = _cryptoMD5.MD5Hash(model.Password + salt);
                var response = await _authenticationRepo.UpdatePasswordAfterReset(model, salt);
                if(!response.HasError)
                {
                    TempData["success"] = "Password changed successfully please login to continue.";
                    return RedirectToAction("Login");
                }
                TempData["error"] = "Something went wrong.";
                return PartialView(model);
            }
            return PartialView();
        }
    }
}
