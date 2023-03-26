
using Microsoft.AspNetCore.Authentication.Cookies;
using Newtonsoft.Json;
using SMSData.AuthHelper;
using SMSData.Context;
using SMSData.DB;
using SMSData.Interface;
using SMSData.MailHelper;
using SMSData.Models.Mail;
using SMSData.Repository.Auth;
using SMSData.Repository.Contact;
using SMSData.Repository.Groups;
using SMSData.Repository.Sms;
using SMSData.Repository.Utility;
using System.Configuration;
using System.Text.Json;
using System.Text.Json.Serialization;
using Utility;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews()
    //.AddJsonOptions(options =>
    //{
    //    options.JsonSerializerOptions.PropertyNamingPolicy = null;
    //    options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    //});
    .AddNewtonsoftJson(x =>
    {
        x.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;
        x.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.DefaultContractResolver();
    });

builder.Services.AddTransient<Database>();
builder.Services.AddTransient<MailSettings>();
builder.Services.AddTransient<IMailHelper,MailHelper>();
builder.Services.AddSingleton<DapperContext>();
builder.Services.AddTransient<CryptoMD5, CryptoMD5>();
builder.Services.AddTransient<AuthenticationRepository, AuthenticationRepository>();
builder.Services.AddTransient<GroupsRepository, GroupsRepository>();
builder.Services.AddTransient<DataStoreRepository, DataStoreRepository>();
builder.Services.AddTransient<ContactRepository, ContactRepository>();
builder.Services.AddTransient<SmsRepository, SmsRepository>();
builder.Services.Configure<MailSettings>(builder.Configuration.GetSection("MailSettings"));
builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
        options.SlidingExpiration = true;
        options.LoginPath = "/auth/login";
        options.AccessDeniedPath = "/Forbidden/";
    });
//var emailConfig = builder.Configuration.GetSection("MailSettings").Get<MailSettings>();
//builder.Services.AddSingleton(emailConfig);
var app = builder.Build();

var ctx = app.Services.GetService<IHttpContextAccessor>();
SessionData.SetHttpContextAccessor(ctx);

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

var cookiePolicyOptions = new CookiePolicyOptions
{
    MinimumSameSitePolicy = SameSiteMode.Strict,
};
app.UseCookiePolicy(cookiePolicyOptions);
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

app.Run();
