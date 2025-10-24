import { JSX, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Upload, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";
import { FileSelector } from "./FileSelector";
import { ValidationStatus } from "./ValidationStatus";
import { ModeSelector } from "./ModeSelector";
import { ImportModeEnum, ImportResult } from "./types";

interface ImportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ImportDialog({ open, onOpenChange }: ImportDialogProps): JSX.Element {
	const { loadProjects, loadTasks, currentProjectId } = useStore();
	const [mode, setMode] = useState<ImportModeEnum>(ImportModeEnum.MERGE);
	const [selectedFile, setSelectedFile] = useState<string | null>(null);
	const [validationResult, setValidationResult] = useState<ImportResult | null>(null);
	const [isValidating, setIsValidating] = useState(false);
	const [isImporting, setIsImporting] = useState(false);

	const handleSelectFile = async (): Promise<void> => {
		try {
			const filePath = await window.api.import.selectFile();
			if (filePath) {
				setSelectedFile(filePath);
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
			const result: ImportResult = await window.api.import.fromJSON({
				filePath,
				mode: ImportModeEnum.MERGE,
				validateOnly: true,
			});
			setValidationResult(result);

			if (!result.success) {
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

			const result: ImportResult = await window.api.import.fromJSON({
				filePath: selectedFile,
				mode,
				validateOnly: false,
			});

			if (result.success && result.imported) {
				toast.success("Import successful", {
					description: `Imported ${result.imported.projects} projects and ${result.imported.tasks} tasks`,
				});
				await loadProjects();
				if (currentProjectId) {
					await loadTasks(currentProjectId);
				}
				onOpenChange(false);
				setSelectedFile(null);
				setValidationResult(null);
			} else {
				toast.error("Import failed", {
					description: result.errors?.[0] || "Unknown error occurred",
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

	const handleDialogChange = (newOpen: boolean): void => {
		onOpenChange(newOpen);
		if (!newOpen) {
			setSelectedFile(null);
			setValidationResult(null);
		}
	};

	return (
		<Dialog open={open} onOpenChange={handleDialogChange}>
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
					<FileSelector
						selectedFile={selectedFile}
						onSelectFile={handleSelectFile}
						disabled={isValidating || isImporting}
					/>

					<ValidationStatus isValidating={isValidating} validationResult={validationResult} />

					{validationResult && validationResult.success && <ModeSelector value={mode} onChange={setMode} />}
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => handleDialogChange(false)} disabled={isImporting}>
						Cancel
					</Button>
					<Button
						onClick={handleImport}
						disabled={!selectedFile || !validationResult || !validationResult.success || isImporting}
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
