using SMSData.Models.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.Interface
{
    public interface IMailHelper
    {
        public Task SendEmailAsync(Mail Mail);
    }
}
