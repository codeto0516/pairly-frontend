"use client";
import Logo from "./Logo";
import HumburgerMenu from "./HumburgerMenu";
import HeaderNav from "./HeaderNav";
import { UserIconMenu } from "./UserIconMenu";
import { LoginButton } from "../../elements/button/AuthorizationButton";
import { Skeleton } from "@mui/material";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import { useEffect, useState } from "react";

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
    const [isInitialRender, setIsInitialRender] = useState(true);
    const controls = useAnimation();
    const [initial, setInitial] = useState(0)

    // 初回レンダリング時のみアニメーションをつける（毎回アニメーションをつけるとチカチカするため）
    useEffect(() => {
        setInitial(1)
    }, []);


    // if (status === "authenticated") {
        return (
            <motion.header
                initial={{ opacity: initial }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 1 }}
                className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50"
            >
                <BaseHeader />
            </motion.header>
        );
    // } else {
    //     return (
    //         <header className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50 ">
    //             <Logo />
    //         </header>
    //     );
    // }
};

// "use client";
// import Logo from "./Logo";
// import HumburgerMenu from "./HumburgerMenu";
// import HeaderNav from "./HeaderNav";
// import { UserIconMenu } from "./UserIconMenu";
// import { useSession } from "next-auth/react";
// import { LoginButton } from "../../elements/button/AuthorizationButton";
// import { Skeleton } from "@mui/material";
// import { AnimatePresence, motion, useAnimation } from "framer-motion";
// import { useEffect, useState } from "react";

// const menuList = [
//     {
//         name: "ホーム",
//         href: "/",
//     },
//     {
//         name: "レポート",
//         href: "/report",
//     },
//     {
//         name: "パートナー",
//         href: "/partner",
//     },
//     {
//         name: "設定",
//         href: "/setting",
//     },
// ];

// const BaseHeader = () => {
//     return (
//         <div className="container flex justify-between items-center max-w-5xl">
//             {/* ハンバーガーメニュー */}
//             <HumburgerMenu menuList={menuList} />

//             {/* ロゴ */}
//             <Logo />

//             {/* ナビゲーションメニュー */}
//             <HeaderNav menuList={menuList} />

//             {/* アバター */}
//             <UserIconMenu />
//         </div>
//     );
// };

// export const Header = () => {
//     const { data: session, status } = useSession();
//     const [isInitialRender, setIsInitialRender] = useState(true);
//     const controls = useAnimation();

//     // 初回レンダリング時のみアニメーションをつける（毎回アニメーションをつけるとチカチカするため）
//     useEffect(() => {
//         // console.log("helosdffasdfsfasf");
//         // if (isInitialRender) {
//         //     controls.start({
//         //         opacity: 1,
//         //         transition: {
//         //             duration: 0.5,
//         //         },
//         //     });
//             setIsInitialRender(false);
//         // }
//     }, []);

//     // ローディング中はなにも表示しない
//     if (status === "loading") {
//         // return <header className="fixed  min-w-full flex justify-center p-4 md:p-4 z-50"></header>;
//         return <></>;
//     }

//     if (status === "authenticated") {
//         return (
//             <>
//                 {isInitialRender ? (
//                     <motion.header
//                         initial={{ opacity: 1 }}
//                         animate={controls}
//                         // animate={{ opacity: 1 }}
//                         // exit={{ opacity: 0 }}
//                         className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50"
//                     >
//                         <BaseHeader />
//                     </motion.header>
//                 ) : (
//                     <motion.header
//                         // initial={{ opacity: 1 }}
//                         // animate={controls}
//                         // animate={{ opacity: 1 }}
//                         // exit={{ opacity: 0 }}
//                         className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50"
//                     >
//                         <BaseHeader />
//                     </motion.header>
//                 )}
//             </>
//         );
//     } else {
//         return (
//             <header className="fixed  min-w-full bg-white flex justify-center p-4 md:p-4 z-50 ">
//                 <Logo />
//             </header>
//         );
//     }
// };
