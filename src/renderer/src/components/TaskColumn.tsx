import { useDroppable } from "@dnd-kit/core";
import type { Task } from "../types/task";
import { cn } from "../lib/utils";
import { TaskCard } from "./TaskCard";

interface TaskColumnProps {
	id: string;
	title: string;
	color: string;
	tasks: Task[];
	onEditTask: (task: Task) => void;
	onDeleteTask: (taskId: string) => Promise<void>;
}

export function TaskColumn({
	id,
	title,
	color,
	tasks,
	onEditTask,
	onDeleteTask,
}: TaskColumnProps): React.JSX.Element {
	const { setNodeRef, isOver } = useDroppable({
		id,
	});

	return (
		<div className="bg-muted/50 flex flex-col overflow-hidden rounded-lg border">
			<div className={cn("flex items-center gap-2 border-b p-3", isOver && "bg-accent/50")}>
				<div className={cn("h-2 w-2 rounded-full", color)} />
				<h3 className="font-semibold">{title}</h3>
				<span className="text-muted-foreground ml-auto text-sm">{tasks.length}</span>
			</div>

			<div ref={setNodeRef} className="flex-1 space-y-2 overflow-y-auto p-3">
				{tasks.length === 0 ? (
					<div className="text-muted-foreground flex h-32 items-center justify-center text-center text-sm">
						No tasks yet
					</div>
				) : (
					tasks.map((task) => (
						<TaskCard key={task._id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
					))
				)}
			</div>
		</div>
	);
}
