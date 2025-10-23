import { InputHTMLAttributes, JSX } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface TaskMetadataFieldsProps {
	labelsProps: InputHTMLAttributes<HTMLInputElement>;
	dueDateProps: InputHTMLAttributes<HTMLInputElement>;
	labelsError?: string;
	dueDateError?: string;
	disabled?: boolean;
}

export function TaskMetadataFields({
	labelsProps,
	dueDateProps,
	labelsError,
	dueDateError,
	disabled,
}: TaskMetadataFieldsProps): JSX.Element {
	return (
		<div className="grid grid-cols-2 gap-4">
			<div className="space-y-2">
				<Label htmlFor="labels">Labels (comma-separated)</Label>
				<Input id="labels" placeholder="bug, feature, urgent" {...labelsProps} disabled={disabled} />
				{labelsError && <p className="text-destructive text-sm">{labelsError}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="dueDate">Due Date</Label>
				<Input
					id="dueDate"
					type="date"
					{...dueDateProps}
					disabled={disabled}
					min={new Date().toISOString().split("T")[0]}
				/>
				{dueDateError && <p className="text-destructive text-sm">{dueDateError}</p>}
			</div>
		</div>
	);
}
