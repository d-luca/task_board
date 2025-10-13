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
import { Checkbox } from "./ui/checkbox";
import { Download, FileJson, FileSpreadsheet, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useStore } from "../store/useStore";

interface ExportDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function ExportDialog({ open, onOpenChange }: ExportDialogProps): React.ReactElement {
	const { currentProjectId, projects } = useStore();
	const [format, setFormat] = useState<"json" | "csv">("json");
	const [scope, setScope] = useState<"all" | "single-project">("single-project");
	const [includeArchived, setIncludeArchived] = useState(false);
	const [isExporting, setIsExporting] = useState(false);

	const handleExport = async (): Promise<void> => {
		try {
			setIsExporting(true);

			const options = {
				format,
				scope,
				projectId: scope === "single-project" ? currentProjectId : undefined,
				includeArchived,
			};

			const result =
				format === "json" ? await window.api.export.toJSON(options) : await window.api.export.toCSV(options);

			if ((result as any).success && (result as any).filePath) {
				toast.success("Export successful", {
					description: `Data exported to ${(result as any).filePath}`,
				});
				onOpenChange(false);
			} else {
				toast.error("Export failed", {
					description: (result as any).error || "Unknown error occurred",
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
					{/* Format Selection */}
					<div className="space-y-3">
						<Label className="text-base font-semibold">Export Format</Label>
						<RadioGroup value={format} onValueChange={(value) => setFormat(value as "json" | "csv")}>
							<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
								<RadioGroupItem value="json" id="json" />
								<Label htmlFor="json" className="flex flex-1 cursor-pointer items-center gap-2">
									<FileJson className="h-4 w-4" />
									<div className="flex-1">
										<div className="font-medium">JSON</div>
										<div className="text-muted-foreground text-sm">
											Complete data with all fields (recommended for backup)
										</div>
									</div>
								</Label>
							</div>
							<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
								<RadioGroupItem value="csv" id="csv" />
								<Label htmlFor="csv" className="flex flex-1 cursor-pointer items-center gap-2">
									<FileSpreadsheet className="h-4 w-4" />
									<div className="flex-1">
										<div className="font-medium">CSV</div>
										<div className="text-muted-foreground text-sm">
											Spreadsheet format (good for Excel/Google Sheets)
										</div>
									</div>
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Scope Selection */}
					<div className="space-y-3">
						<Label className="text-base font-semibold">Export Scope</Label>
						<RadioGroup value={scope} onValueChange={(value) => setScope(value as "all" | "single-project")}>
							<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
								<RadioGroupItem value="all" id="all" />
								<Label htmlFor="all" className="flex-1 cursor-pointer">
									<div className="font-medium">All Projects</div>
									<div className="text-muted-foreground text-sm">Export all projects and their tasks</div>
								</Label>
							</div>
							<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
								<RadioGroupItem value="single-project" id="single-project" disabled={!currentProjectId} />
								<Label
									htmlFor="single-project"
									className={`flex-1 ${!currentProjectId ? "cursor-not-allowed opacity-50" : "cursor-pointer"}`}
								>
									<div className="font-medium">Current Project Only</div>
									<div className="text-muted-foreground text-sm">{currentProjectName}</div>
								</Label>
							</div>
						</RadioGroup>
					</div>

					{/* Options */}
					<div className="space-y-3">
						<Label className="text-base font-semibold">Options</Label>
						<div className="flex items-center space-x-2 rounded-lg border p-3">
							<Checkbox
								id="includeArchived"
								checked={includeArchived}
								onCheckedChange={(checked) => setIncludeArchived(checked as boolean)}
							/>
							<Label htmlFor="includeArchived" className="flex-1 cursor-pointer">
								<div className="font-medium">Include Archived Items</div>
								<div className="text-muted-foreground text-sm">Export archived projects and tasks</div>
							</Label>
						</div>
					</div>
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
