import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentProps, JSX } from "react";

export function DropdownMenuPortal({
	...props
}: ComponentProps<typeof DropdownMenuPrimitive.Portal>): JSX.Element {
	return <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />;
}
