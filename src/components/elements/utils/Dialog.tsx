import * as React from "react";
import Button from "@mui/material/Button";
import { Dialog as MuiDialog } from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

interface textsType {
    title: string;
    content: string;
    execName?: string;
    cancelName?: string;
}
interface BaseDialogProps {
    open: boolean;
    handleExec: any;
    handleClose: any;
}

const BaseDialog = ({ props, texts }: { props: BaseDialogProps; texts: textsType }) => {
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
                <DialogTitle id="alert-dialog-title">{texts.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">{texts.content}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={props.handleClose}>{texts.cancelName ? texts.cancelName : "キャンセル"}</Button>
                    <Button onClick={handleExecClose} autoFocus>
                        {texts.execName ? texts.execName : "実行"}
                    </Button>
                </DialogActions>
            </MuiDialog>
        </div>
    );
};

export const DeleteDialog = (props: BaseDialogProps) => {
    const texts = {
        title: "本当に削除してもよろしいでしょうか？",
        content: "一度削除するとデータを復元できません。",
        execName: "削除",
    };

    return <BaseDialog texts={texts} props={props} />;
};

