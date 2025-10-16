import { TaskPriority } from "./task";

export interface Project {
	_id: string;
	name: string;
	description?: string;
	color?: string;
	icon?: string;
	isArchived: boolean;
	settings?: {
		taskStatuses?: string[];
		defaultPriority?: TaskPriority;
	};
	createdAt: string;
	updatedAt: string;
}

export interface CreateProjectInput {
	name: string;
	description?: string;
	color?: string;
	icon?: string;
}

export interface UpdateProjectInput {
	name?: string;
	description?: string;
	color?: string;
	icon?: string;
	settings?: {
		taskStatuses?: string[];
		defaultPriority?: TaskPriority;
	};
}
