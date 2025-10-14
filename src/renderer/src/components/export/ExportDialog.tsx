import { ReactElement, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../../store/useStore";
import { FormatSelector } from "./FormatSelector";
import { ScopeSelector } from "./ScopeSelector";
import { ExportOptions } from "./ExportOptions";
import { ExportFormat, ExportScope, ExportResult } from "./types";

interface ExportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps): ReactElement {
	const { currentProjectId, projects } = useStore();
	const [format, setFormat] = useState<ExportFormat>("json");
	const [scope, setScope] = useState<ExportScope>("single-project");
	const [includeArchived, setIncludeArchived] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	const handleExport = async (): Promise<void> => {
		try {
			setIsExporting(true);

			const options = {
				format,
				scope,
				projectId: scope === "single-project" && currentProjectId ? currentProjectId : undefined,
				includeArchived,
			};

			const result: ExportResult =
				format === "json" ? await window.api.export.toJSON(options) : await window.api.export.toCSV(options);

			if (result.success && result.filePath) {
				toast.success("Export successful", {
					description: `Data exported to ${result.filePath}`,
				});
				onOpenChange(false);
			} else {
				toast.error("Export failed", {
					description: result.error || "Unknown error occurred",
				});
			}
		} catch (error) {
			toast.error("Export failed", {
				description: error instanceof Error ? error.message : "Unknown error occurred",
			});
		} finally {
			setIsExporting(false);
		}
	};

	const currentProjectName =
		scope === "single-project" && currentProjectId
			? projects.find((p) => p._id === currentProjectId)?.name || "Selected Project"
			: "All Projects";

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className="sm:max-w-[500px]">
				<DialogHeader>
					<DialogTitle className="flex items-center gap-2">
						<Download className="h-5 w-5" />
						Export Data
					</DialogTitle>
					<DialogDescription>
						Export your projects and tasks to JSON or CSV format for backup or sharing.
					</DialogDescription>
				</DialogHeader>

				<div className="space-y-6 py-4">
					<FormatSelector value={format} onChange={setFormat} />
					<ScopeSelector
						value={scope}
						onChange={setScope}
						currentProjectId={currentProjectId}
						currentProjectName={currentProjectName}
					/>
					<ExportOptions includeArchived={includeArchived} onIncludeArchivedChange={setIncludeArchived} />
				</div>

				<DialogFooter>
					<Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
						Cancel
					</Button>
					<Button
						onClick={handleExport}
						disabled={isExporting || (scope === "single-project" && !currentProjectId)}
					>
						{isExporting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								Exporting...
							</>
						) : (
							<>
								<Download className="mr-2 h-4 w-4" />
								Export
							</>
						)}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
