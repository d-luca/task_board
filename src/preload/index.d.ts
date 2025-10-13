import { ElectronAPI } from "@electron-toolkit/preload";

interface ProjectAPI {
	create: (data: unknown) => Promise<unknown>;
	getAll: (includeArchived?: boolean) => Promise<unknown>;
	getById: (id: string) => Promise<unknown>;
	update: (id: string, data: unknown) => Promise<unknown>;
	delete: (id: string) => Promise<unknown>;
	archive: (id: string) => Promise<unknown>;
	unarchive: (id: string) => Promise<unknown>;
	search: (searchTerm: string) => Promise<unknown>;
}

interface TaskAPI {
	create: (data: unknown) => Promise<unknown>;
	getByProject: (projectId: string, includeArchived?: boolean) => Promise<unknown>;
	getById: (id: string) => Promise<unknown>;
	update: (id: string, data: unknown) => Promise<unknown>;
	delete: (id: string) => Promise<unknown>;
	archive: (id: string) => Promise<unknown>;
	updatePosition: (id: string, status: string, position: number) => Promise<unknown>;
	reorder: (projectId: string, status: string, taskIds: string[]) => Promise<unknown>;
	getByDueDate: (startDate: string, endDate: string) => Promise<unknown>;
	search: (projectId: string, searchTerm: string) => Promise<unknown>;
}

interface API {
	project: ProjectAPI;
	task: TaskAPI;
	onOpenTaskDialog: (callback: () => void) => () => void;
	onOpenProjectDialog: (callback: () => void) => () => void;
}

declare global {
	interface Window {
		electron: ElectronAPI;
		api: API;
	}
}
