import { useApi } from "./useApi";

interface User {
    allow_password_change: true;
    email: string;
    id: number;
    image: string | null;
    name: string;
    nickname: string | null;
    provider: string;
    uid: string;
}

interface SignIn {
    email: string;
    password: string;
}

interface Tokens {
    uid: string;
    accessToken: string;
    client: string;
}

export const useSessions = () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    const convertUrl = (path: string) => new URL(path, baseUrl).toString();

    const api = useApi();

    const signIn = async ({ email, password }: SignIn): Promise<any> => {
        const response: any = await api.post({
            url: convertUrl("auth/sign_in"),
            headers: {
                email: email,
                password: password,
            },
        });
        if (response) {
            switch (response.status) {
                case 200:
                    const tokens: Tokens = {
                        uid: response.headers["uid"],
                        accessToken: response.headers["access-token"],
                        client: response.headers["client"],
                    };
                    return { userData: response.data.data, tokens: tokens };
                default:
                    return null;
            }
        }
        return null
    };

    const signOut = async ({ uid, accessToken, client }: Tokens): Promise<any> => {
        const response: any = await api.del({
            url: convertUrl("/auth/sign_out"),
            headers: {
                uid: uid,
                "access-token": accessToken,
                client: client,
            },
        });
        // console.log(response.status, response.statusText);

        switch (response.status) {
            case 200:
                return true;
            default:
                return false;
        }
    };

    return { signIn, signOut };
};
