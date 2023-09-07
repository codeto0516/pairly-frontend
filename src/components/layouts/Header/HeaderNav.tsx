"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuItemType } from "@/src/types/menu.d";

const HeaderNav = ({ menuList }: { menuList: MenuItemType[] }) => {
    const pathname = usePathname();

    return (
        <ul className="hidden gap-0 md:gap-4 items-center sm:flex">
            {menuList.map((menu, index) => {
                return (
                    <li key={index} className="font-bold">
                        {pathname === menu.href ? (
                            <Link
                                href={menu.href}
                                // href="/partner"
                                className="text-gray-50 bg-red-300 text-sm font-bold py-2 px-4 rounded-sm"
                            >
                                {menu.name}
                            </Link>
                        ) : (
                            <Link
                                href={menu.href}
                                // href="/partner"
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

export default HeaderNav;
