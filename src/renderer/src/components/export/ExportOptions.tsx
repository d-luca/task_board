import { JSX } from "react";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";

interface ExportOptionsProps {
	includeArchived: boolean;
	onIncludeArchivedChange: (checked: boolean) => void;
}

export function ExportOptions({ includeArchived, onIncludeArchivedChange }: ExportOptionsProps): JSX.Element {
	return (
		<div className="space-y-3">
			<Label className="text-base font-semibold">Options</Label>
			<div className="flex items-center space-x-2 rounded-lg border p-3">
				<Checkbox
					id="includeArchived"
					checked={includeArchived}
					onCheckedChange={(checked) => onIncludeArchivedChange(checked as boolean)}
				/>
				<Label htmlFor="includeArchived" className="flex-1 cursor-pointer">
					<div className="font-medium">Include Archived Items</div>
					<div className="text-muted-foreground text-sm">Export archived projects and tasks</div>
				</Label>
			</div>
		</div>
	);
}
