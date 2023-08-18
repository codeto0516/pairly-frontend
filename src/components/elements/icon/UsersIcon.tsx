import { UserType } from "@/src/types/user";
import Avatar from "@mui/material/Avatar";
import { useState } from "react";

interface UserIconProps {
    user: any;
    size?: "xs" | "sm" | "md" | "lg";
    src?: string;
}

export const UserIcon = ({ user, size }: UserIconProps) => {
    const getSizeClassName = () => {
        switch (size) {
            case "xs":
                return "w-4 h-4";
            case "sm":
                return "w-6 h-6";
            case "md":
                return "w-8 h-8";
            case "lg":
                return "w-10 h-10";
            default:
                return "w-8 h-8"; // デフォルトサイズ
        }
    };

    return (
        <Avatar alt={user.name} src={user.iconPath && user.iconPath} className={getSizeClassName()} />
    );
};
