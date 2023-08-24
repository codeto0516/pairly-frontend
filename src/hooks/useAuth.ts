import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut as signOutFireBase,
} from "firebase/auth";
import { signIn as signInByNextAuth, signOut as signOutByNextAuth } from "next-auth/react";
import { auth } from "@/src/firebase/config";
import { useState } from "react";

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);

    const signUp = async (email: string, password: string) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
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

    const signIn = async (email: string, password: string) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const isNotVerified = !userCredential.user.emailVerified;
            if (isNotVerified) {
                // await reSendVerifyMail(userCredencial.user);
                // await signOut();
            }
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

    const signOut = async () => {
        await signOutFireBase(auth);
        await signOutByNextAuth();
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const idToken = await userCredential.user.getIdToken();
        await signInByNextAuth("credentials", {
            idToken,
            callbackUrl: "/",
        });
    };

    return { signUp, signIn, signOut, signInWithGoogle, isLoading };
};
