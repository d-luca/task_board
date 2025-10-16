export enum TaskStatus {
	TODO = "todo",
	IN_PROGRESS = "in-progress",
	DONE = "done",
}

export enum TaskPriority {
	LOW = "low",
	MEDIUM = "medium",
	HIGH = "high",
}

export interface Task {
	_id: string;
	projectId: string;
	title: string;
	description?: string;
	status: TaskStatus;
	priority: TaskPriority;
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
	priority?: TaskPriority;
	dueDate?: Date;
	status?: TaskStatus;
}

export interface UpdateTaskInput {
	title?: string;
	description?: string;
	status?: TaskStatus;
	priority?: TaskPriority;
	labels?: string[];
	dueDate?: string;
	checklist?: ChecklistItem[];
	position?: number;
}
