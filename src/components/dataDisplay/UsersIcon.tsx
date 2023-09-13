"use client";
import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";

interface UserIconProps {
    label?: string | null;
    image?: string | null;
    size?: number;
}

export const UserIcon = ({ label = "ユーザー", image, size = 32 }: UserIconProps) => {

    return (
        <Tooltip title={label}>
            <Avatar alt={label ?? ""} src={image ?? ""} sx={{ width: size, height: size }} />
        </Tooltip>
    );
};
