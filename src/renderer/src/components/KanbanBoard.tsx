import { useState } from "react";
import {
	DndContext,
	DragEndEvent,
	DragOverlay,
	DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";

import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useStore } from "../store/useStore";
import type { Task } from "../types/task";
import { TaskColumn } from "./TaskColumn";
import { TaskCard } from "./TaskCard";

const COLUMNS = [
	{ id: "todo", title: "To Do", color: "bg-slate-500" },
	{ id: "in-progress", title: "In Progress", color: "bg-blue-500" },
	{ id: "done", title: "Done", color: "bg-green-500" },
] as const;

interface KanbanBoardProps {
	onCreateTask: () => void;
	onEditTask: (task: Task) => void;
}

export function KanbanBoard({ onCreateTask, onEditTask }: KanbanBoardProps): React.JSX.Element {
	const { tasks, loadingTasks, updateTaskPosition, deleteTask } = useStore();
	const [activeTask, setActiveTask] = useState<Task | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	const handleDragStart = (event: DragStartEvent): void => {
		const task = tasks.find((t) => t._id === event.active.id);
		if (task) {
			setActiveTask(task);
		}
	};

	const handleDragEnd = async (event: DragEndEvent): Promise<void> => {
		const { active, over } = event;
		setActiveTask(null);

		if (!over) return;

		const taskId = active.id as string;
		const newStatus = over.id as string;

		const task = tasks.find((t) => t._id === taskId);
		if (!task || task.status === newStatus) return;

		// Calculate new position (add to end of column)
		const tasksInColumn = tasks.filter((t) => t.status === newStatus);
		const newPosition = tasksInColumn.length;

		try {
			await updateTaskPosition(taskId, newStatus, newPosition);
		} catch (error) {
			console.error("Failed to update task position:", error);
		}
	};

	const getTasksByStatus = (status: string): Task[] => {
		return tasks.filter((task) => task.status === status).sort((a, b) => a.position - b.position);
	};

	const handleDeleteTask = async (taskId: string): Promise<void> => {
		try {
			await deleteTask(taskId);
		} catch (error) {
			console.error("Failed to delete task:", error);
		}
	};

	if (loadingTasks) {
		return (
			<div className="flex h-full items-center justify-center">
				<p className="text-muted-foreground">Loading tasks...</p>
			</div>
		);
	}

	return (
		<div className="flex h-full flex-col">
			<div className="mb-4 flex items-center justify-between">
				<h2 className="text-xl font-semibold">Tasks</h2>
				<Button onClick={onCreateTask} size="sm">
					<Plus className="mr-2 h-4 w-4" />
					New Task
				</Button>
			</div>

			<DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
				<div className="grid flex-1 grid-cols-3 gap-4 overflow-hidden">
					{COLUMNS.map((column) => (
						<TaskColumn
							key={column.id}
							id={column.id}
							title={column.title}
							color={column.color}
							tasks={getTasksByStatus(column.id)}
							onEditTask={onEditTask}
							onDeleteTask={handleDeleteTask}
						/>
					))}
				</div>

				<DragOverlay>{activeTask ? <TaskCard task={activeTask} isDragging /> : null}</DragOverlay>
			</DndContext>
		</div>
	);
}
