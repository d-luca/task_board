import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { TaskPriority, TaskStatus } from "../types/task";

export function cn(...inputs: ClassValue[]): string {
	return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
	return new Date(date).toLocaleDateString("en-US", {
		month: "short",
		day: "numeric",
		year: "numeric",
	});
}

export function getPriorityColor(priority: TaskPriority): string {
	const colors: Record<TaskPriority, string> = {
		[TaskPriority.LOW]: "bg-blue-500",
		[TaskPriority.MEDIUM]: "bg-yellow-500",
		[TaskPriority.HIGH]: "bg-red-500",
	};
	return colors[priority];
}

export function getStatusLabel(status: TaskStatus): string {
	const labels: Record<TaskStatus, string> = {
		[TaskStatus.TODO]: "To Do",
		[TaskStatus.IN_PROGRESS]: "In Progress",
		[TaskStatus.DONE]: "Done",
	};
	return labels[status];
}
