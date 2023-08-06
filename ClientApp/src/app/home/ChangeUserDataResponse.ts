//данные которые приходят с сервера
export interface ChangeUserDataResponse {
    isError: boolean;
    message: string;
    token: string | undefined;
    newUser: {
        login: string;
        email: string;
    } | undefined;
}
