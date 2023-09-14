import Fab from "@mui/material/Fab";
import AddIcon from "@mui/icons-material/Add";

interface FloatingButtonProps {
    onClick: () => void;
}
export const FloatingButton = (props: FloatingButtonProps) => {
    return (
        <Fab
            aria-label="add"
            style={{ backgroundColor: "#F87171", color: "white", position: "fixed", right: "16px", bottom: "16px" }}
            onClick={props.onClick}
        >
            <AddIcon className="text-white" />
        </Fab>
    );
};
