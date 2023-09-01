import type { NextAuthOptions, Session, User } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";

/////////////////////////////////////////////////////////////////
// 型拡張
/////////////////////////////////////////////////////////////////
// declare module "next-auth/jwt" {
//     interface JWT {
//         // Firebaseの認証情報
//         user_id: string;
//         emailVerified: boolean;
//         name: string | null;
//         picture: string | undefined | null;
//         token: string;
//     }
// }

// declare module "next-auth" {
//     interface Session {
//         user: {
//             // Firebaseの認証情報
//             id: string;
//             emailVerified?: boolean;
//             name: string | null;
//             picture: string | undefined | null;
//             token: string;
//         } & DefaultSession["user"];
//     }
// }

/////////////////////////////////////////////////////////////////
// 設定
/////////////////////////////////////////////////////////////////
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

                        // 認証エラー
                        if (res.statusText === "Unauthorized") throw new Error("Unauthorized");

                        const decoded = await res.json();

                        return idToken
                    } catch (err) {
                        return err;
                    }
                }
                return null;
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    // callbacks: {
    //     jwt: async ({ token, user }: { token: JWT; user: User }) => {
    //         console.log(user);
            
    //         return { ...token, ...user };
    //     },
    //     // sessionにJWTトークンからのユーザ情報を格納
    //     session: async ({ session, token }: { session: Session; token: JWT; user: User }) => {
    //         // 各データをセッションに追加
    //         // session.user.id = token.user_id;
    //         // session.user.name = token.name;
    //         // session.user.email = token.email;
    //         // session.user.picture = token.picture;
    //         // session.user.token = token.token;
    //         // console.log(session, token);
            
    //         return session;
    //         // useSessionで参照できるdata: sessionに格納される
    //     },
    // },
};
