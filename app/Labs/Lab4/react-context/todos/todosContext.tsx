"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Todo {
  id: string;
  title: string;
}

interface TodosContextState {
  todos: Todo[];
  todo: Todo;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

const TodosContext = createContext<TodosContextState | undefined>(undefined);

export const TodosProvider = ({ children }: { children: ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ]);
  const [todo, setTodoState] = useState<Todo>({ id: "-1", title: "Learn Mongo" });

  const addTodo = (todo: Todo) => {
    const newTodos = [...todos, { ...todo, id: new Date().getTime().toString() }];
    setTodos(newTodos);
    setTodoState({ id: "-1", title: "" });
  };

  const deleteTodo = (id: string) => {
    const newTodos = todos.filter((todo) => todo.id !== id);
    setTodos(newTodos);
  };

  const updateTodo = (todo: Todo) => {
    const newTodos = todos.map((item) =>
      item.id === todo.id ? todo : item
    );
    setTodos(newTodos);
    setTodoState({ id: "-1", title: "" });
  };

  const setTodo = (todo: Todo) => {
    setTodoState(todo);
  };

  const value: TodosContextState = {
    todos,
    todo,
    addTodo,
    deleteTodo,
    updateTodo,
    setTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};

export const useTodos = () => {
  const context = useContext(TodosContext);
  return context;
};
