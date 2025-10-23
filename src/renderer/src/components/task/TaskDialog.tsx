import { JSX, useEffect } from "react";
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
} from "../ui/dialog";
import { Button } from "../ui/button";
import type { Task } from "../../types/task";
import { TaskStatus, TaskPriority } from "../../types/task";
import { TaskBasicFields } from "./TaskBasicFields";
import { TaskStatusPriority } from "./TaskStatusPriority";
import { TaskMetadataFields } from "./TaskMetadataFields";

const taskSchema = z.object({
	title: z.string().min(1, "Title is required").max(200, "Title too long"),
	description: z.string().max(1000, "Description too long").optional(),
	status: z.enum(TaskStatus),
	priority: z.enum(TaskPriority),
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
	projectId: _projectId, // eslint-disable-line @typescript-eslint/no-unused-vars
	onSubmit,
}: TaskDialogProps): JSX.Element {
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
			status: TaskStatus.TODO,
			priority: TaskPriority.MEDIUM,
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
				status: TaskStatus.TODO,
				priority: TaskPriority.MEDIUM,
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
					<TaskBasicFields
						titleProps={register("title")}
						descriptionProps={register("description")}
						titleError={errors.title?.message}
						descriptionError={errors.description?.message}
						disabled={isSubmitting}
					/>

					<TaskStatusPriority
						statusValue={statusValue}
						priorityValue={priorityValue}
						onStatusChange={(value) => setValue("status", value)}
						onPriorityChange={(value) => setValue("priority", value)}
						statusError={errors.status?.message}
						priorityError={errors.priority?.message}
						disabled={isSubmitting}
					/>

					<TaskMetadataFields
						labelsProps={register("labels")}
						dueDateProps={register("dueDate")}
						labelsError={errors.labels?.message}
						dueDateError={errors.dueDate?.message}
						disabled={isSubmitting}
					/>

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
