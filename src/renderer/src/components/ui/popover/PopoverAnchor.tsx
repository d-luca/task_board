import * as PopoverPrimitive from "@radix-ui/react-popover";
import { ComponentProps, JSX } from "react";

export function PopoverAnchor({ ...props }: ComponentProps<typeof PopoverPrimitive.Anchor>): JSX.Element {
	return <PopoverPrimitive.Anchor data-slot="popover-anchor" {...props} />;
}
