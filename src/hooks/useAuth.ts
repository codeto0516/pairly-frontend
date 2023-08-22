
import {
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signInWithRedirect,
    signOut as signOutFireBase,
} from "firebase/auth";
import { auth, useUser } from "@/src/hooks/firebase";
import { useState } from "react";
import { redirect } from "next/navigation";

export const useAuth = () => {
    const currentUser = useUser();
    const [isLoading, setIsLoading] = useState(false);

    const signUp = async (email: string, password: string) => {
        try {
            console.log(email, password);
            setIsLoading(() => true);
            await createUserWithEmailAndPassword(auth, email, password);
            setIsLoading(() => false);

            console.log("ユーザー登録完了!");
        } catch (error) {
            console.log(error);
        }
    };

    const signIn = async (email: string, password: string) => {
        try {
            const userCredencial = await signInWithEmailAndPassword(auth, email, password);
            const isNotVerified = !userCredencial.user.emailVerified;
            if (isNotVerified) {
                // await reSendVerifyMail(userCredencial.user);
                // await signOut();
            }
            return;
        } catch (error: any) {
            switch (error.code) {
                case "auth/user-not-found":
                case "auth/invalid-email":
                case "auth/wrong-password":
                    // パスワードが合致しない、ユーザが存在しなかったときの処理
                    break;
                default:
                // その他のエラー時の処理
            }
            return;
        }
    };

    const signOut = async () => {
        await signOutFireBase(auth);
    };

    const signInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
    };

    return { signUp, signIn, signOut, signInWithGoogle, currentUser, isLoading, auth };
};
