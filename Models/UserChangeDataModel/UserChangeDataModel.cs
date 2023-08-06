using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ang_app.Models.UserChangeDataModel
{
    //модель в которой прилетаю данные с фронта
    public record UserChangeDataModel(string CurrentPassword, string? NewPassword = null, string? NewLogin = null, string? NewEmail = null);
    
}