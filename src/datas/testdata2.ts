
// const testdata = [
//     {
//         date: "2023-05-16",
//         transactions: [
//             {
//                 transaction_id: 1,
//                 selected_date: "2023-05-16",
//                 type: "spending",
//                 big_category_id: 2,
//                 small_category_id: 4,
//                 content: "セブンでごはんだみ",
//                 amount: [
//                     { user_id: 1, user: "たいせい", amount: 200 },
//                     { user_id: 2, user: "まゆみ", amount: 300 },
//                 ],
//                 regisered_user: {
//                     user_id: 1,
//                     user: "たいせい",
//                 },
//             },
//         ],
//     },
// ];
const testdata = [
    {
        id: 1,
        date: "2023-05-16",
        type: "spending",
        big_category_id: 2,
        small_category_id: 4,
        content: "セブンでごはんだみ",
        total_amount: 50000,
        user: "まゆみ",
        description: [
            { user: "まゆみ", amount: 200 },
            { user: "たいせい", amount: 300 },
        ],
    },
    {
        id: 2,
        date: "2023-05-16",
        type: "spending",
        big_category_id: 2,
        small_category_id: 4,
        content: "セブンでごはんだみ",
        total_amount: 50000,
        user: "まゆみ",
        description: [
            { user: "まゆみ", amount: 200 },
            { user: "たいせい", amount: 300 },
        ],
    },
    {
        id: 3,
        date: "2023-05-16",
        type: "spending",
        big_category_id: 2,
        small_category_id: 4,
        content: "セブンでごはんだみ",
        total_amount: 50000,
        user: "まゆみ",
        description: [
            { user: "まゆみ", amount: 200 },
            { user: "たいせい", amount: 300 },
        ],
    },
];

export default testdata;
