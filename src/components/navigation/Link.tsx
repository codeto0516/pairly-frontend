import { Button } from "@mui/material";
import Link from "next/link";

interface LinkProps {
    href: string;
    children: React.ReactNode;
}
export const LinkPrimary = (props: LinkProps) => {
    return (
        <Link href={props.href}>
            <Button>{props.children}</Button>
        </Link>
    );
};
