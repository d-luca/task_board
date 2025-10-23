import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ComponentProps, JSX } from "react";

export function PopoverTrigger({ ...props }: ComponentProps<typeof PopoverPrimitive.Trigger>): JSX.Element {
	return <PopoverPrimitive.Trigger data-slot="popover-trigger" {...props} />;
}
