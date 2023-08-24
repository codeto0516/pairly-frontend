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
            console.log("ユーザー登録完了!");
        } catch (error) {
            console.log(error);
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

            // const res = await fetch("http://localhost:80/api/v1/users", {
            //     method: "POST",
            //     headers: {
            //         "Content-Type": "application/json",
            //         Authorization: `Bearer ${idToken}`,
            //     },
            // });
            // console.log(res.json());
        } catch (error: any) {
            console.log(error);

            switch (error.code) {
                case "auth/user-not-found":
                case "auth/invalid-email":
                case "auth/wrong-password":
                    console.log("パスワードが合致しない、ユーザが存在しなかったときの処理");

                    // パスワードが合致しない、ユーザが存在しなかったときの処理
                    break;
                default:
                // その他のエラー時の処理
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
