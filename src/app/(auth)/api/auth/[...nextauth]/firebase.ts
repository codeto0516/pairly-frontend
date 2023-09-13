import type { NextAuthOptions, Session, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
    interface Session {
        token: {} | null;
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            credentials: {},
            authorize: async ({ idToken }: any, req): Promise<any | null> => {
                return { idToken };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt: async ({ token, user }: { token: JWT; user: User }) => {
            return { ...token, ...user };
        },
        // sessionにJWTトークンからのユーザ情報を格納
        session: async ({ session, token }: { session: Session; token: JWT }) => {
            session.token = token.idToken ?? null;
            return session;
        },
    },
};
