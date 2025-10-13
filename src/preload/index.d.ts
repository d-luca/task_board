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

interface ExportAPI {
	toJSON: (options: unknown) => Promise<unknown>;
	toCSV: (options: unknown) => Promise<unknown>;
	createBackup: () => Promise<unknown>;
	listBackups: () => Promise<unknown>;
}

interface ImportAPI {
	fromJSON: (options: unknown) => Promise<unknown>;
	restoreBackup: (backupPath: string) => Promise<unknown>;
	selectFile: () => Promise<string | null>;
}

interface API {
	project: ProjectAPI;
	task: TaskAPI;
	export: ExportAPI;
	import: ImportAPI;
	onOpenTaskDialog: (callback: () => void) => () => void;
	onOpenProjectDialog: (callback: () => void) => () => void;
	onOpenExportDialog: (callback: () => void) => () => void;
	onOpenImportDialog: (callback: () => void) => () => void;
}

declare global {
	interface Window {
		electron: ElectronAPI;
		api: API;
	}
}
