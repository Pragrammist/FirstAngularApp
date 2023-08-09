//данные с сервера
export interface AuthorizeUserResponseModel {
    isError: boolean;
    message: string;
    token: string | undefined;
    user: {
        login: string;
        email: string;

    } | undefined;
}
