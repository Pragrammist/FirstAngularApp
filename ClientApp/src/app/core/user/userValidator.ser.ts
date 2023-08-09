
export class UserValidatorService{
    private loginRegularExpr = new RegExp("^[a-zA-Z0-9_-]+$");

    private emailRegularExpr = new RegExp("^[a-zA-Z0-9_-.]+@[a-zA-Z0-9_-.]+$");

    private passwordRegularExprs = [new RegExp("[A-Z]{1,}"), new RegExp("\d{1,}"), new RegExp(".{7,}")];

    ValidateLogin(login : string | undefined)
    {
        if(login === undefined)
            return false;


        return this.loginRegularExpr.test(login);
    }

    ValidateEmail(email : string | undefined)
    {
        if(email === undefined)
            return false;

        return this.emailRegularExpr.test(email);
    }

    ValidatePassword(password : string | undefined) : boolean
    {
        if(password === undefined)
            return false;

        let counter = 0;
        this.passwordRegularExprs.forEach((reg) => {
            if(reg.test(password))
            {
                counter++;
            }
        });
        return counter === 3;
    }
}
// пытался здесь проверку по регулярным выражениям
// но они мне только ломали код
// поэтому они включены в проект
// и никак не используются
