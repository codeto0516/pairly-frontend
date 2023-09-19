import { ComingSoon } from "@/src/components/ComingSoon";
import Button from '@mui/material/Button'
import Link from "next/link";

const Page = () => {
    return (
        <div className="flex flex-col items-center gap-16">
            <ComingSoon />
            <Button variant="text" color="primary">
                <Link href="./signin">ログイン画面に戻る</Link>
            </Button>
        </div>
    );
};

export default Page;
