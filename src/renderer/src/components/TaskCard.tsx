import { useDraggable } from "@dnd-kit/core";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Calendar, CheckSquare, AlertCircle, Trash2 } from "lucide-react";
import type { Task } from "../types/task";
import { TaskPriority } from "../types/task";
import { cn } from "../lib/utils";

interface TaskCardProps {
	task: Task;
	isDragging?: boolean;
	onEdit?: (task: Task) => void;
	onDelete?: (taskId: string) => void;
}

const PRIORITY_CONFIG: Record<TaskPriority, { label: string; color: string }> = {
	[TaskPriority.LOW]: { label: "Low", color: "bg-slate-500" },
	[TaskPriority.MEDIUM]: { label: "Medium", color: "bg-yellow-500" },
	[TaskPriority.HIGH]: { label: "High", color: "bg-red-500" },
};

export function TaskCard({ task, isDragging, onEdit, onDelete }: TaskCardProps): React.JSX.Element {
	const { attributes, listeners, setNodeRef, transform } = useDraggable({
		id: task._id,
	});

	const style = transform
		? {
				transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
			}
		: undefined;

	const priorityConfig = PRIORITY_CONFIG[task.priority];
	const hasChecklist = task.checklist && task.checklist.length > 0;
	const completedItems = task.checklist?.filter((item) => item.completed).length || 0;
	const totalItems = task.checklist?.length || 0;

	const handleCardClick = (e: React.MouseEvent): void => {
		// Don't trigger edit if clicking delete button
		if ((e.target as HTMLElement).closest("button")) {
			return;
		}
		onEdit?.(task);
	};

	const handleDelete = (e: React.MouseEvent): void => {
		e.stopPropagation();
		if (window.confirm(`Delete task "${task.title}"?`)) {
			onDelete?.(task._id);
		}
	};

	return (
		<Card
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={handleCardClick}
			className={cn(
				"group cursor-grab active:cursor-grabbing",
				isDragging && "opacity-50",
				"transition-shadow hover:shadow-md",
			)}
		>
			<CardHeader className="p-3 pb-2">
				<div className="flex items-start justify-between gap-2">
					<h4 className="line-clamp-2 text-sm leading-tight font-medium">{task.title}</h4>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon"
							className="h-5 w-5 opacity-0 transition-opacity group-hover:opacity-100"
							onClick={handleDelete}
						>
							<Trash2 className="h-3 w-3" />
						</Button>
						<div className={cn("h-2 w-2 flex-shrink-0 rounded-full", priorityConfig.color)} />
					</div>
				</div>
			</CardHeader>
			<CardContent className="p-3 pt-0">
				{task.description && (
					<p className="text-muted-foreground mb-2 line-clamp-2 text-xs">{task.description}</p>
				)}

				<div className="flex flex-wrap items-center gap-2">
					{task.labels && task.labels.length > 0 && (
						<div className="flex flex-wrap gap-1">
							{task.labels.slice(0, 2).map((label, index) => (
								<Badge key={index} variant="secondary" className="text-xs">
									{label}
								</Badge>
							))}
							{task.labels.length > 2 && (
								<Badge variant="secondary" className="text-xs">
									+{task.labels.length - 2}
								</Badge>
							)}
						</div>
					)}

					{hasChecklist && (
						<div className="text-muted-foreground flex items-center gap-1 text-xs">
							<CheckSquare className="h-3 w-3" />
							<span>
								{completedItems}/{totalItems}
							</span>
						</div>
					)}

					{task.dueDate && (
						<div
							className={cn(
								"flex items-center gap-1 text-xs",
								new Date(task.dueDate) < new Date() ? "text-red-500" : "text-muted-foreground",
							)}
						>
							<Calendar className="h-3 w-3" />
							<span>{new Date(task.dueDate).toLocaleDateString()}</span>
						</div>
					)}

					{task.dueDate && new Date(task.dueDate) < new Date() && (
						<AlertCircle className="h-3 w-3 text-red-500" />
					)}
				</div>
			</CardContent>
		</Card>
	);
}
