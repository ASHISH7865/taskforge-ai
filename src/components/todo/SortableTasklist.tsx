import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import TaskCard from "@/components/todo/TaskCard";
import { Todo, reorderTodos, updateTodoStatus, deleteBulkTodos, selectAll, deselectAll } from "@/lib/features/todo/todo-slice";
import { useDispatch } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Trash2, Check, X, ChevronDown, AlertTriangle } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { useAppSelector } from "@/lib/hooks";
interface NewSortableTaskListProps {
    todos: Todo[];
    initialLoad: boolean;
}

// Sortable Item wrapper component
const SortableItem = ({ children, id, index }: { children: React.ReactNode, id: string, index: number }) => {
    const {
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({
        id: id,
        data: { index }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 1 : 0
    };

    return (
        <div ref={setNodeRef} style={style} className="mb-2 touch-none">
            {children}
        </div>
    );
};

// Simple version of TaskCard for the drag overlay
const DragOverlayItem = ({ task }: {
    task: Todo
}) => {
    return (
        <motion.div
            initial={{ scale: 1 }}
            animate={{ scale: 1.02 }}
            className={cn(
                "w-full opacity-90 shadow-md rounded-md bg-background border-2 border-primary"
            )}
        >
            <TaskCard
                task={task}
            />
        </motion.div>
    );
};

const NewSortableTaskList: React.FC<NewSortableTaskListProps> = ({
    todos,
}) => {
    const dispatch = useDispatch();
    const [activeId, setActiveId] = React.useState<string | null>(null);
    const selectedCount = useAppSelector((state) => state.todos.selectedCount);

    // Alert Dialog states
    const [deleteSelectedOpen, setDeleteSelectedOpen] = useState(false);
    const [markAllCompletedOpen, setMarkAllCompletedOpen] = useState(false);
    const [markAllActiveOpen, setMarkAllActiveOpen] = useState(false);
    const [deleteAllOpen, setDeleteAllOpen] = useState(false);

    // Get active task
    const activeTask = React.useMemo(() =>
        todos.find(todo => todo.id === activeId) || null,
    [todos, activeId]);

    // Configure only the pointer sensor for mouse drag detection
    const sensors = useSensors(
        useSensor(PointerSensor, {
            // Lower activation constraint for better responsiveness
            activationConstraint: {
                distance: 3, // Reduced from 5px to 3px for more responsive drag start
                tolerance: 5, // Add tolerance for better touch handling
            },
        })
    );

    // Handle the drag start event
    const handleDragStart = useCallback((event: DragStartEvent) => {
        const { active } = event;
        setActiveId(active.id as string);
    }, []);

    // Handle the drag end event
    const handleDragEnd = useCallback((event: DragEndEvent) => {
        const { active, over } = event;

        setActiveId(null);

        if (over && active.id !== over.id) {
            // Find the indices
            const activeIndex = todos.findIndex(t => t.id === active.id);
            const overIndex = todos.findIndex(t => t.id === over.id);

            // Create new array with the reordered items
            const newItems = arrayMove(todos, activeIndex, overIndex);

            // Get the array of ids in the new order
            const todoIds = newItems.map(todo => todo.id);

            // Dispatch the reorder action
            dispatch(reorderTodos({ todoIds }));
        }
    }, [todos, dispatch]);

    // Bulk actions
    const handleSelectAll = () => {
        dispatch(selectAll());
    };

    const handleDeselectAll = () => {
        dispatch(deselectAll());
    };

    const markSelectedAsCompleted = () => {
        if (selectedCount === 0) return;

        todos.forEach(todo => {
            if (todo.selected) {
                dispatch(updateTodoStatus({ id: todo.id, status: 'COMPLETED' }));
            }
        });
        toast.success(`${selectedCount} tasks marked as completed`);
        dispatch(deselectAll());
    };

    const markSelectedAsActive = () => {
        if (selectedCount === 0) return;

        todos.forEach(todo => {
            if (todo.selected) {
                dispatch(updateTodoStatus({ id: todo.id, status: 'NOT_COMPLETED' }));
            }
        });
        toast.success(`${selectedCount} tasks marked as active`);
        dispatch(deselectAll());
    };

    const deleteSelectedTasks = () => {
        if (selectedCount === 0) return;

        const selectedIds = todos.filter(todo => todo.selected).map(todo => todo.id);
        dispatch(deleteBulkTodos({ ids: selectedIds }));
        toast.success(`${selectedCount} tasks deleted`);
        dispatch(deselectAll());
    };

    const markAllTasksAsCompleted = () => {
        if (todos.length === 0) return;

        todos.forEach(todo => {
            if (todo.status !== "COMPLETED") {
                dispatch(updateTodoStatus({ id: todo.id, status: 'COMPLETED' }));
            }
        });
        toast.success(`${todos.length} tasks marked as completed`);
    };

    const markAllTasksAsActive = () => {
        if (todos.length === 0) return;

        todos.forEach(todo => {
            if (todo.status !== "NOT_COMPLETED") {
                dispatch(updateTodoStatus({ id: todo.id, status: 'NOT_COMPLETED' }));
            }
        });
        toast.success(`${todos.length} tasks marked as active`);
    };

    const deleteAllTasks = () => {
        if (todos.length === 0) return;

        const todoIds = todos.map(todo => todo.id);
        dispatch(deleteBulkTodos({ ids: todoIds }));
        toast.success(`${todos.length} tasks deleted`);
    };

    return (
        <motion.div
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.3 }}
        >
            <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                >
            {/* Alert Dialogs */}
            <AlertDialog open={deleteSelectedOpen} onOpenChange={setDeleteSelectedOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete Selected Tasks</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete {selectedCount} selected tasks?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteSelectedTasks}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={markAllCompletedOpen} onOpenChange={setMarkAllCompletedOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark All Tasks as Completed</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to mark all {todos.length} visible tasks as completed?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={markAllTasksAsCompleted}>
                            Mark All Complete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={markAllActiveOpen} onOpenChange={setMarkAllActiveOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Mark All Tasks as Active</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to mark all {todos.length} visible tasks as active?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={markAllTasksAsActive}>
                            Mark All Active
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <AlertDialog open={deleteAllOpen} onOpenChange={setDeleteAllOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete All Tasks</AlertDialogTitle>
                        <AlertDialogDescription>
                            Are you sure you want to delete all {todos.length} visible tasks?
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={deleteAllTasks}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            Delete All
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            {/* Task toolbar - always visible */}
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2 bg-card rounded-md p-2 border">
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleSelectAll}
                        disabled={todos.length === 0}
                    >
                        Select All
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleDeselectAll}
                        disabled={selectedCount === 0}
                    >
                        Deselect All
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        {selectedCount} selected
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    {selectedCount > 0 && (
                        <>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markSelectedAsCompleted}
                            >
                                <Check size={16} className="mr-1" /> Mark Complete
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={markSelectedAsActive}
                            >
                                <X size={16} className="mr-1" /> Mark Active
                            </Button>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => setDeleteSelectedOpen(true)}
                            >
                                <Trash2 size={16} className="mr-1" /> Delete
                            </Button>
                        </>
                    )}

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                Actions <ChevronDown size={16} className="ml-1" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem
                                onClick={() => {
                                    if (todos.length === 0) return;
                                    setMarkAllCompletedOpen(true);
                                }}
                            >
                                <Check size={16} className="mr-2" /> Mark All Complete
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => {
                                    if (todos.length === 0) return;
                                    setMarkAllActiveOpen(true);
                                }}
                            >
                                <X size={16} className="mr-2" /> Mark All Active
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => {
                                    if (todos.length === 0) return;
                                    setDeleteAllOpen(true);
                                }}
                            >
                                <AlertTriangle size={16} className="mr-2" /> Delete All Tasks
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {todos.length > 0 ? (
                <>
                    <SortableContext items={todos.map(t => t.id)} strategy={verticalListSortingStrategy}>
                        <div className="space-y-2">
                            <AnimatePresence initial={false}>
                                {todos.map((todo, index) => (
                                    <SortableItem key={todo.id} id={todo.id} index={index}>
                                        <TaskCard
                                            task={todo}
                                        />
                                    </SortableItem>
                                ))}
                            </AnimatePresence>
                        </div>
                    </SortableContext>

                    <DragOverlay>
                        {activeId && activeTask ? (
                            <DragOverlayItem
                                task={activeTask}
                            />
                        ) : null}
                    </DragOverlay>
                </>
            ) : (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-muted/40"
                >
                    <p className="text-muted-foreground text-center">No tasks found in this view.</p>
                </motion.div>
            )}
                </DndContext>

        </motion.div>
    );
};

export default NewSortableTaskList;
