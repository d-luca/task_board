import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ComponentProps, JSX } from "react";

export function Popover({ ...props }: ComponentProps<typeof PopoverPrimitive.Root>): JSX.Element {
	return <PopoverPrimitive.Root data-slot="popover" {...props} />;
}
