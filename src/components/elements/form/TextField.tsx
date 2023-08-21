import { TextField } from "@mui/material";

export const MailField = () => {
    return (
        <TextField
            required
            name="email"
            type="email"
            label="メールアドレス"
            autoComplete="email"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    );
};

export const PasswordField = () => {
    return (
        <TextField
            required
            name="password"
            label="パスワード"
            type="password"
            autoComplete="password"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    );
};

export const PasswordConfirmField = () => {
    return (
        <TextField
            required
            name="passwordConfirm"
            label="パスワード（確認用）"
            type="password"
            autoComplete="password"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    );
};
