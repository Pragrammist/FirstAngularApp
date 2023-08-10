using Microsoft.AspNetCore.Mvc;
using ang_app.UserRegisterModels;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using ang_app.Models.UserLoginModel;
using ang_app.Models.UserChangeDataModel;
using Microsoft.AspNetCore.Authorization;

namespace ang_app.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController : Controller
    {
        private readonly ILogger<UserController> _logger;

        private readonly UserService _userService;
        readonly TokenService _tokenService;
        public UserController(ILogger<UserController> logger, UserService userService, TokenService tokenService)
        {
            _logger = logger;
            _userService = userService;
            _tokenService = tokenService;
        }

        [HttpPost]
        public IActionResult RegisterUser(UserRegisterModel user)
        {
            var isRegistered = _userService.RegistUser(user);
            
            _logger.LogInformation("Пользователь добавился: {0}", isRegistered);

            string? token = null;
            string? refreshToken = null;
            if(!isRegistered)
                return BadRequest(
                    new {
                        IsError = true,
                        Message = "Такой пользователь уже есть!",
                        Token = token,
                        RefreshToken = refreshToken,
                    }
                );
            
            token = _tokenService.AccessToken(user.Login, user.Email);
            refreshToken = _tokenService.RefreshToken(user.Login, user.Email);
            var res = new {
                IsError = false,
                Message = "Вы зарегестрировались!",
                Token = token,
                RefreshToken = refreshToken,
            };

            return Ok(res);
        }

        [Authorize]
        [HttpPut]
        public IActionResult ChangeUserData([FromBody] UserChangeDataModel userChangeDataModel)
        {
            var login = HttpContext?.User?.Identity?.Name ?? throw new NullReferenceException("Name of Identity null inner HttpContext");

            var newUser = _userService.ChangeUser(login, userChangeDataModel);

            string? token = null;
            string? refreshToken = null;
            if(newUser is null)
                return BadRequest(new {
                    IsError = true,
                    Message = "Неверный пароль или переданные данные не отличаются от текущих!",
                    Token = token,
                    NewUser = newUser,
                    RefreshToken = refreshToken,
                });

            token = _tokenService.AccessToken(newUser.Login, newUser.Email);
            refreshToken = _tokenService.RefreshToken(login, newUser.Email);
            return Ok(
                new {
                    IsError = false,
                    Message = "Данные изменены!",
                    Token = token,
                    NewUser = newUser,
                    RefreshToken = refreshToken,
                }
            );
        }

        [HttpPost("login")]
        public IActionResult LoginUser(UserLoginModel userLoginModel)
        {
            var user = _userService.LoginUser(userLoginModel);
            
            _logger.LogInformation("Пользователь авторизовался: {0}", user is not null);

            string? token = null;
            string? refreshToken = null;
            if(user is null)
            {
                return BadRequest(
                    new {
                        IsError = true,
                        Message = "Пользователь не существует!",
                        Token = token,
                        User = user,
                        RefreshToken = refreshToken,
                    }
                );
            }

            token = _tokenService.AccessToken(user.Login, user.Email);
            refreshToken = _tokenService.RefreshToken(token, user.Email);
            var res = new {
                IsError = false,
                Message = "Вы авторизовались!",
                Token = token,
                User = user,
                RefreshToken = refreshToken,
            };
            
            return Ok(res);
        }

        [HttpGet("validateToken")]
        public IActionResult CheckToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            try
            {
                tokenHandler.ValidateToken(token, BearerAccessTokenOptions.TokenValidationParameters, out SecurityToken validatedToken);
                return Ok();
            }   
            catch{
                return BadRequest();
            }
            
            
        }


        [HttpPost("refreshToken")]
        [Authorize(AuthenticationSchemes = "bearer_refresh_token")]
        /// <summary>
        /// 
        /// </summary>
        /// <param name="authorization">// Bearer {token}</param>
        /// <returns></returns>
        public IActionResult GetRefreshToken([FromHeader]string authorization)
        {
            var token = authorization.Split().ElementAt(1);
            var login = User?.Identity?.Name ?? throw new NullReferenceException("Identity login is null");
            var email = User?.Claims?.FirstOrDefault(c => c.Type.Contains("email"))?.Value ?? throw new NullReferenceException("Identity email is null");;

            var newRefreshToken = _tokenService.UpdateRefreshToken(login, email, token);
            
            var accessToken = _tokenService.AccessToken(login, email);
            if(newRefreshToken == null)
                return Unauthorized();
            
            return Ok(new {
                refreshToken = newRefreshToken,
                token = accessToken
            });
        }
    }
}
