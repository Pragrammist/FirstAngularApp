using ang_app;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddCors();
builder.Services.AddControllers();

builder.Services.AddAuthorization();






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


builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<TokenService>();
var app = builder.Build();

// Configure the HTTP request pipeline.
// if (!app.Environment.IsDevelopment())
// {
//     // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
//     //app.UseHsts();
// }
//app.UseHttpLogging(); 

//app.UseStaticFiles();
app.UseCors(builder => builder.WithOrigins("https://localhost:44473").AllowAnyMethod().AllowAnyHeader().AllowCredentials());
app.UseRouting();

//app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
//Access-Control-Allow-Origin
//WithOrigins("https://localhost:44473").AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithExposedHeaders()



app.MapControllers();

//app.MapFallbackToFile("index.html");

app.Run();
