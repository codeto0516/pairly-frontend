import TextField from "@mui/material/TextField";
import { Invitation } from "./Invitation";
import { ContainerCenter } from "@/src/components/layouts/Container";

const Page = () => {
    return (
        <ContainerCenter>
            <div className="min-h-full">
                {/* <a href="mailto:?subject=件名&body=本文" target='_blank'>メールでシェアする</a> */}
                <Invitation />
            </div>
        </ContainerCenter>
    );
};

export default Page;
