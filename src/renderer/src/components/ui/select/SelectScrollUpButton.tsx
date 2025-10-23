import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronUpIcon } from "lucide-react";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function SelectScrollUpButton({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.ScrollUpButton>): JSX.Element {
	return (
		<SelectPrimitive.ScrollUpButton
			data-slot="select-scroll-up-button"
			className={cn("flex cursor-default items-center justify-center py-1", className)}
			{...props}
		>
			<ChevronUpIcon className="size-4" />
		</SelectPrimitive.ScrollUpButton>
	);
}
