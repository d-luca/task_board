import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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

export function getPriorityColor(priority: "low" | "medium" | "high"): string {
	const colors = {
		low: "bg-blue-500",
		medium: "bg-yellow-500",
		high: "bg-red-500",
	};
	return colors[priority];
}

export function getStatusLabel(status: string): string {
	const labels: Record<string, string> = {
		todo: "To Do",
		"in-progress": "In Progress",
		done: "Done",
	};
	return labels[status] || status;
}
