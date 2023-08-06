using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ang_app.UserRegisterModels
{
    //модель хранит данные которые пришли с фронта
    public record UserRegisterModel(string Login, string Email, string Password, string Password2);
    
}
