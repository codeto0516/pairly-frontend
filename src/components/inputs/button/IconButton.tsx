import { IconButton as MuiIconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

interface BaseIconButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    color?: string;
    size?: string;
}

const BaseIconButton = (props: BaseIconButtonProps) => {
    let sxColor = "";
    let tailwindColor = "";

    if (props.color?.startsWith("#")) {
        // カラーコードで指定されたら
        sxColor = props.color;
    } else if (props.color?.startsWith("text-")) {
        // Tailwindのカラーで指定されたら
        tailwindColor = props.color;
    }

    return (
        <MuiIconButton sx={{ color: sxColor }} className={tailwindColor} onClick={props.onClick}> 
            {props.children}
        </MuiIconButton>
    );
};

interface IconButtonProps {
    onClick: () => void;
    color?: string;
    // size?: string;
}

export const CloseButton = (props: IconButtonProps) => {
    return (
        <BaseIconButton {...props}>
            <CloseIcon fontSize="small" />
        </BaseIconButton>
    );
};
