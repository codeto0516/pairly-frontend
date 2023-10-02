import { ContainerTop } from "@/src/components/layouts/Container";
import { NewTransactionForm } from "./components/TransactionForm/NewTransactionForm";
import { TransactionListWrapper } from "./components/TransactionList/ListWrapper";

const Page = () => {
    return (
        <ContainerTop>
            <div className="flex flex-col md:flex-row gap-8 w-full">
                {/* 取引の新規登録フォーム */}
                <NewTransactionForm />

                {/* 取引一覧表示 ＋ ページネーションなど */}
                <TransactionListWrapper />
            </div>
        </ContainerTop>
    );
};

export default Page;
