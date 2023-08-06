//модель которая приоходит с сервера
export interface UserRegisterResponse {
    isError: boolean;
    message: string;
    token: string | undefined;
}
