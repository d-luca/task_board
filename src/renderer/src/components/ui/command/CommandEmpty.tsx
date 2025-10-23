import { Command as CommandPrimitive } from "cmdk";
import { ComponentProps, JSX } from "react";

export function CommandEmpty({ ...props }: ComponentProps<typeof CommandPrimitive.Empty>): JSX.Element {
	return <CommandPrimitive.Empty data-slot="command-empty" className="py-6 text-center text-sm" {...props} />;
}
