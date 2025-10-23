import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function DialogHeader({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
			{...props}
		/>
	);
}
