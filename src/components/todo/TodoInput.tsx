import React, { KeyboardEvent, useCallback, useState } from "react";
import { Todo } from "@/lib/features/todo/todo-slice";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Check, Clock, Plus, Star, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format, addDays } from "date-fns";
import dayjs from 'dayjs';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { TaskCategory } from "@/lib/features/todo/todo-slice";


interface TodoInputProps {
    newTodo: Partial<Todo> | null;
    setNewTodo: (todo: Partial<Todo> | null) => void;
    handleAddTodo: () => void;
    id?: string;
}

export const TaskCategoriesData: { label: string, value: TaskCategory }[] = [
    { label: "Admin", value: "Admin" },
    { label: "Meetings", value: "Meetings" },
    { label: "Emails", value: "Emails" },
    { label: "ProjectWork", value: "ProjectWork" },
    { label: "Development", value: "Development" },
    { label: "Design", value: "Design" },
    { label: "Marketing", value: "Marketing" },
    { label: "Sales", value: "Sales" },
    { label: "ClientWork", value: "ClientWork" },
    { label: "Research", value: "Research" },
    { label: "Home", value: "Home" },
    { label: "Finance", value: "Finance" },
    { label: "Errands", value: "Errands" },
    { label: "Health", value: "Health" },
    { label: "Family", value: "Family" },
    { label: "Travel", value: "Travel" },
    { label: "Appointments", value: "Appointments" },
    { label: "Learning", value: "Learning" },
    { label: "Reading", value: "Reading" },
    { label: "Habits", value: "Habits" },
    { label: "Journaling", value: "Journaling" },
    { label: "Meditation", value: "Meditation" },
    { label: "Fitness", value: "Fitness" },
    { label: "Career", value: "Career" },
    { label: "Social", value: "Social" },
    { label: "EventPlanning", value: "EventPlanning" },
    { label: "Birthdays", value: "Birthdays" },
    { label: "CatchUp", value: "CatchUp" },
    { label: "SideProject", value: "SideProject" },
    { label: "PassionProject", value: "PassionProject" },
    { label: "ContentCreation", value: "ContentCreation" },
    { label: "Resume", value: "Resume" },
    { label: "JobSearch", value: "JobSearch" },
    { label: "Explore", value: "Explore" },
    { label: "TechSetup", value: "TechSetup" },
    { label: "Subscriptions", value: "Subscriptions" },
    { label: "Maintenance", value: "Maintenance" },
    { label: "Backups", value: "Backups" },
    { label: "Uncategorized", value: "Uncategorized" },
];

