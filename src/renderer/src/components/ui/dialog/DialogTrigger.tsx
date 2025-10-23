import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentProps, JSX } from "react";

export function DialogTrigger({ ...props }: ComponentProps<typeof DialogPrimitive.Trigger>): JSX.Element {
	return <DialogPrimitive.Trigger data-slot="dialog-trigger" {...props} />;
}
