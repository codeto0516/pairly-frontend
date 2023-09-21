import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword as FireBaseSignInWithEmailAndPassword,
    signInWithPopup,
    signOut as FireBaseSignOut,
    UserCredential,
    sendPasswordResetEmail as FireBaseSendPasswordResetEmail,
} from "firebase/auth";
import { signIn as signInByNextAuth, signOut as signOutByNextAuth } from "next-auth/react";
import { auth } from "@/src/app/(auth)/api/auth/[...nextauth]/config";
import { useEffect, useState } from "react";
import { useApi } from "./useApi";
import urlJoin from "url-join";
import { useToggle } from "./useToggle";
import { FirebaseError } from "firebase/app";
import { useRouter } from "next/navigation";

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

    // サクセスメッセージ
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const visibleSuccessMessage = (message: string) => setSuccessMessage(() => message);

    // メッセージを全て非表示にする
    const clearMessage = () => {
        setErrorMessage(() => null);
        setSuccessMessage(() => null);
    };

    //////////////////////////////////////////////////////////////////////
    // IDトークンをサーバーで検証
    //////////////////////////////////////////////////////////////////////
    const verificationIdToken = async (idToken: string) => {
        const endpoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "auth");

        const res = await fetch(endpoint, {
            // cache: "force-cache",
            method: "POST",
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
    const common = async (handler: Promise<UserCredential>, invitationCode?: string) => {
        try {
            // ローディングを開始
            toggleLoading(true);

            // 新規登録 or ログイン してユーザー情報を取得
            const userCredential = await handler;

            // ユーザー情報からIDトークンを取得
            const idToken = await userCredential.user.getIdToken();

            // IDトークンを検証（失敗するとエラーハンドラーに飛ぶ）
            await verificationIdToken(idToken);

            // NextAuth.jsのログイン
            await signInByNextAuth("credentials", {
                idToken,
                callbackUrl: "/",
            });
        } catch (error: FirebaseError | any) {
            console.log(error);

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

    //////////////////////////////////////////////////////////////////////
    // パスワードリセットのメールを送信
    //////////////////////////////////////////////////////////////////////
    const sendPasswordResetEmail = async (email: string) => {
        const actionCodeSettings = {
            // パスワード再設定後のリダイレクト URL
            url: urlJoin("http://localhost:3000", "signin"),
            handleCodeInApp: false,
        };

        // メッセージを全て非表示にする
        clearMessage();

        // ローディングを開始
        toggleLoading(true);

        try {
            await FireBaseSendPasswordResetEmail(auth, email, actionCodeSettings);
            visibleSuccessMessage("パスワードリセットメールを送信しました。");
        } catch (error: FirebaseError | any) {
            console.log(error);
            const errorMessage = getErrorMessage(error.code);
            visibleErrorMessage(errorMessage);
        }

        // ローディングを終了
        toggleLoading(false);
    };

    //////////////////////////////////////////////////////////////////////
    // パスワードをリセット
    //////////////////////////////////////////////////////////////////////
    const resetPassword = async (newPassword: string | undefined, oobCode: string | null): Promise<boolean> => {
        toggleLoading(true);

        if (oobCode === null) {
            visibleErrorMessage("URLが無効です。");
            return false;
        }

        if (newPassword === undefined) {
            visibleErrorMessage("パスワードを入力してください。");
            return false;
        }

        clearMessage();

        try {
            const endpoint = urlJoin(process.env.NEXT_PUBLIC_API_BASE_URL, "password");
            const res = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    newPassword: newPassword,
                    oobCode: oobCode,
                }),
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) throw new Error(res.statusText);

            // visibleSuccessMessage("パスワードをリセットしました。");
            // toggleLoading(false);
            return true;
        } catch (error) {
            toggleLoading(false);
            console.log(error);
            visibleErrorMessage("パスワードのリセットに失敗しました。");
            return false;
        }

        
    };

    //////////////////////////////////////////////////////////////////////
    return {
        signUpWithEmailAndPassword,
        signInWithEmailAndPassword,
        signOut,
        signInWithGoogle,
        sendPasswordResetEmail,
        resetPassword,
        isLoading,
        successMessage,
        errorMessage,
    };
};
