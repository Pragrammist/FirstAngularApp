using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ang_app.Models
{
    //модель нужна для хранения данных и возврата данных
    public record UserModel(string Login, string Email, string Password);
}

//вообще по хорошем эти модели должны быть разные
//но здесь нет смысла так делать