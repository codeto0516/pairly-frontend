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

export const ConfirmPasswordField = () => {
    return (
        <TextField
            required
            name="conformPassword"
            label="パスワード（確認用）"
            type="password"
            autoComplete="password"
            InputLabelProps={{ shrink: true }}
            fullWidth
        />
    );
};
