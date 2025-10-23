import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function Card({ className, ...props }: ComponentProps<"div">): JSX.Element {
	return (
		<div
			data-slot="card"
			className={cn(
				"bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm",
				className,
			)}
			{...props}
		/>
	);
}
