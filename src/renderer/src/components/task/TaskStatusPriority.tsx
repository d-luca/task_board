import { ReactElement } from "react";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

interface TaskStatusPriorityProps {
	statusValue: string;
	priorityValue: string;
	onStatusChange: (value: "todo" | "in-progress" | "done") => void;
	onPriorityChange: (value: "low" | "medium" | "high") => void;
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
}: TaskStatusPriorityProps): ReactElement {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label htmlFor="status">Status</Label>
				<Select
					value={statusValue}
					onValueChange={(value) => onStatusChange(value as "todo" | "in-progress" | "done")}
				>
					<SelectTrigger id="status" disabled={disabled}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="todo">To Do</SelectItem>
						<SelectItem value="in-progress">In Progress</SelectItem>
						<SelectItem value="done">Done</SelectItem>
					</SelectContent>
				</Select>
				{statusError && <p className="text-destructive text-sm">{statusError}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="priority">Priority</Label>
				<Select
					value={priorityValue}
					onValueChange={(value) => onPriorityChange(value as "low" | "medium" | "high")}
				>
					<SelectTrigger id="priority" disabled={disabled}>
						<SelectValue />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="low">Low</SelectItem>
						<SelectItem value="medium">Medium</SelectItem>
						<SelectItem value="high">High</SelectItem>
					</SelectContent>
				</Select>
				{priorityError && <p className="text-destructive text-sm">{priorityError}</p>}
			</div>
		</div>
	);
}
