import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ReactNode } from "react";


interface SelectorButtonProps {
    selectedItem: string | number;
    handler: (event: SelectChangeEvent<string>) => void;
    itemList: {
        name: string | number;
        value: string | number;
    }[];
    label: string;
}

export const SelectorButton = (props: SelectorButtonProps) => {
    return (
        <FormControl>
            <InputLabel>{props.label}</InputLabel>
            <Select
                value={props.selectedItem.toString()}
                label={props.label}
                onChange={props.handler}
                // className="w-24 h-10 border-none"
                sx={{width:"auto", height:"40px"}}
            >
                {props.itemList.map((item, index) => {
                <MenuItem value={10}>10件</MenuItem>;
                    return <MenuItem key={index} value={item.value}>{item.name}</MenuItem>;
                })}
            </Select>
        </FormControl>
    );
};
