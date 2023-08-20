import { TransactionItem } from "./TransactionItem";
// デモデータ
import testdata from "@/src/testdatas/testdata";

// 型定義
import { TransactionListType, TransactionType } from "@/src/types/transaction";

export const TransactionList = () => {
    const transactionList = testdata;

    return (
        <div className="flex flex-col gap-4 w-full text-gray-500">
            {/* 取得したデータをmapで1つずつ取り出す */}
            {transactionList.map((transactionList: TransactionListType, index: number) => (
                // 日付ごとに取引を分けて表示する
                <div key={index} className="rounded-sm overflow-hidden">
                    {/* 日付 */}
                    <div className="bg-whte font-bold text-gray-500 mb-1 text-xs md:text-sm px-2 py-0.5 md:py-1 ">
                        {transactionList.date}
                    </div>

                    {/* その日付の全ての記録一覧を表示 */}
                    <ul className="flex flex-col gap-0.5">
                        {transactionList.transactions.map((transaction: TransactionType, transIndex: number) => (
                            <TransactionItem key={transIndex} {...transaction} />
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};
