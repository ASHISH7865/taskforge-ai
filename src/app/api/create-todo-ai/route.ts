import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";

export const maxDuration = 30;

// Define the TypeScript types as Zod schemas
const prioritySchema = z.enum(["HIGH", "MEDIUM", "LOW"]);

const taskCategorySchema = z.enum([
  "Admin", "Meetings", "Emails", "ProjectWork", "Development",
  "Design", "Marketing", "Sales", "ClientWork", "Research",
  "Home", "Finance", "Errands", "Health", "Family",
  "Travel", "Appointments", "Learning", "Reading", "Habits",
  "Journaling", "Meditation", "Fitness", "Career", "Social",
  "EventPlanning", "Birthdays", "CatchUp", "SideProject", "PassionProject",
  "ContentCreation", "Resume", "JobSearch", "Explore", "TechSetup",
  "Subscriptions", "Maintenance", "Backups", "Uncategorized",
]);

const todoSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.enum(["COMPLETED", "NOT_COMPLETED"]),
  category: taskCategorySchema,
  priority: prioritySchema,
  tags: z.array(z.string()),
  dueDate: z.string().nullable(),
  reminder: z.boolean(),
  position: z.number(),
  selected: z.boolean().optional(),
  notes: z.string().optional(),
});

// Define response schema outside the handler for better memory efficiency
const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  todos: z.array(todoSchema)
});

const getCurrentDateISOString = () => new Date().toISOString();

// Create a more structured system prompt with examples
const createSystemPrompt = (currentDate: string) => `
You are a task assistant that parses natural language into structured task objects.

IMPORTANT INSTRUCTIONS:
1. For learning-related requests like "I want to understand complete Node.js", create a SERIES of logical, sequential tasks that break down the learning path.
2. For multiple tasks mentioned in one input, create separate task objects for each.

For each task identified, create a Todo object with these properties:
- id: Use placeholder IDs ("task-1", "task-2", etc.)
- title: Clear, concise task description
- status: Always "NOT_COMPLETED" for new tasks
- category: Select most appropriate category from available options
- priority: Infer "HIGH", "MEDIUM", or "LOW" based on urgency words, context, or due dates
- tags: Extract 2-5 relevant keywords as tags
- dueDate: ISO string date if mentioned, null if not specified
- reminder: true if specific time mentioned, false otherwise
- position: Use sequential numbers (0, 1, 2...) based on implied order
- notes: Include detailed, structured information relevant to completing the task

Current date context: ${currentDate}

EXAMPLES:

1. Input: "I want to understand complete Node.js"
   Response: Create a learning path with multiple sequential tasks like:
   - "Learn Node.js basics and installation" (category: Learning, tags: ["nodejs", "programming", "backend"])
   - "Practice Node.js core modules" (category: Learning, tags: ["nodejs", "modules", "practice"])
   - "Build a simple Node.js server" (category: Development, tags: ["nodejs", "server", "project"])
   ...and so on

2. Input: "Buy milk today and call mom tomorrow"
   Response: Create two separate tasks:
   - One for buying milk (category: Errands)
   - One for calling mom (category: Family)

If input is unrelated to task creation, return: { "success": false, "message": "I'm sorry, I can't create a task from this input.", "todos": [] }
`;

export async function POST(req: Request) {
  try {
    const { input } = await req.json();

    // Input validation
    if (!input || typeof input !== 'string') {
      return Response.json(
        { success: false, message: "Input must be a non-empty string", todos: [] },
        { status: 400 }
      );
    }

    const currentDate = getCurrentDateISOString();
    const systemPrompt = createSystemPrompt(currentDate);

    // Generate AI response with proper schema validation
    const result = await generateObject({
      model: google("gemini-1.5-flash"),
      schema: responseSchema,
      prompt: `${systemPrompt}\n\nUser input: "${input.trim()}"`,
      temperature: 0.2, // Lower temperature for more consistent task parsing
    });

    // Early return if not successful
    if (!result.object.success) {
      return Response.json(result.object);
    }

    // Process the todos with proper UUIDs and position values
    const processedTodos = result.object.todos.map((todo, index) => ({
      ...todo,
      id: uuidv4(),
      position: index
    }));

    return Response.json({
      success: true,
      message: result.object.message,
      todos: processedTodos
    });

  } catch (error) {
    console.error("Error processing request:", error);
    return Response.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal Server Error",
        todos: []
      },
      { status: 500 }
    );
  }
}
