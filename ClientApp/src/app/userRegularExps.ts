
// пытался здесь проверку по регулярным выражениям
// но они мне только ломали код
// поэтому они включены в проект
// и никак не используются
let loginRegularExpr = new RegExp("^[a-zA-Z0-9_-]+$");

let emailRegularExpr = new RegExp("^[a-zA-Z0-9_-.]+@[a-zA-Z0-9_-.]+$");

let passwordRegularExprs = [new RegExp("[A-Z]{1,}"), new RegExp("\d{1,}"), new RegExp(".{7,}")];

export function ValidateLogin(login : string | undefined)
{
    if(login === undefined)
        return false;


    return loginRegularExpr.test(login);
}

export function ValidateEmail(email : string | undefined)
{
    if(email === undefined)
        return false;

    return emailRegularExpr.test(email);
}

export function ValidatePassword(password : string | undefined) : boolean
{
    if(password === undefined)
        return false;

    let counter = 0;
    passwordRegularExprs.forEach((reg) => {
        if(reg.test(password))
        {
            counter++;
        }
    });
    return counter === 3;
}