import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";

/**
 * Todo Types
 */
export type Priority = "HIGH" | "MEDIUM" | "LOW";

export type TaskCategory = "Admin" | "Meetings" | "Emails" | "ProjectWork" | "Development" | "Design" | "Marketing" | "Sales" | "ClientWork" | "Research" | "Home" | "Finance" | "Errands" | "Health" | "Family" | "Travel" | "Appointments" | "Learning" | "Reading" | "Habits" | "Journaling" | "Meditation" | "Fitness" | "Career" | "Social" | "EventPlanning" | "Birthdays" | "CatchUp" | "SideProject" | "PassionProject" | "ContentCreation" | "Resume" | "JobSearch" | "Explore" | "TechSetup" | "Subscriptions" | "Maintenance" | "Backups" | "Uncategorized";
/**
 * Todo Interface
 */
export interface Todo {
  id: string;
  title: string;
  status: "COMPLETED" | "NOT_COMPLETED";
  category: TaskCategory;
  priority: Priority;
  tags: string[];
  dueDate: string | null;
  reminder: boolean;
  position: number;
  selected?: boolean;
  notes?: string;
}

/**
 * Todo State
 */
interface TodoState {
  todos: Todo[];
  isZenMode: boolean;
  selectedCount: number;
}

/**
 * Load Todos From Storage
 * @returns Todo[]
 */
const loadTodosFromStorage = (): Todo[] => {
  if (typeof window === "undefined") return [];

  try {
    const storedTodos = localStorage.getItem("todos");
    return storedTodos ? JSON.parse(storedTodos) : [];
  } catch (error) {
    console.error("Failed to load todos from localStorage:", error);
    return [];
  }
};

/**
 * Save Todos To Storage
 * @param todos Todo[]
 */
const saveTodosToStorage = (todos: Todo[]) => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem("todos", JSON.stringify(todos));
  } catch (error) {
    console.error("Failed to save todos to localStorage:", error);
  }
};

/**
 * Create Sample Todos
 * @returns Omit<Todo, "id" | "position">[]
 */
const createSampleTodos = (): Omit<Todo, "id" | "position">[] => {
  return [
    {
      title: "Welcome to EasyTodo! Double-click to edit this task",
      status: "NOT_COMPLETED" as const,
      priority: "MEDIUM",
      tags: ["sample"],
      dueDate: null,
      reminder: false,
      category: "Admin",
    },
    {
      title: "Drag and drop tasks to reorder them",
      status: "NOT_COMPLETED" as const,
      priority: "LOW" as const,
      tags: ["tutorial"],
      dueDate: null,
      reminder: false,
      category: "Admin",
    },
    {
      title: "Important tasks are highlighted with red",
      status: "NOT_COMPLETED" as const,
      priority: "HIGH" as const,
      tags: ["important"],
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
      reminder: true,
      category: "Admin",
    },
  ];
};

/**
 * Stored Todos
 */
const storedTodos = loadTodosFromStorage();

/**
 * Initial State
 * @type {TodoState}
 * @description Initial state for the todo slice
 * @property {Todo[]} todos - The list of todos
 * @property {boolean} isZenMode - Whether the zen mode is enabled
 * @property {number} selectedCount - The number of selected todos
 */
const initialState: TodoState = {
  todos: storedTodos.length > 0 ? storedTodos : [],
  isZenMode: false,
  selectedCount: 0,
};

