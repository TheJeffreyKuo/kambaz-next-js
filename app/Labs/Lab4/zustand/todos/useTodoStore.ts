import { create } from "zustand";

interface Todo {
  id: string;
  title: string;
}

interface TodoState {
  todos: Todo[];
  todo: Todo;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

export const useTodoStore = create<TodoState>((set) => ({
  todos: [
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ],
  todo: { id: "-1", title: "Learn Mongo" },
  addTodo: (todo) =>
    set((state) => ({
      todos: [...state.todos, { ...todo, id: new Date().getTime().toString() }],
      todo: { id: "-1", title: "" },
    })),
  deleteTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((todo) => todo.id !== id),
    })),
  updateTodo: (todo) =>
    set((state) => ({
      todos: state.todos.map((item) =>
        item.id === todo.id ? todo : item
      ),
      todo: { id: "-1", title: "" },
    })),
  setTodo: (todo) => set({ todo }),
}));
