import { TextField } from "@mui/material";

export const MailField = ({ register }: { register: any }) => {
    return (
        <TextField
            // required
            // name="email"
            type="email"
            label="メールアドレス"
            autoComplete="email"
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...register("email", { required: true })}
        />
    );
};

export const PasswordField = ({ register }: { register: any }) => {
    return (
        <TextField
            // required
            // name="password"
            label="パスワード"
            type="password"
            autoComplete="password"
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...register("password", { required: true })}
        />
    );
};

export const ConfirmPasswordField = ({ register} : {register:any}) => {
    return (
        <TextField
            // required
            // name="passwordConfirm"
            label="パスワード（確認用）"
            type="password"
            autoComplete="password"
            InputLabelProps={{ shrink: true }}
            fullWidth
            {...register("confirmPassword", { required: true })}
        />
    );
};
