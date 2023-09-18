import { ToggleButton as MuiToggleButton, ToggleButtonGroup as MuiToggleButtonGroup } from "@mui/material";

interface CustomToggleButtonProps {
    toggleList: {
        title: string;
        value: string;
    }[];
    handler: (value: string) => void;
    value: string;
}

export const ToggleButton = (props: CustomToggleButtonProps) => {
    return (
        <MuiToggleButtonGroup
            color="primary"
            value={props.value}
            exclusive
            onChange={(e: React.MouseEvent<HTMLElement>, value: any) => props.handler && props.handler(value)}
            sx={{ width: "100%" }}
        >
            {props.toggleList.map((item, index) => {
                return (
                    <MuiToggleButton key={index} value={item.value} sx={{ width: "100%" }}>
                        {item.title}
                    </MuiToggleButton>
                );
            })}
        </MuiToggleButtonGroup>
    );
};
