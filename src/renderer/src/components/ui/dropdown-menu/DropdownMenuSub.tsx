import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentProps, JSX } from "react";

export function DropdownMenuSub({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Sub>): JSX.Element {
	return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />;
}
