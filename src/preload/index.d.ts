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

interface ExportOptions {
	format: "json" | "csv";
	scope: "all" | "single-project" | "selected-tasks";
	projectId?: string;
	taskIds?: string[];
	includeArchived?: boolean;
}

interface ExportResult {
	success: boolean;
	filePath?: string;
	error?: string;
}

interface ExportAPI {
	toJSON: (options: ExportOptions) => Promise<ExportResult>;
	toCSV: (options: ExportOptions) => Promise<ExportResult>;
	createBackup: () => Promise<ExportResult>;
	listBackups: () => Promise<string[]>;
}

interface ImportOptions {
	filePath: string;
	mode: "merge" | "replace";
	validateOnly?: boolean;
}

interface ImportResult {
	success: boolean;
	imported?: {
		projects: number;
		tasks: number;
	};
	errors?: string[];
	warnings?: string[];
}

interface ImportAPI {
	fromJSON: (options: ImportOptions) => Promise<ImportResult>;
	restoreBackup: (backupPath: string) => Promise<ImportResult>;
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
