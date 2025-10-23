import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentProps, JSX } from "react";

export function DropdownMenu({ ...props }: ComponentProps<typeof DropdownMenuPrimitive.Root>): JSX.Element {
	return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />;
}
