import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CardContent({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return <div data-slot="card-content" className={cn("px-6", className)} {...props} />;
}
