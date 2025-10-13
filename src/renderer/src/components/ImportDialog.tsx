import { useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Upload, FileJson, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../store/useStore";

interface ImportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps): React.ReactElement {
	const { loadProjects, loadTasks, currentProjectId } = useStore();
	const [mode, setMode] = useState<"merge" | "replace">("merge");
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [validationResult, setValidationResult] = useState<any>(null);
	const [isValidating, setIsValidating] = useState(false);
	const [isImporting, setIsImporting] = useState(false);

	const handleSelectFile = async (): Promise<void> => {
		try {
			const filePath = await window.api.import.selectFile();
			if (filePath) {
				setSelectedFile(filePath);
				// Validate the file
				await validateFile(filePath);
			}
		} catch (error) {
			toast.error("File selection failed", {
				description: error instanceof Error ? error.message : "Unknown error occurred",
			});
		}
	};

	const validateFile = async (filePath: string): Promise<void> => {
		try {
			setIsValidating(true);
			const result = await window.api.import.fromJSON({
				filePath,
				mode: "merge",
				validateOnly: true,
			});
			setValidationResult(result);

			if (!(result as any).success) {
				toast.error("Validation failed", {
					description: "The selected file contains errors",
				});
			}
		} catch (error) {
			toast.error("Validation failed", {
				description: error instanceof Error ? error.message : "Unknown error occurred",
			});
		} finally {
			setIsValidating(false);
		}
	};

	const handleImport = async (): Promise<void> => {
		if (!selectedFile) return;

		try {
			setIsImporting(true);

			const result = await window.api.import.fromJSON({
				filePath: selectedFile,
				mode,
				validateOnly: false,
			});

			if ((result as any).success) {
				toast.success("Import successful", {
					description: `Imported ${(result as any).imported.projects} projects and ${(result as any).imported.tasks} tasks`,
				});
				// Reload data
				await loadProjects();
				if (currentProjectId) {
					await loadTasks(currentProjectId);
				}
				onOpenChange(false);
				setSelectedFile(null);
				setValidationResult(null);
			} else {
				toast.error("Import failed", {
					description: (result as any).errors?.[0] || "Unknown error occurred",
				});
			}
		} catch (error) {
			toast.error("Import failed", {
				description: error instanceof Error ? error.message : "Unknown error occurred",
			});
		} finally {
			setIsImporting(false);
		}
	};

	return (
		<Dialog
			open={open}
			onOpenChange={(newOpen) => {
				onOpenChange(newOpen);
				if (!newOpen) {
					setSelectedFile(null);
					setValidationResult(null);
				}
			}}
		>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Upload className="h-5 w-5" />
						Import Data
					</DialogTitle>
					<DialogDescription>
						Import projects and tasks from a JSON file. Select a file to validate and import.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					{/* File Selection */}
					<div className="space-y-3">
						<Label className="text-base font-semibold">Select File</Label>
						<div className="flex items-center gap-2">
							<Button variant="outline" onClick={handleSelectFile} disabled={isValidating || isImporting}>
								<FileJson className="mr-2 h-4 w-4" />
								{selectedFile ? "Change File" : "Select JSON File"}
							</Button>
							{selectedFile && (
								<span className="text-muted-foreground flex-1 truncate text-sm">
									{selectedFile.split(/[/\\]/).pop()}
								</span>
							)}
						</div>
					</div>

					{/* Validation Status */}
					{isValidating && (
						<div className="bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
							<Loader2 className="h-4 w-4 animate-spin" />
							<span className="text-sm">Validating file...</span>
						</div>
					)}

					{validationResult && (
						<div
							className={`flex items-start gap-2 rounded-lg border p-3 ${(validationResult as any).success ? "bg-green-50 dark:bg-green-950/20" : "bg-red-50 dark:bg-red-950/20"}`}
						>
							{(validationResult as any).success ? (
								<CheckCircle2 className="mt-0.5 h-4 w-4 text-green-600 dark:text-green-400" />
							) : (
								<AlertCircle className="mt-0.5 h-4 w-4 text-red-600 dark:text-red-400" />
							)}
							<div className="flex-1">
								<div className="text-sm font-medium">
									{(validationResult as any).success ? "File is valid" : "Validation failed"}
								</div>
								{(validationResult as any).success && (
									<div className="text-muted-foreground mt-1 text-sm">
										Found {(validationResult as any).imported.projects} projects and{" "}
										{(validationResult as any).imported.tasks} tasks
									</div>
								)}
								{(validationResult as any).errors && (
									<ul className="mt-1 list-inside list-disc text-sm text-red-600 dark:text-red-400">
										{(validationResult as any).errors.map((error: string, idx: number) => (
											<li key={idx}>{error}</li>
										))}
									</ul>
								)}
								{(validationResult as any).warnings && (validationResult as any).warnings.length > 0 && (
									<ul className="mt-1 list-inside list-disc text-sm text-yellow-600 dark:text-yellow-400">
										{(validationResult as any).warnings.map((warning: string, idx: number) => (
											<li key={idx}>{warning}</li>
										))}
									</ul>
								)}
							</div>
						</div>
					)}

					{/* Import Mode */}
					{validationResult && (validationResult as any).success && (
						<div className="space-y-3">
							<Label className="text-base font-semibold">Import Mode</Label>
							<RadioGroup value={mode} onValueChange={(value) => setMode(value as "merge" | "replace")}>
								<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
									<RadioGroupItem value="merge" id="merge" />
									<Label htmlFor="merge" className="flex-1 cursor-pointer">
										<div className="font-medium">Merge</div>
										<div className="text-muted-foreground text-sm">
											Add imported data to existing projects and tasks
										</div>
									</Label>
								</div>
								<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
									<RadioGroupItem value="replace" id="replace" />
									<Label htmlFor="replace" className="flex-1 cursor-pointer">
										<div className="font-medium">Replace (Dangerous)</div>
										<div className="text-muted-foreground text-sm">Delete all existing data and import</div>
									</Label>
								</div>
							</RadioGroup>
						</div>
					)}
				</div>

				<DialogFooter>
					<Button
						variant="outline"
						onClick={() => {
							onOpenChange(false);
							setSelectedFile(null);
							setValidationResult(null);
						}}
						disabled={isImporting}
					>
						Cancel
					</Button>
					<Button
						onClick={handleImport}
						disabled={!selectedFile || !validationResult || !(validationResult as any).success || isImporting}
					>
						{isImporting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Importing...
							</>
						) : (
							<>
								<Upload className="mr-2 h-4 w-4" />
								Import
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
