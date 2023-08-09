//данные которые приходят с сервера
export interface ChangeUserDataResponseModel {
    isError: boolean;
    message: string;
    token: string | undefined;
    newUser: {
        login: string;
        email: string;
    } | undefined;
}
