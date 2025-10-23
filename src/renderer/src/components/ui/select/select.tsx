import * as SelectPrimitive from "@radix-ui/react-select";
import { ComponentProps, JSX } from "react";

export function Select({ ...props }: ComponentProps<typeof SelectPrimitive.Root>): JSX.Element {
	return <SelectPrimitive.Root data-slot="select" {...props} />;
}
