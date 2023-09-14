import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Modal as MuiModal } from "@mui/material";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    boxShadow: 24,
    zIndex: 9999,
};

interface ModalProps {
    open: boolean;
    onClose: (event: {}, reason: "backdropClick" | "escapeKeyDown") => void;
    children: React.ReactElement;
}

export const Modal = (props: ModalProps) => {
    return (
        <MuiModal
            open={props.open}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>{props.children}</Box>
        </MuiModal>
    );
};
