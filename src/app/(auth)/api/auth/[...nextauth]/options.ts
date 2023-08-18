import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const options: NextAuthOptions = {
    debug: true,
    session: { strategy: "jwt" },
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Sign in",
            credentials: {
                email: {
                    label: "Email",
                    type: "email",
                    placeholder: "example@example.com",
                },
                password: { label: "Password", type: "password" },
            },
            // メルアド認証処理
            async authorize(credentials) {
                const users = [
                    { id: "1", email: "codetaisei@gmail.com", password: "Ogawa516", name: "たいせい" },
                ];

                const user = users.find((user) => user.email === credentials?.email);

                if (user && user?.password === credentials?.password) {
                    return { id: user.id, name: user.name, email: user.email, role: "admin"};
                } else {
                    return null;
                }
            },
        }),
    ],
    pages: {
        signIn: "/signin",
    },
    callbacks: {
        jwt: async ({ token, user, account, profile }) => {
            // 注意: トークンをログ出力してはダメです。
            // console.log("in jwt", { user, token, account, profile });

            if (user) {
                token.user = user;
                const u = user as any;
                token.role = u.role;
            }
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        session: ({ session, token }) => {
            // console.log("in session", { session, token });
            token.accessToken;
            return {
                ...session,
                user: {
                    ...session.user,
                    role: token.role,
                },
            };
        },
    },
};
