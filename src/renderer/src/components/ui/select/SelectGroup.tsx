import * as SelectPrimitive from "@radix-ui/react-select";
import { ComponentProps, JSX } from "react";

export function SelectGroup({ ...props }: ComponentProps<typeof SelectPrimitive.Group>): JSX.Element {
	return <SelectPrimitive.Group data-slot="select-group" {...props} />;
}
