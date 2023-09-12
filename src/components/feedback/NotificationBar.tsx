import * as React from "react";
import Button from "@mui/material/Button";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

export const NotificationBar = () => {
    const [open, setOpen] = React.useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };

    const action = (
        <>
            <Button color="primary" size="small" onClick={handleClose} >
                元に戻す
            </Button>
            <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
                <CloseIcon fontSize="small" />
            </IconButton>
        </>
    );

    return (
        <div>
            {/* <Button onClick={handleClick}>Open simple snackbar</Button> */}
            <Snackbar
                open={true}
                autoHideDuration={6000}
                onClose={handleClose}
                message="Note archived"
                action={action}
                color="#ffffff"
            />
        </div>
    );
}

