import Button from "@mui/material/Button";
import { Dialog as MuiDialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useEffect, useState } from "react";

interface BaseDialogProps {
    open: boolean;
    texts: {
        title: string;
        content: string;
        execName?: string;
        cancelName?: string;
    };
    buttons: {
        buttonName?: string;
        handler?: () => void;
    }[];
}
const BaseDialog = (props: BaseDialogProps) => {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setOpen(props.open);
    }, [props.open]);

    return (
        <div>
            <MuiDialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                {/* タイトル */}
                <DialogTitle id="alert-dialog-title">{props.texts.title}</DialogTitle>

                {/* コンテキスト */}
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{props.texts.content}</DialogContentText>
                </DialogContent>

                {/* ボタン */}
                <DialogActions>
                    {props.buttons.map((button, index) => {
                        return (
                            <Button key={index} onClick={button.handler}>
                                {button.buttonName}
                            </Button>
                        );
                    })}
                </DialogActions>
            </MuiDialog>
        </div>
    );
};

interface DialogProps {
    open: boolean;
    handleExec: () => void;
    handleCancel?: () => void;
}
export const DeleteDialog = (props: DialogProps) => {
    const texts = {
        title: "本当に削除してもよろしいですか？",
        content: "一度削除するとデータを復元できません。",
        execName: "削除",
    };

    const execButton = {
        buttonName: "削除",
        handler: props.handleExec,
    };

    const cancelButton = {
        buttonName: "キャンセル",
        handler: props.handleCancel,
    };

    return <BaseDialog open={props.open} texts={texts} buttons={[execButton, cancelButton]} />;
};

export const ForceSignOutDialog = (props: DialogProps) => {
    const texts = {
        title: "セッションタイムアウト",
        content: "セッションの有効期限が切れました。再度ログインしてください。",
        execName: "ログイン画面へ",
    };

    const execButton = {
        buttonName: "ログイン画面へ",
        handler: props.handleExec,
    };

    return <BaseDialog open={true} texts={texts} buttons={[execButton]} />;
};
