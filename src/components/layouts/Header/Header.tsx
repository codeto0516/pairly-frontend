"use client";
import Logo from "../../elements/icon/Logo";
import HumburgerMenu from "./HumburgerMenu";
import HeaderNav from "./HeaderNav";
import { UserIconMenu } from "./UserIconMenu";
import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";
import { useAuth } from "@/src/hooks/useAuth";
// import { useAuth } from "@/src/hooks/useAuth";

const menuList = [
    {
        name: "ホーム",
        href: "/",
    },
    {
        name: "レポート",
        href: "/report",
    },
    {
        name: "パートナー",
        href: "/partner",
    },
    {
        name: "設定",
        href: "/setting",
    },
];

const BaseHeader = () => {
    return (
        <div className="container flex justify-between items-center max-w-5xl">
            {/* ハンバーガーメニュー */}
            <HumburgerMenu menuList={menuList} />

            {/* ロゴ */}
            <Logo />

            {/* ナビゲーションメニュー */}
            <HeaderNav menuList={menuList} />

            {/* アバター */}
            <UserIconMenu />
        </div>
    );
};

export const Header = () => {
    const { currentUser } = useAuth();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // console.log(currentUser, isAuthenticated);
        
        if (currentUser) {
            setIsAuthenticated(() => true);
        } else {
            setIsAuthenticated(() => false);
        }
    }, [currentUser]);

    if (isAuthenticated) {
        return (
            <header className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50">
                <BaseHeader />
            </header>
        );
    } else {
        return (
            <header className="fixed  min-w-full flex justify-center p-4 md:p-4 z-50 ">
                <Logo />
            </header>
        );
    }
};
