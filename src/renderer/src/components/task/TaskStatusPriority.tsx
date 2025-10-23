import { JSX } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { TaskStatus, TaskPriority } from "../../types/task";

interface TaskStatusPriorityProps {
	statusValue: string;
	priorityValue: string;
	onStatusChange: (value: TaskStatus) => void;
	onPriorityChange: (value: TaskPriority) => void;
	statusError?: string;
	priorityError?: string;
	disabled?: boolean;
}

export function TaskStatusPriority({
	statusValue,
	priorityValue,
	onStatusChange,
	onPriorityChange,
	statusError,
	priorityError,
	disabled,
}: TaskStatusPriorityProps): JSX.Element {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label htmlFor="status">Status</Label>
				<Select value={statusValue} onValueChange={(value) => onStatusChange(value as TaskStatus)}>
					<SelectTrigger id="status" disabled={disabled}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={TaskStatus.TODO}>To Do</SelectItem>
						<SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
						<SelectItem value={TaskStatus.DONE}>Done</SelectItem>
					</SelectContent>
				</Select>
				{statusError && <p className="text-destructive text-sm">{statusError}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="priority">Priority</Label>
				<Select value={priorityValue} onValueChange={(value) => onPriorityChange(value as TaskPriority)}>
					<SelectTrigger id="priority" disabled={disabled}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value={TaskPriority.LOW}>Low</SelectItem>
						<SelectItem value={TaskPriority.MEDIUM}>Medium</SelectItem>
						<SelectItem value={TaskPriority.HIGH}>High</SelectItem>
					</SelectContent>
				</Select>
				{priorityError && <p className="text-destructive text-sm">{priorityError}</p>}
			</div>
		</div>
	);
}
