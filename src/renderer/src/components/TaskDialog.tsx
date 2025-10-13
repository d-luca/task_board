import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import type { Task } from "../types/task";

const taskSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	description: z.string().max(1000, "Description too long").optional(),
	status: z.enum(["todo", "in-progress", "done"]),
	priority: z.enum(["low", "medium", "high"]),
	labels: z.string().optional(),
	dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	task?: Task;
	projectId: string;
	onSubmit: (data: TaskFormData) => Promise<void>;
}

export function TaskDialog({
	open,
	onOpenChange,
	task,
	projectId: _projectId,
	onSubmit,
}: TaskDialogProps): React.JSX.Element {
	const {
		register,
		handleSubmit,
		formState: { errors, isSubmitting },
		reset,
		setValue,
		watch,
	} = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			description: "",
			status: "todo",
			priority: "medium",
			labels: "",
			dueDate: "",
		},
	});

	useEffect(() => {
		if (task) {
			reset({
				title: task.title,
				description: task.description || "",
				status: task.status,
				priority: task.priority,
				labels: task.labels?.join(", ") || "",
				dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
			});
		} else {
			reset({
				title: "",
				description: "",
				status: "todo",
				priority: "medium",
				labels: "",
				dueDate: "",
			});
		}
	}, [task, reset]);

	const handleFormSubmit = async (data: TaskFormData): Promise<void> => {
		await onSubmit(data);
		onOpenChange(false);
	};

	const statusValue = watch("status");
	const priorityValue = watch("priority");

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>{task ? "Edit Task" : "Create New Task"}</DialogTitle>
					<DialogDescription>
						{task ? "Update task details below." : "Fill in the details for your new task."}
					</DialogDescription>
				</DialogHeader>

				<form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">
							Title <span className="text-destructive">*</span>
						</Label>
						<Input
							id="title"
							placeholder="Enter task title..."
							{...register("title")}
							disabled={isSubmitting}
						/>
						{errors.title && <p className="text-destructive text-sm">{errors.title.message}</p>}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Add task description..."
							rows={4}
							{...register("description")}
							disabled={isSubmitting}
						/>
						{errors.description && <p className="text-destructive text-sm">{errors.description.message}</p>}
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="status">Status</Label>
							<Select
								value={statusValue}
								onValueChange={(value) => setValue("status", value as "todo" | "in-progress" | "done")}
							>
								<SelectTrigger id="status" disabled={isSubmitting}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="todo">To Do</SelectItem>
									<SelectItem value="in-progress">In Progress</SelectItem>
									<SelectItem value="done">Done</SelectItem>
								</SelectContent>
							</Select>
							{errors.status && <p className="text-destructive text-sm">{errors.status.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="priority">Priority</Label>
							<Select
								value={priorityValue}
								onValueChange={(value) => setValue("priority", value as "low" | "medium" | "high")}
							>
								<SelectTrigger id="priority" disabled={isSubmitting}>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="low">Low</SelectItem>
									<SelectItem value="medium">Medium</SelectItem>
									<SelectItem value="high">High</SelectItem>
								</SelectContent>
							</Select>
							{errors.priority && <p className="text-destructive text-sm">{errors.priority.message}</p>}
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="labels">Labels (comma-separated)</Label>
							<Input
								id="labels"
								placeholder="bug, feature, urgent"
								{...register("labels")}
								disabled={isSubmitting}
							/>
							{errors.labels && <p className="text-destructive text-sm">{errors.labels.message}</p>}
						</div>

						<div className="space-y-2">
							<Label htmlFor="dueDate">Due Date</Label>
							<Input
								id="dueDate"
								type="date"
								{...register("dueDate")}
								disabled={isSubmitting}
								min={new Date().toISOString().split("T")[0]}
							/>
							{errors.dueDate && <p className="text-destructive text-sm">{errors.dueDate.message}</p>}
						</div>
					</div>

					<DialogFooter>
						<Button
							type="button"
							variant="outline"
							onClick={() => onOpenChange(false)}
							disabled={isSubmitting}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={isSubmitting}>
							{isSubmitting ? "Saving..." : task ? "Update Task" : "Create Task"}
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
