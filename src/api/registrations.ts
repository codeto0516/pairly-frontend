// export const signUp = async (): Promise<any> => {
//     const res = await fetch(`http://localhost/api/v1/auth/sign_in`, {
//         cache: "no-store", // SSR or CSR
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//             email: "codetaisei@gmail.com",
//             password: "Ogawa516",
//         }),
//     });
//     if (!res.ok) {
//         // This will activate the closest `error.js` Error Boundary
//         throw new Error("Failed to fetch data");
//     }
//     return res.json();
// };

// export const addTodo = async (todo: Task): Promise<Task> => {
//     const res = await fetch(`http://localhost:3001/tasks`, {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify(todo),
//     });
//     const newTodos = res.json();

//     return newTodos;
// };

// export const updateTodo = async (id: string, newText: string): Promise<Task> => {
//     const res = await fetch(`http://localhost:3001/tasks/${id}`, {
//         method: "PUT",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ text: newText }),
//     });
//     const updatedTodos = res.json();

//     return updatedTodos;
// };

// export const deleteTodo = async (id: string): Promise<Task> => {
//     const res = await fetch(`http://localhost:3001/tasks/${id}`, {
//         method: "DELETE",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });
//     const deletedTodos = res.json();

//     return deletedTodos;
// };
