"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItemType } from "@/src/types/menu.d";

interface HeaderNavProps {
    menuList: MenuItemType[];
}
export const HeaderNav = (props: HeaderNavProps) => {
    const pathname = usePathname();

    const isGroupMatch = (path1: string, path2: string) => {
        const pathSegments1 = path1.split("/");
        const pathSegments2 = path2.split("/");

        // 1つ目の文字が一致するかチェック
        return pathSegments1[1]?.charAt(0) === pathSegments2[1]?.charAt(0);
    };

    return (
        <ul className="hidden gap-0 md:gap-4 items-center sm:flex">
            {props.menuList.map((menu, index) => {
                return (
                    <li key={index} className="font-bold">
                        {isGroupMatch(pathname, menu.href) ? (
                            <Link
                                href={menu.href}
                                className="text-gray-50 bg-red-300 text-sm font-bold py-2 px-4 rounded-sm"
                            >
                                {menu.name}
                            </Link>
                        ) : (
                            <Link
                                href={menu.href}
                                className="text-gray-700 text-sm font-bold py-2 px-4 hover:bg-red-50"
                            >
                                {menu.name}
                            </Link>
                        )}
                    </li>
                );
            })}
        </ul>
    );
};
