import { JSX } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ExportScopeEnum } from "./types";

interface ScopeSelectorProps {
	value: ExportScopeEnum;
	onChange: (scope: ExportScopeEnum) => void;
	currentProjectId: string | null;
	currentProjectName: string;
}

export function ScopeSelector({
	value,
	onChange,
	currentProjectId,
	currentProjectName,
}: ScopeSelectorProps): JSX.Element {
	return (
		<div className="space-y-3">
			<Label className="text-base font-semibold">Export Scope</Label>
			<RadioGroup value={value} onValueChange={(val) => onChange(val as ExportScopeEnum)}>
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
	);
}
