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
import urlJoin from "url-join";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const api = useApi();

    const enableInvitation = async (invitationCode: string, uid: string) => {
        const res = await api.post({
            url: "http://localhost/api/v1/invitations",
            data: {
                code: invitationCode,
                uid: uid,
            },
        });
    };

    const verificationIdToken = async (idToken: string) => {
        const endpoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "users");

        const res = await fetch(endpoint, {
            // cache: "force-cache",
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${idToken}`,
            },
        });

        if (res.statusText != "OK") throw new Error(res.statusText);
    };

    //////////////////////////////////////////////////////////////////////
    // 新規登録（メールアドレス・パスワード）
    //////////////////////////////////////////////////////////////////////
    const signUp = async (email: string, password: string, invitationCode?: string) => {
        try {
            // 新規登録しユーザー情報を取得
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // パラメータにトークンがあれば招待の有効期限を有効化
            invitationCode && enableInvitation(invitationCode, userCredential.user.uid);

            // ユーザー情報からIDトークンを取得
            const idToken = await userCredential.user.getIdToken();

            // IDトークンを検証（失敗するとエラーハンドラーに飛ぶ）
            await verificationIdToken(idToken);

            // NextAuth.jsのログイン
            await signInByNextAuth("credentials", {
                idToken,
                callbackUrl: "/",
            });
        } catch (error: any) {
            // Firebaseに関するエラー
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
                    // throw new Error("エラーが発生しました。もう一度お試しください。");
            }

            // API（サーバー）に関するエラー
            switch (error.message) {
                case "Unauthorized":
                    throw new Error("認証エラーが発生しました。");
                default:
                    throw new Error("エラーが発生しました。もう一度お試しください。");
            }
        }
    };

    //////////////////////////////////////////////////////////////////////
    // ログイン（メールアドレス・パスワード）
    //////////////////////////////////////////////////////////////////////
    const signIn = async (email: string, password: string, invitationCode?: string) => {
        try {
            // ログインしユーザー情報を取得
            const userCredential = await signInWithEmailAndPassword(auth, email, password);

            // パラメータにトークンがあれば招待の有効期限を有効化
            invitationCode && enableInvitation(invitationCode, userCredential.user.uid);

            // ユーザー情報からIDトークンを取得
            const idToken = await userCredential.user.getIdToken();

            // IDトークンを検証（失敗するとエラーハンドラーに飛ぶ）
            await verificationIdToken(idToken);

            // NextAuth.jsのログイン
            await signInByNextAuth("credentials", {
                idToken,
                callbackUrl: "/",
            });
        } catch (error: any) {
            // Firebaseに関するエラー
            switch (error.code) {
                case "auth/user-not-found":
                    throw new Error("ユーザーが存在しません。");
                case "auth/invalid-email":
                    throw new Error("無効なメールアドレスです。");
                case "auth/wrong-password":
                    throw new Error("パスワードが間違っています。");
                case "Unauthorized":
                    throw new Error("認証エラーが発生しました。");
                default:
                // throw new Error("エラーが発生しました。もう一度お試しください。");
            }

            // API（サーバー）に関するエラー
            switch (error.message) {
                case "Unauthorized":
                    throw new Error("認証エラーが発生しました。");
                default:
                    throw new Error("エラーが発生しました。もう一度お試しください。");
            }
        }
    };

    //////////////////////////////////////////////////////////////////////
    // Googleアカウントで新規登録・ログイン
    //////////////////////////////////////////////////////////////////////
    const signInWithGoogle = async (token?: string) => {
        // Googleプロパイダーを作成
        const provider = new GoogleAuthProvider();

        // ログインしユーザー情報を取得
        const userCredential = await signInWithPopup(auth, provider);

        // パラメータにトークンがあれば招待の有効期限を有効化
        token && enableInvitation(token, userCredential.user.uid);

        // ユーザー情報からIDトークンを取得
        const idToken = await userCredential.user.getIdToken();

        // IDトークンを検証（失敗するとエラーハンドラーに飛ぶ）
        await verificationIdToken(idToken);

        // NextAuth.jsのログイン
        await signInByNextAuth("credentials", {
            idToken,
            callbackUrl: "/",
        });
    };

    //////////////////////////////////////////////////////////////////////
    // ログアウト（共通）
    //////////////////////////////////////////////////////////////////////
    const signOut = async () => {
        // Firebaseのログアウト
        await signOutFireBase(auth);
        // NextAuth.jsのログアウト
        await signOutByNextAuth();
    };

    return { signUp, signIn, signOut, signInWithGoogle, isLoading };
};
