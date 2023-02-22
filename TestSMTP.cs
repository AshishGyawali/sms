using System;

public class NotificationService
{
    private readonly AppConfig _config;
    private readonly IHttpContextAccessor httpContext;

    public NotificationService(AppConfig config, IHttpContextAccessor httpContext)
    {
        _config = config;
        this.httpContext = httpContext;
    }

    public AppConfig Config => _config;

    public string SendEmail(string to, string subject, string body, bool async = true, string displayName = null)
    {
        var smtp = new SystemSmtp().GetSmtp;
        try
        {
            var fromAddress = new System.Net.Mail.MailAddress(smtp.SMTPSender, displayName ?? smtp.SMTPSenderDisplayName);

            string appDomain = "https://" + httpContext.HttpContext.Request.Host.Value;

            var headerHtml = $"<div style='vertical-align:top;text-align:center'><a href='{appDomain}' target='_blank'></a></div>";
            var hr = "<hr style='margin-top:5px;margin-bottom:24px;border:0;border-bottom:1px solid #c1c7d0'>";
            var ignoreText = "<p style='font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Oxygen,Ubuntu,Fira Sans,Droid Sans,Helvetica Neue,sans-serif;font-size:14px;font-weight:400;color:#091e42;line-height:20px;margin-top:12px'><span style='color:#5e6c84'>If you didn't request this, you can safely ignore this email.</span></p>";
            var footerHr = "<hr style='margin-top:24px;border:0;border-bottom:1px solid #c1c7d0'>";
            var footerImage = $"<div style='vertical-align:top;text-align:center'><a href='{appDomain}' target='_blank'></a></div>"; ;
            var _body = "<div style='background-color:#ffffff;'>";
            _body += "<div style='max-width:480px;margin:auto;padding:20px;'>";
            _body += $"{headerHtml} {hr} {body} {ignoreText} {footerHr} {footerImage}";
            _body += "</div>";
            _body += "</div>";

            var builder = new BodyBuilder
            {
                HtmlBody = _body
            };

            var message = new MimeMessage
            {
                Body = builder.ToMessageBody()
            };

            message.Subject = subject;
            foreach (var e in to.Split(','))
            {
                try
                {
                    var email = new System.Net.Mail.MailAddress(e.Trim());
                    message.To.Add(new MailboxAddress(email.DisplayName, email.Address));
                }
                catch { }
            }

            if (async)
            {
                Task.Factory.StartNew(() =>
                {
                    using var client = new MailKit.Net.Smtp.SmtpClient();
                    message.From.Add(new MailboxAddress(displayName ?? smtp.SMTPSenderDisplayName, smtp.SMTPSender));
                    client.Connect(smtp.SMTP, smtp.SMTPPort, (SecureSocketOptions)smtp.SecureSocketOption);
                    client.AuthenticationMechanisms.Remove("XOAUTH2");
                    client.Authenticate(smtp.SMTPSender, smtp.SMTPPassword);
                    client.Send(message);
                    return "Success";
                });
            }
            else
            {
                using var client = new MailKit.Net.Smtp.SmtpClient();
                message.From.Add(new MailboxAddress(displayName ?? smtp.SMTPSenderDisplayName, smtp.SMTPSender));
                client.Connect(smtp.SMTP, smtp.SMTPPort, (SecureSocketOptions)smtp.SecureSocketOption);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(smtp.SMTPSender, smtp.SMTPPassword);
                client.Send(message);
                client.Disconnect(true);
                client.Dispose();
                return "Success";
            }
        }
        catch (Exception ex)
        {
            return "Error!!! " + ex.Message;
        }
        return "Success";
    }

    public static string SendPlainEmail(string to, string subject, string body, string displayName = null)
    {
        var smtp = new SystemSmtp().GetSmtp;
        try
        {
            var fromAddress = new System.Net.Mail.MailAddress(smtp.SMTPSender, displayName ?? smtp.SMTPSenderDisplayName);
            var builder = new BodyBuilder
            {
                HtmlBody = body
            };

            var message = new MimeMessage
            {
                Body = builder.ToMessageBody()
            };

            message.Subject = subject;
            foreach (var e in to.Split(','))
            {
                try
                {
                    var email = new System.Net.Mail.MailAddress(e.Trim());
                    message.To.Add(new MailboxAddress(email.DisplayName, email.Address));
                }
                catch { }
            }

            Task.Factory.StartNew(() =>
            {
                using var client = new MailKit.Net.Smtp.SmtpClient();
                message.From.Add(new MailboxAddress(displayName ?? smtp.SMTPSenderDisplayName, smtp.SMTPSender));
                client.Connect(smtp.SMTP, smtp.SMTPPort, (SecureSocketOptions)smtp.SecureSocketOption);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(smtp.SMTPSender, smtp.SMTPPassword);
                client.Send(message);
                return "Success";
            });
        }
        catch (Exception ex)
        {
            return "Error!!! " + ex.Message;
        }
        return "Success";
    }

    public static string GetEmailTemplate(string path, Dictionary<string, string> keyValuePairs)
    {
        if (!System.IO.File.Exists(path))
            return null;
        var html = System.IO.File.ReadAllText(path);
        foreach (var key in keyValuePairs)
        {
            html = html.Replace(key.Key, key.Value);
        }
        return html;
    }
}

public class SystemSmtp
{
    public string SMTP { get; set; }
    public string SMTPSender { get; set; }
    public string SMTPSenderDisplayName { get; set; }
    public int SMTPPort { get; set; }
    public string SMTPPassword { get; set; }
    public bool EnableSSL { get; set; }
    public int SecureSocketOption { get; set; } = 4;

    public SystemSmtp GetSmtp
    {
        get
        {
            var _config = DI.Instance.Resolve<AppConfig>();
            this.SMTP = _config.GetValue("SMTPSettings:SMTP");
            this.SMTPSender = _config.GetValue("SMTPSettings:Sender");
            this.SMTPSenderDisplayName = SessionData.FriendlyAppName ?? _config.GetValue("SMTPSettings:DisplayName");
            _ = int.TryParse(_config.GetValue("SMTPSettings:Port"), out int portNumber);
            this.SMTPPort = portNumber;
            _ = bool.TryParse(_config.GetValue("SMTPSettings:EnableSSL"), out bool enableSSL);
            this.EnableSSL = enableSSL;
            this.SMTPPassword = _config.GetValue("SMTPSettings:Password");
            return this;
        }
    }
}
