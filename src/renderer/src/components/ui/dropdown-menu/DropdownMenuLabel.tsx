import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DropdownMenuLabel({
	className,
	inset,
	...props
}: ComponentProps<typeof DropdownMenuPrimitive.Label> & {
	inset?: boolean;
}): JSX.Element {
	return (
		<DropdownMenuPrimitive.Label
			data-slot="dropdown-menu-label"
			data-inset={inset}
			className={cn("px-2 py-1.5 text-sm font-medium data-[inset]:pl-8", className)}
			{...props}
		/>
	);
}
