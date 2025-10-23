import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { ComponentProps, JSX } from "react";

export function DropdownMenuRadioGroup({
	...props
}: ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): JSX.Element {
	return <DropdownMenuPrimitive.RadioGroup data-slot="dropdown-menu-radio-group" {...props} />;
}
