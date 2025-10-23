import { JSX } from "react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { FileJson } from "lucide-react";

interface FileSelectorProps {
	selectedFile: string | null;
	onSelectFile: () => void;
	disabled?: boolean;
}

export function FileSelector({ selectedFile, onSelectFile, disabled }: FileSelectorProps): JSX.Element {
	return (
		<div className="space-y-3">
			<Label className="text-base font-semibold">Select File</Label>
			<div className="flex items-center gap-2">
				<Button variant="outline" onClick={onSelectFile} disabled={disabled}>
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
	);
}
