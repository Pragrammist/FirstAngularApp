using ang_app;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddAuthorization();


var userService = new UserService();

var tokenService = new TokenService(userService);





builder.Services
.AddAuthentication(x => {
    x.DefaultAuthenticateScheme = "bearer_access_token";
    x.DefaultChallengeScheme = "bearer_access_token";
    x.DefaultScheme = "bearer_access_token";
})
.AddJwtBearer("bearer_access_token",options =>
{
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = BearerAccessTokenOptions.TokenValidationParameters;
})
.AddJwtBearer("bearer_refresh_token", options =>
{
    //default validator. It is needed
    options.RequireHttpsMetadata = false;
    options.TokenValidationParameters = BearerRefreshTokenOptions.TokenValidationParameters;
});


//builder.Services.AddCors();
builder.Services.AddSingleton(userService);
builder.Services.AddSingleton(tokenService);
var app = builder.Build();

// Configure the HTTP request pipeline.
// if (!app.Environment.IsDevelopment())
// {
//     // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
//     //app.UseHsts();
// }
//app.UseHttpLogging(); 

//app.UseStaticFiles();

app.UseRouting();

//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.UseCors(builder => builder.WithOrigins("https://localhost:44473").AllowAnyHeader().AllowAnyMethod());


app.MapControllers();

//app.MapFallbackToFile("index.html");

app.Run();
