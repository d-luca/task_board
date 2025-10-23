import * as SelectPrimitive from "@radix-ui/react-select";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function SelectSeparator({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.Separator>): JSX.Element {
	return (
		<SelectPrimitive.Separator
			data-slot="select-separator"
			className={cn("bg-border pointer-events-none -mx-1 my-1 h-px", className)}
			{...props}
		/>
	);
}
