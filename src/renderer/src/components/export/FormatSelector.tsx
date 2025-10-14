import { ReactElement } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { FileJson, FileSpreadsheet } from "lucide-react";
import { ExportFormat } from "./types";

interface FormatSelectorProps {
	value: ExportFormat;
	onChange: (format: ExportFormat) => void;
}

export function FormatSelector({ value, onChange }: FormatSelectorProps): ReactElement {
	return (
		<div className="space-y-3">
			<Label className="text-base font-semibold">Export Format</Label>
			<RadioGroup value={value} onValueChange={(val) => onChange(val as ExportFormat)}>
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
	);
}
