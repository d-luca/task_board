export enum ExportFormatEnum {
	JSON = "json",
	CSV = "csv",
}
export enum ExportScopeEnum {
	ALL = "all",
	SINGLE_PROJECT = "single-project",
}

export interface ExportOptions {
	format: ExportFormatEnum;
	scope: ExportScopeEnum;
	projectId?: string;
	includeArchived: boolean;
}

export interface ExportResult {
	success: boolean;
	filePath?: string;
	error?: string;
}
