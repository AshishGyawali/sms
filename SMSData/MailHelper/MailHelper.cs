using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;
using SMSData.Interface;
using SMSData.Models.Mail;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SMSData.MailHelper
{
    public class MailHelper : IMailHelper
    {
        private readonly MailSettings _mailSettings;
        public MailHelper(IOptions<MailSettings> mailSettings)
        {
            _mailSettings = mailSettings.Value;
        }
        //public MailHelper(MailSettings mailSettings)
        //{
        //    _mailSettings = mailSettings;
        //}
        public async Task SendEmailAsync(Mail mail)
        {
            var email = new MimeMessage();
            email.Sender = MailboxAddress.Parse(_mailSettings.Mail);
            email.To.Add(MailboxAddress.Parse(mail.ToEmail));
            email.Subject = mail.Subject;
            var builder = new BodyBuilder();
            if (mail.Attachments != null)
            {
                byte[] fileBytes;
                foreach (var file in mail.Attachments)
                {
                    if (file.Length > 0)
                    {
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            fileBytes = ms.ToArray();
                        }
                        builder.Attachments.Add(file.FileName, fileBytes, ContentType.Parse(file.ContentType));
                    }
                }
            }
            builder.HtmlBody = mail.Body;
            email.Body = builder.ToMessageBody();
            using var smtp = new SmtpClient();
            smtp.Connect(_mailSettings.Host, _mailSettings.Port, SecureSocketOptions.StartTls);
            smtp.AuthenticationMechanisms.Remove("XOAUTH2");
            smtp.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            await smtp.SendAsync(email);
            smtp.Disconnect(true);
            //client.Connect(_mailSettings.Host, _mailSettings.Port, (SecureSocketOptions) _mailSettings.SecureSocketOption);
            //client.AuthenticationMechanisms.Remove("XOAUTH2");
            //client.Authenticate(_mailSettings.Mail, _mailSettings.Password);
            //client.Send(email);

        }
    }
}
