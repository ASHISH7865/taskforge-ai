import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Sparkles,
  Loader2,
} from 'lucide-react';
import { useCreateAIGeneratedTaskMutation } from '@/lib/services/ai-api';

interface AICreateTaskProps {
  open: boolean;
  onClose: () => void;
}

const AICreateTask: React.FC<AICreateTaskProps> = ({ open, onClose }) => {
  const [createAIGeneratedTask, { isLoading }] = useCreateAIGeneratedTaskMutation();
//   const dispatch = useDispatch();

  // Form state
  const [taskInput, setTaskInput] = useState('');

  const handleCreateAIGeneratedTask = async () => {
    if (!taskInput) return;
    await createAIGeneratedTask(taskInput);
    setTaskInput('');
  }


  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] min-h-[300px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="h-5 w-5 text-primary" />
            Create Smart Task
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
              <div>
                <Label htmlFor="task-input" className="text-sm font-medium">
                  Describe your task in natural language
                </Label>
                <div className="mt-1.5 relative">
                  <Textarea
                    id="task-input"
                    value={taskInput}
                    onChange={(e) => setTaskInput(e.target.value)}
                    placeholder="Create a new task for meeting with design team about new landing page mockups next week at 10am"
                    className="min-h-[200px] "
                  />
                </div>
              </div>

              {isLoading && (
                <div className="flex flex-col items-center justify-center py-6">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="mt-2 text-sm text-muted-foreground">Generating task...</p>
                </div>
              )}
            </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={onClose} className="mr-2">
            Cancel
          </Button>

            <Button
              variant="default"
              onClick={handleCreateAIGeneratedTask}
              disabled={!taskInput || isLoading}
              className="flex items-center gap-2"
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
