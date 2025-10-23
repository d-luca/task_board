import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">): JSX.Element {
	return (
		<span
			data-slot="dropdown-menu-shortcut"
			className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
			{...props}
		/>
	);
}
