import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ComponentProps, JSX } from "react";

export function DialogPortal({ ...props }: ComponentProps<typeof DialogPrimitive.Portal>): JSX.Element {
	return <DialogPrimitive.Portal data-slot="dialog-portal" {...props} />;
}
