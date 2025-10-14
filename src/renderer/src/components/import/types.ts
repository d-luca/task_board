export type ImportMode = "merge" | "replace";

export interface ImportOptions {
	filePath: string;
	mode: ImportMode;
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
