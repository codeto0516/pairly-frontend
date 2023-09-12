import GoogleIcon from "@mui/icons-material/Google";

interface GoogleSignButtonProps {
    children: React.ReactNode;
    onClick: () => Promise<void>;
    className: string;
}

// ベースボタン
const GoogleSignButton = (props: GoogleSignButtonProps) => {
    return (
        <button
            onClick={props.onClick}
            className={`
                flex justify-center items-center gap-4
                p-3 w-full rounded-sm text-white text-sm shadow-md ${props.className}
            `}
        >
            <GoogleIcon fontSize="small" />
            {props.children}
        </button>
    );
};


// ログインボタン
export const GoogleSignInButton = ({ onClick }: { onClick: () => Promise<void> }) => {
    return (
        <GoogleSignButton onClick={onClick} className="bg-[#da5353]">
            Googleアカウントでログイン
        </GoogleSignButton>
    );
};

// 新規登録ボタン
export const GoogleSignUpButton = ({ onClick }: { onClick: () => Promise<void> }) => {
    return (
        <GoogleSignButton onClick={onClick} className="bg-[#445098]">
            Googleアカウントで新規登録
        </GoogleSignButton>
    );
};
