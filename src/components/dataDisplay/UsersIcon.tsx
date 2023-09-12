import { Tooltip } from "@mui/material";
import Avatar from "@mui/material/Avatar";

export const UserIcon = ({ user, size = 32 }: { user: any; size?: number }) => {
    let title: string;
    if (user.name) {
        title = user.displayName;
    } else if (user.email) {
        title = user.email;
    } else {
        title = "ユーザー";
    }

    return (
        <Tooltip title={title}>
            <Avatar alt={title} src={user?.photoURL ?? ""} sx={{ width: size, height: size }} />
        </Tooltip>
    );
};
