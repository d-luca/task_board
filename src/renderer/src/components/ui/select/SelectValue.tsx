import * as SelectPrimitive from "@radix-ui/react-select";
import { ComponentProps, JSX } from "react";

export function SelectValue({ ...props }: ComponentProps<typeof SelectPrimitive.Value>): JSX.Element {
	return <SelectPrimitive.Value data-slot="select-value" {...props} />;
}
