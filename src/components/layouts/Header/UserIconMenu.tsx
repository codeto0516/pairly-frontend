"use client";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import PersonAdd from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import { UserIcon } from "@/src/components/dataDisplay/UsersIcon";
import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/src/hooks/useAuth";
import { useUser } from "@/src/hooks/useUser";

export const UserIconMenu = () => {
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { currentUser } = useUser();
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
                    <UserIcon label={currentUser?.displayName ?? currentUser?.email} image={currentUser?.photoUrl} />
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
                <Link href="/setting/profile">
                    <MenuItem onClick={handleClose}>
                        <ListItemIcon>
                            <UserIcon
                                label={currentUser?.displayName ?? currentUser?.email}
                                image={currentUser?.photoUrl}
                            />
                        </ListItemIcon>
                        プロフィール
                    </MenuItem>
                </Link>

                <Link href="/setting/partner">
                    <MenuItem onClick={handleClose}>
                        {currentUser?.partner ? (
                            <>
                                <ListItemIcon>
                                    <UserIcon
                                        label={currentUser.partner.displayName ?? currentUser.partner.email}
                                        image={currentUser.partner.photoUrl}
                                    />
                                </ListItemIcon>
                                パートナー
                            </>
                        ) : (
                            <>
                                <ListItemIcon>
                                    <PersonAdd fontSize="small" />
                                </ListItemIcon>
                                パートナーを招待
                            </>
                        )}
                    </MenuItem>
                </Link>
                <Divider sx={{ my: 1 }} />

                {/* <CustomMenuitem handler={handleClose} title="設定">
                    <Settings fontSize="small" />
                </CustomMenuitem> */}

                <MenuItem onClick={signOut}>
                    <ListItemIcon>
                        <Logout fontSize="small" />
                    </ListItemIcon>
                    ログアウト
                </MenuItem>
            </Menu>
        </>
    );
};

