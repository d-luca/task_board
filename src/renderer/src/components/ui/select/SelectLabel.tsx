import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function SelectLabel({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.Label>): JSX.Element {
	return (
		<SelectPrimitive.Label
			data-slot="select-label"
			className={cn("text-muted-foreground px-2 py-1.5 text-xs", className)}
			{...props}
		/>
	);
}
