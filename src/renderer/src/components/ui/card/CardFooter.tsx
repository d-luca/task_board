import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CardFooter({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return (
		<div
			data-slot="card-footer"
			className={cn("flex items-center px-6 [.border-t]:pt-6", className)}
			{...props}
		/>
	);
}
