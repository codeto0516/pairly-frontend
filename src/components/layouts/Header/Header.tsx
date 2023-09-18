"use client";
import Logo from "../../dataDisplay/Logo";
import { HumburgerMenu } from "./HumburgerMenu";
import { HeaderNav } from "./HeaderNav";
import { UserIconMenu } from "./UserIconMenu";

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
        name: "設定",
        href: "/setting/profile",
    },
];

export const Header = () => {
    return (
        <header className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50">
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
        </header>
    );
};
