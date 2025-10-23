import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DialogTitle({
	className,
	...props
}: ComponentProps<typeof DialogPrimitive.Title>): JSX.Element {
	return (
		<DialogPrimitive.Title
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}
