//модель которая отправляется на сервер
export class UserRegister{
    constructor(
        public login?: string, 
        public email? : string, 
        public password? : string, 
        public password2? : string) {}
}