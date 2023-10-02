"use client";
import { Skeleton, Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { Suspense } from "react";

interface UserIconProps {
    label?: string | null;
    image?: string | null;
    size?: number;
}

export const UserIcon = ({ label = "ユーザー", image, size = 32 }: UserIconProps) => {
    return (
        <Suspense
            fallback={<Skeleton variant="circular" animation="wave" style={{ minWidth: "32px", minHeight: "32px" }} />}
        >
            <Tooltip title={label}>
                <Avatar alt={label ?? ""} src={image ?? ""} sx={{ width: size, height: size }} />
            </Tooltip>
        </Suspense>
    );
};
