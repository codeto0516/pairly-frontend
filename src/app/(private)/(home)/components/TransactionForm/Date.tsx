import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker, DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { UseDateFieldProps } from "@mui/x-date-pickers/DateField";
import { BaseSingleInputFieldProps, DateValidationError, FieldSection } from "@mui/x-date-pickers/models";

import ja from "date-fns/locale/ja";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { jaJP } from "@mui/x-date-pickers";
import { useState } from "react";
import { format } from "date-fns";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import { useTransactionContext } from "./main";

////////////////////////////////////////////////////////////////////////////////////////////////
// 本体
////////////////////////////////////////////////////////////////////////////////////////////////
export const TransactionFormDate = () => {
    const { transaction, changeTransaction } = useTransactionContext();

    const [label, setLabel] = useState<string | null>(transaction.paidDate ?? null);

    const changeDate = (newDate: Date | null) => {
        if (newDate) {
            const formattedDate = format(new Date(newDate), "yyyy-MM-dd");
            changeTransaction("paidDate", formattedDate);
            setLabel(() => formattedDate);
        }
    };

    return (
        <LocalizationProvider
            dateAdapter={AdapterDateFns}
            dateFormats={{ monthAndYear: "yyyy年 MM月" }}
            adapterLocale={ja}
            localeText={jaJP.components.MuiLocalizationProvider.defaultProps.localeText}
        >
            <CustomDatePicker label={label} onChange={(selectedDate) => changeDate(selectedDate)} />
        </LocalizationProvider>
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////
// 日付選択ボタン
////////////////////////////////////////////////////////////////////////////////////////////////
interface ButtonFieldProps
    extends UseDateFieldProps<Date>,
        BaseSingleInputFieldProps<Date | null, Date, FieldSection, DateValidationError> {
    setOpen?: React.Dispatch<React.SetStateAction<boolean>>;
}
const ButtonField = (props: ButtonFieldProps) => {
    const { setOpen, label, InputProps: { ref } = {} } = props;

    return (
        <div
            className="flex items-center gap-1 justify-end text-gray-500"
            ref={ref}
            onClick={() => setOpen?.((prev) => !prev)}
        >
            <CalendarMonthOutlinedIcon className="relative -top-0.5" fontSize="small" />
            <button>{label ?? "日付を選択してください。"}</button>
        </div>
    );
};

////////////////////////////////////////////////////////////////////////////////////////////////
// 日付選択カレンダー（ポップアップ形式）
////////////////////////////////////////////////////////////////////////////////////////////////
const CustomDatePicker = (props: Omit<DatePickerProps<Date>, "open" | "onOpen" | "onClose">) => {
    const [open, setOpen] = useState(false);

    return (
        <DatePicker
            slots={{
                field: ButtonField,
                ...props.slots,
            }}
            slotProps={{
                field: { setOpen } as any,
                toolbar: { hidden: true },
                actionBar: {
                    actions: ["today"],
                },
            }}
            {...props}
            open={open}
            onClose={() => setOpen(false)}
            onOpen={() => setOpen(true)}
        />
    );
};
