import {LoadingButton as MuiLoadingButton} from "@mui/lab";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { ReactNode, useEffect, useState } from "react";

interface SaveButtonProps {
    children: ReactNode | undefined;
    onClick?: any;
    Disabled?: boolean;
    className?: string | undefined;


}

export const LoadingButton = ({ children, onClick, Disabled, className }: SaveButtonProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [isDisabled, setIsDisabled] = useState(false);
    const [icon, setIcon] = useState<ReactNode | undefined>(undefined);

    useEffect(() => {
        // フォームが編集されたら検知して保存ボタンのDisabledを解除
        setIsDisabled(false);
    }, [Disabled]);

    // クリックハンドラ
    const handleClick = async () => {
        // ローディング開始
        setIsLoading(true);

        // クリック禁止にする（連打防止）
        setIsDisabled(true);

        // 引数で渡された非同期処理を実行
        try {
            await onClick();
            setIcon(<DoneIcon className="text-blue-400" />);
        } catch (error) {
            console.log("エラーになりました");
            setIcon(<CloseIcon className="text-red-400" />);
            setIsDisabled(false);
        }

        // ローディング終了
        setIsLoading(false);

        // 終了ハンドラーを起動
        handleFinished();
    };

    // 終了ハンドラ
    const handleFinished = () => {
        setIsFinished(true);

        setTimeout(() => {
            setIsFinished(false);
        }, 2000);
    };

    return (
        <MuiLoadingButton
            loading={isLoading}
            variant="outlined"
            onClick={handleClick}
            disabled={isDisabled}
            sx={{ height: "48px" }}
        >
            {isFinished ? icon : children}
        </MuiLoadingButton>
    );
};
