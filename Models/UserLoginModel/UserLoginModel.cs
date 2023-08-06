using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ang_app.Models.UserLoginModel
{
    //модель хранит данные которые пришли с фронта
    public record UserLoginModel(string LoginOrEmail, string Password);
}