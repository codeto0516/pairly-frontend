import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as signOutFireBase,
} from "firebase/auth";
import { signIn as signInByNextAuth, signOut as signOutByNextAuth } from "next-auth/react";
import { auth } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import { useState } from "react";
import { useApi } from "./api/v1/useApi";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const api = useApi();

    const enableInvitation = async (token: string, uid: string) => {
        const res = await api.post({
            url: "http://localhost/api/v1/invitations",
            data: {
                token: token,
                uid: uid,
            },
        });
    };

    //////////////////////////////////////////////////////////////////////
    // 新規登録（メールアドレス・パスワード）
    //////////////////////////////////////////////////////////////////////
    const signUp = async (email: string, password: string, token?: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            token && enableInvitation(token, userCredential.user.uid);

            const idToken = await userCredential.user.getIdToken();
            await signInByNextAuth("credentials", {
                idToken,
                callbackUrl: "/",
            });
        } catch (error: any) {
            switch (error.code) {
                case "auth/email-already-in-use":
                    throw new Error("このメールアドレスは既に使用されています。");
                case "auth/invalid-email":
                    throw new Error("無効なメールアドレスです。");
                case "auth/operation-not-allowed":
                    throw new Error("この操作は許可されていません。");
                case "auth/weak-password":
                    throw new Error("パスワードが弱すぎます。6文字以上入力してください。");
                default:
                    throw new Error("エラーが発生しました。もう一度お試しください。");
            }
        }
    };

    //////////////////////////////////////////////////////////////////////
    // ログイン（メールアドレス・パスワード）
    //////////////////////////////////////////////////////////////////////
    const signIn = async (email: string, password: string, token?: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            // const isNotVerified = !userCredential.user.emailVerified;
            // if (isNotVerified) {
            //     // await reSendVerifyMail(userCredencial.user);
            //     // await signOut();
            // }
            token && enableInvitation(token, userCredential.user.uid);

            const idToken = await userCredential.user.getIdToken();
            await signInByNextAuth("credentials", {
                idToken,
                callbackUrl: "/",
            });
        } catch (error: any) {
            console.log(error.code);

            switch (error.code) {
                case "auth/user-not-found":
                    throw new Error("ユーザーが存在しません。");
                case "auth/invalid-email":
                    throw new Error("無効なメールアドレスです。");
                case "auth/wrong-password":
                    throw new Error("パスワードが間違っています。");
                default:
                // throw new Error("エラーが発生しました。もう一度お試しください。");
            }
        }
    };

    //////////////////////////////////////////////////////////////////////
    // Googleアカウントで新規登録・ログイン
    //////////////////////////////////////////////////////////////////////
    const signInWithGoogle = async (token?: string) => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        token && enableInvitation(token, userCredential.user.uid);
        const idToken = await userCredential.user.getIdToken();
        await signInByNextAuth("credentials", {
            idToken,
            callbackUrl: "/",
        });
    };

    //////////////////////////////////////////////////////////////////////
    // ログアウト（共通）
    //////////////////////////////////////////////////////////////////////
    const signOut = async () => {
        await signOutFireBase(auth); // Firebaseのログアウト
        await signOutByNextAuth(); // NextAuth.jsのログアウト
    };

    return { signUp, signIn, signOut, signInWithGoogle, isLoading };
};
