import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function Command({ className, ...props }: ComponentProps<typeof CommandPrimitive>): JSX.Element {
	return (
		<CommandPrimitive
			data-slot="command"
			className={cn(
				"bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
				className,
			)}
			{...props}
		/>
	);
}
