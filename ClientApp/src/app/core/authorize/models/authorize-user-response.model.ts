//данные с сервера
export interface AuthorizeUserResponseModel {
    isError: boolean;
    message: string;
    token: string | undefined;
    refreshToken : string | undefined
    user: {
        login: string;
        email: string;

    } | undefined;
}
