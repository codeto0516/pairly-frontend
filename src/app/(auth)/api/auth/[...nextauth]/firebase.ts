import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

/////////////////////////////////////////////////////////////////
// 設定
/////////////////////////////////////////////////////////////////
export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {},
            authorize: async ({ idToken }: any, req): Promise<any | null> => {
                return idToken ? idToken : null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
};
