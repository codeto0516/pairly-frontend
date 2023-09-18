"use client";
import { ContainerTop } from "@/src/components/layouts/Container";
import { usePathname } from "next/navigation";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const settingList = [
    {
        id: 0,
        name: "プロフィール",
        link: "/setting/profile",
    },
    {
        id: 1,
        name: "パートナー",
        link: "/setting/partner",
    },
    {
        id: 2,
        name: "パスワード",
        link: "/setting/password",
    },
    {
        id: 3,
        name: "通知",
        link: "/setting/notification",
    },
    {
        id: 4,
        name: "アカウント削除",
        link: "/setting/delete",
    },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [value, setValue] = useState<number | null>(null);
    const pathName = usePathname();

    useEffect(() => {
        const index = settingList.findIndex((item) => item.link === pathName);
        setValue(() => index);
    }, [pathName]);

    if (value === null) return null;

    return (
        <ContainerTop>
            <div className="flex flex-col md:flex-col gap-4 w-full justify-center ">
                {/* サイドバー */}
                <div className="w-full flex justify-center">
                    <Tabs
                        value={value}
                        variant="scrollable"
                        scrollButtons="auto"
                        aria-label="scrollable auto tabs example"
                    >
                        {settingList.map((item) => {
                            return (
                                <Tab
                                    key={item.id}
                                    label={item.name}
                                    onClick={() => {
                                        router.push(item.link);
                                    }}
                                />
                            );
                        })}
                    </Tabs>
                </div>

                {/* 各設定画面 */}
                <div className="py-16 md:p-16 md:min-h-[600px] h-fit ">
                    <div className="flex flex-col items-center gap-16">
                        <h1 className="text-xl font-bold">
                            {settingList.find((item) => item.link === pathName)?.name}
                        </h1>
                        {children}
                    </div>
                </div>
            </div>
        </ContainerTop>
    );
}