export const todoSlice = createSlice({
  name: "todos",
  initialState,
  reducers: {
    initializeTodos: (state) => {
      // Only initialize if no todos exist
      if (state.todos.length === 0) {
        const sampleTodos = createSampleTodos();
        const maxPosition = -1;

        sampleTodos.forEach((todo, index) => {
          state.todos.push({
            id: nanoid(),
            position: maxPosition + 1 + index,
            selected: false,
            ...todo,
          });
        });

        // Save the initial todos to localStorage
        saveTodosToStorage(state.todos);
      }
    },
    addTodo: (state, action: PayloadAction<Omit<Todo, "id" | "position">>) => {
      // Find the highest position value
      const maxPosition = state.todos.length > 0 ? Math.max(...state.todos.map((todo) => todo.position)) : -1;

      state.todos.push({
        id: nanoid(),
        position: maxPosition + 1,
        selected: false,
        ...action.payload,
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    addBulkTodo: (state, action: PayloadAction<Omit<Todo, "id" | "position">[]>) => {
      // Find the highest position value
      const maxPosition = state.todos.length > 0 ? Math.max(...state.todos.map((todo) => todo.position)) : -1;

      action.payload.forEach((todo, index) => {
        state.todos.push({
          id: nanoid(),
          position: maxPosition + 1 + index,
          selected: false,
          ...todo,
        });
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    toggleTodo: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.status = todo.status === "COMPLETED" ? "NOT_COMPLETED" : "COMPLETED";
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    editTodo: (state, action: PayloadAction<{ id: string; newTitle: string; notes?: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.newTitle;
        if (action.payload.notes !== undefined) {
          todo.notes = action.payload.notes;
        }
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    updateTodoTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.title = action.payload.title;
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    updateTodoPriority: (state, action: PayloadAction<{ id: string; priority: Priority }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.priority = action.payload.priority;
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    updateTodoDueDate: (state, action: PayloadAction<{ id: string; dueDate: string | null }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.dueDate = action.payload.dueDate;
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    updateTodoCategory: (state, action: PayloadAction<{ id: string; category: TaskCategory }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.category = action.payload.category;
      }
    },
    toggleTodoReminder: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.reminder = !todo.reminder;
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    addTagToTodo: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo && !todo.tags.includes(action.payload.tag)) {
        todo.tags.push(action.payload.tag);
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    removeTagFromTodo: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.tags = todo.tags.filter((tag) => tag !== action.payload.tag);
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    reorderTodos: (state, action: PayloadAction<{ todoIds: string[] }>) => {
      // Reorder todos based on the new order of IDs
      const { todoIds } = action.payload;

      // Update positions based on new order
      todoIds.forEach((id, index) => {
        const todo = state.todos.find((todo) => todo.id === id);
        if (todo) {
          todo.position = index;
        }
      });

      // Sort the todos array by position
      state.todos.sort((a, b) => a.position - b.position);

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    removeTodo: (state, action: PayloadAction<string>) => {
      // Remove a single todo by ID
      state.todos = state.todos.filter((todo) => todo.id !== action.payload);

      // Reorder the remaining todos
      state.todos.forEach((todo, index) => {
        todo.position = index;
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    clearCompleted: (state) => {
      state.todos = state.todos.filter((todo) => todo.status !== "COMPLETED");

      // Reorder the remaining todos
      state.todos.forEach((todo, index) => {
        todo.position = index;
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    clearAll: (state) => {
      state.todos = [];
      state.selectedCount = 0;

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    toggleZenMode: (state) => {
      state.isZenMode = !state.isZenMode;
    },
    // New reducers for selection and batch operations
    toggleSelection: (state, action: PayloadAction<string>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload);
      if (todo) {
        todo.selected = !todo.selected;
        state.selectedCount = todo.selected ? state.selectedCount + 1 : state.selectedCount - 1;
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    selectAll: (state) => {
      state.todos.forEach((todo) => {
        todo.selected = true;
      });
      state.selectedCount = state.todos.length;

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    deselectAll: (state) => {
      state.todos.forEach((todo) => {
        todo.selected = false;
      });
      state.selectedCount = 0;

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    deleteSelected: (state) => {
      state.todos = state.todos.filter((todo) => !todo.selected);
      // Reorder the remaining todos
      state.todos.forEach((todo, index) => {
        todo.position = index;
      });
      state.selectedCount = 0;

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    completeSelected: (state) => {
      state.todos.forEach((todo) => {
        if (todo.selected) {
          todo.status = "COMPLETED";
        }
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    uncompleteSelected: (state) => {
      state.todos.forEach((todo) => {
        if (todo.selected) {
          todo.status = "NOT_COMPLETED";
        }
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    deleteBulkTodos: (state, action: PayloadAction<{ ids: string[] }>) => {
      // Remove multiple todos by their IDs
      state.todos = state.todos.filter((todo) => !action.payload.ids.includes(todo.id));

      // Reorder the remaining todos
      state.todos.forEach((todo, index) => {
        todo.position = index;
      });

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
    updateTodoStatus: (state, action: PayloadAction<{ id: string; status: "COMPLETED" | "NOT_COMPLETED" }>) => {
      const todo = state.todos.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.status = action.payload.status;
      }

      // Save to localStorage
      saveTodosToStorage(state.todos);
    },
  },
});

export const {
  initializeTodos,
  addTodo,
  addBulkTodo,
  toggleTodo,
  editTodo,
  updateTodoTitle,
  updateTodoPriority,
  updateTodoDueDate,
  toggleTodoReminder,
  addTagToTodo,
  removeTagFromTodo,
  reorderTodos,
  removeTodo,
  clearCompleted,
  clearAll,
  toggleZenMode,
  toggleSelection,
  selectAll,
  deselectAll,
  deleteSelected,
  completeSelected,
  uncompleteSelected,
  deleteBulkTodos,
  updateTodoStatus,
} = todoSlice.actions;

export default todoSlice.reducer;
