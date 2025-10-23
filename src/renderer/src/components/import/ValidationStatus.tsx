import { JSX } from "react";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ImportResult } from "./types";

interface ValidationStatusProps {
	isValidating: boolean;
	validationResult: ImportResult | null;
}

export function ValidationStatus({
	isValidating,
	validationResult,
}: ValidationStatusProps): JSX.Element | null {
	if (isValidating) {
		return (
			<div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
				<Loader2 className="h-4 w-4 animate-spin" />
				<span className="text-sm">Validating file...</span>
			</div>
		);
	}

	if (!validationResult) {
		return null;
	}

	return (
		<div
			className={`flex items-start gap-2 rounded-lg border p-3 ${validationResult.success ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}`}
		>
			{validationResult.success ? (
				<CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
			) : (
				<AlertCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
			)}
			<div className="flex-1">
				<div className="text-sm font-medium">
					{validationResult.success ? "File is valid" : "Validation failed"}
				</div>
				{validationResult.success && validationResult.imported && (
					<div className="text-muted-foreground mt-1 text-sm">
						Found {validationResult.imported.projects} projects and {validationResult.imported.tasks} tasks
					</div>
				)}
				{validationResult.errors && validationResult.errors.length > 0 && (
					<ul className="mt-1 list-inside list-disc text-sm text-red-600 dark:text-red-400">
						{validationResult.errors.map((error, idx) => (
							<li key={idx}>{error}</li>
						))}
					</ul>
				)}
				{validationResult.warnings && validationResult.warnings.length > 0 && (
					<ul className="mt-1 list-inside list-disc text-sm text-yellow-600 dark:text-yellow-400">
						{validationResult.warnings.map((warning, idx) => (
							<li key={idx}>{warning}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
}
