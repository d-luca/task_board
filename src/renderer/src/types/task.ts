export interface Task {
	_id: string;
	projectId: string;
	title: string;
	description?: string;
	status: "todo" | "in-progress" | "done";
	priority: "low" | "medium" | "high";
	labels?: string[];
	dueDate?: string;
	checklist?: ChecklistItem[];
	position: number;
	isArchived: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ChecklistItem {
	id: string;
	text: string;
	completed: boolean;
}

export interface CreateTaskInput {
	projectId: string;
	title: string;
	description?: string;
	priority?: "low" | "medium" | "high";
	dueDate?: Date;
	status?: "todo" | "in-progress" | "done";
}

export interface UpdateTaskInput {
	title?: string;
	description?: string;
	status?: "todo" | "in-progress" | "done";
	priority?: "low" | "medium" | "high";
	labels?: string[];
	dueDate?: string;
	checklist?: ChecklistItem[];
	position?: number;
}
