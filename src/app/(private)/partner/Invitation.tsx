"use client";

import { useApi } from "@/src/hooks/api/v1/useApi";
import { useUser } from "@/src/hooks/api/v1/useUser";
import {
    TextField,
    Button,
    FormControl,
    InputLabel,
    InputAdornment,
    Input,
    IconButton,
    Skeleton,
    Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";

type InvitationLink = string | null;

export const Invitation = () => {
    // 表示する内容
    // 相手がリンクをクリックしていた場合は有効期限が有効化されているので、
    // 相手の行動を一覧にする
    // 〇〇月〇〇日 リンクがクリックされました。
    // 招待コード： 残り〇〇時間〇〇秒
    // 招待コードを無効化して再発行する

    const api = useApi();
    const [invitationLink, setInvitationLink] = useState<InvitationLink>(null);

    const { currentUser } = useUser();

    const generateInvitationToken = async () => {
        const res: any = await api.get({
            url: `http://192.168.1.10/api/v1/invitations/${currentUser?.uid}`,
        });
        const url = await res?.data.url;
        setInvitationLink(() => url);
    };

    useEffect(() => {
        generateInvitationToken();
    }, []);

    return (
        <div className="flex flex-col gap-8">
            <InviteLinkCopyForm invitationLink={invitationLink} />
            <div></div>

            <div className="text-sm text-gray-500">
                <p>2023年5月15日 招待相手がリンクをクリックしました。</p>
                <ExpirationTimer expirationTime={1693651270928} />
            </div>
        </div>
    );
};

/////////////////////////////////////////////////////////////////////////////////////
// 招待コードをコピーするフォーム
/////////////////////////////////////////////////////////////////////////////////////
const InviteLinkCopyForm = ({ invitationLink }: { invitationLink: InvitationLink }) => {
    const [isShowTooltipTitle, setIsShowTooltipTitle] = useState(false);

    if (invitationLink === null) {
        return <Skeleton variant="rectangular" animation="wave" width={360} height={48} />;
    }

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(invitationLink);
            setIsShowTooltipTitle(prev => !prev);
        } catch (error) {
            // 失敗時時アクション
        }
    };

    return (
        <FormControl sx={{ width: "40ch" }} variant="outlined">
            <TextField
                id="outlined-basic"
                label="招待リンク"
                variant="outlined"
                value={invitationLink}
                InputLabelProps={{ shrink: true }}
                InputProps={{
                    endAdornment: (
                        <InputAdornment position="end">
                            <Tooltip
                                title="コピーしました！"
                                open={isShowTooltipTitle}
                                onClick={() => setIsShowTooltipTitle(true)}
                                onClose={() => setIsShowTooltipTitle(false)}
                            >
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={copy}
                                >
                                    <ContentCopyIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </InputAdornment>
                    ),
                }}
            />
        </FormControl>
    );
};

/////////////////////////////////////////////////////////////////////////////////////
// 招待コードが有効な残り時間を表示するコンポーネント
/////////////////////////////////////////////////////////////////////////////////////
const ExpirationTimer = ({ expirationTime }: { expirationTime: number }) => {
    const [timeRemaining, setTimeRemaining] = useState(expirationTime - Date.now());
    const hours = Math.floor((timeRemaining / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeRemaining / (1000 * 60)) % 60);
    const seconds = Math.floor((timeRemaining / 1000) % 60);
    useEffect(() => {
        const timerInterval = setInterval(() => {
            const newTimeRemaining = expirationTime - Date.now();
            if (newTimeRemaining <= 0) {
                clearInterval(timerInterval);
                // 有効期限が切れた場合の処理を追加
            } else {
                setTimeRemaining(newTimeRemaining);
            }
        }, 1000); // 1秒ごとに更新
        return () => clearInterval(timerInterval);
    }, [expirationTime]);
    return (
        <p>
            [有効期限] 残り: {hours} 時間 {minutes} 分 {seconds} 秒
        </p>
    );
};
