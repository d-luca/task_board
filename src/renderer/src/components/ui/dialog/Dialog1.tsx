import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentProps, JSX } from "react";

export function Dialog({ ...props }: ComponentProps<typeof DialogPrimitive.Root>): JSX.Element {
	return <DialogPrimitive.Root data-slot="dialog" {...props} />;
}
