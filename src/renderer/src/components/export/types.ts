export type ExportFormat = "json" | "csv";
export type ExportScope = "all" | "single-project";

export interface ExportOptions {
	format: ExportFormat;
	scope: ExportScope;
	projectId?: string;
	includeArchived: boolean;
}

export interface ExportResult {
	success: boolean;
	filePath?: string;
	error?: string;
}
