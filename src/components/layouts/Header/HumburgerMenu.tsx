"use client";
import Drawer from "@mui/material/Drawer";
import { IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";

interface TemporaryDrawerProps {
    menuList: {
        name: string;
        href: string;
    }[];
}
export const HumburgerMenu = (props: TemporaryDrawerProps) => {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
        if (
            // キーボードの「Tab」キーまたは「Shift」キーが押された場合に、ドロワーが開いている状態でフォーカスがドロワー内で循環するのを防ぐためのもの
            event.type === "keydown" &&
            ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
        ) {
            return;
        }
        setIsOpen(!isOpen);
    };

    return (
        <div className="sm:hidden">
            {/* ハンバーガーメニューボタン */}
            <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={() => setIsOpen(true)}
                className="p-0"
            >
                <MenuIcon />
            </IconButton>
            {/* ドロワー */}
            <Drawer anchor={"left"} open={isOpen} onClose={() => setIsOpen(false)}>
                <div className="w-[250px]" role="presentation" onKeyDown={toggleDrawer}>
                    <IconButton className="p-4" onClick={() => setIsOpen(false)}>
                        <CloseIcon />
                    </IconButton>
                    <ul className="flex flex-col gap-2">
                        {props.menuList.map((menu, index) => {
                            return (
                                <li
                                    key={index}
                                    onClick={() => {
                                        setIsOpen(false);
                                    }}
                                    className=""
                                >
                                    {pathname == menu.href ? (
                                        <Link
                                            href={menu.href}
                                            className="text-gray-50 bg-red-300 font-bold p-4 rounded-sm block"
                                        >
                                            {menu.name}
                                        </Link>
                                    ) : (
                                        <Link href={menu.href} className="p-4 hover:bg-red-50 block">
                                            {menu.name}
                                        </Link>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Drawer>
        </div>
    );
};
