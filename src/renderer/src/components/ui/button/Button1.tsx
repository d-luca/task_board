import { Slot } from "@radix-ui/react-slot";
import type { VariantProps } from "class-variance-authority";
import type { ComponentProps, JSX } from "react";

import { cn } from "@renderer/lib/utils";
import { buttonVariants } from "./buttonVariants";

function Button({
	className,
	variant,
	size,
	asChild = false,
	...props
}: ComponentProps<"button"> & VariantProps<typeof buttonVariants> & { asChild?: boolean }): JSX.Element {
	const Comp = asChild ? Slot : "button";

	return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button };
