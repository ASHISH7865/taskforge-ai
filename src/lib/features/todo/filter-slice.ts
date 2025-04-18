import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Priority } from "@/lib/features/todo/todo-slice";

export type DueDateFilter = 'all' | 'today' | 'tomorrow' | 'thisWeek' | 'overdue' | 'none';

interface FilterState {
  selectedTags: string[];
  selectedPriority: Priority | null;
  searchQuery: string;
  showCompleted: boolean;
  dueDateFilter: DueDateFilter;
  onlyReminders: boolean;
}

const initialState: FilterState = {
  selectedTags: [],
  selectedPriority: null,
  searchQuery: "",
  showCompleted: true,
  dueDateFilter: 'all',
  onlyReminders: false,
};

const filterSlice = createSlice({
  name: "filter",
  initialState,
  reducers: {
    addTagFilter: (state, action: PayloadAction<string>) => {
      if (!state.selectedTags.includes(action.payload)) {
        state.selectedTags.push(action.payload);
      }
    },
    removeTagFilter: (state, action: PayloadAction<string>) => {
      state.selectedTags = state.selectedTags.filter(tag => tag !== action.payload);
    },
    clearTagFilters: (state) => {
      state.selectedTags = [];
    },
    setPriorityFilter: (state, action: PayloadAction<Priority | null>) => {
      state.selectedPriority = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleShowCompleted: (state) => {
      state.showCompleted = !state.showCompleted;
    },
    setDueDateFilter: (state, action: PayloadAction<DueDateFilter>) => {
      state.dueDateFilter = action.payload;
    },
    toggleOnlyReminders: (state) => {
      state.onlyReminders = !state.onlyReminders;
    },
    resetAllFilters: () => {
      return initialState;
    }
  },
});

export const {
  addTagFilter,
  removeTagFilter,
  clearTagFilters,
  setPriorityFilter,
  setSearchQuery,
  toggleShowCompleted,
  setDueDateFilter,
  toggleOnlyReminders,
  resetAllFilters
} = filterSlice.actions;

export default filterSlice.reducer;
