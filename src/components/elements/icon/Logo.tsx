import { Typography } from "@mui/material";
import Link from "next/link";

const Logo = () => {
    return (
        <Link href="/"> 
            <Typography
                variant="h6"
                noWrap
                sx={{
                    display: { xs: "flex", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".15rem",
                    color: "#cd8e8e",
                    textDecoration: "none",
                }}
            >
                Pairly
            </Typography>
        </Link>
    );
};

export default Logo;
