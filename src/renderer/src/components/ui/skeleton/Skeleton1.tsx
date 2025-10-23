import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

function Skeleton({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return (
		<div data-slot="skeleton" className={cn("bg-accent animate-pulse rounded-md", className)} {...props} />
	);
}

export { Skeleton };
