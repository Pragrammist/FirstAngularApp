using Microsoft.IdentityModel.Tokens;
using System.Text;

class BearerRefreshTokenOptions{
    public const string ISSUER = "MyAuthServer"; // издатель токена
    public const string AUDIENCE = "MyAuthClient"; // потребитель токена
    const string KEY = "K8aJI0Xvbgb61eC7xBBw0/ysKHczbWnXMPKNzorE9b3NdEY8Ta7nOZQrIue4Kj+m";   // ключ для шифрации
    public const int LIFETIME = 2; // время жизни токена - дни
    public static SymmetricSecurityKey GetSymmetricSecurityKey()
    {
        return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(KEY));
    }
    public static TokenValidationParameters TokenValidationParameters => new()
    {
        // укзывает, будет ли валидироваться издатель при валидации токена
        ValidateIssuer = true,
        // строка, представляющая издателя
        ValidIssuer = ISSUER,
        
        // будет ли валидироваться потребитель токена
        ValidateAudience = true,
        // установка потребителя токена
        ValidAudience = AUDIENCE,
        // будет ли валидироваться время существования
        ValidateLifetime = true,

        ClockSkew = TimeSpan.Zero,
        // установка ключа безопасности
        IssuerSigningKey = GetSymmetricSecurityKey(),
        // валидация ключа безопасности
        ValidateIssuerSigningKey = true,
    };
}