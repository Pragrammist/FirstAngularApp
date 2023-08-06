using ang_app.UserRegisterModels;
using ang_app.Models;
using Mapster;
using ang_app.Models.UserChangeDataModel;
using ang_app.Models.UserLoginModel;

namespace ang_app
{
    public class UserService
    {
        // чтобы не плодить 100500 методов для чтения, которые делаются при работе с бд,
        // я просто дам копию списка пользователей
        
        //вместо бд
        List<UserModel> users = new List<UserModel>();
        //логика регистрации пользователя
        public bool RegistUser(UserRegisterModel userToRegist)
        {
            
            var user = userToRegist.Adapt<UserModel>();
            
            if(userToRegist.Password != userToRegist.Password2)
                return false;

            var isExist = users.Any(u => u.Login == userToRegist.Login && u.Email == userToRegist.Email);

            if(isExist)
                return false;
               
            users.Add(user);

            return true;
        }

        //даныне метод хот и называется LoginUser
        //но здеь лишь проверка на индетичного пользователя
        
        public UserModel? LoginUser(UserLoginModel userLoginModel)
        {
            return users.FirstOrDefault(
                u => (
                    u.Login == userLoginModel.LoginOrEmail || u.Email == userLoginModel.LoginOrEmail) && 
                    u.Password == userLoginModel.Password
                );
        }

        //елси не получилось изменит данные то возвращается null
        public UserModel? ChangeUser(string loginOrEmail, UserChangeDataModel userChangeData)
        {
            //если пользователь с входящим логином и введеным пользователем паролем существует
            var user = users.FirstOrDefault(u => (u.Email == loginOrEmail || u.Login == loginOrEmail) && u.Password == userChangeData.CurrentPassword);

            
            
            if (user is null)
                return null;

            
            //создает новый экземпляр пользователя
            //если поля с новыми данными не null
            //то тогда они присваиваются новой моделе
            //если новые поля null то используются старые данные
            var newUser = new UserModel
            (
                Login: string.IsNullOrEmpty(userChangeData.NewLogin) ? user.Login : userChangeData.NewLogin,
                Email: string.IsNullOrEmpty(userChangeData.NewEmail) ? user.Email : userChangeData.NewEmail,
                Password: string.IsNullOrEmpty(userChangeData.NewPassword) ? user.Password : userChangeData.NewPassword
            );

            //если ничего не изменилсь то 
            //возвращаем null
            //так как null - значит ничего не прроизошло
            if(newUser == user)
                return null;
            
            //удалеям строго пользователя
            users.Remove(user);
            //добавляем нового пользователя
            users.Add(newUser);
            //возвращаем данные нового пользователя
            return newUser;
        }
        //поиск по логику и почте
        public UserModel FindUser(string login, string email) => users.First(x => x.Login == login && x.Email == email);
    }
}