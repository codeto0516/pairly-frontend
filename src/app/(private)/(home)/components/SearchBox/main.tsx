"use client";

import { useContext, useState, createContext, useEffect, useRef } from "react";

// Material UI
import {
    Restaurant as RestaurantIcon,
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Button, IconButton, Collapse, TextField, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";


const SearchBox = () => {
    const [accordionIsOpen, setAccordionIdOpen] = useState(false);

    return (
        <div className="border border-gray-300 rounded-md">
            {/* -----------------------------------------------------------------------
             リスト（最初に表示されるリスト。下のアコーディオンを開けば詳細が見れる）
            ----------------------------------------------------------------------- */}
            <div
                className="flex items-center justify-between px-4 text-sm"
                onClick={() => {
                    setAccordionIdOpen(!accordionIsOpen);
                }}
            >
                <div className="flex items-center gap-2">
                    <SearchIcon fontSize="small" />
                    絞り込み
                </div>

                {/* 開閉ボタン */}
                <IconButton size="small" onClick={() => setAccordionIdOpen(!accordionIsOpen)}>
                    {accordionIsOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
            </div>

            {/* -----------------------------------------------------------------------
             詳細（アコーディオンで表示）
            ----------------------------------------------------------------------- */}
            <Collapse in={accordionIsOpen} timeout="auto" unmountOnExit>
                <div className="p-4">
                    <div className="flex items-center">
                        <TextField
                            label="キーワード検索"
                            variant="standard"
                            multiline
                            // value={""}
                            // onChange={(e) => handleChangeContent(e.target.value)}
                            className="w-full"
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button variant="text" color="primary">
                                            <SearchIcon fontSize="small" />
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </div>
                </div>
            </Collapse>
        </div>
    );
};

export default SearchBox;
