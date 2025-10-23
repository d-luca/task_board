import { JSX } from "react";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

interface ColorSelectorProps {
	selectedColor: string;
	colors: string[];
	onColorChange: (color: string) => void;
}

export function ColorSelector({ selectedColor, colors, onColorChange }: ColorSelectorProps): JSX.Element {
	return (
		<div className="space-y-2">
			<Label>Color</Label>
			<div className="flex flex-wrap gap-2">
				{colors.map((color) => (
					<button
						key={color}
						type="button"
						onClick={() => onColorChange(color)}
						className={cn(
							"h-10 w-10 rounded-lg border-2 transition-all",
							selectedColor === color ? "border-foreground scale-110" : "border-transparent",
						)}
						style={{ backgroundColor: color }}
					/>
				))}
			</div>
		</div>
	);
}
