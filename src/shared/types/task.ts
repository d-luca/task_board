/**
 * Shared enums for task status and priority
 * Used by both main and renderer processes
 */

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
