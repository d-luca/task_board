import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CardDescription({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return (
		<div data-slot="card-description" className={cn("text-muted-foreground text-sm", className)} {...props} />
	);
}
