/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import {
    addTodo,
    toggleZenMode,
    Todo,
    initializeTodos
} from '@/lib/features/todo/todo-slice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Calendar as CalendarIcon,
    CheckSquare,
    Clock,
    LayoutDashboard,
    ListTodo,
    Plus,
    BarChart3,
    Star,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dayjs from 'dayjs';
import TodoInput from './TodoInput';
import SortableTaskList from '@/components/todo/SortableTasklist';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import FilterMenu from '@/components/todo/TodoFilterMenu';
import { useAppSelector } from '@/lib/hooks';
import CreateTaskButton from './CreateTaskButton';

const NewMainScreen: React.FC = () => {
    const dispatch = useDispatch();
    const todos = useAppSelector((state) => state.todos.todos);
    const isZenMode = useAppSelector((state) => state.todos.isZenMode);
    const {
        selectedTags,
        selectedPriority,
        searchQuery,
        showCompleted,
        dueDateFilter,
        onlyReminders
    } = useAppSelector((state) => state.filter);

    const [newTodo, setNewTodo] = useState<Partial<Todo> | null>(null);
    const [initialLoad, setInitialLoad] = useState(true);
    const [activeTab, setActiveTab] = useState("all");

    // Helper function to check if a task's due date matches the filter
    const matchesDueDateFilter = (todo: Todo) => {
        if (dueDateFilter === 'all') return true;
        if (dueDateFilter === 'none') return !todo.dueDate;

        if (!todo.dueDate) return false;

        const today = dayjs().startOf('day');
        const dueDate = dayjs(todo.dueDate).startOf('day');
        const endOfWeek = today.add(7, 'day');

        switch (dueDateFilter) {
            case 'today':
                return dueDate.isSame(today);
            case 'tomorrow':
                return dueDate.isSame(today.add(1, 'day'));
            case 'thisWeek':
                return dueDate.isAfter(today) && dueDate.isBefore(endOfWeek);
            case 'overdue':
                return dueDate.isBefore(today) && todo.status !== 'COMPLETED';
            default:
                return true;
        }
    };

    // Sort todos by position
    const sortedTodos = useMemo(() => {
        return [...todos].sort((a, b) => a.position - b.position);
    }, [todos]);

    // Filter todos based on tab and filters
    const filteredTodos = useMemo(() => {
        return sortedTodos.filter(todo => {
            // Filter by tab
            if (activeTab === "completed" && todo.status !== "COMPLETED") return false;
            if (activeTab === "active" && todo.status !== "NOT_COMPLETED") return false;
            if (activeTab === "today") {
                if (!todo.dueDate) return false;
                const today = dayjs().startOf('day');
                const dueDate = dayjs(todo.dueDate).startOf('day');
                return dueDate.isSame(today);
            }
            if (activeTab === "important" && todo.priority !== "HIGH") return false;

            // Filter by completion status
            if (!showCompleted && todo.status === 'COMPLETED') {
                return false;
            }

            // Filter by search query
            if (searchQuery && !todo.title.toLowerCase().includes(searchQuery.toLowerCase())) {
                return false;
            }

            // Filter by tags
            if (selectedTags.length > 0 && !selectedTags.some(tag => todo.tags.includes(tag))) {
                return false;
            }

            // Filter by priority
            if (selectedPriority && todo.priority !== selectedPriority) {
                return false;
            }

            // Filter by due date
            if (!matchesDueDateFilter(todo)) {
                return false;
            }

            // Filter by reminders
            if (onlyReminders && !todo.reminder) {
                return false;
            }

            return true;
        });
    }, [sortedTodos, activeTab, selectedTags, selectedPriority, searchQuery, showCompleted, dueDateFilter, onlyReminders]);


    useEffect(() => {
        // Initialize todos from localStorage or create sample todos if needed
        dispatch(initializeTodos());
        setInitialLoad(false);
    }, [dispatch]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'z') {
                event.preventDefault();
                dispatch(toggleZenMode());
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [dispatch]);

    // Set up reminder notifications
    useEffect(() => {
        // Check for overdue tasks with reminders
        const checkReminders = () => {
            const now = dayjs();
            todos.forEach(todo => {
                if (
                    todo.reminder &&
                    todo.dueDate &&
                    todo.status !== 'COMPLETED' &&
                    dayjs(todo.dueDate).isBefore(now, 'day')
                ) {
                    // Show notification for overdue tasks with reminders
                    if (Notification.permission === 'granted') {
                        console.log(`Reminder: Task "${todo.title}" is overdue!`);
                    } else if (Notification.permission !== 'denied') {
                        Notification.requestPermission();
                    }
                }
            });
        };

        // Check reminders once when component mounts
        checkReminders();

        // Set up a daily check
        const intervalId = setInterval(checkReminders, 24 * 60 * 60 * 1000);

        return () => clearInterval(intervalId);
    }, [todos]);


    const handleAddTodo = () => {
        if (newTodo && newTodo.title) {
            dispatch(addTodo(newTodo as Omit<Todo, "id" | "position">));
            toast.success("Task added successfully");
        }
        setNewTodo({
            title: '',
            status: 'NOT_COMPLETED',
            priority: 'MEDIUM',
            tags: [],
            dueDate: null,
            reminder: false,
        });
    };

    const createNewTask = () => {
        setNewTodo({
            title: '',
            status: 'NOT_COMPLETED',
            priority: 'MEDIUM',
            tags: [],
            dueDate: null,
            reminder: false,
        });
        // Scroll the task input into view and focus it
        setTimeout(() => {
            const taskInput = document.getElementById('new-task-input');
            if (taskInput) {
                taskInput.focus();
            }
        }, 100);
    };

    const completedCount = todos.filter(todo => todo.status === 'COMPLETED').length;
    const pendingCount = todos.length - completedCount;
    const highPriorityCount = todos.filter(todo => todo.priority === 'HIGH').length;
    const todayTasksCount = todos.filter(todo =>
        todo.dueDate && dayjs(todo.dueDate).startOf('day').isSame(dayjs().startOf('day'))
    ).length;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-4 md:p-6 gap-6 max-w-[1600px] mx-auto"
        >
            {/* Main Content */}
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {/* Left sidebar / Task Navigation - Fixed height with sticky position */}
                <div className="md:col-span-1 h-full">
                    <Card className="h-full overflow-hidden border shadow-md hover:shadow-lg transition-shadow duration-300">
                        {/* Stats section */}
                        {!isZenMode && (
                            <div className="border-b p-4 bg-gradient-to-br from-muted/30 to-background">
                                <h3 className="text-xs font-medium mb-3 text-muted-foreground tracking-wide uppercase flex items-center">
                                    <BarChart3 className="h-3.5 w-3.5 mr-1.5 text-primary" />
                                    Statistics
                                </h3>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-2 rounded-md bg-background/80 hover:bg-background transition-colors">
                                        <div className="flex items-center">
                                            <ListTodo className="h-4 w-4 text-primary mr-2" />
                                            <span className="text-sm text-muted-foreground">Total</span>
                                        </div>
                                        <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">{todos.length}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2 rounded-md bg-background/80 hover:bg-background transition-colors">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-amber-500 mr-2" />
                                            <span className="text-sm text-muted-foreground">Pending</span>
                                        </div>
                                        <span className="text-sm font-medium bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full">{pendingCount}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2 rounded-md bg-background/80 hover:bg-background transition-colors">
                                        <div className="flex items-center">
                                            <CheckSquare className="h-4 w-4 text-emerald-500 mr-2" />
                                            <span className="text-sm text-muted-foreground">Completed</span>
                                        </div>
                                        <span className="text-sm font-medium bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full">{completedCount}</span>
                                    </div>

                                    <div className="flex items-center justify-between p-2 rounded-md bg-background/80 hover:bg-background transition-colors">
                                        <div className="flex items-center">
                                            <Star className="h-4 w-4 text-red-500 mr-2" />
                                            <span className="text-sm text-muted-foreground">High Priority</span>
                                        </div>
                                        <span className="text-sm font-medium bg-red-500/10 text-red-500 px-2 py-0.5 rounded-full">{highPriorityCount}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <CardHeader className="pb-3 pt-4 border-b bg-background">
                            <CardTitle className="text-sm flex items-center tracking-wide uppercase font-medium text-muted-foreground">
                                <LayoutDashboard className="h-4 w-4 mr-2 text-primary" /> Views
                            </CardTitle>
                        </CardHeader>

                        {/* Views Section with Icons - making it take the available space */}
                        <div className="space-y-1 p-2 overflow-y-auto">
                            <Button
                                variant={activeTab === "all" ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start pl-4 pr-2 py-2.5 mb-1 transition-all duration-200",
                                    activeTab === "all" ?
                                        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" :
                                        "hover:bg-accent"
                                )}
                                onClick={() => setActiveTab("all")}
                            >
                                <div className="flex items-center grow">
                                    <LayoutDashboard className="h-4 w-4 mr-3" />
                                    <span>All Tasks</span>
                                </div>
                                <Badge className="ml-auto shrink-0" variant={activeTab === "all" ? "secondary" : "outline"}>
                                    {todos.length}
                                </Badge>
                            </Button>

                            <Button
                                variant={activeTab === "active" ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start pl-4 pr-2 py-2.5 mb-1 transition-all duration-200",
                                    activeTab === "active" ?
                                        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" :
                                        "hover:bg-accent"
                                )}
                                onClick={() => setActiveTab("active")}
                            >
                                <div className="flex items-center grow">
                                    <Clock className="h-4 w-4 mr-3 text-amber-500" />
                                    <span>Active Tasks</span>
                                </div>
                                <Badge className="ml-auto shrink-0" variant={activeTab === "active" ? "secondary" : "outline"}>
                                    {pendingCount}
                                </Badge>
                            </Button>

                            <Button
                                variant={activeTab === "today" ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start pl-4 pr-2 py-2.5 mb-1 transition-all duration-200",
                                    activeTab === "today" ?
                                        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" :
                                        "hover:bg-accent"
                                )}
                                onClick={() => setActiveTab("today")}
                            >
                                <div className="flex items-center grow">
                                    <CalendarIcon className="h-4 w-4 mr-3 text-blue-500" />
                                    <span>Today</span>
                                </div>
                                <Badge className="ml-auto shrink-0" variant={activeTab === "today" ? "secondary" : "outline"}>
                                    {todayTasksCount}
                                </Badge>
                            </Button>

                            <Button
                                variant={activeTab === "important" ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start pl-4 pr-2 py-2.5 mb-1 transition-all duration-200",
                                    activeTab === "important" ?
                                        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" :
                                        "hover:bg-accent"
                                )}
                                onClick={() => setActiveTab("important")}
                            >
                                <div className="flex items-center grow">
                                    <Star className="h-4 w-4 mr-3 text-red-500" />
                                    <span>Important</span>
                                </div>
                                <Badge className="ml-auto shrink-0" variant={activeTab === "important" ? "secondary" : "outline"}>
                                    {highPriorityCount}
                                </Badge>
                            </Button>

                            <Button
                                variant={activeTab === "completed" ? "default" : "ghost"}
                                className={cn(
                                    "w-full justify-start pl-4 pr-2 py-2.5 mb-1 transition-all duration-200",
                                    activeTab === "completed" ?
                                        "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" :
                                        "hover:bg-accent"
                                )}
                                onClick={() => setActiveTab("completed")}
                            >
                                <div className="flex items-center grow">
                                    <CheckSquare className="h-4 w-4 mr-3 text-emerald-500" />
                                    <span>Completed</span>
                                </div>
                                <Badge className="ml-auto shrink-0" variant={activeTab === "completed" ? "secondary" : "outline"}>
                                    {completedCount}
                                </Badge>
                            </Button>

                            <div className="pt-3 pb-1 px-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="w-full justify-start hover:bg-primary/5 transition-colors"
                                    onClick={createNewTask}
                                >
                                    <Plus className="h-4 w-4 mr-2" /> Add Task
                                </Button>
                            </div>
                        </div>
                    </Card>
                </div>

                {/* Main task area - Independently scrollable */}
                <div className="md:col-span-2 lg:col-span-3 h-full">
                    <Card className="h-full overflow-hidden border shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
                        <CardHeader className="flex flex-row items-center justify-between border-b bg-gradient-to-r from-background to-background/95 py-4">
                            <div>
                                <CardTitle className="text-xl font-semibold flex items-center">
                                    {activeTab === "all" && (
                                        <>
                                            <LayoutDashboard className="h-5 w-5 mr-2 text-primary" />
                                            All Tasks
                                        </>
                                    )}
                                    {activeTab === "active" && (
                                        <>
                                            <Clock className="h-5 w-5 mr-2 text-amber-500" />
                                            Active Tasks
                                        </>
                                    )}
                                    {activeTab === "completed" && (
                                        <>
                                            <CheckSquare className="h-5 w-5 mr-2 text-emerald-500" />
                                            Completed Tasks
                                        </>
                                    )}
                                    {activeTab === "today" && (
                                        <>
                                            <CalendarIcon className="h-5 w-5 mr-2 text-blue-500" />
                                         {"Today's Tasks"}
                                        </>
                                    )}
                                    {activeTab === "important" && (
                                        <>
                                            <Star className="h-5 w-5 mr-2 text-red-500" />
                                            Important Tasks
                                        </>
                                    )}
                                </CardTitle>
                                <CardDescription className="mt-1">
                                    {filteredTodos.length} {filteredTodos.length === 1 ? 'task' : 'tasks'}
                                </CardDescription>
                            </div>

                            <div className="flex gap-2">
                                <FilterMenu />
                                <CreateTaskButton />
                            </div>
                        </CardHeader>

                        <CardContent className="p-0 flex-1 overflow-hidden">
                            <div className="p-4 h-full overflow-y-auto">
                                <AnimatePresence mode="wait">

                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                            className="mb-4"
                                        >
                                            <TodoInput
                                                newTodo={newTodo}
                                                setNewTodo={setNewTodo}
                                                handleAddTodo={handleAddTodo}
                                                id="new-task-input"
                                            />
                                        </motion.div>

                                </AnimatePresence>

                                <SortableTaskList
                                    todos={filteredTodos}
                                    initialLoad={initialLoad}
                                />

                                {filteredTodos.length === 0 && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: 0.2 }}
                                        className="flex flex-col items-center justify-center py-12 text-center"
                                    >
                                        <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                                            <ListTodo className="h-6 w-6 text-muted-foreground" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-1">No tasks found</h3>
                                        <p className="text-sm text-muted-foreground max-w-md">
                                            {activeTab === "all" && "You don&apos;t have any tasks yet. Create your first task to get started."}
                                            {activeTab === "active" && "You don&apos;t have any active tasks. All your tasks are completed!"}
                                            {activeTab === "completed" && "You don&apos;t have any completed tasks yet. Complete a task to see it here."}
                                            {activeTab === "today" && "You don&apos;t have any tasks due today. Add a task with today&apos;s date to see it here."}
                                            {activeTab === "important" && "You don&apos;t have any high priority tasks. Mark a task as high priority to see it here."}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="mt-4"
                                            onClick={createNewTask}
                                        >
                                            <Plus className="h-4 w-4 mr-2" /> Add Task
                                        </Button>
                                    </motion.div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <Toaster />
        </motion.div>
    );
};

export default NewMainScreen;
