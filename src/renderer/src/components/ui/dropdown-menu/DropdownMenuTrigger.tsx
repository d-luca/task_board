import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentProps, JSX } from "react";

export function DropdownMenuTrigger({
	...props
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>): JSX.Element {
	return <DropdownMenuPrimitive.Trigger data-slot="dropdown-menu-trigger" {...props} />;
}
