import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import { IconButton } from "@mui/material";

export const MonthSelectorButton = () => {
    return (
        <div className="flex gap-4 items-center">
            <IconButton className=" rounded-md h-8 border border-gray-400 border-solid">
                <ArrowLeftIcon fontSize="large" />
            </IconButton>
            <div>
                <p className="text-xl text-gray-500">2023 / 05 / 01 ~ 2023 / 05 / 31</p>
            </div>
            <IconButton className=" rounded-md h-8 border border-gray-400 border-solid">
                <ArrowRightIcon fontSize="large" />
            </IconButton>
        </div>
    );
};
