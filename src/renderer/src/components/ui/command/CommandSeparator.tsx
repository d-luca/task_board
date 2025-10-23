import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CommandSeparator({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Separator>): JSX.Element {
	return (
		<CommandPrimitive.Separator
			data-slot="command-separator"
			className={cn("bg-border -mx-1 h-px", className)}
			{...props}
		/>
	);
}
