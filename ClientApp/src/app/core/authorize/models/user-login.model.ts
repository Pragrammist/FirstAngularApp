//модель которая отправляется на сервер
export interface UserLoginModel {
  loginOrEmail: string | undefined;
  password: string | undefined;
}
