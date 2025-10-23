import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DialogOverlay({
	className,
	...props
}: ComponentProps<typeof DialogPrimitive.Overlay>): JSX.Element {
	return (
		<DialogPrimitive.Overlay
			data-slot="dialog-overlay"
			className={cn(
				"data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
				className,
			)}
			{...props}
		/>
	);
}
