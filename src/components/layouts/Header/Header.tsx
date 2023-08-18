"use client";
import Logo from "./Logo";
import HumburgerMenu from "./HumburgerMenu";
import HeaderNav from "./HeaderNav";
import { UserIconMenu } from "./UserIconMenu";
import { useSession } from "next-auth/react";
import { LoginButton } from "../../elements/button/AuthorizationButton";
import { Skeleton } from "@mui/material";
import { AnimatePresence, motion } from "framer-motion";
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

export const MySkeleton = () => {
    return <Skeleton variant="rectangular" style={{ width: "100%" }} height={64} />;
};

function ResponsiveAppBar() {
    const { data: session, status } = useSession();
    console.log(session);
    console.log(session?.user);
    console.log(status);

    if (status === "loading") {
        return <header className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50"></header>;
    }

    if (status === "authenticated") {
        return (
            <motion.header
                // initial={{ opacity: 0 }}
                // animate={{ opacity: 1 }}
                // exit={{ opacity: 0 }}
                className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50"
            >
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
            </motion.header>
        );
    }

    return (
        <header className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50 ">
            <Logo />
        </header>
    );
}
export default ResponsiveAppBar;
