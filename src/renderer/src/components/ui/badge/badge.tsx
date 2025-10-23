import { Slot } from "@radix-ui/react-slot";
import type { ComponentProps, JSX } from "react";
import { cn } from "@renderer/lib/utils";
import { badgeVariants } from "./badgeVariants";

function Badge({
	className,
	variant,
	asChild = false,
	...props
}: ComponentProps<"span"> &
	import("class-variance-authority").VariantProps<typeof badgeVariants> & {
		asChild?: boolean;
	}): JSX.Element {
	const Comp = asChild ? Slot : "span";
	return <Comp data-slot="badge" className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge };
