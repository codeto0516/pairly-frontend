"use client";
import { useRouter, redirect } from "next/navigation";
import { createContext, useReducer, useContext, useEffect } from "react";

// アクションの定義
export const loginAction = (userData: any, tokens: any) => ({
    type: "LOGIN",
    userData: userData,
    tokens: tokens,
});
export const logoutAction = () => ({ type: "LOGOUT" });

// レデューサー
const authReducer = (state: any, action: any) => {
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                user: action.userData,
                tokens: action.tokens,
                isAuthenticated: true,
            };
        case "LOGOUT":
            return {
                ...state,
                user: null,
                tokens: null,
                isAuthenticated: false,
            };
        default:
            return state;
    }
};

// 初期状態
const initialAuthState = {
    user: null,
    tokens: null,
    isAuthenticated: false,
};

export const AuthContext = createContext<any>({});

export const AuthProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(authReducer, initialAuthState);

    return <AuthContext.Provider value={{ state, dispatch }}>{children}</AuthContext.Provider>;
};


