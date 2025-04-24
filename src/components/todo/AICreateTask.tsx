import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Loader2,
  Info,
  Calendar,
  Tag,
  Clock,
} from 'lucide-react';
import { useCreateAIGeneratedTaskMutation } from '@/lib/services/ai-api';
import { cn } from '@/lib/utils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

interface AICreateTaskProps {
  open: boolean;
  onClose: () => void;
}

const AICreateTask: React.FC<AICreateTaskProps> = ({ open, onClose }) => {
  const [createAIGeneratedTask, { isLoading }] = useCreateAIGeneratedTaskMutation();
//   const dispatch = useDispatch();

  // Form state
  const [taskInput, setTaskInput] = useState('');
  const [activeTab, setActiveTab] = useState('write');
  const maxLength = 500;
  const currentLength = taskInput.length;

  const examplePrompts = [
    {
      title: "Meeting with Design Team",
      description: "Schedule a meeting with the design team to review the new landing page mockups next Tuesday at 2pm. High priority.",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: "Project Deadline",
      description: "Complete the quarterly report by Friday with all financial data and charts. Set reminder for Thursday.",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      title: "Task with Tags",
      description: "Research competitors for the new product launch. Tag with #market-research and #competitor-analysis.",
      icon: <Tag className="h-4 w-4" />,
    },
  ];

  const handleCreateAIGeneratedTask = async () => {
    if (!taskInput) return;
    try {
        await createAIGeneratedTask(taskInput).unwrap(); // Use unwrap to catch errors
        setTaskInput('');
        onClose();
        toast.success("Smart task created successfully!");
    } catch (error) {
        console.error("Failed to create smart task:", error);
        toast.error("Failed to create smart task. Please try again.");
    }
  }

  const handleExampleClick = (example: string) => {
    setTaskInput(example);
    setActiveTab('write');
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] min-h-[300px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Smart Task
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="write">Write Task</TabsTrigger>
            <TabsTrigger value="examples">Examples</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-6 py-2">
            <div className="space-y-2">
              <Label htmlFor="task-input" className="text-sm font-medium">
                Describe your task in natural language
              </Label>
              <div className="relative">
                <Textarea
                  id="task-input"
                  value={taskInput}
                  onChange={(e) => setTaskInput(e.target.value)}
                  placeholder="Example: Create a new task for meeting with design team about new landing page mockups next week at 10am"
                  className={cn(
                    "min-h-[200px] resize-none",
                    currentLength > maxLength * 0.9 && "border-amber-500 focus-visible:ring-amber-500"
                  )}
                  maxLength={maxLength}
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1.5">
                  <span className={cn(
                    "text-xs",
                    currentLength > maxLength * 0.9 ? "text-amber-500" : "text-muted-foreground"
                  )}>
                    {currentLength}/{maxLength}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p>Our AI will automatically extract important details like due dates, priorities, and categories from your description.</p>
              </div>
            </div>

            {isLoading && (
              <div className="flex flex-col items-center justify-center py-8 space-y-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">Generating task...</p>
                  <p className="text-xs text-muted-foreground">Please wait while we process your request</p>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="examples" className="space-y-4 py-2">
            <div className="text-sm text-muted-foreground mb-2">
              Click on an example to use it as a template for your task.
            </div>
            <div className="space-y-3">
              {examplePrompts.map((example, index) => (
                <div
                  key={index}
                  className="p-3 border rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => handleExampleClick(example.description)}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {example.icon}
                    <span className="font-medium">{example.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{example.description}</p>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            onClick={handleCreateAIGeneratedTask}
            disabled={!taskInput || isLoading || currentLength > maxLength}
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Sparkles className="h-4 w-4" />
            {isLoading ? 'Processing...' : 'Generate Task'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AICreateTask;
