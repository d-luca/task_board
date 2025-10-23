import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentProps, JSX } from "react";

export function DropdownMenuGroup({
	...props
}: ComponentProps<typeof DropdownMenuPrimitive.Group>): JSX.Element {
	return <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />;
}
