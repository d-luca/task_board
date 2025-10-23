import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DialogFooter({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return (
		<div
			data-slot="dialog-footer"
			className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
			{...props}
		/>
	);
}
