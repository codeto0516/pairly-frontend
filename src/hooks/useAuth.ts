import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword as FireBaseSignInWithEmailAndPassword,
    signInWithPopup,
    signOut as FireBaseSignOut,
} from "firebase/auth";
import { signIn as signInByNextAuth, signOut as signOutByNextAuth } from "next-auth/react";
import { auth } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import { useEffect, useState } from "react";
import { useApi } from "./api/v1/useApi";
import urlJoin from "url-join";
import { useToggle } from "./useToggle";

const errorMessages: Record<string, string> = {
    "auth/email-already-in-use": "このメールアドレスは既に使用されています。",
    "auth/invalid-email": "無効なメールアドレスです。",
    "auth/operation-not-allowed": "この操作は許可されていません。",
    "auth/weak-password": "パスワードが弱すぎます。6文字以上入力してください。",
    "auth/user-not-found": "ユーザーが存在しません。",
    "auth/wrong-password": "パスワードが間違っています。",
    Unauthorized: "認証エラーが発生しました。",
    default: "エラーが発生しました。もう一度お試しください。",
};

const getErrorMessage = (errorCode: any) => errorMessages[errorCode] || errorMessages["default"];

//////////////////////////////////////////////////////////////////////
// 本体
//////////////////////////////////////////////////////////////////////
export const useAuth = () => {
    // ローディング状態
    const [isLoading, toggleLoading] = useToggle(false);

    // エラーメッセージ
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const visibleErrorMessage = (message: string) => setErrorMessage(() => message);

    // APIカスタムフック
    const api = useApi();

    //////////////////////////////////////////////////////////////////////
    // 招待の有効期限を有効化
    //////////////////////////////////////////////////////////////////////
    const enableInvitation = async (invitationCode: string, uid: string) => {
        const res = await api.post({
            url: "http://localhost/api/v1/invitations",
            data: {
                code: invitationCode,
                uid: uid,
            },
        });
    };

    //////////////////////////////////////////////////////////////////////
    // IDトークンを検証
    //////////////////////////////////////////////////////////////////////
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

        if (!res.ok) throw new Error(res.statusText);
    };

    //////////////////////////////////////////////////////////////////////
    // 新規登録 と ログイン の共通処理
    //////////////////////////////////////////////////////////////////////
    const common = async (handler: any, invitationCode?: string) => {
        try {
            // ローディングを開始
            toggleLoading(true);

            // 新規登録 or ログイン してユーザー情報を取得
            const userCredential = await handler;

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

            // ローディングを終了
            // toggleLoading(false);
        } catch (error: any) {
            // ローディングを終了
            toggleLoading(false);

            // エラーメッセージを取得
            const errorMessage = getErrorMessage(error.code);

            // エラーメッセージを表示
            visibleErrorMessage(errorMessage);
        }
    };

    //////////////////////////////////////////////////////////////////////
    // 新規登録（メールアドレス・パスワード）
    //////////////////////////////////////////////////////////////////////
    const signUpWithEmailAndPassword = async (email: string, password: string, invitationCode?: string) => {
        common(createUserWithEmailAndPassword(auth, email, password), invitationCode);
    };

    //////////////////////////////////////////////////////////////////////
    // ログイン（メールアドレス・パスワード）
    //////////////////////////////////////////////////////////////////////
    const signInWithEmailAndPassword = async (email: string, password: string, invitationCode?: string) => {
        common(FireBaseSignInWithEmailAndPassword(auth, email, password), invitationCode);
    };

    //////////////////////////////////////////////////////////////////////
    // 新規登録・ログイン（Googleアカウント）
    //////////////////////////////////////////////////////////////////////
    const signInWithGoogle = async (invitationCode?: string) => {
        const provider = new GoogleAuthProvider();
        common(signInWithPopup(auth, provider), invitationCode);
    };

    //////////////////////////////////////////////////////////////////////
    // ログアウト（共通）
    //////////////////////////////////////////////////////////////////////
    const signOut = async () => {
        // Firebaseのログアウト
        await FireBaseSignOut(auth);

        // NextAuth.jsのログアウト
        await signOutByNextAuth();
    };

    return {
        signUpWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        signInWithGoogle,
        isLoading,
        errorMessage,
    };
};
