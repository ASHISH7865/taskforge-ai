import React from "react";
import { useDispatch } from "react-redux";
import {
  setPriorityFilter,
  setDueDateFilter,
  toggleShowCompleted,
  toggleOnlyReminders,
  resetAllFilters,
  clearTagFilters,
  removeTagFilter,
  DueDateFilter
} from "@/lib/features/todo/filter-slice";
import { Priority } from "@/lib/features/todo/todo-slice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertCircle,
  Calendar,
  CheckSquare,
  Clock,
  Filter,
  Flag,
  RotateCcw,
  Tag,
  X,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/lib/hooks";

const FilterMenu: React.FC = () => {
  const dispatch = useDispatch();
  const {
    selectedTags,
    selectedPriority,
    showCompleted,
    dueDateFilter,
    onlyReminders
  } = useAppSelector((state) => state.filter);

  // Count active filters
  const activeFilterCount = [
    selectedPriority !== null,
    dueDateFilter !== 'all',
    selectedTags.length > 0,
    !showCompleted,
    onlyReminders
  ].filter(Boolean).length;

  const handlePrioritySelect = (priority: Priority | null) => {
    dispatch(setPriorityFilter(priority));
  };

  const handleDueDateSelect = (filter: DueDateFilter) => {
    dispatch(setDueDateFilter(filter));
  };

  const handleToggleShowCompleted = () => {
    dispatch(toggleShowCompleted());
  };

  const handleToggleOnlyReminders = () => {
    dispatch(toggleOnlyReminders());
  };

  const handleClearFilters = () => {
    dispatch(resetAllFilters());
  };

  const handleRemoveTag = (tag: string) => {
    dispatch(removeTagFilter(tag));
  };

  const handleClearTags = () => {
    dispatch(clearTagFilters());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-1 text-muted-foreground"
        >
          <Filter className="h-3.5 w-3.5" />
          Filter
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="h-5 w-5 p-0 flex items-center justify-center rounded-full text-[10px]">
              {activeFilterCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>Filter Tasks</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Priority filter */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            <Flag className="h-3.5 w-3.5 inline mr-1" /> Priority
          </DropdownMenuLabel>

          <DropdownMenuItem
            className={cn(selectedPriority === "HIGH" && "bg-primary/10")}
            onClick={() => handlePrioritySelect("HIGH")}
          >
            <div className="h-2 w-2 rounded-full bg-red-500 mr-2" />
            High Priority
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(selectedPriority === "MEDIUM" && "bg-primary/10")}
            onClick={() => handlePrioritySelect("MEDIUM")}
          >
            <div className="h-2 w-2 rounded-full bg-amber-500 mr-2" />
            Medium Priority
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(selectedPriority === "LOW" && "bg-primary/10")}
            onClick={() => handlePrioritySelect("LOW")}
          >
            <div className="h-2 w-2 rounded-full bg-blue-500 mr-2" />
            Low Priority
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(selectedPriority === null && "bg-primary/10")}
            onClick={() => handlePrioritySelect(null)}
          >
            <div className="h-2 w-2 rounded-full bg-gray-400 mr-2" />
            All Priorities
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Due date filter */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            <Calendar className="h-3.5 w-3.5 inline mr-1" /> Due Date
          </DropdownMenuLabel>

          <DropdownMenuItem
            className={cn(dueDateFilter === "all" && "bg-primary/10")}
            onClick={() => handleDueDateSelect("all")}
          >
            All Tasks
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(dueDateFilter === "today" && "bg-primary/10")}
            onClick={() => handleDueDateSelect("today")}
          >
            <Clock className="h-3.5 w-3.5 mr-2" />
            Due Today
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(dueDateFilter === "tomorrow" && "bg-primary/10")}
            onClick={() => handleDueDateSelect("tomorrow")}
          >
            <Clock className="h-3.5 w-3.5 mr-2" />
            Due Tomorrow
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(dueDateFilter === "thisWeek" && "bg-primary/10")}
            onClick={() => handleDueDateSelect("thisWeek")}
          >
            <Calendar className="h-3.5 w-3.5 mr-2" />
            Due This Week
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(dueDateFilter === "overdue" && "bg-primary/10")}
            onClick={() => handleDueDateSelect("overdue")}
          >
            <AlertCircle className="h-3.5 w-3.5 mr-2 text-red-500" />
            Overdue
          </DropdownMenuItem>

          <DropdownMenuItem
            className={cn(dueDateFilter === "none" && "bg-primary/10")}
            onClick={() => handleDueDateSelect("none")}
          >
            No Due Date
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Task status */}
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-xs text-muted-foreground">
            Status & Tags
          </DropdownMenuLabel>

          <DropdownMenuItem onClick={handleToggleShowCompleted}>
            <CheckSquare className="h-3.5 w-3.5 mr-2" />
            {showCompleted ? "Hide Completed Tasks" : "Show Completed Tasks"}
          </DropdownMenuItem>

          <DropdownMenuItem onClick={handleToggleOnlyReminders}>
            <Bell className="h-3.5 w-3.5 mr-2" />
            {onlyReminders ? "Show All Tasks" : "Only Tasks With Reminders"}
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Tags */}
        {selectedTags.length > 0 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                <Tag className="h-3.5 w-3.5 inline mr-1" /> Selected Tags
              </DropdownMenuLabel>

              <div className="p-2 flex flex-wrap gap-1">
                {selectedTags.map(tag => (
                  <Badge key={tag} variant="outline" className="px-1 flex gap-1 items-center">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer hover:text-destructive"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveTag(tag);
                      }}
                    />
                  </Badge>
                ))}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 text-xs mt-1"
                  onClick={handleClearTags}
                >
                  Clear all tags
                </Button>
              </div>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />

        {/* Reset filters */}
        <DropdownMenuItem
          className="text-destructive"
          onClick={handleClearFilters}
          disabled={activeFilterCount === 0}
        >
          <RotateCcw className="h-3.5 w-3.5 mr-2" />
          Reset All Filters
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default FilterMenu;
