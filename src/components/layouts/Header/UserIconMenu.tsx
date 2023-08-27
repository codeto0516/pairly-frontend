"use client";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";

import { UserIcon } from "@/src/components/elements/icon/UsersIcon";

// import { logoutAction } from "../../../hooks/providers/AuthProvider";
import { redirect, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/src/hooks/useAuth";
import { useUserData } from "@/src/providers/SessionProvider";
// import { useAuth } from "@/src/hooks/useAuth";

const CustomMenuitem = (props: { handler: any; children: React.ReactNode; title: string }) => {
    return (
        <MenuItem onClick={() => props.handler()}>
            <ListItemIcon>{props.children}</ListItemIcon>
            {props.title}
        </MenuItem>
    );
};

export const UserIconMenu = () => {
    const router = useRouter();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { user } = useUserData();

    const { signOut } = useAuth();

    return (
        <>
            <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
                <IconButton
                    onClick={handleClick}
                    size="small"
                    aria-controls={open ? "account-menu" : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? "true" : undefined}
                    sx={{ padding: 0 }}
                >
                    <UserIcon user={user} />
                </IconButton>
            </Box>

            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                    elevation: 0,
                    sx: {
                        overflow: "visible",
                        filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                        mt: 1.5,
                        "& .MuiAvatar-root": {
                            width: 32,
                            height: 32,
                            ml: -0.5,
                            mr: 1,
                        },
                        "&:before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 14,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <CustomMenuitem handler={handleClose} title="プロフィール">
                    <UserIcon user={user} />
                </CustomMenuitem>

                <CustomMenuitem handler={handleClose} title="パートナーを招待">
                    <PersonAdd fontSize="small" />
                </CustomMenuitem>

                <Divider />

                {/* <CustomMenuitem handler={handleClose} title="設定">
                    <Settings fontSize="small" />
                </CustomMenuitem> */}

                <CustomMenuitem handler={signOut} title="ログアウト">
                    <Logout fontSize="small" />
                </CustomMenuitem>
            </Menu>
        </>
    );
};
