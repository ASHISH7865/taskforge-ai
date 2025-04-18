import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Todo, editTodo, updateTodoTitle, updateTodoPriority, updateTodoDueDate, toggleTodoReminder, addTagToTodo, removeTagFromTodo, TaskCategory } from '@/lib/features/todo/todo-slice';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditorComponent from '@/components/editor/rich-text-editor';
import { Edit, Save, X, Calendar, Star, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Switch } from '@/components/ui/switch';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { TaskCategoriesData } from './TodoInput';

interface TaskNoteModalProps {
  open: boolean;
  onClose: () => void;
  task: Todo;
}

const TaskNoteModal: React.FC<TaskNoteModalProps> = ({ open, onClose, task }) => {
  const dispatch = useDispatch();

  // Local states
  const [taskTitle, setTaskTitle] = useState(task?.title || '');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [taskNotes, setTaskNotes] = useState(task?.notes || '');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('notes');
  const [taskPriority, setTaskPriority] = useState(task?.priority || 'MEDIUM');
  const [taskDueDate, setTaskDueDate] = useState<Date | undefined>(
    task?.dueDate ? new Date(task.dueDate) : undefined
  );
  const [taskReminder, setTaskReminder] = useState(task?.reminder || false);
  const [newTag, setNewTag] = useState('');
  const [taskTags, setTaskTags] = useState(task?.tags || []);
  const [taskCategory, setTaskCategory] = useState(task?.category || '');
  // Alert dialog state
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [pendingClose, setPendingClose] = useState(false);

  // Reset state when task changes
  useEffect(() => {
    if (task) {
      setTaskTitle(task.title);
      setTaskNotes(task.notes || '');
      setTaskPriority(task.priority || 'MEDIUM');
      setTaskDueDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setTaskReminder(task.reminder || false);
      setTaskTags(task.tags || []);
      setTaskCategory(task.category || '');
      setIsEditingTitle(false);
      setSaveSuccess(false);
    }
  }, [task]);

  // Handle title editing
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const saveTitle = () => {
    if (taskTitle.trim() !== task.title) {
      dispatch(updateTodoTitle({ id: task.id, title: taskTitle.trim() }));
    }
    setIsEditingTitle(false);
  };

  const handleTitleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveTitle();
    }
  };

  // Handle notes content change
  const handleNotesChange = (content: string) => {
    setTaskNotes(content);
  };

  // Handle priority change
  const handlePriorityChange = (priority: "HIGH" | "MEDIUM" | "LOW") => {
    setTaskPriority(priority);
  };

  // Handle due date change
  const handleDueDateChange = (date: Date | undefined) => {
    setTaskDueDate(date);
  };

  // Handle reminder toggle
  const handleReminderToggle = (checked: boolean) => {
    setTaskReminder(checked);
  };

  // Handle tag management
  const handleAddTag = () => {
    if (newTag.trim() && !taskTags.includes(newTag.trim())) {
      setTaskTags([...taskTags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTaskTags(taskTags.filter(tag => tag !== tagToRemove));
  };

  const handleCategoryChange = (value: string) => {
    setTaskCategory(value as TaskCategory);
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Save all changes
  const saveChanges = () => {
    setIsSaving(true);

    // Update title if changed
    if (taskTitle.trim() !== task.title) {
      dispatch(updateTodoTitle({ id: task.id, title: taskTitle.trim() }));
    }

    // Update notes
    dispatch(editTodo({
      id: task.id,
      newTitle: taskTitle.trim(),
      notes: taskNotes
    }));

    // Update priority
    if (taskPriority !== task.priority) {
      dispatch(updateTodoPriority({ id: task.id, priority: taskPriority }));
    }

    // Update due date
    dispatch(updateTodoDueDate({
      id: task.id,
      dueDate: taskDueDate ? taskDueDate.toISOString() : null
    }));

    // Update reminder
    if (taskReminder !== task.reminder) {
      dispatch(toggleTodoReminder(task.id));
    }

    // Update tags - add null checks for task.tags
    const taskCurrentTags = task.tags || [];
    const tagsToRemove = taskCurrentTags.filter(tag => !taskTags.includes(tag));
    const tagsToAdd = taskTags.filter(tag => !taskCurrentTags.includes(tag));

    tagsToRemove.forEach(tag => {
      dispatch(removeTagFromTodo({ id: task.id, tag }));
    });

    tagsToAdd.forEach(tag => {
      dispatch(addTagToTodo({ id: task.id, tag }));
    });

    // Show success message
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);

      // Hide success message after a delay
      setTimeout(() => {
        setSaveSuccess(false);
      }, 2000);

      // If we were waiting to close, do it now
      if (pendingClose) {
        setPendingClose(false);
        onClose();
      }
    }, 600);
  };

  const checkUnsavedChanges = () => {
    if (!task) return false;

    return (
      task.title !== taskTitle ||
      task.notes !== taskNotes ||
      task.priority !== taskPriority ||
      (task.dueDate ? new Date(task.dueDate).toDateString() : null) !== (taskDueDate?.toDateString() || null) ||
      task.reminder !== taskReminder ||
      !areTagsEqual(task.tags || [], taskTags)
    );
  };

  const handleClose = () => {
    if (checkUnsavedChanges()) {
      // Show the unsaved changes alert
      setShowUnsavedChangesAlert(true);
    } else {
      // No unsaved changes, close immediately
      onClose();
    }
  };

  const handleSaveAndClose = () => {
    saveChanges();
    setPendingClose(true);
    setShowUnsavedChangesAlert(false);
  };

  const handleDiscardAndClose = () => {
    setShowUnsavedChangesAlert(false);
    onClose();
  };

  // Helper function to compare tags without modifying original arrays
  const areTagsEqual = (tags1: string[], tags2: string[]) => {
    if (!tags1 || !tags2) return tags1 === tags2;
    if (tags1.length !== tags2.length) return false;

    const sortedTags1 = [...tags1].sort();
    const sortedTags2 = [...tags2].sort();

    return JSON.stringify(sortedTags1) === JSON.stringify(sortedTags2);
  };

  // Format the status and priority badges
  const formatPriority = (priority: string) => {
    const colors = {
      HIGH: 'bg-red-500',
      MEDIUM: 'bg-amber-500',
      LOW: 'bg-green-500'
    };

    return (
      <Badge className={cn("h-5 px-2", colors[priority as keyof typeof colors])}>
        {priority.charAt(0) + priority.slice(1).toLowerCase()}
      </Badge>
    );
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className=" flex flex-col">
          <DialogHeader className="pb-2 border-b">
            <div className="flex justify-between items-start gap-2">
              <div className="flex-1">
                {isEditingTitle ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={taskTitle}
                      onChange={handleTitleChange}
                      onBlur={saveTitle}
                      onKeyDown={handleTitleKeyDown}
                      className="text-xl font-semibold h-9"
                      autoFocus
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={saveTitle}
                      className="shrink-0"
                    >
                      <Save className="h-4 w-4 mr-1" /> Save
                    </Button>
                  </div>
                ) : (
                  <div className="group flex items-center gap-2">
                    <DialogTitle className="text-xl pr-8">{taskTitle}</DialogTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setIsEditingTitle(true)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                <div className="flex flex-wrap gap-2 mt-2">
                  {/* Status badge */}
                  <Badge variant={task.status === "COMPLETED" ? "default" : "outline"}>
                    {task.status === "COMPLETED" ? "Completed" : "Active"}
                  </Badge>

                  {/* Category badge */}
                  <Badge variant="default" className="flex items-center gap-1">
                    <span className="text-xs">Category: {task.category}</span>
                  </Badge>

                  {/* Priority badge */}
                  {formatPriority(taskPriority)}

                  {/* Due date if exists */}
                  {taskDueDate && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <span className="text-xs">Due: {format(taskDueDate, 'MMM d, yyyy')}</span>
                    </Badge>
                  )}

                  {/* Tags */}
                  {taskTags && taskTags.map((tag, i) => (
                    <Badge key={i} variant="secondary">{tag}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="flex-1 ">
            <Tabs value={activeTab} onValueChange={setActiveTab} className=" flex flex-col min-h-full">
              <TabsList className="grid w-full grid-cols-2 mb-2">
                <TabsTrigger value="notes">Notes</TabsTrigger>
                <TabsTrigger value="settings">Task Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="notes" className="flex-1 overflow-hidden flex flex-col">
                <div className="py-2">
                  <Label className="text-sm font-medium">Notes</Label>
                </div>
                <RichTextEditorComponent content={taskNotes} setContent={handleNotesChange} />
              </TabsContent>

              <TabsContent value="settings" className="flex-1 overflow-y-auto">
                <div className="space-y-6 p-2">
                  {/* Category Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Category</Label>
                    <Select value={taskCategory} onValueChange={handleCategoryChange} >
                    <SelectTrigger className="w-[180px] ">
                        <SelectValue placeholder="Select a category"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                                {TaskCategoriesData.map((category: { value: string; label: string } ) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                    </Select>
                  </div>

                  {/* Priority Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Priority</Label>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant={taskPriority === "HIGH" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePriorityChange("HIGH")}
                        className={cn(taskPriority === "HIGH" && "bg-red-500 hover:bg-red-600")}
                      >
                        <Star className="h-4 w-4 mr-2" /> High
                      </Button>
                      <Button
                        variant={taskPriority === "MEDIUM" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePriorityChange("MEDIUM")}
                        className={cn(taskPriority === "MEDIUM" && "bg-amber-500 hover:bg-amber-600")}
                      >
                        <Star className="h-4 w-4 mr-2" /> Medium
                      </Button>
                      <Button
                        variant={taskPriority === "LOW" ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePriorityChange("LOW")}
                        className={cn(taskPriority === "LOW" && "bg-green-500 hover:bg-green-600")}
                      >
                        <Star className="h-4 w-4 mr-2" /> Low
                      </Button>
                    </div>
                  </div>

                  {/* Due Date Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Due Date</Label>
                    <div className="flex items-center">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" size="sm" className="flex gap-2 items-center">
                            <Calendar className="h-4 w-4" />
                            {taskDueDate ? format(taskDueDate, 'MMM d, yyyy') : 'Set due date'}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={taskDueDate}
                            onSelect={handleDueDateChange}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {taskDueDate && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDueDateChange(undefined)}
                          className="ml-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>

                  {/* Reminder Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Reminder</Label>
                      <Switch
                        checked={taskReminder}
                        onCheckedChange={handleReminderToggle}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {taskReminder
                        ? "You will receive a reminder notification for this task"
                        : "Toggle to receive reminder notifications for this task"}
                    </p>
                  </div>

                  {/* Tags Section */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Tags</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {taskTags && taskTags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="flex gap-1 items-center">
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveTag(tag)}
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add a tag..."
                        value={newTag}
                        onChange={e => setNewTag(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                        className="h-9"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleAddTag}
                        disabled={!newTag.trim()}
                      >
                        <Plus className="h-4 w-4 mr-1" /> Add
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="py-2 border-t mt-2">
            <div className="flex items-center justify-between w-full">
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>

              <div className="flex items-center gap-2">
                <AnimatePresence>
                  {saveSuccess && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-sm text-green-500 font-medium"
                    >
                      Changes saved!
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button
                  onClick={saveChanges}
                  disabled={isSaving}
                  className={cn(isSaving && "opacity-70")}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unsaved Changes Alert Dialog */}
      <AlertDialog open={showUnsavedChangesAlert} onOpenChange={setShowUnsavedChangesAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Would you like to save them before closing?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleDiscardAndClose}>Discard</AlertDialogCancel>
            <AlertDialogAction onClick={handleSaveAndClose}>Save & Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskNoteModal;
