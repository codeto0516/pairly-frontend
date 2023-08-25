import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";

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
        <Tooltip title={user.email ? user.email : "user"}>
            <Avatar
                alt={user.email ? user.email : ""}
                src={user.image ? user.image : ""}
                className={getSizeClassName()}
            />
        </Tooltip>
    );
};
