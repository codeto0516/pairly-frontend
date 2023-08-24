import type { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

// 型を拡張
declare module "next-auth/jwt" {
    interface JWT {
        // Firebaseの認証情報
        uid: string;
        emailVerified: boolean;
    }
}

declare module "next-auth" {
    interface Session {
        user: {
            // Firebaseの認証情報
            uid: string;
            emailVerified?: boolean;
            token: any;
        } & DefaultSession["user"];
    }
}

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
        CredentialsProvider({
            credentials: {},
            authorize: async ({ idToken }: any, req): Promise<any | null> => {
                if (idToken) {
                    try {
                        const res = await fetch("http://localhost:80/api/v1/users", {
                            // cache: "force-cache",
                            method: "GET",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${idToken}`,
                            },
                        });
                        const decoded = await res.json();
        
                        return { ...decoded, token: idToken };
                    } catch (err) {
                        console.error(err);
                    }
                }
                return null;
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
            session.user.emailVerified = token.emailVerified;
            session.user.uid = token.uid;
            session.user.token = token.token;
            return session;
        },
    },
};
