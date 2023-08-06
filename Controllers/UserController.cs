using Microsoft.AspNetCore.Mvc;
using ang_app.UserRegisterModels;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using ang_app.Models.UserLoginModel;
using ang_app.Models.UserChangeDataModel;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace ang_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;

        private readonly UserService _userService;

        public UserController(ILogger<UserController> logger, UserService userService)
        {
            _logger = logger;
            _userService = userService;
        }

        [HttpPost]
        public IActionResult RegisterUser(UserRegisterModel user)
        {
            var isRegistered = _userService.RegistUser(user);
            
            _logger.LogInformation("Пользователь добавился: {0}", isRegistered);

            string? token = null;

            if(!isRegistered)
                return BadRequest(
                    new {
                        IsError = true,
                        Message = "Такой пользователь уже есть!",
                        Token = token
                    }
                );
            
            token = Token(user.Login, user.Email);

            var res = new {
                IsError = false,
                Message = "Вы зарегестрировались!",
                Token = token
            };

            return Ok(res);
        }

        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        [HttpPut]
        public IActionResult ChangeUserData([FromBody] UserChangeDataModel userChangeDataModel)
        {
            var login = HttpContext?.User?.Identity?.Name ?? throw new NullReferenceException("Name of Identity null inner HttpContext");

            var newUser = _userService.ChangeUser(login, userChangeDataModel);

            string? token = null;

            if(newUser is null)
                return BadRequest(new {
                    IsError = true,
                    Message = "Неверный пароль или переданные данные не отличаются от текущих!",
                    Token = token,
                    NewUser = newUser
                });

            token = Token(newUser.Login, newUser.Email);

            return Ok(
                new {
                    IsError = false,
                    Message = "Данные изменены!",
                    Token = token,
                    NewUser = newUser
                }
            );
        }

        [HttpPost("login")]
        public IActionResult LoginUser(UserLoginModel userLogimModel)
        {
            var user = _userService.LoginUser(userLogimModel);
            
            _logger.LogInformation("Пользователь авторизовался: {0}", user is not null);

            string? token = null;

            if(user is null)
            {
                return BadRequest(
                    new {
                        IsError = true,
                        Message = "Пользователь не существует!",
                        Token = token,
                        User = user
                    }
                );
            }

            token = Token(user.Login, user.Email);
            
            var res = new {
                IsError = false,
                Message = "Вы авторизовались!",
                Token = token,
                User = user
            };
            
            return Ok(res);
        }

        [HttpGet("validateToken")]
        public IActionResult CheckToken(string token)
        {
            SecurityToken validatedToken;
            var tokenHandler = new JwtSecurityTokenHandler();
            try{
                tokenHandler.ValidateToken(token, AuthOptions.TokenValidationParameters, out validatedToken);
                return Ok();
            }   
            catch{
                return BadRequest();
            }
            
            
        }


        public string Token(string login, string email)
        {
            var claims = GetIdentity(login, email);
            
 
            var now = DateTime.UtcNow;
            
            var jwt = new JwtSecurityToken(
                    issuer: AuthOptions.ISSUER,
                    audience: AuthOptions.AUDIENCE,
                    notBefore: now,
                    claims: claims,
                    expires: now.Add(TimeSpan.FromMinutes(AuthOptions.LIFETIME)),
                    signingCredentials: new SigningCredentials(AuthOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));
            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);
 
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
    
    
        
    }
}
