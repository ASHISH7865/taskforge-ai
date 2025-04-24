import React, { useState, useCallback } from 'react';
import {
    Calendar,
    Check,
    FileText,
    GripVertical,
    MoreHorizontal,
    Star,
    Tag,
    Bell,
    Trash,
    Copy,
    Circle
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { toggleTodo, editTodo, Todo, toggleSelection, removeTodo, TaskCategory } from '@/lib/features/todo/todo-slice';
import { format, isPast, isSameDay } from 'date-fns';
import { Checkbox } from '../ui/checkbox';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import TaskNoteModal from './TaskNoteModal';
import { toast } from 'sonner';
import { useSortable } from '@dnd-kit/sortable';

export const priorityColors = {
    HIGH: "var(--high, hsl(var(--destructive)))",
    MEDIUM: "var(--medium, hsl(var(--warning)))",
    LOW: "var(--low, hsl(var(--primary)))",
};

export const priorityIcons = {
    HIGH: <Star className="h-3.5 w-3.5 fill-red-500 text-red-500" />,
    MEDIUM: <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />,
    LOW: <Star className="h-3.5 w-3.5 fill-blue-500 text-blue-500" />,
};

export const categoryColors: Record<TaskCategory, string> = {
    Admin: "bg-sky-500",
    Meetings: "bg-rose-500",
    Emails: "bg-emerald-500",
    ProjectWork: "bg-indigo-500",
    Development: "bg-orange-500",
    Design: "bg-pink-500",
    Marketing: "bg-yellow-400",
    Sales: "bg-amber-500",
    ClientWork: "bg-violet-500",
    Research: "bg-cyan-500",
    Home: "bg-lime-500",
    Finance: "bg-teal-500",
    Errands: "bg-red-400",
    Health: "bg-fuchsia-500",
    Family: "bg-blue-400",
    Travel: "bg-green-400",
    Appointments: "bg-purple-400",
    Learning: "bg-orange-400",
    Reading: "bg-pink-400",
    Habits: "bg-rose-400",
    Journaling: "bg-sky-400",
    Meditation: "bg-emerald-400",
    Fitness: "bg-yellow-500",
    Career: "bg-red-500",
    Social: "bg-blue-500",
    EventPlanning: "bg-lime-400",
    Birthdays: "bg-amber-400",
    CatchUp: "bg-rose-300",
    SideProject: "bg-cyan-400",
    PassionProject: "bg-teal-400",
    ContentCreation: "bg-yellow-300",
    Resume: "bg-fuchsia-400",
    JobSearch: "bg-blue-300",
    Explore: "bg-green-300",
    TechSetup: "bg-indigo-400",
    Subscriptions: "bg-orange-300",
    Maintenance: "bg-red-300",
    Backups: "bg-sky-300",
    Uncategorized: "bg-gray-400",
  }


interface TaskCardProps {
    task: Todo;
    onSelect?: () => void;
}

const TaskCard = ({ task, onSelect }: TaskCardProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState(task.title);
    const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
    const dispatch = useDispatch();

    // Add sortable functionality to the drag handle
    const { attributes, listeners } = useSortable({
        id: task.id,
        data: { index: 0 } // This will be overridden by the parent component
    });

    const openNotesModal = useCallback(() => {
        setIsNoteModalOpen(true);
    }, []);

    const handleTitleDoubleClick = useCallback(() => {
        openNotesModal();
    }, [openNotesModal]);

    const handleTitleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedTitle(event.target.value);
    }, []);

    const handleTitleBlur = useCallback(() => {
        setIsEditing(false);
        if (editedTitle.trim() !== task.title) {
            dispatch(editTodo({ id: task.id, newTitle: editedTitle.trim() }));
        }
    }, [editedTitle, task.title, task.id, dispatch]);

    const handleKeyDown = useCallback((event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleTitleBlur();
        }
    }, [handleTitleBlur]);

    const handleToggle = useCallback(() => {
        dispatch(toggleTodo(task.id));
    }, [task.id, dispatch]);

    const handleToggleSelection = useCallback(() => {
        dispatch(toggleSelection(task.id));
        if (onSelect) {
            onSelect();
        }
    }, [task.id, dispatch, onSelect]);

    const handleCopyTask = useCallback(() => {
        navigator.clipboard.writeText(task.title);
        toast.success("Task text copied to clipboard");
    }, [task.title]);

    const handleDeleteTask = useCallback(() => {
        if (confirm("Are you sure you want to delete this task?")) {
            dispatch(removeTodo(task.id));
            toast.success("Task deleted successfully");
        }
    }, [task.id, dispatch]);

    // Format date for display and check if overdue
    const formattedDate = task.dueDate ? format(new Date(task.dueDate), 'MMM d') : null;
    const isOverdue = task.dueDate &&
        isPast(new Date(task.dueDate)) &&
        !isSameDay(new Date(), new Date(task.dueDate)) &&
        task.status !== "COMPLETED";

    const isDueToday = task.dueDate && isSameDay(new Date(), new Date(task.dueDate));
    const priorityColor = task.priority ? priorityColors[task.priority] : priorityColors.MEDIUM;
    const priorityIcon = task.priority ? priorityIcons[task.priority] : priorityIcons.MEDIUM;
    const categoryColor = task.category ? categoryColors[task.category] : categoryColors.Uncategorized;
    return (
        <>
            <div
                className={cn(
                    "group w-full flex items-start p-3.5 rounded-md relative border transition-all duration-200 hover:translate-y-[-1px] hover:shadow-md overflow-hidden",
                    // task.priority === "HIGH" && "bg-red-500/5 border-red-500/20",
                    // task.priority === "MEDIUM" && "bg-amber-500/5 border-amber-500/20",
                    // task.priority === "LOW" && "bg-blue-500/5 border-blue-500/20",
                    task.selected && "bg-primary/5 border-primary/50 shadow-sm",
                    task.status === "COMPLETED"
                        ? "bg-success/5 border-success/20"
                        : isOverdue
                            ? "bg-destructive/5 border-destructive/20"
                            : ""
                )}
            >
                <div
                    className="absolute left-0 top-0 bottom-0 w-1.5 transition-all group-hover:w-2"
                    style={{ backgroundColor: priorityColor }}
                />

                <div
                    className="self-center opacity-50 hover:opacity-100 touch-none mr-3 cursor-grab"
                    {...attributes}
                    {...listeners}
                >
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                </div>

                <div className="flex flex-grow">
                    <div className="mr-3 pt-1.5">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Checkbox
                                        checked={task.selected}
                                        onCheckedChange={handleToggleSelection}
                                        className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground border-muted-foreground"
                                    />
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>{task.selected ? "Deselect task" : "Select task"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <div className="flex-grow flex flex-col" onDoubleClick={handleTitleDoubleClick}>
                        {isEditing ? (
                            <Input
                                value={editedTitle}
                                onChange={handleTitleChange}
                                onBlur={handleTitleBlur}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="text-sm font-medium px-0 h-9 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                        ) : (
                            <>
                                <div className="flex items-center gap-2 mb-2">
                                    <p
                                        className={cn(
                                            "text-sm font-medium leading-normal break-words",
                                            task.status === "COMPLETED" && "text-muted-foreground line-through"
                                        )}
                                    >
                                        {task.title}
                                    </p>

                                    <Badge
                                        variant="outline"
                                        className="h-5 text-[10px] rounded-md py-0 px-1.5 flex gap-1 items-center"
                                        style={{
                                            color: priorityColor,
                                            borderColor: priorityColor,
                                            backgroundColor: task.priority === "HIGH" ? "rgba(239, 68, 68, 0.1)" :
                                                task.priority === "MEDIUM" ? "rgba(245, 158, 11, 0.1)" :
                                                    "rgba(59, 130, 246, 0.1)"
                                        }}
                                    >
                                        {priorityIcon}
                                        {task.priority ? task.priority.charAt(0) + task.priority.slice(1).toLowerCase() : "Medium"}
                                    </Badge>
                                </div>

                                <div className="flex flex-wrap gap-1.5 items-center">
                                    {task.category && <Badge
                                        variant="default"
                                        className={`h-5 text-[10px] rounded-md py-0 px-1.5 flex gap-1 items-center ${categoryColor}`}
                                    >
                                        {task.category}
                                    </Badge>}
                                    {formattedDate && (
                                        <Badge
                                            variant={isOverdue ? "destructive" : isDueToday ? "default" : "outline"}
                                            className="h-5 text-[10px] rounded-md py-0 px-1.5 flex gap-1 items-center whitespace-nowrap"
                                        >
                                            <Calendar className="h-3 w-3" />
                                            {formattedDate}
                                            {isOverdue && " (Overdue)"}
                                            {isDueToday && " (Today)"}
                                        </Badge>
                                    )}

                                    {task.reminder && (
                                        <Badge
                                            variant="secondary"
                                            className="h-5 text-[10px] rounded-md py-0 px-1.5 flex gap-1 items-center"
                                        >
                                            <Bell className="h-3 w-3" />
                                            Reminder
                                        </Badge>
                                    )}

                                    {task.tags && task.tags.length > 0 && task.tags.map((tag, index) => (
                                        <Badge
                                            key={index}
                                            variant="outline"
                                            className="h-5 text-[10px] rounded-md py-0 px-1.5 bg-accent/50 flex gap-1 items-center"
                                        >
                                            <Tag className="h-3 w-3" />
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-start gap-1 ml-2">
                    <div className="hidden group-hover:flex items-center gap-1">
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                                        onClick={openNotesModal}
                                    >
                                        <FileText className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Edit Task</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className={cn(
                                            "h-5 w-5 p-0",
                                            task.status === "COMPLETED"
                                                ? "text-success"
                                                : "text-muted-foreground"
                                        )}
                                        onClick={handleToggle}
                                    >
                                        {task.status === "COMPLETED" ? (
                                            <Check className="h-4 w-4" />
                                        ) : (
                                            <Circle className="h-4 w-4" />
                                        )}
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent side="right">
                                    <p>Click to {task.status === "COMPLETED" ? "mark as incomplete" : "mark as complete"}</p>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-foreground"
                            >
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={openNotesModal} className="gap-2">
                                <FileText className="h-4 w-4" /> Edit Task
                            </DropdownMenuItem>

                            <DropdownMenuItem onClick={handleToggle} className="gap-2">
                                {task.status === "COMPLETED" ? (
                                    <>
                                        <Circle className="h-4 w-4" /> Mark as Incomplete
                                    </>
                                ) : (
                                    <>
                                        <Check className="h-4 w-4" /> Mark as Complete
                                    </>
                                )}
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleCopyTask} className="gap-2">
                                <Copy className="h-4 w-4" />
                                Copy Text
                            </DropdownMenuItem>

                            <DropdownMenuSeparator />

                            <DropdownMenuItem onClick={handleDeleteTask} className="gap-2 text-destructive">
                                <Trash className="h-4 w-4" />
                                Delete Task
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {isNoteModalOpen && (
                <TaskNoteModal
                    open={isNoteModalOpen}
                    onClose={() => setIsNoteModalOpen(false)}
                    task={task}
                />
            )}
        </>
    );
};

export default TaskCard;
