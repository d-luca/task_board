import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CommandShortcut({ className, ...props }: ComponentProps<"span">): JSX.Element {
	return (
		<span
			data-slot="command-shortcut"
			className={cn("text-muted-foreground ml-auto text-xs tracking-widest", className)}
			{...props}
		/>
	);
}
