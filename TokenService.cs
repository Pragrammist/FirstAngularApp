using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace ang_app
{
    public class TokenService
    {
        readonly UserService _userService;
        //private readonly List<SecurityToken> _refreshTokens = new();

        private readonly Dictionary<string, string> _refreshTokens = new();
        public TokenService(UserService userService)
        {
            _userService = userService;
        }
        public string AccessToken(string login, string email)
        {
            var claims = GetIdentity(login, email);
            
 
            var now = DateTime.UtcNow;
            
            var jwt = new JwtSecurityToken(
                    issuer: BearerAccessTokenOptions.ISSUER,
                    audience: BearerAccessTokenOptions.AUDIENCE,
                    notBefore: now,
                    claims: claims,
                    expires: now.Add(TimeSpan.FromSeconds(BearerAccessTokenOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(BearerAccessTokenOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
 
            return encodedJwt;
        }
 

        public string RefreshToken(string login, string email){
            
            
            var claims = GetIdentity(login, email);
            
            var now = DateTime.UtcNow;
            
            var jwt = new JwtSecurityToken(
                    issuer: BearerRefreshTokenOptions.ISSUER,
                    audience: BearerRefreshTokenOptions.AUDIENCE,
                    notBefore: now,
                    claims: claims,
                    expires: now.Add(TimeSpan.FromDays(BearerRefreshTokenOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(BearerRefreshTokenOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

            _refreshTokens[login] = encodedJwt;

            return encodedJwt;
        }
        private List<Claim> GetIdentity(string login, string email)
        {
            var user = _userService.FindUser(login, email);


            var claims = new List<Claim>
            {
                new Claim(ClaimsIdentity.DefaultNameClaimType, user.Login),
                //роль нужна для галочки,, чтобы просто была
                new Claim(ClaimsIdentity.DefaultRoleClaimType, "user"),
                new Claim("email", email)
            };

            
            return claims;
 
        }
    
        public string? UpdateRefreshToken(string login, string email, string oldToken)
        {
            if(!_refreshTokens.ContainsKey(login))
                return null;

            var currentToken = _refreshTokens[login];

            if(currentToken != oldToken)
                return null;

            _refreshTokens.Remove(login);

            return RefreshToken(login, email);
        }
        
    }
}