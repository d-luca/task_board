import { ReactElement } from "react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

interface TaskBasicFieldsProps {
	titleProps: React.InputHTMLAttributes<HTMLInputElement>;
	descriptionProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>;
	titleError?: string;
	descriptionError?: string;
	disabled?: boolean;
}

export function TaskBasicFields({
	titleProps,
	descriptionProps,
	titleError,
	descriptionError,
	disabled,
}: TaskBasicFieldsProps): ReactElement {
	return (
		<>
			<div className="space-y-2">
				<Label htmlFor="title">
					Title <span className="text-destructive">*</span>
				</Label>
				<Input id="title" placeholder="Enter task title..." {...titleProps} disabled={disabled} />
				{titleError && <p className="text-destructive text-sm">{titleError}</p>}
			</div>

			<div className="space-y-2">
				<Label htmlFor="description">Description</Label>
				<Textarea
					id="description"
					placeholder="Add task description..."
					rows={4}
					{...descriptionProps}
					disabled={disabled}
				/>
				{descriptionError && <p className="text-destructive text-sm">{descriptionError}</p>}
			</div>
		</>
	);
}
