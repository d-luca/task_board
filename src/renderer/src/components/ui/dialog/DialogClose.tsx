import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentProps, JSX } from "react";

export function DialogClose({ ...props }: ComponentProps<typeof DialogPrimitive.Close>): JSX.Element {
	return <DialogPrimitive.Close data-slot="dialog-close" {...props} />;
}
