//модель которая приоходит с сервера
export interface UserRegisterResponseModel {
    isError: boolean;
    message: string;
    token: string | undefined;
    refreshToken:string | undefined

}
