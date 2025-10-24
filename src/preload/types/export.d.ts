export enum ExportFormatEnum {
	JSON = "json",
	CSV = "csv",
}

export enum ExportScopeEnum {
	ALL = "all",
	SINGLE_PROJECT = "single-project",
	SELECTED_TASKS = "selected-tasks",
}

export interface ExportOptions {
	format: ExportFormatEnum;
	scope: ExportScopeEnum;
	projectId?: string;
	taskIds?: string[];
	includeArchived?: boolean;
}

export interface ExportResult {
	success: boolean;
	filePath?: string;
	error?: string;
}

export interface ExportAPI {
	toJSON: (options: ExportOptions) => Promise<ExportResult>;
	toCSV: (options: ExportOptions) => Promise<ExportResult>;
	createBackup: () => Promise<ExportResult>;
	listBackups: () => Promise<string[]>;
}
