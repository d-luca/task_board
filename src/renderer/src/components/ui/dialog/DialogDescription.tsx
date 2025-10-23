import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DialogDescription({
	className,
	...props
}: ComponentProps<typeof DialogPrimitive.Description>): JSX.Element {
	return (
		<DialogPrimitive.Description
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}
