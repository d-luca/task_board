import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function CardTitle({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return <div data-slot="card-title" className={cn("leading-none font-semibold", className)} {...props} />;
}
