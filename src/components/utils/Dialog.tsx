import * as React from "react";
import Button from "@mui/material/Button";
import { Dialog as MuiDialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface Texts {
    title: string;
    content: string;
    execName?: string;
    cancelName?: string;
}

interface DialogProps {
    open: boolean;
    handleExec: () => void;
    handleClose: () => void;
}

interface BaseDialogProps extends DialogProps {
    texts: Texts;
}

export const DeleteDialog = (props: DialogProps) => {
    const texts = {
        title: "本当に削除してもよろしいでしょうか？",
        content: "一度削除するとデータを復元できません。",
        execName: "削除",
    };

    const newProps = {
        ...props,
        texts,
    };

    // return <BaseDialog texts={texts} props={props} />;
    return <BaseDialog {...newProps} />;
};

const BaseDialog = (props: BaseDialogProps) => {
    const handleExecClose = () => {
        props.handleExec();
        props.handleClose();
    };

    return (
        <div>
            <MuiDialog
                open={props.open}
                onClose={props.handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{props.texts.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{props.texts.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>
                        {props.texts.cancelName ? props.texts.cancelName : "キャンセル"}
                    </Button>
                    <Button onClick={handleExecClose} autoFocus>
                        {props.texts.execName ? props.texts.execName : "実行"}
                    </Button>
                </DialogActions>
            </MuiDialog>
        </div>
    );
};
