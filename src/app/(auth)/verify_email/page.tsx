"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@mui/lab";
import { PasswordField } from "@/src/components/inputs/textField/TextField";
import { useAuth } from "@/src/hooks/useAuth";
import {
    Form,
    FormBottomLinkWrapperCenter,
    FormSubmitButton,
    FormTitle,
    FormWrapper,
} from "@/src/components/inputs/form/Form";
import { LinkPrimary } from "@/src/components/navigation/Link";

const Page = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const oobCode = searchParams.get("oobCode");

    const { verifyEmail, isLoading, successMessage, errorMessage } = useAuth();

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const result = await verifyEmail(oobCode);

        if (result) {
            router.push("/signin");
        }
    };

    return (
        <FormWrapper>
            <FormTitle>メールアドレスの有効化</FormTitle>

            <Form onSubmit={handleSubmit}>
                <FormSubmitButton isLoading={isLoading}>{isLoading ? "有効化中..." : "有効化"}</FormSubmitButton>
                {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
                {successMessage && <Alert severity="success">{successMessage}</Alert>}
            </Form>
            <FormBottomLinkWrapperCenter>
                <LinkPrimary href="/signin">ログイン画面に戻る</LinkPrimary>
            </FormBottomLinkWrapperCenter>
        </FormWrapper>
    );
};

export default Page;
