export enum ImportModeEnum {
	MERGE = "merge",
	REPLACE = "replace",
}

export interface ImportOptions {
	filePath: string;
	mode: ImportModeEnum;
	validateOnly?: boolean;
}

export interface ImportResult {
	success: boolean;
	imported?: {
		projects: number;
		tasks: number;
	};
	errors?: string[];
	warnings?: string[];
}
