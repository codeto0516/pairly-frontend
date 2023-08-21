// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { useState } from "react";

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: "pairly-8c80b",
    storageBucket: "pairly-8c80b.appspot.com",
    messagingSenderId: "68145767886",
    appId: "1:68145767886:web:ce1b8f7c70827a40cbf79f",
    measurementId: "G-R01EK9NLGV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);


export const useUser = () => {
    const [user, setUser] = useState<User>();
    onAuthStateChanged(auth, (user) => {
        if (user) {
            setUser(user);
        }
    });
    return user;
};
