import * as SelectPrimitive from "@radix-ui/react-select";
import { ChevronDownIcon } from "lucide-react";
import { cn } from "@renderer/lib/utils";
import { ComponentProps, JSX } from "react";

export function SelectScrollDownButton({
	className,
	...props
}: ComponentProps<typeof SelectPrimitive.ScrollDownButton>): JSX.Element {
	return (
		<SelectPrimitive.ScrollDownButton
			data-slot="select-scroll-down-button"
			className={cn("flex cursor-default items-center justify-center py-1", className)}
			{...props}
		>
			<ChevronDownIcon className="size-4" />
		</SelectPrimitive.ScrollDownButton>
	);
}
