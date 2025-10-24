import { JSX } from "react";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { ImportModeEnum } from "./types";

interface ModeSelectorProps {
	value: ImportModeEnum;
	onChange: (mode: ImportModeEnum) => void;
}

export function ModeSelector({ value, onChange }: ModeSelectorProps): JSX.Element {
	return (
		<div className="space-y-3">
			<Label className="text-base font-semibold">Import Mode</Label>
			<RadioGroup value={value} onValueChange={(val) => onChange(val as ImportModeEnum)}>
				<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
					<RadioGroupItem value={ImportModeEnum.MERGE} id="merge" />
					<Label htmlFor="merge" className="flex-1 cursor-pointer">
						<div className="font-medium">Merge</div>
						<div className="text-muted-foreground text-sm">
							Add imported data to existing projects and tasks
						</div>
					</Label>
				</div>
				<div className="hover:bg-accent flex items-center space-x-2 rounded-lg border p-3">
					<RadioGroupItem value={ImportModeEnum.REPLACE} id="replace" />
					<Label htmlFor="replace" className="flex-1 cursor-pointer">
						<div className="font-medium">Replace (Dangerous)</div>
						<div className="text-muted-foreground text-sm">Delete all existing data and import</div>
					</Label>
				</div>
			</RadioGroup>
		</div>
	);
}
