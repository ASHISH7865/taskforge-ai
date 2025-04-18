import { baseApi } from './api';
import { addTodo, Todo } from '@/lib/features/todo/todo-slice';

interface AIGeneratedTaskResponse {
  todos: Todo[]
}


// Extended API with AI-specific endpoints
export const aiApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createAIGeneratedTask: builder.mutation<AIGeneratedTaskResponse, string>({
      query: (userInput) => ({
        url: '/create-todo-ai',
        method: 'POST',
        body: { input: userInput }
      }),
      invalidatesTags: ['Tasks'],
      onQueryStarted: async (userInput, { dispatch, queryFulfilled }) => {
        try {
          const result = await queryFulfilled;
          if (result.data.todos.length > 0) {
            const todos = result.data.todos;
            todos.forEach((todo) => {
              dispatch(addTodo(todo));
            });
          }
        } catch (error) {
          console.error('Error creating AI generated task:', error);
        }
      }
    }),
  }),
  // This API will not override existing endpoints
  overrideExisting: false,
});

// Export hooks for using the API endpoints
export const {
  useCreateAIGeneratedTaskMutation
} = aiApi;
