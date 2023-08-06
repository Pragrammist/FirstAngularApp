//данные с сервера
export interface AuthorizeUserResponse {
    isError: boolean;
    message: string;
    token: string | undefined;
    user: {
        login: string;
        email: string;

    } | undefined;
}
