import { Alert, AlertTitle } from "@mui/material";

export const ComingSoon = () => {
    return (
        <Alert severity="info" variant="outlined">
            <AlertTitle>Coming Soon...</AlertTitle>
            ただいま準備中です。しばらくお待ちください。
        </Alert>
    );
};
