import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CommandGroup({
	className,
	...props
}: ComponentProps<typeof CommandPrimitive.Group>): JSX.Element {
	return (
		<CommandPrimitive.Group
			data-slot="command-group"
			className={cn(
				"text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
				className,
			)}
			{...props}
		/>
	);
}
