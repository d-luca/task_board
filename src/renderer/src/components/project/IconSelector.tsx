import { ReactElement } from "react";
import { Label } from "../ui/label";
import { cn } from "../../lib/utils";

interface IconSelectorProps {
	selectedIcon: string;
	icons: string[];
	onIconChange: (icon: string) => void;
}

export function IconSelector({ selectedIcon, icons, onIconChange }: IconSelectorProps): ReactElement {
	return (
		<div className="space-y-2">
			<Label>Icon</Label>
			<div className="flex flex-wrap gap-2">
				{icons.map((icon) => (
					<button
						key={icon}
						type="button"
						onClick={() => onIconChange(icon)}
						className={cn(
							"hover:bg-accent h-10 w-10 rounded-lg border-2 text-xl transition-all",
							selectedIcon === icon ? "border-primary bg-accent scale-110" : "border-transparent",
						)}
					>
						{icon}
					</button>
				))}
			</div>
		</div>
	);
}
