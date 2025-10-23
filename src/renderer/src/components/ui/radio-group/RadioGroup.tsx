import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function RadioGroup({
	className,
	...props
}: ComponentProps<typeof RadioGroupPrimitive.Root>): JSX.Element {
	return (
		<RadioGroupPrimitive.Root data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />
	);
}
