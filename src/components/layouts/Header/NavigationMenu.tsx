import { Box, Button } from "@mui/material";
import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { MenuItemType } from "@/src/types/menu.d";

interface NavigationMenuProps {
    menuList: MenuItemType[];
}
export const NavigationMenu = (props: NavigationMenuProps) => {
    const pathname = usePathname();
    return (
        <Box sx={{ display: { xs: "none", sm: "flex" }, gap: { xs: "8px", md: "16px" } }}>
            {props.menuList.map((menu, index) => (
                <React.Fragment key={index}>
                    <Link href={menu.href} passHref>
                        <Button
                            sx={{
                                my: 2,
                                color: "#333333",
                                fontWeight: "bold",
                                px: 2,
                            }}
                            disabled={pathname === menu.href}
                            variant={pathname === menu.href ? "contained" : "text"}
                        >
                            {menu.name}
                        </Button>
                    </Link>
                </React.Fragment>
            ))}
        </Box>
    );
};
