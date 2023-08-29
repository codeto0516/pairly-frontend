
import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { User } from "next-auth";

export const UserIcon = ({ user, size = 32 }: { user: User; size?: number }) => {

    let title: string;
    if (user.name) {
        title = user.name
    } else if (user.email) {
        title = user.email
    } else {
        title = "ユーザー"
    }

    return (
        <Tooltip title={title}>
            <Avatar
                alt={title}
                src={user?.image ? user.image : ""}
                sx={{ width: size, height: size }}
            />
        </Tooltip>
    );
};
