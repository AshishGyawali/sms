using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;

namespace SMSData.Models.Auth
{
    public class ForgotPasswordViewModel
    {
        public string Email { get; set; }

    }
    public class ResetPasswordViewModel
    {
        [Required]
        public string Password { get; set; }

        [Required]
        [Display(Name = "Confirm Password")]
        [NotMapped]
        public string ConfirmPassword { get; set; }
        public string Token { get; set; }
    }
}