const TodoInput: React.FC<TodoInputProps> = ({
    newTodo, setNewTodo, handleAddTodo, id
}) => {
    const [showQuickOptions, setShowQuickOptions] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        setNewTodo({
            ...newTodo,
            title: e.target.value,
        });
    }, [newTodo, setNewTodo]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && newTodo?.title && newTodo.title.trim() !== "") {
            handleAddTodo();
            setShowQuickOptions(false);
            setDate(undefined);
        }
    }, [newTodo, handleAddTodo]);

    const handlePriorityChange = useCallback((priority: "HIGH" | "MEDIUM" | "LOW") => {
        setNewTodo({
            ...newTodo,
            priority,
        });
    }, [newTodo, setNewTodo]);

    const handleDueDateChange = useCallback((date: Date | undefined) => {
        setDate(date);
        setNewTodo({
            ...newTodo,
            dueDate: date ? date.toISOString() : null,
        });
    }, [newTodo, setNewTodo]);

    const handleQuickDate = useCallback((days: number) => {
        const newDate = addDays(new Date(), days);
        handleDueDateChange(newDate);
    }, [handleDueDateChange]);

    const handleToggleReminder = useCallback(() => {
        setNewTodo({
            ...newTodo,
            reminder: !newTodo?.reminder,
        });
    }, [newTodo, setNewTodo]);

    const handleClear = useCallback(() => {
        setNewTodo({
            title: '',
            status: 'NOT_COMPLETED',
            priority: 'MEDIUM',
            tags: [],
            dueDate: null,
            reminder: false,
        });
        setDate(undefined);
        setShowQuickOptions(false);
    }, [setNewTodo]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full p-4 border rounded-md mb-6 bg-background shadow-sm"
        >
            <div className="flex gap-2 items-center mb-4">
                <div className="rounded-full bg-primary/10 p-2">
                    <Plus className="h-4 w-4 text-primary" />
                </div>
                <Input
                    id={id}
                    value={newTodo?.title || ''}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    placeholder="Add a new task..."
                    className=""
                    onFocus={() => setShowQuickOptions(true)}
                />
                <Select value={newTodo?.category || ''} onValueChange={(value) => setNewTodo({ ...newTodo, category: value as TaskCategory })} >
                    <SelectTrigger className="w-[180px] ">
                        <SelectValue placeholder="Select a category"/>
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Categories</SelectLabel>
                            {TaskCategoriesData.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClear}
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                    <X className="h-4 w-4" />
                </Button>
                <Button
                    size="sm"
                    onClick={handleAddTodo}
                    disabled={!newTodo?.title || newTodo.title.trim() === ''}
                    className="h-8"
                >
                    <Check className="h-4 w-4 mr-1" /> Add
                </Button>
            </div>

            {showQuickOptions && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex flex-wrap items-center gap-2"
                >
                    <span className="text-xs text-muted-foreground mr-1">Priority:</span>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-7 px-2 text-xs",
                            newTodo?.priority === "HIGH" && "bg-red-500/10 text-red-500 border-red-500/30"
                        )}
                        onClick={() => handlePriorityChange("HIGH")}
                    >
                        <Star className={cn(
                            "h-3 w-3 mr-1",
                            newTodo?.priority === "HIGH" && "fill-red-500"
                        )} />
                        High
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-7 px-2 text-xs",
                            newTodo?.priority === "MEDIUM" && "bg-amber-500/10 text-amber-500 border-amber-500/30"
                        )}
                        onClick={() => handlePriorityChange("MEDIUM")}
                    >
                        <Star className={cn(
                            "h-3 w-3 mr-1",
                            newTodo?.priority === "MEDIUM" && "fill-amber-500"
                        )} />
                        Medium
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-7 px-2 text-xs",
                            newTodo?.priority === "LOW" && "bg-primary/10 text-primary border-primary/30"
                        )}
                        onClick={() => handlePriorityChange("LOW")}
                    >
                        <Star className={cn(
                            "h-3 w-3 mr-1",
                            newTodo?.priority === "LOW" && "fill-primary"
                        )} />
                        Low
                    </Button>

                    <span className="text-xs text-muted-foreground ml-4 mr-1">Due:</span>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-7 px-2 text-xs",
                            date && dayjs(date).isSame(dayjs(), 'day') && "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        )}
                        onClick={() => handleQuickDate(0)}
                    >
                        <Clock className="h-3 w-3 mr-1" />
                        Today
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className={cn(
                            "h-7 px-2 text-xs",
                            date && dayjs(date).isSame(dayjs().add(1, 'day'), 'day') && "bg-blue-500/10 text-blue-500 border-blue-500/30"
                        )}
                        onClick={() => handleQuickDate(1)}
                    >
                        <Clock className="h-3 w-3 mr-1" />
                        Tomorrow
                    </Button>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-7 px-2 text-xs",
                                    date && !dayjs(date).isSame(dayjs(), 'day') && !dayjs(date).isSame(dayjs().add(1, 'day'), 'day') && "bg-blue-500/10 text-blue-500 border-blue-500/30"
                                )}
                            >
                                <CalendarIcon className="h-3 w-3 mr-1" />
                                {date ? format(date, 'PP') : 'Pick a date'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <CalendarComponent
                                mode="single"
                                selected={date}
                                onSelect={handleDueDateChange}
                                initialFocus
                            />
                        </PopoverContent>
                    </Popover>

                    <Button
                        variant={newTodo?.reminder ? "default" : "outline"}
                        size="sm"
                        className="h-7 px-2 text-xs ml-4"
                        onClick={handleToggleReminder}
                    >
                        <Clock className="h-3 w-3 mr-1" />
                        {newTodo?.reminder ? "Reminder Set" : "Set Reminder"}
                    </Button>
                </motion.div>
            )}
        </motion.div>
    );
};

export default TodoInput;
